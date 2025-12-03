import React, { useState, memo } from 'react';
import Modal from '../common/Modal';
import { todayKey } from '../../utils/helpers';

const AddGoalModal = memo(({ onClose, onSubmit }) => {
  const [text, setText] = useState("");
  const [date, setDate] = useState(todayKey());

  return (
    <Modal title="Add Goal" onClose={onClose}>
      <div className="grid gap-4">
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Date</label>
          <input
            type="date"
            className="input mt-1"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Goal</label>
          <textarea
            rows="4"
            className="w-full mt-1"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Today's goal..."
          />
        </div>
        <div className="flex gap-3">
          <button
            className="btn btn-primary px-4 py-2 flex-1"
            onClick={() => {
              if (!text.trim()) return;
              onSubmit({ date, text: text.trim() });
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

AddGoalModal.displayName = 'AddGoalModal';

export default AddGoalModal;



