/* ---------- اللغة (عربي / إنجليزي) ---------- */

// كل نصوص الواجهة مترجمة باللغتين هنا — أي نص جديد لازم يُضاف بالعربي والإنجليزي
// عشان تبديل اللغة يترجم كل شيء: النصوص الثابتة (data-i18n) والديناميكية (tr)
const TRANSLATIONS = {
    ar: {
        brandLine: "نظام العيادة الذكي",
        mainTitle: "سستم جدول حالات العيادة",
        mainSubtitle: "منظومة تصنيف وتوثيق الحالات — عيادات الطوارئ الطبية",
        tabAddPatient: "➕ إضافة المريض",
        tabViewPatientsAdmin: "👥 عرض المرضى",
        tabStats: "📊 الإحصائية الشهرية",
        tabManageEmployees: "🛠️ إدارة الموظفين",
        serverChecking: "يتم التحقق من حالة السيرفر...",
        checkingSession: "جاري التحقق من الجلسة...",
        loginTitle: "تسجيل الدخول إلى النظام",
        empIdLabel: "الرقم الوظيفي",
        passwordLabel: "الرمز السري",
        clinicShiftPreviewLabel: "العيادة والشفت المسجلة",
        loginBtn: "تسجيل الدخول وتأكيد الهوية",
        createAccountLink: "إنشاء حساب جديد",
        forgotPinLink: "استرجاع الرمز",
        registerTitle: "تسجيل موظف جديد برقم وظيفي",
        empIdRegLabel: "الرقم الوظيفي (4 أرقام)",
        phoneLabel: "رقم الهاتف للتأكيد والتواصل",
        civilIdLabel: "الرقم المدني",
        emailLabel: "البريد الإلكتروني",
        chooseClinicLabel: "اختر العيادة",
        clinicA: "عيادة الف",
        clinicB: "عيادة باء",
        allClinicsOption: "كل العيادات",
        shiftAMorning: "شفت الف صباحي",
        shiftAEvening: "شفت الف مسائي",
        shiftBMorning: "شفت باء صباحي",
        shiftBEvening: "شفت باء مسائي",
        shiftCMorning: "شفت جيم صباحي",
        shiftCEvening: "شفت جيم مسائي",
        chooseShiftLabel: "اختر الشفت / الفترة",
        choosePinLabel: "اختر الرمز السري",
        registerBtn: "اعتماد وحفظ الحساب الجديد",
        backToLogin: "العودة للدخول",
        forgotTitle: "استرجاع وتحديث الرمز الخاص",
        empIdLabel2: "الرقم الوظيفي الخاص بك",
        phoneRegisteredLabel: "رقم الهاتف المسجل بالمنظومة",
        civilIdRegisteredLabel: "الرقم المدني المسجل",
        emailRegisteredLabel: "البريد الإلكتروني المسجل",
        newPinLabel: "أدخل الرمز السري الجديد",
        forgotBtn: "تحديث الرمز بالهاتف والتحقق",
        addPatientTitle: "إضافة مريض جديد",
        viewPatientsTitle: "عرض المرضى حسب التاريخ",
        morningShiftTitle: "🌅 شفت صباحي",
        eveningShiftTitle: "🌙 شفت مسائي",
        statsTitle: "الإحصائية الشهرية",
        manageEmployeesTitle: "إدارة الموظفين — تعديل العيادة والشفت",
        logoutBtn: "تسجيل الخروج",
        logoutAllBtn: "تسجيل خروج جميع الموظفين",
        patientNameLabel: "اسم المريض",
        genderLabel: "الجنس",
        genderMale: "ذكر",
        genderFemale: "أنثى",
        condSickCases: "حالات طبية",
        condBloodPressure: "ضغط الدم",
        condHypertension: "ارتفاع ضغط",
        condHypotension: "انخفاض ضغط",
        condBloodSugar: "قياس سكر الدم",
        condHyperglycemia: "ارتفاع سكر الدم",
        condHypoglycemia: "انخفاض سكر الدم",
        condHeadache: "صداع",
        condVitalSigns: "علامات حيوية",
        condInjuries: "إصابات",
        condBurns: "حروق",
        condHospitalTransfer: "نقل مستشفى",
        condOther: "أخرى (اكتب الحالة)",
        conditionLabel: "الحالة",
        writeConditionLabel: "اكتب الحالة",
        bpLabel: "الضغط",
        sugarLabel: "السكر",
        tempLabel: "الحرارة",
        hourLabel: "الساعة",
        treatmentLabel: "التعامل",
        bpPlaceholder: "مثال: 120/80",
        treatmentPlaceholder: "اكتب شنو كان التعامل مع الحالة...",
        dateLabel: "التاريخ",
        clinicLabel: "العيادة",
        shiftLabel: "الشفت",
        chooseMonthLabel: "اختر الشهر",
        chooseClinicForReportLabel: "اختر العيادة لعرض تقريرها",
        timeColLabel: "الوقت",
        empIdColLabel: "الرقم الوظيفي",
        phoneColLabel: "رقم الهاتف",
        currentClinicLabel: "العيادة الحالية",
        currentShiftLabel: "الشفت الحالي",
        actionsLabel: "إجراءات",
        totalLabel: "الإجمالي",
        sickCasesLabel: "حالات طبية",
        bloodPressureLabel: "ضغط الدم",
        sugarColLabel: "السكر",
        headacheLabel: "صداع",
        vitalSignsLabel: "علامات حيوية",
        injuriesLabel: "إصابات",
        burnsLabel: "حروق",
        hospitalTransferLabel: "نقل مستشفى",
        otherLabel: "أخرى",
        savePatientBtn: "حفظ بيانات المريض",
        refreshBtn: "🔄 تحديث",
        printSaveBtn: "🖨️ طباعة / حفظ PDF",
        viewPatientsBtn: "عرض المرضى",
        loadMonthlyReportBtn: "جلب التقرير الشهري",
        closeDetailsBtn: "إغلاق التفاصيل",
        exportExcelBtn: "📥 تصدير Excel",
        monthlyReportTitle: "التقرير الشهري لكل الشفتات",
        sessionsTitle: "الجلسات",
        footerNote: "جميع البيانات تُحفظ وتُوثّق آليًا لحظة الضغط على زر الحفظ",
        printHeaderToday: "تقرير مرضى اليوم",
        printHeaderPatients: "تقرير المرضى",
        printHeaderClinic: "تقرير حالات العيادة",
        pieChartBtn: "📊 نسب الحالات (دائري)",
        barChartBtn: "📶 نسب الحالات (أعمدة)",
        barCompareBtn: "📶 مقارنة العيادتين",
        combinedTotalBtn: "🏥 إجمالي العيادتين معًا",
        edit: "تعديل",
        delete: "حذف",
        save: "حفظ",
        cancel: "إلغاء",
        deleteAccount: "حذف حساب",
        errorRequiredFields: "الرجاء تعبئة جميع الحقول",
        errorRequiredEmpPin: "الرجاء إدخال الرقم الوظيفي والرمز السري",
        errorEmpIdFourDigits: "الرقم الوظيفي يجب أن يكون 4 أرقام",
        errorCivilIdMax: "الرقم المدني يجب ألا يتجاوز 12 رقمًا",
        errorNameCivilRequired: "الرجاء إدخال اسم المريض والرقم المدني",
        errorConditionRequired: "الرجاء كتابة نوع الحالة",
        errorChooseDate: "اختر تاريخًا أولاً",
        apiUrlNotSet: "لم يتم ربط رابط السيرفر بعد (API_URL)",
        loginSuccess: "تم تسجيل الدخول بنجاح",
        loginFailed: "الرقم الوظيفي أو الرمز السري غير صحيح",
        loginFailedShift: "اليوم مو شفتك — الفريق المناوب اليوم هو {{team}}. حسابك مسجّل على {{yours}}.",
        loginOldAccountNoClinic: "حسابك القديم ما فيه عيادة/شفت مسجلة. تواصل مع المسؤول لتحديثها، أو سجّل حساب جديد.",
        adminAccount: "حساب مسؤول",
        registerSuccess: "تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن",
        registerExists: "هذا الرقم الوظيفي مسجل مسبقًا",
        registerFailed: "تعذر إنشاء الحساب، حاول مجددًا",
        forgotSuccess: "تم تحديث الرمز السري بنجاح",
        forgotNotFound: "لم يتم العثور على حساب مطابق لهذه البيانات",
        connError: "تعذر الاتصال بالسيرفر، تحقق من رابط API",
        connErrorShort: "تعذر الاتصال بالسيرفر",
        reportLoadFailed: "تعذر جلب التقرير",
        reportConnFailed: "تعذر الاتصال بالسيرفر أثناء جلب التقرير",
        sessionInvalid: "جلسة الدخول غير صالحة، سجّل الدخول من جديد",
        noDataForScope: "لا توجد بيانات مسجلة بعد ل{{scope}}",
        rowClickTooltip: "اضغط لعرض تفاصيل هذا اليوم",
        loadingDetails: "جاري جلب التفاصيل...",
        detailsLoadFailed: "تعذر جلب التفاصيل، حاول مرة أخرى",
        detailsConnFailed: "تعذر الاتصال بالسيرفر أثناء جلب التفاصيل",
        detailsTitle: "تفاصيل اليوم — {{date}} ({{clinic}})",
        noPatientsShift: "لا يوجد مرضى مسجلون بهذا الشفت",
        noPatientsDay: "لا يوجد مرضى مسجلون بهذا اليوم",
        morningBlockTitle: "🌅 الشفت الصباحي",
        eveningBlockTitle: "🌙 الشفت المسائي",
        thTime: "الوقت",
        thPatientName: "اسم المريض",
        thCivilId: "الرقم المدني",
        thGender: "الجنس",
        thCondition: "الحالة",
        thBP: "الضغط",
        thSugar: "السكر",
        thTemp: "الحرارة",
        thTreatment: "التعامل",
        thRecordedBy: "من سجّل",
        thShift: "الشفت",
        thClinic: "العيادة",
        noPatientsToday: "لم تتم إضافة أي مريض بعد اليوم لنفس عيادتك وشفتك",
        noPatientsMorningDate: "لا يوجد مرضى مسجلون بالشفت الصباحي بهذا التاريخ",
        noPatientsEveningDate: "لا يوجد مرضى مسجلون بالشفت المسائي بهذا التاريخ",
        noPatientsShiftDate: "لا يوجد مرضى مسجلون بهذا الشفت بهذا التاريخ",
        selectDatePrompt: "اختر تاريخًا واضغط \"عرض المرضى\"",
        patientsLoadedEmpty: "لا يوجد مرضى مسجلون بالتاريخ المحدد",
        savePatientSuccess: "تم حفظ بيانات المريض بنجاح",
        savePatientFailed: "فشل الحفظ، حاول مرة أخرى",
        savePatientConnFailed: "تعذر الاتصال بالسيرفر أثناء الحفظ",
        loadPatientsFailed: "تعذر جلب بيانات المرضى",
        loadPatientsForbidden: "هذه الميزة للمسؤول فقط، أو الجلسة غير صالحة",
        loadPatientsConnFailed: "تعذر الاتصال بالسيرفر أثناء جلب بيانات المرضى",
        updatePatientSuccess: "تم تحديث بيانات المريض بنجاح",
        updatePatientFailed: "تعذر حفظ التعديل",
        deleteConfirmPatient: "هل أنت متأكد من حذف بيانات هذا المريض نهائيًا؟",
        deletePatientSuccess: "تم حذف المريض بنجاح",
        deletePatientFailed: "تعذر حذف السجل",
        deleteConnFailed: "تعذر الاتصال بالسيرفر أثناء الحذف",
        otherOption: "أخرى (اكتب الحالة)",
        otherPlaceholder: "اكتب الحالة",
        loading: "جاري التحميل...",
        employeesLoadFailed: "تعذر جلب قائمة الموظفين",
        employeesEmpty: "ما فيه موظفين مسجلين بعد",
        employeesConnFailed: "تعذر الاتصال بالسيرفر",
        updateEmployeeSuccess: "تم تحديث بيانات الموظف بنجاح",
        updateEmployeeFailed: "تعذر حفظ التعديل",
        updateEmployeeConnFailed: "تعذر الاتصال بالسيرفر أثناء الحفظ",
        deleteConfirmEmployee: "هل أنت متأكد من حذف حساب الموظف رقم {{empId}} نهائيًا؟ هذا الإجراء لا يمكن التراجع عنه.",
        deleteEmployeeSuccess: "تم حذف حساب الموظف بنجاح",
        deleteEmployeeFailed: "تعذر حذف الحساب",
        serverOk: "🟢 السيرفر متصل ويعمل بشكل طبيعي",
        serverUnexpected: "🔴 السيرفر يستجيب لكن برد غير متوقع",
        serverOffline: "🔴 تعذر الاتصال بالسيرفر، تحقق من رابط API أو النشر",
        dutyTeamBanner: "الفريق المناوب اليوم: {{team}}",
        genericError: "صار خطأ غير متوقع، جرّب تحدّث الصفحة. لو تكرر، بلّغ الأدمن.",
        logoutAllConfirm: "هل أنت متأكد؟ سيتم تسجيل خروج جميع الموظفين، وسيحتاج كل واحد لتسجيل الدخول من جديد. لن يتم مسح أي بيانات.",
        logoutAllSuccess: "تم تسجيل خروج جميع الموظفين",
        logoutAllFailed: "تعذر تسجيل خروج الجميع، حاول مرة أخرى",
        logoutAllConnFailed: "تعذر الاتصال بالسيرفر أثناء تسجيل الخروج",
        loggingOut: "تسجيل خروج...",
        loggingOutAll: "تسجيل خروج جميع الموظفين",
        excelLibraryMissing: "تعذر تحميل مكتبة Excel (SheetJS). تحقق من اتصال الإنترنت وأعد تحميل الصفحة.",
        excelPreparing: "جاري تجهيز الملف...",
        excelFetchFailed: "تعذر جلب البيانات للتصدير، حاول مرة أخرى",
        excelNoData: "لا توجد بيانات مسجلة لهذا الشهر لتصديرها",
        excelMonthlySheet: "الإحصائية الشهرية",
        excelMonthlyTitle: "التقرير الشهري — {{month}} ({{clinic}})",
        excelMonthTotal: "مجموع الشهر",
        excelDayTitle: "تفاصيل اليوم — {{date}} ({{clinic}})",
        excelAllClinics: "كل العيادات",
        excelSuccess: "تم تصدير ملف Excel بنجاح",
        excelFailed: "تعذر تصدير ملف Excel، حاول مرة أخرى",
        printFailed: "تعذر تجهيز الطباعة، حاول تحديث الصفحة",
        printDatePrefix: "تاريخ الطباعة: ",
        printPopupsBlocked: "يرجى السماح بالنوافذ المنبثقة (Pop-ups) لهذا الموقع من إعدادات المتصفح عشان تقدر تطبع",
        loginBusy: "تسجيل الدخول وتأكيد الهوية",
        registerBusy: "اعتماد وحفظ الحساب الجديد",
        forgotBusy: "تحديث الرمز والتحقق",
        savePatientBusy: "حفظ بيانات المريض",
        reportScope: "الشهر",
        chartLibraryMissing: "تعذر تحميل مكتبة الرسوم البيانية (Chart.js). تحقق من اتصال الإنترنت وأعد تحميل الصفحة.",
        chartFetchFailed: "تعذر جلب بيانات الرسم البياني من السيرفر",
        chartNoData: "لا توجد بيانات كافية لعرض الرسم البياني لهذه العيادة",
        chartNoCompareData: "لا توجد بيانات كافية لعرض المقارنة",
        chartBuildError: "حدث خطأ أثناء بناء الرسم البياني: {{error}}",
        chartUnknownError: "غير معروف",
        chartCaseTitle: "نسب أنواع الحالات — {{clinic}} ({{scope}})",
        chartCompareTitle: "مقارنة أنواع الحالات بين العيادتين ({{scope}})",
        chartCombinedTitle: "إجمالي الحالات — العيادتين معًا ({{scope}})",
        combinedTotalLabel: "الإجمالي الكلي",
        combinedFetchFailed: "تعذر جلب البيانات",
        combinedConnFailed: "تعذر الاتصال بالسيرفر أثناء جلب البيانات"
    },
    en: {
        brandLine: "Smart Clinic System",
        mainTitle: "Clinic Case Log System",
        mainSubtitle: "Case classification & documentation — Emergency medical clinics",
        tabAddPatient: "➕ Add Patient",
        tabViewPatientsAdmin: "👥 View Patients",
        tabStats: "📊 Monthly Statistics",
        tabManageEmployees: "🛠️ Manage Employees",
        serverChecking: "Checking server status...",
        checkingSession: "Checking session...",
        loginTitle: "Login to the System",
        empIdLabel: "Employee ID",
        passwordLabel: "Password",
        clinicShiftPreviewLabel: "Registered Clinic & Shift",
        loginBtn: "Login & Verify",
        createAccountLink: "Create New Account",
        forgotPinLink: "Recover Password",
        registerTitle: "Register New Employee",
        empIdRegLabel: "Employee ID (4 digits)",
        phoneLabel: "Phone Number (for verification)",
        civilIdLabel: "Civil ID",
        emailLabel: "Email",
        chooseClinicLabel: "Choose Clinic",
        clinicA: "Clinic A",
        clinicB: "Clinic B",
        allClinicsOption: "All Clinics",
        shiftAMorning: "Shift A — Morning",
        shiftAEvening: "Shift A — Evening",
        shiftBMorning: "Shift B — Morning",
        shiftBEvening: "Shift B — Evening",
        shiftCMorning: "Shift C — Morning",
        shiftCEvening: "Shift C — Evening",
        chooseShiftLabel: "Choose Shift / Period",
        choosePinLabel: "Choose Password",
        registerBtn: "Confirm & Save New Account",
        backToLogin: "Back to Login",
        forgotTitle: "Recover & Reset Password",
        empIdLabel2: "Your Employee ID",
        phoneRegisteredLabel: "Registered Phone Number",
        civilIdRegisteredLabel: "Registered Civil ID",
        emailRegisteredLabel: "Registered Email",
        newPinLabel: "Enter New Password",
        forgotBtn: "Verify & Reset Password",
        addPatientTitle: "Add New Patient",
        viewPatientsTitle: "View Patients by Date",
        morningShiftTitle: "🌅 Morning Shift",
        eveningShiftTitle: "🌙 Evening Shift",
        statsTitle: "Monthly Statistics",
        manageEmployeesTitle: "Manage Employees — Edit Clinic & Shift",
        logoutBtn: "Logout",
        logoutAllBtn: "Log Out All Employees",
        patientNameLabel: "Patient Name",
        genderLabel: "Gender",
        genderMale: "Male",
        genderFemale: "Female",
        condSickCases: "Medical Cases",
        condBloodPressure: "Blood Pressure",
        condHypertension: "Hypertension",
        condHypotension: "Hypotension",
        condBloodSugar: "Blood Sugar",
        condHyperglycemia: "Hyperglycemia",
        condHypoglycemia: "Hypoglycemia",
        condHeadache: "Headache",
        condVitalSigns: "Vital Signs",
        condInjuries: "Injuries",
        condBurns: "Burns",
        condHospitalTransfer: "Hospital Transfer",
        condOther: "Other (specify)",
        conditionLabel: "Condition",
        writeConditionLabel: "Enter Condition",
        bpLabel: "Blood Pressure",
        sugarLabel: "Sugar",
        tempLabel: "Temperature",
        hourLabel: "Time",
        treatmentLabel: "Treatment",
        bpPlaceholder: "Example: 120/80",
        treatmentPlaceholder: "Describe what was done for the case...",
        dateLabel: "Date",
        clinicLabel: "Clinic",
        shiftLabel: "Shift",
        chooseMonthLabel: "Choose Month",
        chooseClinicForReportLabel: "Choose Clinic for Report",
        timeColLabel: "Time",
        empIdColLabel: "Employee ID",
        phoneColLabel: "Phone Number",
        currentClinicLabel: "Current Clinic",
        currentShiftLabel: "Current Shift",
        actionsLabel: "Actions",
        totalLabel: "Total",
        sickCasesLabel: "Medical Cases",
        bloodPressureLabel: "Blood Pressure",
        sugarColLabel: "Sugar",
        headacheLabel: "Headache",
        vitalSignsLabel: "Vital Signs",
        injuriesLabel: "Injuries",
        burnsLabel: "Burns",
        hospitalTransferLabel: "Hospital Transfer",
        otherLabel: "Other",
        savePatientBtn: "Save Patient Data",
        refreshBtn: "🔄 Refresh",
        printSaveBtn: "🖨️ Print / Save PDF",
        viewPatientsBtn: "View Patients",
        loadMonthlyReportBtn: "Load Monthly Report",
        closeDetailsBtn: "Close Details",
        exportExcelBtn: "📥 Export Excel",
        monthlyReportTitle: "Monthly Report — All Shifts",
        sessionsTitle: "Sessions",
        footerNote: "All data is saved and documented automatically the moment you press Save",
        printHeaderToday: "Today's Patients Report",
        printHeaderPatients: "Patients Report",
        printHeaderClinic: "Clinic Cases Report",
        pieChartBtn: "📊 Case Distribution (Pie)",
        barChartBtn: "📶 Case Distribution (Bars)",
        barCompareBtn: "📶 Compare Both Clinics",
        combinedTotalBtn: "🏥 Combined Total of Both Clinics",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        cancel: "Cancel",
        deleteAccount: "Delete Account",
        errorRequiredFields: "Please fill in all fields",
        errorRequiredEmpPin: "Please enter employee ID and password",
        errorEmpIdFourDigits: "Employee ID must be 4 digits",
        errorCivilIdMax: "Civil ID must not exceed 12 digits",
        errorNameCivilRequired: "Please enter patient name and civil ID",
        errorConditionRequired: "Please write the condition",
        errorChooseDate: "Choose a date first",
        apiUrlNotSet: "Server URL is not configured yet (API_URL)",
        loginSuccess: "Logged in successfully",
        loginFailed: "Incorrect employee ID or password",
        loginFailedShift: "Not your shift today — today's on-duty team is {{team}}. Your account is registered for {{yours}}.",
        loginOldAccountNoClinic: "Your old account has no registered clinic/shift. Contact the admin to update it, or register a new account.",
        adminAccount: "Admin Account",
        registerSuccess: "Account created successfully, you can log in now",
        registerExists: "This employee ID is already registered",
        registerFailed: "Could not create the account, try again",
        forgotSuccess: "Password updated successfully",
        forgotNotFound: "No matching account found for this data",
        connError: "Could not connect to the server, check the API URL",
        connErrorShort: "Could not connect to the server",
        reportLoadFailed: "Could not load the report",
        reportConnFailed: "Could not connect to the server while loading the report",
        sessionInvalid: "Session is invalid, please log in again",
        noDataForScope: "No data recorded yet for {{scope}}",
        rowClickTooltip: "Click to view this day's details",
        loadingDetails: "Loading details...",
        detailsLoadFailed: "Could not load the details, try again",
        detailsConnFailed: "Could not connect to the server while loading the details",
        detailsTitle: "Day Details — {{date}} ({{clinic}})",
        noPatientsShift: "No patients recorded in this shift",
        noPatientsDay: "No patients recorded this day",
        morningBlockTitle: "🌅 Morning Shift",
        eveningBlockTitle: "🌙 Evening Shift",
        thTime: "Time",
        thPatientName: "Patient Name",
        thCivilId: "Civil ID",
        thGender: "Gender",
        thCondition: "Condition",
        thBP: "Blood Pressure",
        thSugar: "Sugar",
        thTemp: "Temperature",
        thTreatment: "Treatment",
        thRecordedBy: "Recorded By",
        thShift: "Shift",
        thClinic: "Clinic",
        noPatientsToday: "No patients have been added today for your clinic and shift yet",
        noPatientsMorningDate: "No patients recorded in the morning shift on this date",
        noPatientsEveningDate: "No patients recorded in the evening shift on this date",
        noPatientsShiftDate: "No patients recorded in this shift on this date",
        selectDatePrompt: "Choose a date and press \"View Patients\"",
        patientsLoadedEmpty: "No patients recorded on the selected date",
        savePatientSuccess: "Patient data saved successfully",
        savePatientFailed: "Saving failed, try again",
        savePatientConnFailed: "Could not connect to the server while saving",
        loadPatientsFailed: "Could not load patient data",
        loadPatientsForbidden: "This feature is admin-only, or the session is invalid",
        loadPatientsConnFailed: "Could not connect to the server while loading patient data",
        updatePatientSuccess: "Patient data updated successfully",
        updatePatientFailed: "Could not save the edit",
        deleteConfirmPatient: "Are you sure you want to permanently delete this patient's data?",
        deletePatientSuccess: "Patient deleted successfully",
        deletePatientFailed: "Could not delete the record",
        deleteConnFailed: "Could not connect to the server while deleting",
        otherOption: "Other (specify)",
        otherPlaceholder: "Enter the condition",
        loading: "Loading...",
        employeesLoadFailed: "Could not load the employees list",
        employeesEmpty: "No employees registered yet",
        employeesConnFailed: "Could not connect to the server",
        updateEmployeeSuccess: "Employee data updated successfully",
        updateEmployeeFailed: "Could not save the edit",
        updateEmployeeConnFailed: "Could not connect to the server while saving",
        deleteConfirmEmployee: "Are you sure you want to permanently delete employee #{{empId}}? This action cannot be undone.",
        deleteEmployeeSuccess: "Employee account deleted successfully",
        deleteEmployeeFailed: "Could not delete the account",
        serverOk: "🟢 Server is connected and working normally",
        serverUnexpected: "🔴 Server responded with an unexpected reply",
        serverOffline: "🔴 Could not connect to the server, check the API URL or deployment",
        dutyTeamBanner: "Today's on-duty team: {{team}}",
        genericError: "An unexpected error occurred, try refreshing the page. If it keeps happening, notify the admin.",
        logoutAllConfirm: "Are you sure? All employees will be logged out, and each one will need to log in again. No data will be erased.",
        logoutAllSuccess: "All employees have been logged out",
        logoutAllFailed: "Could not log everyone out, try again",
        logoutAllConnFailed: "Could not connect to the server while logging out",
        loggingOut: "Logging out...",
        loggingOutAll: "Log Out All Employees",
        excelLibraryMissing: "Could not load the Excel library (SheetJS). Check your internet connection and reload the page.",
        excelPreparing: "Preparing file...",
        excelFetchFailed: "Could not fetch data for export, try again",
        excelNoData: "No data recorded for this month to export",
        excelMonthlySheet: "Monthly Statistics",
        excelMonthlyTitle: "Monthly Report — {{month}} ({{clinic}})",
        excelMonthTotal: "Monthly Total",
        excelDayTitle: "Day Details — {{date}} ({{clinic}})",
        excelAllClinics: "All Clinics",
        excelSuccess: "Excel file exported successfully",
        excelFailed: "Could not export the Excel file, try again",
        printFailed: "Could not prepare printing, try refreshing the page",
        printDatePrefix: "Print date: ",
        printPopupsBlocked: "Please allow pop-ups for this site in your browser settings so you can print",
        loginBusy: "Login & Verify",
        registerBusy: "Confirm & Save New Account",
        forgotBusy: "Verify & Reset Password",
        savePatientBusy: "Save Patient Data",
        reportScope: "Month",
        chartLibraryMissing: "Could not load the charts library (Chart.js). Check your internet connection and reload the page.",
        chartFetchFailed: "Could not fetch chart data from the server",
        chartNoData: "Not enough data to display the chart for this clinic",
        chartNoCompareData: "Not enough data to display the comparison",
        chartBuildError: "Error while building the chart: {{error}}",
        chartUnknownError: "Unknown",
        chartCaseTitle: "Case Distribution — {{clinic}} ({{scope}})",
        chartCompareTitle: "Case Comparison Between Both Clinics ({{scope}})",
        chartCombinedTitle: "Total Cases — Both Clinics Combined ({{scope}})",
        combinedTotalLabel: "Grand Total",
        combinedFetchFailed: "Could not fetch the data",
        combinedConnFailed: "Could not connect to the server while fetching data"
    }
};

