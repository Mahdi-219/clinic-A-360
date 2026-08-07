/* ---------- إدارة الموظفين (للمسؤول فقط) ---------- */

async function loadAllEmployees() {
    const body = document.getElementById("employeesTableBody");
    try {
        const result = await apiGet({ action: "GET_ALL_EMPLOYEES", token: session.token });
        if (!Array.isArray(result)) {
            body.innerHTML = `<tr class="empty-row"><td colspan="5">${trText("employeesLoadFailed")}</td></tr>`;
            return;
        }
        if (!result.length) {
            body.innerHTML = `<tr class="empty-row"><td colspan="5">${trText("employeesEmpty")}</td></tr>`;
            return;
        }
        body.innerHTML = "";
        result.forEach(emp => {
            const tr = document.createElement("tr");
            tr.dataset.empId = emp.emp_id;
            tr.innerHTML = `
                <td>${escapeHtml(emp.emp_id)}</td>
                <td>${escapeHtml(emp.phone) || "-"}</td>
                <td class="cell-emp-clinic" data-value="${escapeHtml(emp.clinic)}">${escapeHtml(valueLabel(emp.clinic)) || "-"}</td>
                <td class="cell-emp-shift" data-value="${escapeHtml(emp.shift)}">${escapeHtml(valueLabel(emp.shift)) || "-"}</td>
                <td class="cell-actions">
                    <button class="row-btn row-edit" data-action="edit-employee">${t('edit')}</button>
                    <button class="row-btn row-delete" data-action="delete-employee">${t('deleteAccount')}</button>
                </td>
            `;
            body.appendChild(tr);
        });
    } catch (e) {
        body.innerHTML = `<tr class="empty-row"><td colspan="5">${trText("employeesConnFailed")}</td></tr>`;
    }
}

function startEditEmployeeRow(btn) {
    const tr = btn.closest("tr");
    if (tr.classList.contains("editing")) return;
    tr.classList.add("editing");

    const clinicTd = tr.querySelector(".cell-emp-clinic");
    const shiftTd = tr.querySelector(".cell-emp-shift");
    const currentClinic = clinicTd.dataset.value;
    const currentShift = shiftTd.dataset.value;

    clinicTd.innerHTML = `<select class="row-input">${CLINIC_OPTIONS.map(c =>
        `<option value="${c}" ${c === currentClinic ? "selected" : ""}>${escapeHtml(valueLabel(c))}</option>`).join("")}</select>`;
    shiftTd.innerHTML = `<select class="row-input">${SHIFT_OPTIONS.map(s =>
        `<option value="${s}" ${s === currentShift ? "selected" : ""}>${escapeHtml(valueLabel(s))}</option>`).join("")}</select>`;

    const actionsTd = tr.querySelector(".cell-actions");
    actionsTd.innerHTML = `
        <button class="row-btn row-save" data-action="save-employee">${t('save')}</button>
        <button class="row-btn row-cancel" data-action="cancel-employee">${t('cancel')}</button>
    `;
}

function cancelEmployeeEditRow(btn) {
    const tr = btn.closest("tr");
    tr.classList.remove("editing");
    const clinicTd = tr.querySelector(".cell-emp-clinic");
    const shiftTd = tr.querySelector(".cell-emp-shift");
    clinicTd.textContent = valueLabel(clinicTd.dataset.value) || "-";
    shiftTd.textContent = valueLabel(shiftTd.dataset.value) || "-";
    const actionsTd = tr.querySelector(".cell-actions");
    actionsTd.innerHTML = `<button class="row-btn row-edit" data-action="edit-employee">${t('edit')}</button><button class="row-btn row-delete" data-action="delete-employee">${t('deleteAccount')}</button>`;
}

async function saveEmployeeEditRow(btn) {
    const tr = btn.closest("tr");
    const empId = tr.dataset.empId;
    const clinic = tr.querySelector(".cell-emp-clinic select").value;
    const shift = tr.querySelector(".cell-emp-shift select").value;

    setBusy(btn, true, t('save'));
    try {
        const result = await apiPost("UPDATE_EMPLOYEE_SHIFT", { token: session.token, emp_id: empId, clinic, shift });
        if (result.status === "SUCCESS") {
            const clinicTd = tr.querySelector(".cell-emp-clinic");
            const shiftTd = tr.querySelector(".cell-emp-shift");
            clinicTd.dataset.value = clinic;
            shiftTd.dataset.value = shift;
            clinicTd.textContent = valueLabel(clinic);
            shiftTd.textContent = valueLabel(shift);
            tr.classList.remove("editing");
            const actionsTd = tr.querySelector(".cell-actions");
            actionsTd.innerHTML = `<button class="row-btn row-edit" data-action="edit-employee">${t('edit')}</button><button class="row-btn row-delete" data-action="delete-employee">${t('deleteAccount')}</button>`;
            showSuccess(trText("updateEmployeeSuccess"));
        } else {
            showError(trText("updateEmployeeFailed"));
            setBusy(btn, false, t('save'));
        }
    } catch (e) {
        showError(trText("updateEmployeeConnFailed"));
        setBusy(btn, false, t('save'));
    }
}

async function deleteEmployeeRow(btn) {
    const tr = btn.closest("tr");
    const empId = tr.dataset.empId;

    if (!confirm(trText("deleteConfirmEmployee", { empId }))) return;

    setBusy(btn, true, t('deleteAccount'));
    try {
        const result = await apiPost("DELETE_EMPLOYEE", { token: session.token, emp_id: empId });
        if (result.status === "SUCCESS") {
            tr.remove();
            showSuccess(trText("deleteEmployeeSuccess"));
            const body = document.getElementById("employeesTableBody");
            if (!body.children.length) {
                body.innerHTML = `<tr class="empty-row"><td colspan="5">${trText("employeesEmpty")}</td></tr>`;
            }
        } else {
            showError(trText("deleteEmployeeFailed"));
            setBusy(btn, false, t('deleteAccount'));
        }
    } catch (e) {
        showError(trText("deleteConnFailed"));
        setBusy(btn, false, t('deleteAccount'));
    }
}
