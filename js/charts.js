/* ---------- الإحصائيات البيانية (دائري / أعمدة / إجمالي مدمج) ---------- */

let statsChart = null; // مرجع الرسم البياني الحالي، نحذفه قبل رسم واحد جديد
let lastChartType = null; // آخر نوع رسم تم عرضه — نعيد رسمه عند تبديل اللغة

// يعيد عرض آخر رسم عند تبديل اللغة
function showChartForType(type) {
    if (type === "doughnut" || type === "bar") showCaseTypeChart(type);
    else if (type === "barCompare") showBarChart();
    else if (type === "combined") showCombinedTotal();
}

function setActiveStatBtn(id) {
    ["btnPieChart", "btnBarSingle", "btnBarChart", "btnCombinedTotal"].forEach(btnId => {
        document.getElementById(btnId).classList.toggle("active", btnId === id);
    });
}

// يجلب بيانات عيادة معينة (أو الكل) ويرجع مجموع كل نوع حالة + الإجمالي العام
// (يحترم النطاق الحالي: يومي أو شهري)
async function fetchClinicTotals(clinicValue) {
    const result = await apiGet({ action: currentReportAction(), token: session.token, clinic: clinicValue, month: currentReportMonth() });
    if (!Array.isArray(result)) return null;

    const totals = Object.fromEntries(REPORT_EDIT_FIELDS.map(k => [k, 0]));
    let grandTotal = 0;
    result.forEach(row => {
        REPORT_EDIT_FIELDS.forEach(k => { totals[k] += Number(row[k]) || 0; });
        grandTotal += Number(row.total_daily) || 0;
    });
    return { totals, grandTotal, count: result.length };
}

function showChartCard(title) {
    document.getElementById("chartCard").style.display = "block";
    document.getElementById("chartCardTitle").textContent = title;
    document.getElementById("chartCanvasWrap").style.display = "block";
    document.getElementById("combinedTotalBox").style.display = "none";
}

// ١) نسب أنواع الحالات — يدعم عرض دائري أو عمودي لنفس البيانات (يحترم اختيار العيادة بقائمة المسؤول)
async function showCaseTypeChart(chartType) {
    setActiveStatBtn(chartType === "doughnut" ? "btnPieChart" : "btnBarSingle");
    lastChartType = chartType;

    if (typeof Chart === "undefined") {
        showError(trText("chartLibraryMissing"));
        return;
    }

    const clinic = document.getElementById("adminClinicSelect").value;
    const clinicLabel = clinic === "all" ? trText("allClinicsOption") : valueLabel(clinic);

    try {
        const data = await fetchClinicTotals(clinic);
        if (!data) { showError(trText("chartFetchFailed")); return; }

        if (data.grandTotal === 0) {
            showError(trText("chartNoData"));
            return;
        }

        showChartCard(trText("chartCaseTitle", { clinic: clinicLabel, scope: currentReportScopeLabel() }));

        const labels = REPORT_EDIT_FIELDS.map(categoryLabel);
        const values = REPORT_EDIT_FIELDS.map(k => data.totals[k]);
        const colors = REPORT_EDIT_FIELDS.map(k => CASE_COLORS[k]);

        if (statsChart) statsChart.destroy();
        const ctx = document.getElementById("statsCanvas").getContext("2d");

        if (chartType === "doughnut") {
            statsChart = new Chart(ctx, {
                type: "doughnut",
                data: { labels, datasets: [{ data: values, backgroundColor: colors, borderColor: "#fff", borderWidth: 2 }] },
                options: {
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: "bottom", labels: { font: { family: "Tajawal" }, padding: 14 } },
                        tooltip: {
                            callbacks: {
                                label: (c) => `${c.label}: ${c.parsed} (${((c.parsed / data.grandTotal) * 100).toFixed(1)}%)`
                            }
                        }
                    }
                }
            });
        } else {
            statsChart = new Chart(ctx, {
                type: "bar",
                data: { labels, datasets: [{ label: clinicLabel, data: values, backgroundColor: colors, borderRadius: 6 }] },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, ticks: { precision: 0 } },
                        x: { ticks: { font: { family: "Tajawal" } } }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (c) => `${c.label}: ${c.parsed.y} (${((c.parsed.y / data.grandTotal) * 100).toFixed(1)}%)`
                            }
                        }
                    }
                }
            });
        }
    } catch (e) {
        showError(trText("chartBuildError", { error: (e && e.message ? e.message : trText("chartUnknownError")) }));
    }
}

