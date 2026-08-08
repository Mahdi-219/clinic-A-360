/* ---------- تصدير البيانات إلى ملف Excel (.xlsx) — ثيم موحّد مطابق لألوان الموقع ---------- */
/* الورقة الأولى = الإحصائية الشهرية، ثم ورقة لكل يوم من أيام الشهر بالتفاصيل.
   نستخدم مكتبة ExcelJS (بدل SheetJS) لأن كتابة التنسيقات الفعلية (ألوان تعبئة،
   خط أبيض بالرأس...) مو مدعومة بالنسخة المجانية من SheetJS — بس بالنسخة المدفوعة.
   ExcelJS تدعمها مجانًا بالكامل. التوليد بالكامل من جهة المتصفح (بدون سيرفر) */

// نفس ألوان الموقع بالضبط (شوف :root بملف styles.css) — عشان ملف الإكسل يطلع
// بنفس هوية الموقع البصرية دايمًا، بغض النظر عن الوضع الليلي أو أي شي ثاني
const EXCEL_THEME = {
    headerFill: "0F2942",  // نفس لون رأس جدول الموقع (--ink)
    titleColor: "0D9488",  // نفس لون العلامة التجارية (--accent)
    stripeFill: "F7F9FA",  // نفس لون الصف المتبدّل بالموقع (--surface)
    borderColor: "C7CED3"
};

function sanitizeSheetName(name) {
    let s = String(name).replace(/[[\]:*?/\\]/g, " ").replace(/\s+/g, " ").trim();
    if (s.length > 31) s = s.slice(0, 31);
    return s || "ورقة";
}

function sanitizeFilename(name) {
    return String(name).replace(/[\\/:*?"<>|]/g, "-").trim();
}

// يبني ورقة بثيم موحّد: عنوان بلون العلامة التجارية (صف 0)، رأس جدول غامق بخط
// أبيض (صف 1)، صفوف بيانات متبدّلة اللون، حدود رفيعة على كل الخلايا، واتجاه RTL
function addThemedSheet(workbook, sheetName, aoa, opts) {
    const ws = workbook.addWorksheet(sanitizeSheetName(sheetName), {
        views: [{ rightToLeft: true, state: opts.freezeRows ? "frozen" : "normal", ySplit: opts.freezeRows || 0 }]
    });

    if (opts.colWidths) {
        ws.columns = opts.colWidths.map(w => ({ width: w }));
    }

    const thinBorder = {
        top: { style: "thin", color: { argb: "FF" + EXCEL_THEME.borderColor } },
        bottom: { style: "thin", color: { argb: "FF" + EXCEL_THEME.borderColor } },
        left: { style: "thin", color: { argb: "FF" + EXCEL_THEME.borderColor } },
        right: { style: "thin", color: { argb: "FF" + EXCEL_THEME.borderColor } }
    };

    aoa.forEach((rowValues, rIdx) => {
        const row = ws.addRow(rowValues);
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            cell.border = thinBorder;

            if (rIdx === 0) {
                cell.font = { bold: true, size: 13, color: { argb: "FF" + EXCEL_THEME.titleColor } };
            } else if (rIdx === 1) {
                cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + EXCEL_THEME.headerFill } };
            } else {
                cell.font = { color: { argb: "FF1A1A1A" } };
                if ((rIdx - 2) % 2 === 1) {
                    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + EXCEL_THEME.stripeFill } };
                }
            }
        });
    });

    if (opts.mergeCols) {
        ws.mergeCells(1, 1, 1, opts.mergeCols);
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

    if (typeof ExcelJS === "undefined") {
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

        const workbook = new ExcelJS.Workbook();

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

        addThemedSheet(workbook, trText("excelMonthlySheet"), monthlyAoa, {
            colWidths: [14, 13, 12, 10, ...catHeaders.map(() => 13)],
            mergeCols: monthlyHeader.length,
            freezeRows: 2
        });

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

                addThemedSheet(workbook, name, aoa, {
                    colWidths: [10, 26, 14, 9, 18, 11, 11, 11, 26, 13, 15],
                    mergeCols: dayHeader.length,
                    freezeRows: 2
                });
            });
        });

        const clinicPart = clinic === "all" ? trText("excelAllClinics") : valueLabel(clinic).replace(/^(عيادة |Clinic )/, "");
        const filename = sanitizeFilename(`${trText("excelMonthlySheet")}_${month}_${clinicPart}.xlsx`);

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        showSuccess(trText("excelSuccess"));
    } catch (e) {
        showError(trText("excelFailed"));
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}
