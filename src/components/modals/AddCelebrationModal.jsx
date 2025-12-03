import React, { useState, memo } from 'react';
import Modal from '../common/Modal';
import { todayKey } from '../../utils/helpers';

const AddCelebrationModal = memo(({ onClose, onSubmit }) => {
  const [f, setF] = useState({ date: todayKey(), title: "", description: "" });

  return (
    <Modal title="Add Celebration" onClose={onClose}>
      <div className="grid gap-4">
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
          <label className="text-sm text-[var(--clr-muted)]">Title</label>
          <input
            className="input mt-1"
            value={f.title}
            onChange={e => setF({ ...f, title: e.target.value })}
            placeholder="e.g., Team Lunch"
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Description</label>
          <textarea
            rows="4"
            className="w-full mt-1"
            value={f.description}
            onChange={e => setF({ ...f, description: e.target.value })}
            placeholder="Optional notes..."
          />
        </div>
        <div className="flex gap-3">
          <button
            className="btn btn-primary px-4 py-2 flex-1"
            onClick={() => {
              if (!f.date || !f.title) return alert('Add Date and Title');
              onSubmit(f);
            }}
          >
            Save
          </button>
          <button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
});

AddCelebrationModal.displayName = 'AddCelebrationModal';

export default AddCelebrationModal;



