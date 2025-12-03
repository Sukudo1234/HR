import React, { useState, memo } from 'react';
import Modal from '../common/Modal';

const DOC_TYPES = ["Offer", "Appointment", "Intent", "Other"];

const AddDocumentModal = memo(({ onClose, onSubmit, employees }) => {
  const [f, setF] = useState({
    employeeId: employees[0]?.id || "",
    title: "",
    docType: "Offer",
    file: null
  });

  const changeFile = (e) => setF({ ...f, file: e.target.files?.[0] || null });

  const save = () => {
    if (!f.employeeId || !f.title || !f.docType || !f.file) {
      alert("Fill all and attach a file");
      return;
    }
    const url = URL.createObjectURL(f.file);
    onSubmit({
      employeeId: Number(f.employeeId),
      title: f.title,
      docType: f.docType,
      fileName: f.file.name,
      url
    });
  };

  return (
    <Modal title="Upload Document" onClose={onClose}>
      <div className="grid gap-4">
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Employee</label>
          <select
            className="select mt-1"
            value={f.employeeId}
            onChange={e => setF({ ...f, employeeId: e.target.value })}
          >
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Title</label>
          <input
            className="input mt-1"
            value={f.title}
            onChange={e => setF({ ...f, title: e.target.value })}
            placeholder="Offer / Appointment / Intent..."
          />
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">Type</label>
          <select
            className="select mt-1"
            value={f.docType}
            onChange={e => setF({ ...f, docType: e.target.value })}
          >
            {DOC_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-[var(--clr-muted)]">File</label>
          <input type="file" className="input mt-1" onChange={changeFile} />
        </div>
        <div className="flex gap-3">
          <button className="btn btn-primary px-4 py-2 flex-1" onClick={save}>
            Upload
          </button>
          <button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
});

AddDocumentModal.displayName = 'AddDocumentModal';

export default AddDocumentModal;



