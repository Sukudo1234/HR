import React, { useState, memo } from 'react';
import Modal from '../common/Modal';

const AddOfficeModal = memo(({ onClose, onSubmit }) => {
  const [name, setName] = useState("");

  return (
    <Modal title="Add Office Location" onClose={onClose} maxWidth="max-w-md">
      <div className="grid gap-4">
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Office Name</label>
          <input
            className="input mt-1"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Noida HQ"
          />
        </div>
        <div className="flex gap-3">
          <button
            className="btn btn-primary px-4 py-2 flex-1"
            onClick={() => {
              const s = name.trim();
              if (!s) return;
              onSubmit(s);
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

AddOfficeModal.displayName = 'AddOfficeModal';

export default AddOfficeModal;

