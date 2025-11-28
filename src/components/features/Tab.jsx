import React, { memo } from 'react';

/**
 * TabButton Component - Navigation tab button used in AdminView
 */
const TabButton = memo(({ id, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-4 py-2 rounded-lg border ${
      active
        ? "bg-[var(--clr-hover)] border-[var(--ring)] text-[#0B4680]"
        : "bg-white hover:bg-[#F9FAFB]"
    }`}
  >
    {label}
  </button>
));

TabButton.displayName = 'TabButton';

export default TabButton;

