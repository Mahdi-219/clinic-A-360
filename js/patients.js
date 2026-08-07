/* ---------- إضافة مريض ---------- */

async function savePatient() {
    const btn = document.getElementById("savePatientBtn");

    const name = document.getElementById("patientName").value.trim();
    const civilId = document.getElementById("patientCivilId").value.trim();
    const gender = document.getElementById("patientGender").value;
    const conditionSelect = document.getElementById("patientCondition").value;
    const condition = conditionSelect === "__other__"
        ? document.getElementById("patientConditionOther").value.trim()
        : conditionSelect;
    const bp = document.getElementById("patientBP").value.trim();
    const sugar = document.getElementById("patientSugar").value.trim();
    const temp = document.getElementById("patientTemp").value.trim();
    const action = document.getElementById("patientAction").value.trim();
    const time = document.getElementById("patientTimeHour").value + ":" + document.getElementById("patientTimeMinute").value;

    if (!name || !civilId) { showError(trText("errorNameCivilRequired")); return; }
    if (conditionSelect === "__other__" && !condition) { showError(trText("errorConditionRequired")); return; }
    if (civilId.length > 12) { showError(trText("errorCivilIdMax")); return; }
    if (API_URL.includes("PASTE_YOUR")) { showError(trText("apiUrlNotSet")); return; }

    setBusy(btn, true, trText("savePatientBusy"));
    try {
        const now = new Date();
        const payload = {
            token: session.token,
            date_target: now.toLocaleDateString("en-CA"),
            emp_id: session.empId,
            clinic: session.clinic,
            shift: session.shift,
            patient_name: name,
            civil_id: civilId,
            gender,
            condition,
            blood_pressure: bp,
            sugar,
            temperature: temp,
            treatment: action,
            time,
            timestamp: now.toISOString()
        };
        const result = await apiPost("ADD_PATIENT", payload);

        if (result.status === "SUCCESS") {
            showSuccess(trText("savePatientSuccess"));
            clearPatientForm();
            loadTodayShiftPatients(); // نحدّث الجدول من السيرفر عشان يظهر لكل زملاء نفس الشفت
        } else {
            showError(trText("savePatientFailed"));
        }
    } catch (e) {
        showError(trText("savePatientConnFailed"));
    } finally {
        setBusy(btn, false, trText("savePatientBusy"));
    }
}

// يبحث عن آخر بيانات محفوظة لنفس الرقم المدني (مريض متكرر) ويعبّي الاسم والجنس تلقائيًا
// حتى لا يُعاد كتابتهم يدويًا في كل زيارة
let returningPatientTimer = null;
function checkReturningPatient() {
    clearTimeout(returningPatientTimer);
    const civilId = document.getElementById("patientCivilId").value.trim();
    if (civilId.length < 5) return; // ما نبحث إلا بعد رقم مدني معقول الطول

    returningPatientTimer = setTimeout(async () => {
        try {
            const result = await apiGet({ action: "GET_PATIENT_BY_CIVIL_ID", token: session.token, civil_id: civilId });
            if (result && result.status === "FOUND") {
                document.getElementById("patientName").value = result.patient_name || "";
                if (result.gender) document.getElementById("patientGender").value = result.gender;
            }
        } catch (e) {
            // تجاهل بصمت — لو تعذر البحث، الموظف يكمل التعبئة يدويًا كالمعتاد
        }
    }, 400);
}

function toggleOtherConditionBox() {
    const isOther = document.getElementById("patientCondition").value === "__other__";
    document.getElementById("patientConditionOtherGroup").style.display = isOther ? "block" : "none";
    if (!isOther) document.getElementById("patientConditionOther").value = "";
}

