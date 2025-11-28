import React, { useState } from 'react';
import Modal from '../common/Modal';
import { DEPARTMENTS, ROLES } from '../../utils/constants';

const AddEmployeeModal = ({ onClose, onSubmit, offices }) => {
  const [f, setF] = useState({
    name: "",
    email: "",
    role: "employee",
    office: offices[0] || "Headquarters",
    department: DEPARTMENTS[0],
    password: "emp123"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!f.name || !f.email) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(f);
  };

  return (
    <Modal title="Add Employee" onClose={onClose} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Full Name *</label>
          <input
            className="input mt-1 w-full"
            value={f.name}
            onChange={e => setF({ ...f, name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Email *</label>
          <input
            type="email"
            className="input mt-1 w-full"
            value={f.email}
            onChange={e => setF({ ...f, email: e.target.value })}
            placeholder="john@example.com"
            required
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Role</label>
          <select
            className="select mt-1 w-full"
            value={f.role}
            onChange={e => setF({ ...f, role: e.target.value })}
          >
            {ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Department</label>
          <select
            className="select mt-1 w-full"
            value={f.department}
            onChange={e => setF({ ...f, department: e.target.value })}
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Office</label>
          <select
            className="select mt-1 w-full"
            value={f.office}
            onChange={e => setF({ ...f, office: e.target.value })}
          >
            {offices.map(office => (
              <option key={office} value={office}>{office}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Temporary Password</label>
          <input
            type="password"
            className="input mt-1 w-full"
            value={f.password}
            onChange={e => setF({ ...f, password: e.target.value })}
            placeholder="Enter password"
          />
        </div>
        <div className="flex gap-3 mt-4">
          <button type="submit" className="btn btn-primary px-4 py-2 flex-1">
            Add Employee
          </button>
          <button type="button" className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

AddEmployeeModal.displayName = 'AddEmployeeModal';

export default AddEmployeeModal;

