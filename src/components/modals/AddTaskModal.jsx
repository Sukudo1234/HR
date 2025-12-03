import React, { useState, memo } from 'react';
import Modal from '../common/Modal';
import { PRIORITIES } from '../../utils/constants';

const AddTaskModal = memo(({ onClose, onSubmit, employees }) => {
  const [f, setF] = useState({
    title: "",
    description: "",
    assignedTo: employees[0]?.id || "",
    deadline: "",
    priority: "general",
    link: "",
    file: null
  });

  const save = () => {
    if (!f.title || !f.assignedTo || !f.deadline) {
      alert('Fill Title, Assignee, Deadline');
      return;
    }
    const payload = { ...f };
    if (f.file) {
      payload.attachmentUrl = URL.createObjectURL(f.file);
      payload.attachmentName = f.file.name;
    }
    onSubmit(payload);
  };

  return (
    <Modal title="Add Task" onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm text-[var(--clr-muted)]">Title</label>
          <input
            className="input mt-1"
            value={f.title}
            onChange={e => setF({ ...f, title: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-[var(--clr-muted)]">Description</label>
          <textarea
            className="w-full mt-1"
            rows="4"
            value={f.description}
            onChange={e => setF({ ...f, description: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Assign to</label>
          <select
            className="select mt-1"
            value={f.assignedTo}
            onChange={e => setF({ ...f, assignedTo: Number(e.target.value) })}
          >
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Deadline</label>
          <input
            type="date"
            className="input mt-1"
            value={f.deadline}
            onChange={e => setF({ ...f, deadline: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Priority</label>
          <select
            className="select mt-1"
            value={f.priority}
            onChange={e => setF({ ...f, priority: e.target.value })}
          >
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-[var(--clr-muted)]">Task Link (optional)</label>
          <input
            className="input mt-1"
            value={f.link}
            onChange={e => setF({ ...f, link: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-[var(--clr-muted)]">Attachment (optional)</label>
          <input
            type="file"
            className="input mt-1"
            onChange={e => setF({ ...f, file: e.target.files?.[0] || null })}
          />
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button className="btn btn-primary px-4 py-2 flex-1" onClick={save}>
          Create Task
        </button>
        <button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
});

AddTaskModal.displayName = 'AddTaskModal';

export default AddTaskModal;

