/* ---------- تصدير البيانات إلى ملف Excel (.xlsx) يدعم العربية والـ RTL ---------- */
/* الورقة الأولى = الإحصائية الشهرية، ثم ورقة لكل يوم من أيام الشهر بالتفاصيل.
   التوليد بالكامل من جهة المتصفح عبر مكتبة SheetJS (تُحمّل من CDN مثل Chart.js) */

function sanitizeSheetName(name) {
    let s = String(name).replace(/[[\]:*?/\\]/g, " ").replace(/\s+/g, " ").trim();
    if (s.length > 31) s = s.slice(0, 31);
    return s || "ورقة";
}

function sanitizeFilename(name) {
    return String(name).replace(/[\\/:*?"<>|]/g, "-").trim();
}

// يبني ورقة من مصفوفة صفوف، مع تنسيق جاهز: العنوان (صف 0) والرأس (صف 1) عريضين،
// وكل الخلايا متمركزة، والورقة بالاتجاه RTL لتبدو سليمة في إكسل
function buildExcelSheet(aoa, opts) {
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!dir"] = "rtl";
    if (opts.colWidths) ws["!cols"] = opts.colWidths.map(w => ({ wch: w }));
    if (opts.mergeCols) ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: opts.mergeCols - 1 } }];
    if (opts.freezeRows) ws["!freeze"] = { xSplit: 0, ySplit: opts.freezeRows };

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
            if (!cell) continue;
            if (R === 0) {
                cell.s = { font: { bold: true, sz: 13 }, alignment: { horizontal: "center" } };
            } else if (R === 1) {
                cell.s = { font: { bold: true }, alignment: { horizontal: "center" } };
            } else {
                cell.s = { alignment: { horizontal: "center" } };
            }
        }
    }
    return ws;
}

// الاسم المترجم لعمود كل فئة حالة (مفاتيح التقرير ليست بأسماء القواميس مباشرة)
function excelCategoryLabel(key) {
    return categoryLabel(key);
}

async function exportExcel() {
    const btn = document.getElementById("exportExcelBtn");
    if (!btn) return;
    const originalText = btn.textContent;

    if (typeof XLSX === "undefined") {
        showError(trText("excelLibraryMissing"));
        return;
    }

    const clinic = currentReportClinic();
    const month = currentReportMonth();
    const clinicLabel = clinic === "all" ? trText("excelAllClinics") : valueLabel(clinic);

    btn.disabled = true;
    btn.innerHTML = '<span class="loader"></span>' + trText("excelPreparing");
    try {
        const [reportRows, detailRows] = await Promise.all([
            apiGet({ action: "GET_MONTHLY_REPORT", token: session.token, clinic, month }),
            apiGet({ action: "GET_MONTH_REPORT_DETAILS", token: session.token, clinic, month })
        ]);

        if (!Array.isArray(reportRows) || !Array.isArray(detailRows)) {
            showError(trText("excelFetchFailed"));
            return;
        }
        if (!reportRows.length) {
            showError(trText("excelNoData"));
            return;
        }

        const wb = XLSX.utils.book_new();
        wb.Workbook = { Views: [{ RTL: true }] };

        // ---- الورقة الأولى: الإحصائية الشهرية ----
        const catHeaders = REPORT_EDIT_FIELDS.map(excelCategoryLabel);
        const monthlyHeader = [trText("dateLabel"), trText("empIdColLabel"), trText("clinicLabel"), trText("totalLabel"), ...catHeaders];
        const totals = { total: 0 };
        REPORT_EDIT_FIELDS.forEach(k => { totals[k] = 0; });

        const monthlyAoa = [[trText("excelMonthlyTitle", { month, clinic: clinicLabel })], monthlyHeader];
        reportRows.forEach(r => {
            totals.total += Number(r.total_daily) || 0;
            REPORT_EDIT_FIELDS.forEach(k => { totals[k] += Number(r[k]) || 0; });
            monthlyAoa.push([r.date, r.emp_id, valueLabel(r.clinic), r.total_daily, ...REPORT_EDIT_FIELDS.map(k => r[k])]);
        });
        monthlyAoa.push([trText("excelMonthTotal"), "", "", totals.total, ...REPORT_EDIT_FIELDS.map(k => totals[k])]);

        const monthlyWs = buildExcelSheet(monthlyAoa, {
            colWidths: [14, 13, 12, 10, ...catHeaders.map(() => 13)],
            mergeCols: monthlyHeader.length,
            freezeRows: 2
        });
        XLSX.utils.book_append_sheet(wb, monthlyWs, trText("excelMonthlySheet"));

        // ---- ورقة لكل يوم من أيام الشهر بالتفاصيل ----
        const dayHeader = [trText("thTime"), trText("thPatientName"), trText("thCivilId"), trText("thGender"), trText("thCondition"), trText("thBP"), trText("thSugar"), trText("thTemp"), trText("thTreatment"), trText("thRecordedBy"), trText("thShift")];
        const usedSheetNames = new Set();

        const byDate = {};
        detailRows.forEach(p => { (byDate[p.date] = byDate[p.date] || []).push(p); });

        Object.keys(byDate).sort().forEach(date => {
            const rows = byDate[date];
            const clinics = [...new Set(rows.map(p => p.clinic))];
            const groups = clinics.map(cl => ({ clinic: cl, rows: rows.filter(p => p.clinic === cl) }));

            groups.forEach(g => {
                // عيادة وحدة بنفس اليوم: اسم الورقة = التاريخ؛ أكثر من عيادة: نضيف اسم العيادة
                const clinicDisp = valueLabel(g.clinic);
                let name = groups.length === 1 ? date : `${date} - ${clinicDisp}`;
                if (usedSheetNames.has(name)) name = `${name} (${clinicDisp})`;
                usedSheetNames.add(name);

                const aoa = [[trText("excelDayTitle", { date, clinic: clinicDisp })], dayHeader];
                g.rows.forEach(p => {
                    aoa.push([p.time, p.patient_name, p.civil_id, valueLabel(p.gender), valueLabel(p.condition), p.blood_pressure, p.sugar, p.temperature, p.treatment, p.emp_id, valueLabel(p.shift)]);
                });

                const ws = buildExcelSheet(aoa, {
                    colWidths: [10, 26, 14, 9, 18, 11, 11, 11, 26, 13, 15],
                    mergeCols: dayHeader.length,
                    freezeRows: 2
                });
                XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(name));
            });
        });

        const clinicPart = clinic === "all" ? trText("excelAllClinics") : valueLabel(clinic).replace(/^(عيادة |Clinic )/, "");
        const filename = sanitizeFilename(`${trText("excelMonthlySheet")}_${month}_${clinicPart}.xlsx`);
        XLSX.writeFile(wb, filename);
        showSuccess(trText("excelSuccess"));
    } catch (e) {
        showError(trText("excelFailed"));
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}
