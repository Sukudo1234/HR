import React, { useState, memo } from 'react';
import Modal from '../common/Modal';

/**
 * LeaveRequestModal Component - Form for requesting leave
 */
const LeaveRequestModal = memo(({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    type: 'sick',
    reason: ''
  });

  const handleSubmit = () => {
    if (!formData.fromDate || !formData.toDate) {
      alert('Pick from date and to date');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal title="Request Leave" onClose={onClose}>
      <div className="grid gap-4">
        <div>
          <label className="text-[var(--clr-muted)] text-sm">From Date</label>
          <input
            type="date"
            className="input mt-1"
            value={formData.fromDate}
            onChange={e => setFormData({ ...formData, fromDate: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[var(--clr-muted)] text-sm">To Date</label>
          <input
            type="date"
            className="input mt-1"
            value={formData.toDate}
            onChange={e => setFormData({ ...formData, toDate: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[var(--clr-muted)] text-sm">Type</label>
          <select
            className="select mt-1"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="emergency">Emergency Leave</option>
          </select>
        </div>
        <div>
          <label className="text-[var(--clr-muted)] text-sm">Reason</label>
          <textarea
            className="mt-1 w-full"
            rows="4"
            placeholder="Explain your reason..."
            value={formData.reason}
            onChange={e => setFormData({ ...formData, reason: e.target.value })}
          />
        </div>
        <button className="btn btn-primary px-4 py-2" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </Modal>
  );
});

LeaveRequestModal.displayName = 'LeaveRequestModal';

export default LeaveRequestModal;



