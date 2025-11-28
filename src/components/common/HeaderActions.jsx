import React, { memo } from 'react';

/**
 * HeaderActions Component - Combines Chat, Notifications, and Logout buttons
 * Used in both EmployeeView and AdminView header
 */
const HeaderActions = memo(({ unreadCount, onOpenChat, onOpenNotifications, onLogout }) => (
  <>
    <button
      className="btn btn-ghost px-3 py-1.5 border border-white/40 hover:bg-white/10"
      onClick={onOpenChat}
    >
      <span className="text-white">Chat</span>
    </button>
    <button
      className="btn btn-ghost px-3 py-1.5 text-white relative"
      onClick={onOpenNotifications}
      title="Notifications"
    >
      <span className="text-white">Bell</span>
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </button>
    <button
      onClick={onLogout}
      className="btn btn-ghost px-3 py-1.5 border border-white/40 hover:bg-white/10"
    >
      <span className="text-white">Logout</span>
    </button>
  </>
));

HeaderActions.displayName = 'HeaderActions';

export default HeaderActions;

