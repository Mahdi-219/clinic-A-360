/* ---------- أدوات مساعدة عامة ---------- */

// يمنع حقن HTML/سكربتات لو موظف كتب اسم مريض أو رقم هاتف يحتوي على أكواد —
// لازم تُستخدم على أي نص أدخله مستخدم قبل ما ينحط بالصفحة عبر innerHTML
function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function limitFourDigits(input) {
    if (input.value.length > 4) input.value = input.value.slice(0, 4);
}

function limitTwelveDigits(input) {
    if (input.value.length > 12) input.value = input.value.slice(0, 12);
}

function showError(msg, durationMs = 5000) {
    const el = document.getElementById("errorMessage");
    document.getElementById("successMessage").style.display = "none";
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = "none"; }, durationMs);
}

function showSuccess(msg) {
    const el = document.getElementById("successMessage");
    document.getElementById("errorMessage").style.display = "none";
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = "none"; }, 5000);
}

function setBusy(buttonEl, busy, originalText) {
    if (busy) {
        buttonEl.disabled = true;
        buttonEl.dataset.originalText = originalText;
        buttonEl.innerHTML = '<span class="loader"></span>' + originalText;
    } else {
        buttonEl.disabled = false;
        buttonEl.textContent = buttonEl.dataset.originalText || originalText;
    }
}

function switchAuthScreen(screenId) {
    ["loginScreen", "registerScreen", "forgotScreen"].forEach(id => {
        document.getElementById(id).style.display = (id === screenId) ? "block" : "none";
    });
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("successMessage").style.display = "none";
}

/* تشفير أحادي الاتجاه (SHA-256) من جهة العميل قبل إرسال الرمز السري.
   هذا لا يغني عن HTTPS ولا عن الحماية على السيرفر، لكنه يمنع
   وصول الرمز كنص صريح عبر الشبكة أو ظهوره في سجلات الطلبات */
async function hashPin(pin) {
    const enc = new TextEncoder().encode(pin);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function todayDateStringLocal() {
    return new Date().toLocaleDateString("en-CA"); // صيغة yyyy-MM-dd ثابتة
}

// يبني قوائم الساعات (00-23) والدقائق (00-59) داخل عنصري select — يضمن نظام 24 ساعة دايمًا بغض النظر عن إعدادات المتصفح
function populateTimeSelect(selectEl, count) {
    selectEl.innerHTML = Array.from({ length: count }, (_, i) => {
        const v = String(i).padStart(2, "0");
        return `<option value="${v}">${v}</option>`;
    }).join("");
}

function setDefaultPatientTime() {
    const now = new Date();
    document.getElementById("patientTimeHour").value = String(now.getHours()).padStart(2, "0");
    document.getElementById("patientTimeMinute").value = String(now.getMinutes()).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    document.getElementById("patientDateDisplay").value = `${dd}/${mm}/${yyyy}`;
}
