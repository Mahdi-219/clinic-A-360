/* ---------- طباعة / حفظ PDF (أي قسم — اسم الملف دايمًا بتاريخ اليوم الفعلي) ---------- */

const ORIGINAL_PAGE_TITLE = document.title;

// نطبع من نفس نافذة التطبيق (بدون window.open) عشان يشتغل صح حتى داخل
// التطبيق المثبّت كـ PWA (standalone) بالأندرويد والآيفون — فتح نافذة/تبويب
// منبثق غير مضمون إطلاقًا بوضع standalone، بينما window.print() على نفس
// النافذة يشتغل بالحالتين. نبني نسخة القسم داخل #printArea (شوف index.html
// و@media print بملف styles.css) ثم نستدعي window.print() مباشرة.
let printCleanupTimer = null;

// آبل ما تدعم window.print() إطلاقًا داخل تطبيق مثبّت على الشاشة الرئيسية
// بالآيفون (standalone) — قيد بنظام iOS نفسه، ولا يوجد كود يتجاوزه. لو حاولنا
// نستدعيها بهالوضع، الصفحة "تعلّق" على شاشة فاضية بدون طريقة رجوع. نكتشف
// الحالة هذي مبكرًا ونعرض تعليمة بدل ما نحاول ونفشل.
function isIOSStandalone() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone === true ||
        (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
    return isIOS && isStandalone;
}

function printSection(sectionId, dateElId, filenamePrefix) {
    const section = document.getElementById(sectionId);
    const printArea = document.getElementById("printArea");
    if (!section || !printArea) { showError(trText("printFailed")); return; }

    if (isIOSStandalone()) {
        showError(trText("printNeedsSafariIOS", { url: window.location.href }), 25000);
        return;
    }

    // نحدّث نص التاريخ على النسخة الأصلية أولاً، عشان ينسخ وياه فورًا بالخطوة الجاية
    const dateEl = document.getElementById(dateElId);
    if (dateEl) dateEl.textContent = trText("printDatePrefix") + new Date().toLocaleDateString(currentLang() === "en" ? "en-GB" : "ar-EG");

    // نستنسخ القسم ونشيل منه أي أزرار/معرّفات — المحتوى المطبوع بس، بدون تشابك مع باقي الصفحة
    const clone = section.cloneNode(true);
    clone.querySelectorAll(".btn-secondary").forEach(b => b.remove());
    clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

    printArea.innerHTML = "";
    printArea.appendChild(clone);

    document.title = `${filenamePrefix}_${todayDateStringLocal()}`;
    document.body.classList.add("printing-mode");

    // مهم: ما نفضّي #printArea أو نشيل "printing-mode" فورًا بعد استدعاء print().
    // بالأندرويد (كروم/سامسونج إنترنت) window.print() غير متزامن — لو نظّفنا المحتوى
    // مباشرة، معاينة الطباعة تفتح على جدول فاضي (نفس مشكلة "الجدول المنثقب" اللي
    // صارت). التنظيف الحين يصير بس بعد ما تنتهي الطباعة فعليًا (afterprint)، ولو
    // المتصفح ما يدعم afterprint نستخدم مهلة احتياطية سخية بدل التنظيف الفوري.
    // تركه بدون تنظيف بينهم ما يأثر على الشكل العادي للصفحة أصلاً، لأن #printArea
    // و.printing-mode ما لهم أي تأثير مرئي خارج @media print.
    clearTimeout(printCleanupTimer);
    const cleanup = () => {
        document.body.classList.remove("printing-mode");
        document.title = ORIGINAL_PAGE_TITLE;
        printArea.innerHTML = "";
        window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    printCleanupTimer = setTimeout(cleanup, 60000);

    window.print();
}
