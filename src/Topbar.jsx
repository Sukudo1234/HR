import React, { memo, useMemo } from "react";

// Constants
const BRAND_NAME = "AttendX";
const NAVIGATION_ITEMS = ["HR", "Attendance", "Tasks", "EOD", "Docs", "Chat"];

/**
 * Topbar Component
 * 
 * A reusable top navigation bar component with conditional rendering
 * for login and authenticated pages.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.right] - Content to display on the right side (buttons, actions, etc.)
 * @param {boolean} [props.isLogin=false] - Whether this is the login page (simplified view)
 * @returns {React.ReactElement} Topbar component
 */
const Topbar = memo(({ right = null, isLogin = false }) => {
  const navigationText = useMemo(() => {
    return NAVIGATION_ITEMS.join(" ");
  }, []);

  return (
    <header 
      className="topbar bg-[#0f1a3a] text-white"
      role="banner"
      aria-label="Main navigation"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Brand Section */}
          <div className="flex items-center gap-3 min-w-0">
            <span 
              className="brand-dot flex-shrink-0" 
              aria-hidden="true"
              role="presentation"
            />
            <h1 className="font-bold tracking-wide text-lg sm:text-xl truncate">
              {BRAND_NAME}
            </h1>
            {!isLogin && (
              <span 
                className="text-white/60 hidden sm:inline text-sm ml-2"
                aria-label="Navigation sections"
              >
                {navigationText}
              </span>
            )}
          </div>

          {/* Right Actions Section */}
          {!isLogin && right && (
            <div 
              className="flex items-center gap-2 flex-shrink-0"
              role="toolbar"
              aria-label="User actions"
            >
              {right}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
});

Topbar.displayName = "Topbar";

export default Topbar;

