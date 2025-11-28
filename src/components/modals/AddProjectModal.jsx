import React, { useState } from 'react';
import Modal from '../common/Modal';
import { PROJECT_STATUSES } from '../../utils/constants';
import { todayKey } from '../../utils/helpers';

const AddProjectModal = ({ onClose, onSubmit }) => {
  const [f, setF] = useState({
    name: "",
    quantity: "",
    deadline: todayKey(),
    status: "not_started",
    link: "",
    file: null
  });

  const save = () => {
    if (!f.name || !f.deadline) {
      alert('Fill Project Name and Deadline');
      return;
    }
    const payload = {
      name: f.name,
      quantity: f.quantity,
      deadline: f.deadline,
      status: f.status,
      link: f.link,
    };
    if (f.file) {
      payload.attachmentUrl = URL.createObjectURL(f.file);
      payload.attachmentName = f.file.name;
    }
    onSubmit(payload);
  };

  return (
    <Modal title="Add Project" onClose={onClose} maxWidth="max-w-lg">
      <div className="grid gap-4">
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Project Name</label>
          <input
            className="input mt-1"
            value={f.name}
            onChange={e => setF({ ...f, name: e.target.value })}
            placeholder="e.g., CEO's Wife Series"
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Total Episodes / Quantity</label>
          <input
            className="input mt-1"
            value={f.quantity}
            onChange={e => setF({ ...f, quantity: e.target.value })}
            placeholder="e.g., 60 Episodes"
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Project Deadline</label>
          <input
            type="date"
            className="input mt-1"
            value={f.deadline}
            onChange={e => setF({ ...f, deadline: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Current Status</label>
          <select
            className="select mt-1"
            value={f.status}
            onChange={e => setF({ ...f, status: e.target.value })}
          >
            {PROJECT_STATUSES.map(s => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Project Link (optional)</label>
          <input
            className="input mt-1"
            value={f.link}
            onChange={e => setF({ ...f, link: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Attachment (optional)</label>
          <input
            type="file"
            className="input mt-1"
            onChange={e => setF({ ...f, file: e.target.files?.[0] || null })}
          />
        </div>
        <div className="flex gap-3 mt-2">
          <button className="btn btn-primary px-4 py-2 flex-1" onClick={save}>
            Save Project
          </button>
          <button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

AddProjectModal.displayName = 'AddProjectModal';

export default AddProjectModal;