function clearPatientForm() {
    document.getElementById("patientName").value = "";
    document.getElementById("patientCivilId").value = "";
    document.getElementById("patientGender").selectedIndex = 0;
    document.getElementById("patientCondition").selectedIndex = 0;
    document.getElementById("patientConditionOther").value = "";
    document.getElementById("patientConditionOtherGroup").style.display = "none";
    document.getElementById("patientBP").value = "";
    document.getElementById("patientSugar").value = "";
    document.getElementById("patientTemp").value = "";
    document.getElementById("patientAction").value = "";
    setDefaultPatientTime();
    document.getElementById("patientName").focus();
}

// يجلب من السيرفر كل مرضى اليوم لنفس العيادة ونفس اسم الشفت المسجّل فيه الموظف
// (يشوف زملاءه اللي بنفس الفترة، مو بس اللي أضافهم هو بجهازه)
async function loadTodayShiftPatients() {
    if (API_URL.includes("PASTE_YOUR")) return;
    try {
        const result = await apiGet({ action: "GET_PATIENTS_BY_DATE", token: session.token, clinic: session.clinic, shift: session.shift });
        if (!Array.isArray(result)) return; // نتجاهل بصمت لو فشل الجلب، الجدول يبقى بآخر حالة معروضة
        renderTodayPatientsTable(result);
    } catch (e) {
        // تجاهل بصمت، المستخدم يقدر يضغط زر التحديث يدويًا لاحقًا
    }
}

function renderTodayPatientsTable(rows) {
    const body = document.getElementById("todayPatientsBody");
    document.getElementById("todayPatientCount").textContent = rows.length;

    if (!rows.length) {
        body.innerHTML = `<tr class="empty-row"><td colspan="10">${trText("noPatientsToday")}</td></tr>`;
        return;
    }

    // الأحدث فوق
    body.innerHTML = rows.slice().reverse().map(p => `
        <tr>
            <td>${escapeHtml(p.time) || "-"}</td>
            <td>${escapeHtml(p.patient_name)}</td>
            <td>${escapeHtml(p.civil_id)}</td>
            <td>${escapeHtml(valueLabel(p.gender)) || "-"}</td>
            <td>${escapeHtml(valueLabel(p.condition))}</td>
            <td>${escapeHtml(p.blood_pressure) || "-"}</td>
            <td>${escapeHtml(p.sugar) || "-"}</td>
            <td>${escapeHtml(p.temperature) || "-"}</td>
            <td>${escapeHtml(p.treatment) || "-"}</td>
            <td>${escapeHtml(p.emp_id)}</td>
        </tr>
    `).join("");
}

/* ---------- عرض المرضى حسب التاريخ (للمسؤول) ---------- */

async function loadPatientsByDate() {
    const date = document.getElementById("patientsViewDate").value;
    if (!date) { showError(trText("errorChooseDate")); return; }

    const clinic = document.getElementById("patientsViewClinic").value;

    try {
        const result = await apiGet({ action: "GET_PATIENTS_BY_DATE", token: session.token, date, clinic });
        if (!Array.isArray(result)) {
            if (result && result.status === "FORBIDDEN") {
                showError(trText("loadPatientsForbidden"));
            } else {
                showError(trText("loadPatientsFailed"));
            }
            return;
        }
        renderPatientsByDateTable(result);
        document.getElementById("patientsByDateSection").style.display = "block";
    } catch (e) {
        showError(trText("loadPatientsConnFailed"));
    }
}

function buildPatientRow(r) {
    const tr = document.createElement("tr");
    tr.dataset.id = r.id;

    PATIENT_ROW_FIELDS.forEach((key, idx) => {
        const td = document.createElement("td");
        td.className = "cell-p-" + idx;
        const val = r[key] ?? "";
        const display = (key === "gender" || key === "condition") ? valueLabel(val) : val;
        td.textContent = display === "" ? "-" : display;
        td.dataset.value = val;
        tr.appendChild(td);
    });

    // حقول للعرض فقط (غير قابلة للتعديل): العيادة، الشفت، الرقم الوظيفي
    [valueLabel(r.clinic), valueLabel(r.shift), r.emp_id].forEach(val => {
        const td = document.createElement("td");
        td.textContent = val ?? "";
        tr.appendChild(td);
    });

    const actionsTd = document.createElement("td");
    actionsTd.className = "cell-actions";
    actionsTd.innerHTML = `
        <button class="row-btn row-edit" data-action="edit-patient">${t('edit')}</button>
        <button class="row-btn row-delete" data-action="delete-patient">${t('delete')}</button>
    `;
    tr.appendChild(actionsTd);
    return tr;
}

