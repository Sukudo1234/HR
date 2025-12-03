import React, { useState, useEffect, memo } from 'react';
import Modal from '../common/Modal';
import { PRIORITIES } from '../../utils/constants';
import { todayKey } from '../../utils/helpers';

const EditTaskModal = memo(({ onClose, onSubmit, task, employees }) => {
  const [f, setF] = useState(
    task
      ? {
          title: task.title,
          description: task.description || "",
          assignedTo: task.assignedTo,
          deadline: task.deadline.slice(0, 10),
          priority: task.priority || "general",
          link: task.link || ""
        }
      : {
          title: "",
          description: "",
          assignedTo: employees[0]?.id || "",
          deadline: todayKey(),
          priority: "general",
          link: ""
        }
  );

  useEffect(() => {
    if (task) {
      setF({
        title: task.title,
        description: task.description || "",
        assignedTo: task.assignedTo,
        deadline: task.deadline.slice(0, 10),
        priority: task.priority || "general",
        link: task.link || ""
      });
    }
  }, [task]);

  const save = () => {
    if (!f.title || !f.assignedTo || !f.deadline) {
      alert('Fill Title, Assignee, Deadline');
      return;
    }
    onSubmit({ ...f });
  };

  return (
    <Modal title="Edit Task" onClose={onClose}>
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
      </div>
      <div className="flex gap-3 mt-5">
        <button className="btn btn-primary px-4 py-2 flex-1" onClick={save}>
          Save Changes
        </button>
        <button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
});

EditTaskModal.displayName = 'EditTaskModal';

export default EditTaskModal;



