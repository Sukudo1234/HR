import React, { memo } from 'react';
import { fmtDate, fmtTime } from '../../utils/helpers';

/**
 * AttendanceCard Component - Displays attendance check-in/check-out interface
 * Used in both EmployeeView and AdminView
 */
const AttendanceCard = memo(({ currentTime, todayStatus, onCheckIn, onCheckOut }) => (
  <div className="card p-6 md:col-span-2">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="text-3xl font-bold text-[var(--clr-navy)]">
          {currentTime.toLocaleTimeString()}
        </div>
        <p className="text-[var(--clr-muted)]">{fmtDate(currentTime)}</p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button
          className="btn btn-primary px-4 py-2"
          onClick={onCheckIn}
          disabled={!!(todayStatus && !todayStatus.checkOut)}
        >
          Check In
        </button>
        <button
          className="btn btn-danger px-4 py-2"
          onClick={onCheckOut}
          disabled={!todayStatus || !!todayStatus.checkOut}
        >
          Check Out
        </button>
      </div>
    </div>
    <div className="mt-6 grid md:grid-cols-3 gap-4">
      <div className="p-4 rounded-lg border border-[var(--clr-border)]">
        <p className="text-[var(--clr-muted)] text-sm">Check In</p>
        <p className="font-semibold">
          {todayStatus ? fmtTime(todayStatus.checkIn) : "-"}
        </p>
      </div>
      <div className="p-4 rounded-lg border border-[var(--clr-border)]">
        <p className="text-[var(--clr-muted)] text-sm">Check Out</p>
        <p className="font-semibold">
          {todayStatus && todayStatus.checkOut
            ? fmtTime(todayStatus.checkOut)
            : todayStatus
            ? "Active"
            : "-"}
        </p>
      </div>
      <div className="p-4 rounded-lg border border-[var(--clr-border)]">
        <p className="text-[var(--clr-muted)] text-sm">Hours</p>
        <p className="font-semibold">
          {todayStatus ? Number(todayStatus.hours || 0).toFixed(2) : "0.00"} hrs
        </p>
      </div>
    </div>
  </div>
));

AttendanceCard.displayName = 'AttendanceCard';

export default AttendanceCard;

