import React, { memo } from 'react';

/**
 * Modal Component - Reusable modal wrapper/dialog
 * Used by all modal components
 */
const Modal = memo(({ title, children, onClose, maxWidth = "max-w-lg" }) => (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
    <div className={`card w-full ${maxWidth} max-h-[90vh] overflow-hidden flex flex-col`}>
      <div className="px-6 py-4 border-b border-[var(--clr-border)] flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <button className="btn btn-ghost px-3 py-1.5" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="p-6 overflow-y-auto">{children}</div>
    </div>
  </div>
));

Modal.displayName = 'Modal';

export default Modal;