// كل شفت يطلع بجدوله الخاص وحصري — بلا اختلاط بين الصباحي والمسائي
function renderPatientsByDateTable(rows) {
    const morningBody = document.getElementById("patientsByDateMorningBody");
    const eveningBody = document.getElementById("patientsByDateEveningBody");
    morningBody.innerHTML = "";
    eveningBody.innerHTML = "";

    const morningRows = rows.filter(r => (r.shift || "").includes("صباحي"));
    const eveningRows = rows.filter(r => (r.shift || "").includes("مسائي"));

    document.getElementById("morningPatientCount").textContent = morningRows.length;
    document.getElementById("eveningPatientCount").textContent = eveningRows.length;

    if (!morningRows.length) {
        morningBody.innerHTML = `<tr class="empty-row"><td colspan="13">${trText("noPatientsMorningDate")}</td></tr>`;
    } else {
        morningRows.forEach(r => morningBody.appendChild(buildPatientRow(r)));
    }

    if (!eveningRows.length) {
        eveningBody.innerHTML = `<tr class="empty-row"><td colspan="13">${trText("noPatientsEveningDate")}</td></tr>`;
    } else {
        eveningRows.forEach(r => eveningBody.appendChild(buildPatientRow(r)));
    }
}

function startEditPatientRow(btn) {
    const tr = btn.closest("tr");
    if (tr.classList.contains("editing")) return;
    tr.classList.add("editing");

    PATIENT_ROW_FIELDS.forEach((key, idx) => {
        const td = tr.querySelector(".cell-p-" + idx);
        const val = td.dataset.value;
        if (key === "condition") {
            const isKnown = PATIENT_CONDITION_OPTIONS.includes(val);
            const selectVal = isKnown ? val : "__other__";
            const optionsHTML = PATIENT_CONDITION_OPTIONS.map(o =>
                `<option value="${o}" ${o === selectVal ? "selected" : ""}>${escapeHtml(valueLabel(o))}</option>`).join("")
                + `<option value="__other__" ${selectVal === "__other__" ? "selected" : ""}>${trText("otherOption")}</option>`;
            td.innerHTML = `
                <select class="row-input cond-select">${optionsHTML}</select>
                <input type="text" class="row-input cond-other" placeholder="${trText("otherPlaceholder")}" value="${isKnown ? "" : escapeHtml(val)}" style="display:${isKnown ? "none" : "block"}; margin-top:4px;">
            `;
        } else if (key === "gender") {
            const optionsHTML = PATIENT_GENDER_OPTIONS.map(o =>
                `<option value="${o}" ${o === val ? "selected" : ""}>${escapeHtml(valueLabel(o))}</option>`).join("");
            td.innerHTML = `<select class="row-input gender-select">${optionsHTML}</select>`;
        } else if (key === "time") {
            const [h, m] = (val || "00:00").split(":");
            const hourOpts = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
                .map(v => `<option value="${v}" ${v === h ? "selected" : ""}>${v}</option>`).join("");
            const minOpts = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))
                .map(v => `<option value="${v}" ${v === m ? "selected" : ""}>${v}</option>`).join("");
            td.innerHTML = `<div style="display:flex; gap:4px;">
                <select class="row-input time-hour-select">${hourOpts}</select>
                <select class="row-input time-minute-select">${minOpts}</select>
            </div>`;
        } else {
            td.innerHTML = `<input type="text" class="row-input" value="${escapeHtml(val)}">`;
        }
    });

    const actionsTd = tr.querySelector(".cell-actions");
    actionsTd.innerHTML = `
        <button class="row-btn row-save" data-action="save-patient">${t('save')}</button>
        <button class="row-btn row-cancel" data-action="cancel-patient">${t('cancel')}</button>
    `;
}