function currentLang() {
    return localStorage.getItem("clinicLang") || "ar";
}

// الترجمة العامة لأي نص ديناميكي (تُستخدم بالجافاسكربت).
// يدعم استبدال المتغيرات {{name}} — مثال: trText("detailsTitle", { date, clinic })
// الاسم trText مو tr حتى لا يتعارض مع متغير الصف (tr) الشائع في كود الجداول
function trText(key, vars) {
    const lang = currentLang();
    const dict = lang === "en" ? TRANSLATIONS.en : TRANSLATIONS.ar;
    let s = dict[key];
    if (s === undefined || s === null) s = TRANSLATIONS.ar[key];
    if (s === undefined || s === null) s = key;
    if (vars) {
        Object.keys(vars).forEach(k => { s = s.split("{{" + k + "}}").join(String(vars[k] ?? "")); });
    }
    return s;
}

// الأزرار الديناميكية داخل الجداول (تعديل/حذف/حفظ/إلغاء)
function t(key) {
    return trText(key);
}

// الاسم المترجم لفئة الحالة (تُستخدم بالرسوم البيانية وتصدير Excel)
function categoryLabel(key) {
    const map = {
        sick_cases: "sickCasesLabel",
        blood_pressure: "bloodPressureLabel",
        sugar: "sugarColLabel",
        headache: "headacheLabel",
        vital_signs: "vitalSignsLabel",
        injuries: "injuriesLabel",
        burns: "burnsLabel",
        hospital_transfer: "hospitalTransferLabel",
        other: "otherLabel"
    };
    return trText(map[key] || "otherLabel");
}

