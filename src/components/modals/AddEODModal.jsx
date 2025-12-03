import React, { useState, memo } from 'react';
import Modal from '../common/Modal';
import { todayKey } from '../../utils/helpers';

const AddEODModal = memo(({ onClose, onSubmit }) => {
  const [f, setF] = useState({
    date: todayKey(),
    project: "",
    task: "",
    hours: "",
    notes: ""
  });

  return (
    <Modal title="Add EOD Entry" onClose={onClose}>
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[var(--clr-muted)]">Date</label>
            <input
              type="date"
              className="input mt-1"
              value={f.date}
              onChange={e => setF({ ...f, date: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-[var(--clr-muted)]">Hours</label>
            <input
              className="input mt-1"
              placeholder="e.g., 3.5"
              value={f.hours}
              onChange={e => setF({ ...f, hours: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Project</label>
          <input
            className="input mt-1"
            value={f.project}
            onChange={e => setF({ ...f, project: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Task / Work Done</label>
          <input
            className="input mt-1"
            value={f.task}
            onChange={e => setF({ ...f, task: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Notes</label>
          <textarea
            rows="4"
            className="w-full mt-1"
            value={f.notes}
            onChange={e => setF({ ...f, notes: e.target.value })}
          />
        </div>
        <button
          className="btn btn-primary px-4 py-2"
          onClick={() => {
            if (!f.date || !f.project || !f.hours) return alert('Add Date, Project, Hours');
            const h = parseFloat(f.hours);
            if (isNaN(h) || h < 0) return alert('Hours invalid');
            onSubmit({ ...f, hours: h });
          }}
        >
          Save EOD
        </button>
      </div>
    </Modal>
  );
});

AddEODModal.displayName = 'AddEODModal';

export default AddEODModal;



