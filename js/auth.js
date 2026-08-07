/* ---------- تسجيل الدخول / التسجيل / استرجاع الرمز ---------- */

// بمجرد ما يكتمل الرقم الوظيفي (4 أرقام) بشاشة الدخول، نجيب عيادته وشفته
// المسجلين ونعرضهم بمربع رصاصي مقفول للعرض فقط (بدون الحاجة لإدخال الرمز السري)
let empIdPreviewTimer = null;
function checkLoginEmpIdPreview() {
    clearTimeout(empIdPreviewTimer);
    const empId = document.getElementById("loginEmpId").value.trim();
    const group = document.getElementById("loginClinicShiftPreviewGroup");
    const preview = document.getElementById("loginClinicShiftPreview");

    if (empId.length !== 4) {
        group.style.display = "none";
        return;
    }

    empIdPreviewTimer = setTimeout(async () => {
        try {
            const result = await apiGet({ action: "GET_USER_CLINIC_SHIFT", emp_id: empId });
            if (result && result.status === "FOUND") {
                if (result.isAdmin) {
                    preview.value = trText("adminAccount");
                } else {
                    preview.value = `${valueLabel(result.clinic) || "-"} — ${valueLabel(result.shift) || "-"}`;
                }
                group.style.display = "block";
            } else {
                group.style.display = "none";
            }
        } catch (e) {
            group.style.display = "none";
        }
    }, 300);
}

async function handleLogin() {
    const empId = document.getElementById("loginEmpId").value.trim();
    const pin = document.getElementById("loginPin").value.trim();
    const btn = document.getElementById("loginBtn");

    if (!empId || !pin) { showError(trText("errorRequiredEmpPin")); return; }
    if (API_URL.includes("PASTE_YOUR")) { showError(trText("apiUrlNotSet")); return; }

    setBusy(btn, true, trText("loginBusy"));
    try {
        const pinHash = await hashPin(pin);
        const result = await apiPost("VERIFY_LOGIN", { emp_id: empId, pin_hash: pinHash });

        if (result.status === "SUCCESS") {
            session.empId = empId;
            session.isAdmin = !!result.isAdmin;
            session.token = result.token;
            // العيادة والشفت يجيان من حساب الموظف المسجّل مسبقًا — يدخل بفترته تلقائيًا بدون اختيار كل مرة
            session.clinic = result.isAdmin ? null : (result.clinic || null);
            session.shift = result.isAdmin ? null : (result.shift || null);

            if (!session.isAdmin && (!session.clinic || !session.shift)) {
                showError(trText("loginOldAccountNoClinic"));
                setBusy(btn, false, trText("loginBusy"));
                return;
            }

            persistSession();
            enterDashboard();
        } else if (result.status === "WRONG_SHIFT_DAY") {
            showError(trText("loginFailedShift", { team: shiftLabel(result.on_duty_team), yours: shiftLabel(result.your_team) }));
        } else {
            showError(trText("loginFailed"));
        }
    } catch (e) {
        showError(trText("connError"));
    } finally {
        setBusy(btn, false, trText("loginBusy"));
    }
}

async function handleRegister() {
    const empId = document.getElementById("regEmpId").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const civilId = document.getElementById("regCivilId").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const clinic = document.getElementById("regClinic").value;
    const shift = document.getElementById("regShift").value;
    const pin = document.getElementById("regPin").value.trim();
    const btn = document.getElementById("registerBtn");

    if (!empId || !phone || !civilId || !email || !pin) { showError(trText("errorRequiredFields")); return; }
    if (empId.length !== 4) { showError(trText("errorEmpIdFourDigits")); return; }

    setBusy(btn, true, trText("registerBusy"));
    try {
        const pinHash = await hashPin(pin);
        const result = await apiPost("REGISTER_SECURE", {
            emp_id: empId, phone, pin_hash: pinHash,
            civil_id: civilId, email, clinic, shift
        });

        if (result.status === "SUCCESS") {
            showSuccess(trText("registerSuccess"));
            switchAuthScreen("loginScreen");
        } else if (result.status === "EXISTS") {
            showError(trText("registerExists"));
        } else {
            showError(trText("registerFailed"));
        }
    } catch (e) {
        showError(trText("connErrorShort"));
    } finally {
        setBusy(btn, false, trText("registerBusy"));
    }
}

async function handleForgot() {
    const empId = document.getElementById("forgotEmpId").value.trim();
    const phone = document.getElementById("forgotPhone").value.trim();
    const civilId = document.getElementById("forgotCivilId").value.trim();
    const email = document.getElementById("forgotEmail").value.trim();
    const newPin = document.getElementById("forgotNewPin").value.trim();
    const btn = document.getElementById("forgotBtn");

    if (!empId || !phone || !civilId || !email || !newPin) { showError(trText("errorRequiredFields")); return; }

    setBusy(btn, true, trText("forgotBusy"));
    try {
        const newPinHash = await hashPin(newPin);
        const result = await apiPost("FORGOT_PIN_SECURE", {
            emp_id: empId, phone, civil_id: civilId, email, new_pin_hash: newPinHash
        });

        if (result.status === "SUCCESS") {
            showSuccess(trText("forgotSuccess"));
            switchAuthScreen("loginScreen");
        } else {
            showError(trText("forgotNotFound"));
        }
    } catch (e) {
        showError(trText("connErrorShort"));
    } finally {
        setBusy(btn, false, trText("forgotBusy"));
    }
}