// ترجمة القيم المخزنة عربيًّا في قاعدة البيانات (العيادة/الشفت/الجنس/الحالة).
// القيم الثابتة تُترجم حسب اللغة الحالية، وأي قيمة غير معروفة (مثل اسم موظف مكتوب
// يدويًا) تمر كما هي — لأن البيانات المدخلة من المستخدمين لا يمكن ترجمتها آليًا.
const VALUE_LABEL_KEYS = {
    "عيادة الف": "clinicA",
    "عيادة باء": "clinicB",
    "شفت الف صباحي": "shiftAMorning",
    "شفت الف مسائي": "shiftAEvening",
    "شفت باء صباحي": "shiftBMorning",
    "شفت باء مسائي": "shiftBEvening",
    "شفت جيم صباحي": "shiftCMorning",
    "شفت جيم مسائي": "shiftCEvening",
    "ذكر": "genderMale",
    "أنثى": "genderFemale",
    "حالات طبية": "condSickCases",
    "ضغط الدم": "condBloodPressure",
    "ارتفاع ضغط": "condHypertension",
    "انخفاض ضغط": "condHypotension",
    "قياس سكر الدم": "condBloodSugar",
    "ارتفاع سكر الدم": "condHyperglycemia",
    "انخفاض سكر الدم": "condHypoglycemia",
    "صداع": "condHeadache",
    "علامات حيوية": "condVitalSigns",
    "إصابات": "condInjuries",
    "حروق": "condBurns",
    "نقل مستشفى": "condHospitalTransfer",
    "أخرى": "otherLabel"
};
function valueLabel(value) {
    if (value == null || value === "") return value;
    const key = VALUE_LABEL_KEYS[value];
    if (!key) return value;
    const translated = trText(key);
    return translated === key ? value : translated;
}

