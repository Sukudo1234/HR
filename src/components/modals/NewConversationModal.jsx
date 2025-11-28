import React, { useState } from 'react';
import Modal from '../common/Modal';

const NewConversationModal = ({ onClose, onCreate, employees, currentUser }) => {
  const [selected, setSelected] = useState([currentUser.id]);
  const [name, setName] = useState("");

  const toggle = (id) =>
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const others = employees.filter(e => e.id !== currentUser.id && e.active !== false);

  const create = () => {
    const members = selected.slice().sort((a, b) => a - b);
    if (members.length < 2) {
      alert("Select at least one other participant");
      return;
    }
    const isGroup = members.length > 2;
    onCreate({
      memberIds: members,
      name: isGroup ? (name.trim() || "New Group") : undefined
    });
  };

  return (
    <Modal title="Start a Chat" onClose={onClose} maxWidth="max-w-xl">
      <div className="grid gap-3">
        <div className="text-sm text-[var(--clr-muted)]">Pick participants</div>
        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
          {others.map(u => (
            <label
              key={u.id}
              className="border border-[var(--clr-border)] rounded-lg p-2 flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={selected.includes(u.id)}
                onChange={() => toggle(u.id)}
              />
              <span className="text-sm">
                {u.name} <span className="text-[var(--clr-muted)]">({u.department})</span>
              </span>
            </label>
          ))}
        </div>
        {selected.length > 2 && (
          <div>
            <label className="text-sm text-[var(--clr-muted)]">Group Name</label>
            <input
              className="input mt-1"
              placeholder="e.g., QA Squad"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        )}
        <div className="flex gap-3">
          <button className="btn btn-primary px-4 py-2" onClick={create}>
            Create
          </button>
          <button className="btn btn-ghost px-4 py-2" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

NewConversationModal.displayName = 'NewConversationModal';

export default NewConversationModal;

