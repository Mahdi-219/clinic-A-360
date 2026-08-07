/* =========================================================
   النقطة الرئيسية: ربط كل مستمعات الأحداث + إقلاع التطبيق
   (تُحمَّل بعد كل الملفات الأخرى — الأسكربتات تُشغَّل بالترتيب)
   ========================================================= */

// حارس عام: أي خطأ JS غير متوقع ينسجل بالكونسول (للمطوّر) ويطلع تنبيه للمستخدم
// بدل ما تفشل الصفحة بصمت وتطلع فاضية بدون أي رسالة
window.addEventListener("error", (e) => {
    console.error("خطأ غير متوقع:", e.error || e.message);
    const el = document.getElementById("errorMessage");
    if (el) {
        el.textContent = trText("genericError");
        el.style.display = "block";
    }
});

/* ---------- أزرار عامة (اللغة / المود الليلي) ---------- */
document.getElementById("langToggleBtn").addEventListener("click", toggleLanguage);
document.getElementById("darkModeToggleBtn").addEventListener("click", toggleDarkMode);

/* ---------- مبدّل التبويبات ---------- */
["tabBtnAddPatient", "tabBtnMonthlyStats", "tabBtnManageEmployees"].forEach(id => {
    const btn = document.getElementById(id);
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

/* ---------- شاشات الدخول / التسجيل / الاسترجاع ---------- */
document.querySelectorAll("[data-auth-screen]").forEach(el => {
    el.addEventListener("click", () => switchAuthScreen(el.dataset.authScreen));
});

document.getElementById("loginEmpId").addEventListener("input", (e) => {
    limitFourDigits(e.target);
    checkLoginEmpIdPreview();
});
document.getElementById("loginBtn").addEventListener("click", handleLogin);

document.getElementById("regEmpId").addEventListener("input", (e) => limitFourDigits(e.target));
document.getElementById("regCivilId").addEventListener("input", (e) => limitTwelveDigits(e.target));
document.getElementById("registerBtn").addEventListener("click", handleRegister);

document.getElementById("forgotEmpId").addEventListener("input", (e) => limitFourDigits(e.target));
document.getElementById("forgotCivilId").addEventListener("input", (e) => limitTwelveDigits(e.target));
document.getElementById("forgotBtn").addEventListener("click", handleForgot);

/* ---------- نموذج إضافة مريض ---------- */
document.getElementById("patientCivilId").addEventListener("input", (e) => {
    limitTwelveDigits(e.target);
    checkReturningPatient();
});
document.getElementById("patientCondition").addEventListener("change", toggleOtherConditionBox);
document.getElementById("savePatientBtn").addEventListener("click", savePatient);
document.getElementById("todayRefreshBtn").addEventListener("click", loadTodayShiftPatients);

/* ---------- أزرار الطباعة / حفظ PDF ---------- */
document.querySelectorAll("[data-print-section]").forEach(btn => {
    btn.addEventListener("click", () => {
        printSection(btn.dataset.printSection, btn.dataset.printDate, btn.dataset.printFilename);
    });
});

/* ---------- عرض المرضى حسب التاريخ (المسؤول) ---------- */
document.getElementById("viewPatientsBtn").addEventListener("click", loadPatientsByDate);

/* ---------- التقرير الشهري ---------- */
document.getElementById("reportMonth").addEventListener("change", loadMonthlyReport);
document.getElementById("adminClinicSelect").addEventListener("change", loadMonthlyReport);
document.getElementById("loadReportBtn").addEventListener("click", loadMonthlyReport);

/* ---------- أزرار الإحصائيات البيانية ---------- */
document.querySelectorAll("[data-chart-type]").forEach(btn => {
    btn.addEventListener("click", () => {
        switch (btn.dataset.chartType) {
            case "doughnut": showCaseTypeChart("doughnut"); break;
            case "bar": showCaseTypeChart("bar"); break;
            case "barCompare": showBarChart(); break;
            case "combined": showCombinedTotal(); break;
        }
    });
});

/* ---------- التصدير إلى Excel ---------- */
document.getElementById("exportExcelBtn").addEventListener("click", exportExcel);

/* ---------- تسجيل الخروج ---------- */
document.getElementById("logoutBtn").addEventListener("click", logout);

// تسجيل خروج جميع الموظفين دفعة واحدة (للمسؤول فقط) — يمسح كل الجلسات بالسيرفر
document.getElementById("logoutAllBtn").addEventListener("click", async () => {
    if (!session.isAdmin) return;
    if (!confirm(trText("logoutAllConfirm"))) return;

    const btn = document.getElementById("logoutAllBtn");
    setBusy(btn, true, trText("loggingOut"));
    try {
        const result = await apiPost("LOGOUT_ALL", { token: session.token });
        if (result.status === "SUCCESS") {
            showSuccess(trText("logoutAllSuccess"));
            logout(); // المسؤول نفسه بينخرج أيضًا لأن كل الجلسات انمسحت
        } else {
            showError(trText("logoutAllFailed"));
        }
    } catch (e) {
        showError(trText("logoutAllConnFailed"));
    } finally {
        setBusy(btn, false, trText("loggingOutAll"));
    }
});

/* ---------- تفويض الأحداث للجداول الديناميكية ---------- */

// جدول التقرير الشهري — الضغط على صف يفتح تفاصيل اليوم
document.getElementById("reportTableBody").addEventListener("click", (e) => {
    const tr = e.target.closest("tr.clickable-row");
    if (tr && tr.dataset.date) {
        loadDayDetails(tr.dataset.date, tr.dataset.clinic);
    }
});

// إغلاق لوحة تفاصيل اليوم
document.getElementById("dayDetailsCloseBtn").addEventListener("click", () => {
    document.getElementById("dayDetailsPanel").style.display = "none";
    delete window.__lastDayDetails;
});

// جداول المرضى حسب التاريخ (صباحي/مسائي) — تعديل/حذف/حفظ/إلغاء + إظهار/إخفاء صندوق "أخرى"
[document.getElementById("patientsByDateMorningBody"), document.getElementById("patientsByDateEveningBody")].forEach(tb => {
    tb.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        switch (btn.dataset.action) {
            case "edit-patient": startEditPatientRow(btn); break;
            case "delete-patient": deletePatientRow(btn); break;
            case "save-patient": savePatientEditRow(btn); break;
            case "cancel-patient": cancelPatientEditRow(btn); break;
        }
    });
    tb.addEventListener("change", (e) => {
        const target = e.target;
        if (target.classList && target.classList.contains("cond-select")) {
            const other = target.nextElementSibling;
            if (other) other.style.display = target.value === "__other__" ? "block" : "none";
        }
    });
});

// جدول إدارة الموظفين — تعديل/حذف/حفظ/إلغاء
document.getElementById("employeesTableBody").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    switch (btn.dataset.action) {
        case "edit-employee": startEditEmployeeRow(btn); break;
        case "delete-employee": deleteEmployeeRow(btn); break;
        case "save-employee": saveEmployeeEditRow(btn); break;
        case "cancel-employee": cancelEmployeeEditRow(btn); break;
    }
});

/* ---------- إقلاع التطبيق ---------- */

initPreferences(); // اللغة والمود المحفوظين

populateTimeSelect(document.getElementById("patientTimeHour"), 24);
populateTimeSelect(document.getElementById("patientTimeMinute"), 60);
document.getElementById("reportMonth").value = todayDateStringLocal().substring(0, 7);

checkServerStatus();
updateDutyTeamBanner();
restoreSession();