// قيمة الشفت القادمة من السيرفر تأتي بدون كلمة "شفت" — نكمّلها ثم نترجمها
// (مثال: "الف صباحي" → AR "شفت الف صباحي" / EN "Shift A — Morning")
function shiftLabel(raw) {
    const v = String(raw || "").trim();
    if (!v) return "";
    return valueLabel(v.startsWith("شفت ") ? v : "شفت " + v);
}

// تسمية تبويب "إضافة المريض / عرض المرضى" تتغير حسب نوع الحساب —
// لازم تترجم صح مع اللغة الحالية (المسؤول يشوف "عرض المرضى"، الموظف يشوف "إضافة المريض")
function setTabAddPatientLabel() {
    const btn = document.getElementById("tabBtnAddPatient");
    if (!btn) return;
    const isAdmin = !!(session && session.isAdmin);
    btn.textContent = isAdmin ? trText("tabViewPatientsAdmin") : trText("tabAddPatient");
}

function applyLanguage(lang) {
    const html = document.documentElement;
    if (lang === "en") {
        html.setAttribute("lang", "en");
        html.setAttribute("dir", "ltr");
        document.getElementById("langToggleBtn").textContent = "عربي";
    } else {
        html.setAttribute("lang", "ar");
        html.setAttribute("dir", "rtl");
        document.getElementById("langToggleBtn").textContent = "English";
    }

    document.querySelectorAll("[data-i18n]").forEach(el => {
        // تبويب "إضافة المريض/عرض المرضى" يُدار بشكل خاص لأنه يتغير حسب نوع الحساب
        if (el.id === "tabBtnAddPatient") return;
        const key = el.getAttribute("data-i18n");
        const isEn = lang === "en";
        if (isEn && TRANSLATIONS.en[key]) {
            if (!el.dataset.arOriginal) el.dataset.arOriginal = el.textContent;
            el.textContent = TRANSLATIONS.en[key];
        } else if (el.dataset.arOriginal) {
            el.textContent = el.dataset.arOriginal;
        }
    });

    // placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        const isEn = lang === "en";
        if (isEn && TRANSLATIONS.en[key]) {
            if (!el.dataset.phOriginal) el.dataset.phOriginal = el.getAttribute("placeholder");
            el.setAttribute("placeholder", TRANSLATIONS.en[key]);
        } else if (el.dataset.phOriginal !== undefined) {
            el.setAttribute("placeholder", el.dataset.phOriginal);
        }
    });

    // عنوان التبويب
    document.title = trText("mainTitle");

    setTabAddPatientLabel();
    localStorage.setItem("clinicLang", lang);
}

