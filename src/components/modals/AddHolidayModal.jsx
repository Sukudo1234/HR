import React, { useState, memo } from 'react';
import Modal from '../common/Modal';

const AddHolidayModal = memo(({ onClose, onSubmit }) => {
  const [f, setF] = useState({ date: "", name: "" });

  return (
    <Modal title="Add Holiday" onClose={onClose} maxWidth="max-w-md">
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
          <label className="text-sm text-[var(--clr-muted)]">Holiday Name</label>
          <input
            className="input mt-1"
            value={f.name}
            onChange={e => setF({ ...f, name: e.target.value })}
          />
        </div>
        <div className="flex gap-3">
          <button
            className="btn btn-primary px-4 py-2 flex-1"
            onClick={() => {
              if (!f.date || !f.name) return alert('Fill both');
              onSubmit(f);
            }}
          >
            Add
          </button>
          <button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
});

AddHolidayModal.displayName = 'AddHolidayModal';

export default AddHolidayModal;

