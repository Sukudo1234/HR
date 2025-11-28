import React, { useState } from 'react';
import { todayKey } from '../../utils/helpers';

const SetEmpDateForm = ({ employees, onSave }) => {
  const [empId, setEmpId] = useState(employees[0]?.id || "");
  const [type, setType] = useState("dob");
  const [date, setDate] = useState(todayKey());

  return (
    <div className="grid gap-3">
      <div>
        <label className="text-sm text-[var(--clr-muted)]">Employee</label>
        <select
          className="select mt-1"
          value={empId}
          onChange={e => setEmpId(Number(e.target.value))}
        >
          {employees.map(e => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.department})
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Type</label>
          <select
            className="select mt-1"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="dob">Birthday</option>
            <option value="doj">Work Anniversary</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Date</label>
          <input
            type="date"
            className="input mt-1"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
      </div>
      <button
        className="btn btn-primary px-4 py-2"
        onClick={() => {
          if (!empId || !date) return;
          onSave({ employeeId: Number(empId), type, date });
        }}
      >
        Save
      </button>
    </div>
  );
};

SetEmpDateForm.displayName = 'SetEmpDateForm';

export default SetEmpDateForm;

