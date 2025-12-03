import React, { useState, memo } from 'react';
import Modal from '../common/Modal';
import { DEPARTMENTS } from '../../utils/constants';

const AddJobModal = memo(({ onClose, onSubmit, departments }) => {
  const [f, setF] = useState({
    title: "",
    department: departments[0],
    location: "Remote / Onsite",
    description: "",
    applyUrl: ""
  });

  return (
    <Modal title="Add Hiring Alert" onClose={onClose} maxWidth="max-w-2xl">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Title</label>
          <input
            className="input mt-1"
            value={f.title}
            onChange={e => setF({ ...f, title: e.target.value })}
            placeholder="e.g., Senior Video Editor"
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Department</label>
          <select
            className="select mt-1"
            value={f.department}
            onChange={e => setF({ ...f, department: e.target.value })}
          >
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Location</label>
          <input
            className="input mt-1"
            value={f.location}
            onChange={e => setF({ ...f, location: e.target.value })}
            placeholder="Noida / Remote"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-[var(--clr-muted)]">Description</label>
          <textarea
            rows="4"
            className="w-full mt-1"
            value={f.description}
            onChange={e => setF({ ...f, description: e.target.value })}
            placeholder="Short JD / expectations..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-[var(--clr-muted)]">Apply URL</label>
          <input
            className="input mt-1"
            value={f.applyUrl}
            onChange={e => setF({ ...f, applyUrl: e.target.value })}
            placeholder="https://forms.gle/..."
          />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          className="btn btn-primary px-4 py-2"
          onClick={() => {
            if (!f.title || !f.applyUrl) return alert("Add Title and Apply URL");
            onSubmit(f);
          }}
        >
          Publish
        </button>
        <button className="btn btn-ghost px-4 py-2" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
});

AddJobModal.displayName = 'AddJobModal';

export default AddJobModal;

