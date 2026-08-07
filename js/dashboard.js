/* ---------- لوحة التحكم والتبويبات ---------- */

function enterDashboard() {
    ["loginScreen", "registerScreen", "forgotScreen", "authCheckingScreen"].forEach(id => {
        document.getElementById(id).style.display = "none";
    });
    document.getElementById("mainDashboard").style.display = "block";

    // تسمية التبويب الأول تختلف حسب نوع الحساب: عرض المرضى للمسؤول، إضافة مريض للموظف
    setTabAddPatientLabel();
    document.getElementById("tabBtnManageEmployees").style.display = session.isAdmin ? "block" : "none";

    if (session.isAdmin) {
        document.getElementById("patientsViewDate").value = todayDateStringLocal();
    } else {
        loadTodayShiftPatients();
    }

    switchTab("addPatient");
    setDefaultPatientTime();
}

// التبويبان متاحان قبل وبعد تسجيل الدخول. حساب المسؤول يشوف "عرض المرضى"
// بدل نموذج "إضافة مريض" داخل نفس التبويب الأول
function switchTab(tab) {
    const isAdmin = session.isAdmin;
    const isAddPatient = tab === "addPatient";
    const isMonthlyStats = tab === "monthlyStats";
    const isManageEmployees = tab === "manageEmployees" && isAdmin;

    document.getElementById("addPatientSection").style.display = (isAddPatient && !isAdmin) ? "block" : "none";
    document.getElementById("adminPatientsSection").style.display = (isAddPatient && isAdmin) ? "block" : "none";
    document.getElementById("monthlyStatsSection").style.display = isMonthlyStats ? "block" : "none";
    document.getElementById("manageEmployeesSection").style.display = isManageEmployees ? "block" : "none";

    document.getElementById("tabBtnAddPatient").classList.toggle("active", isAddPatient);
    document.getElementById("tabBtnMonthlyStats").classList.toggle("active", isMonthlyStats);
    document.getElementById("tabBtnManageEmployees").classList.toggle("active", isManageEmployees);

    document.getElementById("monthlyStatsAdminControls").style.display = (isMonthlyStats && isAdmin) ? "block" : "none";

    // الإحصائية (جدول العرض) تتحدّث تلقائيًا أول ما نفتح التبويب
    if (isMonthlyStats && session.token) {
        loadMonthlyReport();
    }

    if (isManageEmployees) {
        loadAllEmployees();
    }
}
