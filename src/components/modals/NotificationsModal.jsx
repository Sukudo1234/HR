import React, { memo } from 'react';
import Modal from '../common/Modal';
import { fmtShort } from '../../utils/helpers';

const NotificationsModal = memo(({ list, onClose, markAll, clearAll }) => (
  <Modal title="Notifications" onClose={onClose}>
    <div className="space-y-3">
      {list.length === 0 && (
        <div className="text-[var(--clr-muted)]">No notifications.</div>
      )}
      {list.map(n => (
        <div key={n.id} className="rounded-lg border border-[var(--clr-border)] p-3">
          <div className="text-sm">{n.message}</div>
          <div className="text-xs text-[var(--clr-muted)] mt-1">{fmtShort(n.date)}</div>
        </div>
      ))}
    </div>
    <div className="mt-4 flex gap-2">
      <button className="btn btn-ghost px-3 py-1.5" onClick={markAll}>
        Mark all read
      </button>
      <button className="btn btn-ghost px-3 py-1.5" onClick={clearAll}>
        Clear all
      </button>
    </div>
  </Modal>
));

NotificationsModal.displayName = 'NotificationsModal';

export default NotificationsModal;



