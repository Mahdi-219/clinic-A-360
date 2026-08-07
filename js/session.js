/* ---------- الجلسة: الحالة + استمرارية الدخول عبر الريفرش (localStorage) ---------- */

let session = { empId: null, shift: null, clinic: null, isAdmin: false, token: null };

function persistSession() {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        empId: session.empId, shift: session.shift, clinic: session.clinic,
        isAdmin: session.isAdmin, token: session.token
    }));
}

function clearPersistedSession() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
}

// عند فتح الصفحة (أو عمل ريفرش) نتحقق إذا فيه جلسة محفوظة ولسا سارية،
// ولو صحيحة ندخل مباشرة للوحة التحكم بدون ما نرجع لشاشة تسجيل الدخول
async function restoreSession() {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!saved) { showLoginScreenNow(); return; }

    let parsed;
    try { parsed = JSON.parse(saved); } catch (e) { clearPersistedSession(); showLoginScreenNow(); return; }
    if (!parsed || !parsed.token) { clearPersistedSession(); showLoginScreenNow(); return; }

    try {
        const result = await apiGet({ action: "VALIDATE_SESSION", token: parsed.token });
        if (result && result.status === "VALID") {
            session = {
                empId: parsed.empId, shift: parsed.shift, clinic: parsed.clinic,
                isAdmin: result.isAdmin, token: parsed.token
            };
            enterDashboard(); // هذي تخفي شاشة التحقق ضمنيًا لأنها تخفي كل شاشات auth-screen
        } else {
            clearPersistedSession();
            showLoginScreenNow();
        }
    } catch (e) {
        // تعذر التحقق (مثلاً السيرفر غير متاح مؤقتًا) — نرجع لشاشة الدخول العادية بدل ما تعلق شاشة التحقق للأبد
        showLoginScreenNow();
    }
}

function showLoginScreenNow() {
    document.getElementById("authCheckingScreen").style.display = "none";
    switchAuthScreen("loginScreen");
}

function logout() {
    session = { empId: null, shift: null, clinic: null, isAdmin: false, token: null };
    clearPersistedSession();
    renderTodayPatientsTable([]);
    if (statsChart) { statsChart.destroy(); statsChart = null; }
    document.getElementById("chartCard").style.display = "none";
    document.getElementById("mainDashboard").style.display = "none";
    document.getElementById("reportSection").style.display = "none";
    document.getElementById("patientsByDateSection").style.display = "none";
    document.getElementById("loginEmpId").value = "";
    document.getElementById("loginPin").value = "";
    setTabAddPatientLabel();
    switchTab("addPatient");
    switchAuthScreen("loginScreen");
}
