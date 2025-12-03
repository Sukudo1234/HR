import React, { useState, memo } from 'react';
import Modal from '../common/Modal';

const AddAnnouncementModal = memo(({ onClose, onSubmit }) => {
  const [f, setF] = useState({ title: "", message: "" });

  return (
    <Modal title="New Announcement" onClose={onClose}>
      <div className="grid gap-4">
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Title</label>
          <input
            className="input mt-1"
            value={f.title}
            onChange={e => setF({ ...f, title: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Message</label>
          <textarea
            rows="5"
            className="w-full mt-1"
            value={f.message}
            onChange={e => setF({ ...f, message: e.target.value })}
          />
        </div>
        <div className="flex gap-3">
          <button
            className="btn btn-primary px-4 py-2 flex-1"
            onClick={() => {
              if (!f.title || !f.message) return alert('Fill both');
              onSubmit(f);
            }}
          >
            Publish
          </button>
          <button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
});

AddAnnouncementModal.displayName = 'AddAnnouncementModal';

export default AddAnnouncementModal;



