/* =========================================================
   إعدادات الاتصال بالسيرفر (Google Apps Script Web App)
   استبدل الرابط أدناه برابط الـ Web App الخاص بك بعد النشر
   ========================================================= */
const API_URL = "https://script.google.com/macros/s/AKfycbyf6Qxoq0i4RkrauhfrQpeuWa0jPvHolmE0-nwyw5FRQez1qgk7KdgMlQiggBEjnvre/exec";

const SESSION_STORAGE_KEY = "clinicSession";

/* ---------- الثوابت المشتركة ---------- */

// أعمدة التقرير الشهري (تجميع تلقائي من سجلات المرضى) — نفس ترتيب الجدول
// والرسوم البيانية: الفئات الثمانية المعروفة + فئة "أخرى" لأي حالة غير مصنفة
const REPORT_EDIT_FIELDS = ["sick_cases", "blood_pressure", "sugar", "headache", "vital_signs", "injuries", "burns", "hospital_transfer", "other"];

// حقول صف المريض (عرض وتعديل)
const PATIENT_ROW_FIELDS = ["time", "patient_name", "civil_id", "gender", "condition", "blood_pressure", "sugar", "temperature", "treatment"];

// خيارات قوائم المرضى
const PATIENT_CONDITION_OPTIONS = ["حالات طبية", "ضغط الدم", "ارتفاع ضغط", "انخفاض ضغط", "قياس سكر الدم", "ارتفاع سكر الدم", "انخفاض سكر الدم", "صداع", "علامات حيوية", "إصابات", "حروق", "نقل مستشفى"];
const PATIENT_GENDER_OPTIONS = ["ذكر", "أنثى"];

// خيارات الموظفين (إدارة الموظفين)
const SHIFT_OPTIONS = ["شفت الف صباحي", "شفت الف مسائي", "شفت باء صباحي", "شفت باء مسائي", "شفت جيم صباحي", "شفت جيم مسائي"];
const CLINIC_OPTIONS = ["عيادة الف", "عيادة باء"];

// أسماء أنواع الحالات للرسوم البيانية
const CASE_LABELS = {
    sick_cases: "حالات طبية",
    blood_pressure: "ضغط الدم",
    sugar: "السكر",
    headache: "صداع",
    vital_signs: "علامات حيوية",
    injuries: "إصابات",
    burns: "حروق",
    hospital_transfer: "نقل مستشفى",
    other: "أخرى"
};

// ألوان أنواع الحالات للرسوم البيانية
const CASE_COLORS = {
    sick_cases: "#0d9488",
    blood_pressure: "#c0392b",
    sugar: "#e67e22",
    headache: "#b8860b",
    vital_signs: "#2980b9",
    injuries: "#8e44ad",
    burns: "#d35400",
    hospital_transfer: "#16a085",
    other: "#64748b"
};