// ٢) رسم أعمدة: مقارنة كل نوع حالة بين العيادتين
async function showBarChart() {
    setActiveStatBtn("btnBarChart");
    lastChartType = "barCompare";

    if (typeof Chart === "undefined") {
        showError(trText("chartLibraryMissing"));
        return;
    }

    try {
        const [dataA, dataB] = await Promise.all([
            fetchClinicTotals("عيادة الف"),
            fetchClinicTotals("عيادة باء")
        ]);
        if (!dataA || !dataB) { showError(trText("chartFetchFailed")); return; }

        if (dataA.grandTotal === 0 && dataB.grandTotal === 0) {
            showError(trText("chartNoCompareData"));
            return;
        }

        showChartCard(trText("chartCompareTitle", { scope: currentReportScopeLabel() }));

        const labels = REPORT_EDIT_FIELDS.map(categoryLabel);
        const valuesA = REPORT_EDIT_FIELDS.map(k => dataA.totals[k]);
        const valuesB = REPORT_EDIT_FIELDS.map(k => dataB.totals[k]);

        if (statsChart) statsChart.destroy();
        const ctx = document.getElementById("statsCanvas").getContext("2d");
        statsChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    { label: trText("clinicA"), data: valuesA, backgroundColor: "#0d9488", borderRadius: 6 },
                    { label: trText("clinicB"), data: valuesB, backgroundColor: "#b8860b", borderRadius: 6 }
                ]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { precision: 0 } },
                    x: { ticks: { font: { family: "Tajawal" } } }
                },
                plugins: {
                    legend: { position: "bottom", labels: { font: { family: "Tajawal" }, padding: 14 } }
                }
            }
        });
    } catch (e) {
        showError(trText("chartBuildError", { error: (e && e.message ? e.message : trText("chartUnknownError")) }));
    }
}

// ٣) إجمالي العيادتين معًا (بطاقات أرقام بدون رسم بياني)
async function showCombinedTotal() {
    setActiveStatBtn("btnCombinedTotal");
    lastChartType = "combined";

    try {
        const [dataA, dataB] = await Promise.all([
            fetchClinicTotals("عيادة الف"),
            fetchClinicTotals("عيادة باء")
        ]);
        if (!dataA || !dataB) { showError(trText("combinedFetchFailed")); return; }

        document.getElementById("chartCard").style.display = "block";
        document.getElementById("chartCardTitle").textContent = trText("chartCombinedTitle", { scope: currentReportScopeLabel() });
        document.getElementById("chartCanvasWrap").style.display = "none";

        const box = document.getElementById("combinedTotalBox");
        box.style.display = "flex";
        box.innerHTML = `
            <div class="combined-total-card">
                <div class="label">${trText("clinicA")}</div>
                <div class="value">${dataA.grandTotal}</div>
            </div>
            <div class="combined-total-card">
                <div class="label">${trText("clinicB")}</div>
                <div class="value">${dataB.grandTotal}</div>
            </div>
            <div class="combined-total-card grand">
                <div class="label">${trText("combinedTotalLabel")}</div>
                <div class="value">${dataA.grandTotal + dataB.grandTotal}</div>
            </div>
        `;
    } catch (e) {
        showError(trText("combinedConnFailed"));
    }
}