function toggleLanguage() {
    const current = localStorage.getItem("clinicLang") || "ar";
    applyLanguage(current === "ar" ? "en" : "ar");
    refreshDynamicContentForLanguage();
}

// يعيد رسم أي محتوى ديناميكي ظاهر حاليًا عشان يتحدث فورًا للغة الجديدة
function refreshDynamicContentForLanguage() {
    if (!session.token) {
        // شاشات الدخول — نعيد تطبيق النصوص الثابتة + حالة السيرفر
        checkServerStatus();
        updateDutyTeamBanner();
        return;
    }
    if (document.getElementById("addPatientSection").style.display !== "none") {
        loadTodayShiftPatients();
    }
    if (document.getElementById("adminPatientsSection").style.display !== "none" &&
        document.getElementById("patientsByDateSection").style.display !== "none") {
        loadPatientsByDate();
    }
    if (document.getElementById("monthlyStatsSection").style.display !== "none") {
        loadMonthlyReport();
        if (lastChartType) showChartForType(lastChartType);
        if (window.__lastDayDetails) {
            loadDayDetails(window.__lastDayDetails.date, window.__lastDayDetails.clinic);
        }
    }
    if (document.getElementById("manageEmployeesSection").style.display !== "none") {
        loadAllEmployees();
    }
    checkServerStatus();
    updateDutyTeamBanner();
}

function toggleDarkMode() {
    const isDark = document.body.classList.toggle("dark-mode");
    document.getElementById("darkModeToggleBtn").textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("clinicDarkMode", isDark ? "1" : "0");
}

// نطبّق تفضيلات اللغة والمود المحفوظة فور تحميل الصفحة
function initPreferences() {
    const savedLang = localStorage.getItem("clinicLang") || "ar";
    applyLanguage(savedLang);

    if (localStorage.getItem("clinicDarkMode") === "1") {
        document.body.classList.add("dark-mode");
        document.getElementById("darkModeToggleBtn").textContent = "☀️";
    }
}
