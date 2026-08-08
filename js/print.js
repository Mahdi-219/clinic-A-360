/* ---------- حفظ PDF (أي قسم — اسم الملف دايمًا بتاريخ اليوم الفعلي) ---------- */

// نولّد ملف PDF حقيقي من جهة المتصفح (html2canvas يصوّر المحتوى، jsPDF يحطه
// بملف) بدل الاعتماد على معاينة طباعة المتصفح (window.print). هذا يضمن نفس
// الشكل بالضبط على أي جهاز (آيفون، أندرويد، كمبيوتر) لأننا نتحكم بالتنسيق
// بالكامل من الكود، مو المتصفح. شوف #printArea.capturing بملف styles.css.
async function printSection(sectionId, dateElId, filenamePrefix) {
    const section = document.getElementById(sectionId);
    const captureArea = document.getElementById("printArea");
    if (!section || !captureArea) { showError(trText("printFailed")); return; }

    if (typeof html2canvas === "undefined" || typeof window.jspdf === "undefined") {
        showError(trText("pdfLibraryMissing"));
        return;
    }

    const dateEl = document.getElementById(dateElId);
    if (dateEl) dateEl.textContent = trText("printDatePrefix") + new Date().toLocaleDateString(currentLang() === "en" ? "en-GB" : "ar-EG");

    // نستنسخ القسم ونشيل منه أي أزرار/معرّفات — المحتوى المطلوب بس، بدون تشابك مع باقي الصفحة
    const clone = section.cloneNode(true);
    clone.querySelectorAll(".btn-secondary").forEach(b => b.remove());
    clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

    captureArea.innerHTML = "";
    captureArea.appendChild(clone);
    captureArea.classList.add("capturing");

    const btn = document.querySelector(`[data-print-section="${sectionId}"]`);
    if (btn) setBusy(btn, true, trText("pdfPreparing"));

    try {
        // نستنى إطارين عشان المتصفح يخلص يرسم المحتوى فعليًا قبل ما نلتقط الصورة
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        const canvas = await html2canvas(captureArea, {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true
        });

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        const pageWidthMm = pdf.internal.pageSize.getWidth();
        const pageHeightMm = pdf.internal.pageSize.getHeight();
        const marginMm = 8;
        const usableWidthMm = pageWidthMm - marginMm * 2;
        const usableHeightMm = pageHeightMm - marginMm * 2;

        const pxPerMm = canvas.width / usableWidthMm;
        const pageHeightPx = Math.max(1, Math.floor(usableHeightMm * pxPerMm));

        let renderedPx = 0;
        let pageIndex = 0;
        while (renderedPx < canvas.height) {
            const sliceHeightPx = Math.min(pageHeightPx, canvas.height - renderedPx);

            const pageCanvas = document.createElement("canvas");
            pageCanvas.width = canvas.width;
            pageCanvas.height = sliceHeightPx;
            const ctx = pageCanvas.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(canvas, 0, renderedPx, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);

            const imgData = pageCanvas.toDataURL("image/jpeg", 0.92);
            const sliceHeightMm = sliceHeightPx / pxPerMm;

            if (pageIndex > 0) pdf.addPage();
            pdf.addImage(imgData, "JPEG", marginMm, marginMm, usableWidthMm, sliceHeightMm);

            renderedPx += sliceHeightPx;
            pageIndex++;
        }

        pdf.save(`${filenamePrefix}_${todayDateStringLocal()}.pdf`);
        showSuccess(trText("pdfSaveSuccess"));
    } catch (e) {
        showError(trText("pdfSaveFailed"));
    } finally {
        captureArea.classList.remove("capturing");
        captureArea.innerHTML = "";
        if (btn) setBusy(btn, false, trText("printSaveBtn"));
    }
}