function cancelPatientEditRow(btn) {
    const tr = btn.closest("tr");
    tr.classList.remove("editing");
    PATIENT_ROW_FIELDS.forEach((key, idx) => {
        const td = tr.querySelector(".cell-p-" + idx);
        td.textContent = td.dataset.value === "" ? "-" : td.dataset.value;
    });
    const actionsTd = tr.querySelector(".cell-actions");
    actionsTd.innerHTML = `
        <button class="row-btn row-edit" data-action="edit-patient">${t('edit')}</button>
        <button class="row-btn row-delete" data-action="delete-patient">${t('delete')}</button>
    `;
}

async function savePatientEditRow(btn) {
    const tr = btn.closest("tr");
    const id = tr.dataset.id;

    const updated = {};
    PATIENT_ROW_FIELDS.forEach((key, idx) => {
        const cell = tr.querySelector(".cell-p-" + idx);
        if (key === "time") {
            const h = cell.querySelector(".time-hour-select").value;
            const m = cell.querySelector(".time-minute-select").value;
            updated[key] = `${h}:${m}`;
        } else if (key === "condition") {
            const selectVal = cell.querySelector(".cond-select").value;
            updated[key] = selectVal === "__other__"
                ? cell.querySelector(".cond-other").value.trim()
                : selectVal;
        } else if (key === "gender") {
            updated[key] = cell.querySelector(".gender-select").value;
        } else {
            const field = cell.querySelector("input, select");
            updated[key] = field.value.trim();
        }
    });

    setBusy(btn, true, t('save'));
    try {
        const result = await apiPost("UPDATE_PATIENT", { token: session.token, id, ...updated });
        if (result.status === "SUCCESS") {
            PATIENT_ROW_FIELDS.forEach((key, idx) => {
                const td = tr.querySelector(".cell-p-" + idx);
                td.dataset.value = updated[key];
                td.textContent = updated[key] === "" ? "-" : updated[key];
            });
            tr.classList.remove("editing");
            const actionsTd = tr.querySelector(".cell-actions");
            actionsTd.innerHTML = `
                <button class="row-btn row-edit" data-action="edit-patient">${t('edit')}</button>
                <button class="row-btn row-delete" data-action="delete-patient">${t('delete')}</button>
            `;
            showSuccess(trText("updatePatientSuccess"));
        } else {
            showError(trText("updatePatientFailed"));
            setBusy(btn, false, t('save'));
        }
    } catch (e) {
        showError(trText("savePatientConnFailed"));
        setBusy(btn, false, t('save'));
    }
}

async function deletePatientRow(btn) {
    const tr = btn.closest("tr");
    const id = tr.dataset.id;
    const body = tr.parentElement; // نحفظ مرجع الجدول (صباحي أو مسائي) قبل ما نحذف الصف

    if (!confirm(trText("deleteConfirmPatient"))) return;

    setBusy(btn, true, t('delete'));
    try {
        const result = await apiPost("DELETE_PATIENT", { token: session.token, id });
        if (result.status === "SUCCESS") {
            tr.remove();
            showSuccess(trText("deletePatientSuccess"));
            if (!body.children.length) {
                body.innerHTML = `<tr class="empty-row"><td colspan="13">${trText("noPatientsShiftDate")}</td></tr>`;
            }
        } else {
            showError(trText("deletePatientFailed"));
            setBusy(btn, false, t('delete'));
        }
    } catch (e) {
        showError(trText("deleteConnFailed"));
        setBusy(btn, false, t('delete'));
    }
}
