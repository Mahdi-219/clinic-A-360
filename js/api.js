/* ---------- طلبات الشبكة + حالة السيرفر ---------- */

async function apiPost(action, payload) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // يتجنب preflight مع Apps Script
        body: JSON.stringify({ action, ...payload })
    });
    const data = await res.json();
    handleSessionExpiry(data);
    return data;
}

async function apiGet(params) {
    const url = new URL(API_URL);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    // معرّف فريد لكل طلب حتى لا يرجّع Apps Script نفس الاستجابة القديمة
    // المخزّنة كاش لرابط GET متطابق — هذا سبب عدم تحديث التقرير بعد إضافة مرضى
    url.searchParams.set("_t", Date.now());
    const res = await fetch(url.toString(), { cache: "no-store" });
    const data = await res.json();
    handleSessionExpiry(data);
    return data;
}

// لو السيرفر قال إن الجلسة منتهية (مثلًا بعد "تسجيل خروج الجميع" أو انتهاء صلاحيتها)،
// نخرج المستخدم تلقائيًا لشاشة الدخول بدل ما يظل يترجم رسائل خطأ بالداشبورد
function handleSessionExpiry(result) {
    if (result && result.status === "FORBIDDEN" && String(result.error || "").indexOf("جلسة") !== -1) {
        if (typeof logout === "function") logout();
    }
}

// حالة السيرفر (تفحص تلقائيًا عند فتح الصفحة)
async function checkServerStatus() {
    const wrap = document.getElementById("serverStatus");
    const text = document.getElementById("serverStatusText");

    if (API_URL.includes("PASTE_YOUR")) {
        wrap.className = "server-status offline";
        text.textContent = trText("apiUrlNotSet");
        return;
    }

    try {
        const result = await apiGet({ action: "PING" });
        if (result && result.status === "OK") {
            wrap.className = "server-status online";
            text.textContent = trText("serverOk");
        } else {
            wrap.className = "server-status offline";
            text.textContent = trText("serverUnexpected");
        }
    } catch (e) {
        wrap.className = "server-status offline";
        text.textContent = trText("serverOffline");
    }
}

async function updateDutyTeamBanner() {
    if (API_URL.includes("PASTE_YOUR")) return;
    try {
        const result = await apiGet({ action: "GET_ON_DUTY_TEAM" });
        if (result && result.on_duty_team) {
            const banner = document.getElementById("dutyTeamBanner");
            document.getElementById("dutyTeamBannerText").textContent = trText("dutyTeamBanner", { team: shiftLabel(result.on_duty_team) });
            banner.style.display = "flex";
        }
    } catch (e) { /* تجاهل بصمت */ }
}
