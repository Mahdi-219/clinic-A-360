/* ---------- التقرير الشهري (تجميع تلقائي من سجلات المرضى) ---------- */

function currentReportAction() {
    return "GET_MONTHLY_REPORT";
}

function currentReportScopeLabel() {
    return trText("reportScope");
}

function currentReportMonth() {
    return document.getElementById("reportMonth").value || todayDateStringLocal().substring(0, 7);
}

// الموظف يشوف عيادته بس — المسؤول يحدد (الكل / عيادة الف / عيادة باء)
function currentReportClinic() {
    if (session.isAdmin) return document.getElementById("adminClinicSelect").value;
    return session.clinic || "all";
}

async function loadMonthlyReport() {
    if (API_URL.includes("PASTE_YOUR")) { showError(trText("apiUrlNotSet")); return; }

    const params = { action: currentReportAction(), token: session.token, clinic: currentReportClinic(), month: currentReportMonth() };

    try {
        const result = await apiGet(params);
        if (!Array.isArray(result)) {
            if (result && result.status === "FORBIDDEN") {
                showError(trText("sessionInvalid"));
            } else {
                showError(trText("reportLoadFailed"));
            }
            return;
        }
        renderReportTable(result);
        document.getElementById("reportSection").style.display = "block";
        document.getElementById("dayDetailsPanel").style.display = "none";
        delete window.__lastDayDetails;
    } catch (e) {
        showError(trText("reportConnFailed"));
    }
}

function renderReportTable(rows) {
    const body = document.getElementById("reportTableBody");
    body.innerHTML = "";

    const colCount = 13; // التاريخ + الرقم الوظيفي + العيادة + الإجمالي + 9 فئات

    if (!rows.length) {
        body.innerHTML = `<tr class="empty-row"><td colspan="${colCount}">${trText("noDataForScope", { scope: currentReportScopeLabel() })}</td></tr>`;
        return;
    }

    rows.forEach(r => {
        const tr = document.createElement("tr");
        tr.dataset.id = r.id;
        tr.dataset.date = r.date;
        tr.dataset.clinic = r.clinic;
        tr.className = "clickable-row";
        tr.title = trText("rowClickTooltip");

        const staticCells = [r.date, r.emp_id, valueLabel(r.clinic)];
        staticCells.forEach((val, idx) => {
            const td = document.createElement("td");
            td.textContent = val ?? "";
            if (idx === 1) td.className = "col-emp-id"; // عمود الرقم الوظيفي دايمًا "آلي" هنا — يُخفى بالطباعة (شوف @media print)
            tr.appendChild(td);
        });

        // أعمدة الإجمالي وكل الحالات تظهر للجميع الآن (نفس الجدول للمسعفين والمسؤول)
        const totalTd = document.createElement("td");
        totalTd.className = "cell-total";
        totalTd.textContent = r.total_daily;
        tr.appendChild(totalTd);

        REPORT_EDIT_FIELDS.forEach(key => {
            const td = document.createElement("td");
            td.className = "cell-" + key;
            td.textContent = r[key];
            td.dataset.value = r[key];
            tr.appendChild(td);
        });

        body.appendChild(tr);
    });
}

/* ---------- تفاصيل يوم معيّن (بالضغط على صف التقرير) ---------- */

async function loadDayDetails(date, clinic) {
    const panel = document.getElementById("dayDetailsPanel");
    const content = document.getElementById("dayDetailsContent");
    content.innerHTML = `<div class="report-title">${trText("loadingDetails")}</div>`;

    document.getElementById("dayDetailsTitle").textContent = trText("detailsTitle", { date, clinic: valueLabel(clinic) });
    panel.style.display = "block";
    window.__lastDayDetails = { date, clinic };

    try {
        const result = await apiGet({ action: "GET_REPORT_DAY_DETAILS", token: session.token, date, clinic });
        if (!Array.isArray(result)) {
            content.innerHTML = `<div class="report-title">${trText("detailsLoadFailed")}</div>`;
            return;
        }
        renderDayDetails(result);
    } catch (e) {
        content.innerHTML = `<div class="report-title">${trText("detailsConnFailed")}</div>`;
    }
}

function renderDayDetails(rows) {
    const content = document.getElementById("dayDetailsContent");
    content.innerHTML = "";

    const morningRows = rows.filter(r => (r.shift || "").includes("صباحي"));
    const eveningRows = rows.filter(r => (r.shift || "").includes("مسائي"));

    const renderShiftBlock = (title, shiftRows) => {
        const html = `
            <div class="report-title report-title-gap">${title} (<span>${shiftRows.length}</span>)</div>
            <table class="monthly-table">
                <thead>
                    <tr>
                        <th>${trText("thTime")}</th><th>${trText("thPatientName")}</th><th>${trText("thCivilId")}</th><th>${trText("thGender")}</th><th>${trText("thCondition")}</th>
                        <th>${trText("thBP")}</th><th>${trText("thSugar")}</th><th>${trText("thTemp")}</th><th>${trText("thTreatment")}</th><th>${trText("thRecordedBy")}</th><th>${trText("thShift")}</th>
                    </tr>
                </thead>
                <tbody>
                    ${shiftRows.length ? shiftRows.map(p => `
                        <tr>
                            <td>${escapeHtml(p.time) || "-"}</td>
                            <td>${escapeHtml(p.patient_name)}</td>
                            <td>${escapeHtml(p.civil_id)}</td>
                            <td>${escapeHtml(valueLabel(p.gender)) || "-"}</td>
                            <td>${escapeHtml(valueLabel(p.condition))}</td>
                            <td>${escapeHtml(p.blood_pressure) || "-"}</td>
                            <td>${escapeHtml(p.sugar) || "-"}</td>
                            <td>${escapeHtml(p.temperature) || "-"}</td>
                            <td>${escapeHtml(p.treatment) || "-"}</td>
                            <td>${escapeHtml(p.emp_id)}</td>
                            <td>${escapeHtml(valueLabel(p.shift)) || "-"}</td>
                        </tr>
                    `).join("") : `<tr class="empty-row"><td colspan="11">${trText("noPatientsShift")}</td></tr>`}
                </tbody>
            </table>
        `;
        return html;
    };

    if (!rows.length) {
        content.innerHTML = `<div class="report-title">${trText("noPatientsDay")}</div>`;
        return;
    }

    content.innerHTML = renderShiftBlock(trText("morningBlockTitle"), morningRows)
        + renderShiftBlock(trText("eveningBlockTitle"), eveningRows);
}
