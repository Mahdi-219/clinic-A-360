/* ---------- طباعة / حفظ PDF (أي قسم — اسم الملف دايمًا بتاريخ اليوم الفعلي) ---------- */

const ORIGINAL_PAGE_TITLE = document.title;

function printSection(sectionId, dateElId, filenamePrefix) {
    const section = document.getElementById(sectionId);
    if (!section) { showError(trText("printFailed")); return; }

    // نحدّث نص التاريخ على النسخة الأصلية أولاً، عشان ينسخ وياه فورًا بالخطوة الجاية
    const dateEl = document.getElementById(dateElId);
    if (dateEl) dateEl.textContent = trText("printDatePrefix") + new Date().toLocaleDateString(currentLang() === "en" ? "en-GB" : "ar-EG");

    // نستنسخ القسم ونشيل منه أي أزرار/معرّفات — المحتوى المطبوع بس، بدون تشابك مع باقي الصفحة
    const clone = section.cloneNode(true);
    clone.querySelectorAll(".btn-secondary").forEach(b => b.remove());
    clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

    const fileTitle = `${filenamePrefix}_${todayDateStringLocal()}`;

    // نفتح نافذة/تبويب مستقل نظيف (بدون المود الليلي، التدرجات اللونية، أو أي تعقيد من
    // الصفحة الأصلية) ونطبع منه مباشرة — هذا أضمن بكثير من محاولة إخفاء/إظهار أجزاء من
    // نفس الصفحة المعقدة، خصوصًا إن سفاري بالآيفون يتعامل بشكل مختلف مع window.print()
    // على صفحة فيها CSS معقد ومتغيرات ألوان (مود ليلي)
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        showError(trText("printPopupsBlocked"));
        return;
    }

    const printLang = currentLang() === "en" ? "en" : "ar";
    const printDir = currentLang() === "en" ? "ltr" : "rtl";
    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html>
<html lang="${printLang}" dir="${printDir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${fileTitle}</title>
<style>
    * { box-sizing: border-box; }
    body {
        font-family: 'Tajawal', 'Segoe UI', Tahoma, Arial, sans-serif;
        color: #000; background: #fff; margin: 0; padding: 16px;
    }
    .print-only-header { display: block; text-align: center; border-bottom: 3px solid #000; padding-bottom: 12px; margin-bottom: 16px; }
    .print-only-header h2 { font-size: 20px; margin-bottom: 4px; }
    .print-only-header p { color: #555; font-size: 12px; margin: 0; }
    .report-title { font-size: 16px; font-weight: 700; text-align: center; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #999; padding: 8px 9px; text-align: center; font-size: 12.5px; }
    th { background-color: #222 !important; color: #fff !important; font-weight: 700; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    tr:nth-child(even) { background-color: #f5f5f5; }
    .btn-secondary, .cell-actions, .th-actions, .row-btn { display: none !important; }
    @page { margin: 12mm; }
</style>
</head>
<body>${clone.innerHTML}</body>
</html>`);
    printWindow.document.close();

    // ننتظر تحميل المحتوى فعليًا قبل ما نطبع (بعض متصفحات الجوال، خصوصًا سفاري،
    // تحتاج مهلة بسيطة بعد كتابة المحتوى قبل ما تقدر تطبعه صح)
    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 250);
    };
}
