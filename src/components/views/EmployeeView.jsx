import React, { useMemo } from 'react';
import Topbar from '../../Topbar';
import { HeaderActions, AttendanceCard } from '../common';
import { todayKey, fmtShort, fmtTime } from '../../utils/helpers';

const EmployeeView = ({
  currentUser,
  currentTime,
  attendanceRecords,
  leaveRequests,
  tasks,
  announcements,
  holidays,
  eods,
  documents,
  leaveBalance,
  onCheckIn,
  onCheckOut,
  onOpenLeaveModal,
  onUpdateTaskStatus,
  onAddEOD,
  onLogout,
  onCancelLeave,
  notifications,
  openNotifs,
  openChat,
  goals,
  achievements,
  onOpenGoal,
  onOpenAch,
  jobs
}) => {
  const todayStatus = useMemo(
    () =>
      attendanceRecords.find(
        r => r.employeeId === currentUser.id && r.dateKey === todayKey()
      ) || null,
    [attendanceRecords, currentUser]
  );

  const myAttendance = useMemo(
    () => attendanceRecords.filter(r => r.employeeId === currentUser.id),
    [attendanceRecords, currentUser]
  );

  const myTasks = useMemo(
    () => tasks.filter(t => t.assignedTo === currentUser.id),
    [tasks, currentUser]
  );

  const myLeaves = useMemo(
    () => leaveRequests.filter(l => l.employeeId === currentUser.id).slice().reverse(),
    [leaveRequests, currentUser]
  );

  const myEODToday = useMemo(
    () => eods.filter(e => e.employeeId === currentUser.id && e.dateKey === todayKey()),
    [eods, currentUser]
  );

  const myDocs = useMemo(
    () => documents.filter(d => d.employeeId === currentUser.id && d.shared),
    [documents, currentUser]
  );

  const unreadCount = notifications.filter(n => !n.read && n.userId === currentUser.id).length;
  const prioBadge = (p) =>
    p === "hot" ? "prio-hot" : p === "cold" ? "prio-cold" : "prio-general";
  const openJobs = useMemo(
    () => jobs.filter(j => j.active !== false).slice().reverse(),
    [jobs]
  );

  const myGoalsToday = useMemo(
    () => goals.filter(g => g.userId === currentUser.id && g.date === todayKey()),
    [goals, currentUser]
  );

  const myAchToday = useMemo(
    () => achievements.filter(a => a.userId === currentUser.id && a.date === todayKey()),
    [achievements, currentUser]
  );

  return (
    <>
      <Topbar
        right={
          <HeaderActions
            unreadCount={unreadCount}
            onOpenChat={openChat}
            onOpenNotifications={openNotifs}
            onLogout={onLogout}
          />
        }
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Hi, {currentUser.name}</h1>
          <p className="text-[var(--clr-muted)]">
            {currentUser.office} - {currentUser.department}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <AttendanceCard
            currentTime={currentTime}
            todayStatus={todayStatus}
            onCheckIn={onCheckIn}
            onCheckOut={onCheckOut}
          />
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-3">Leave Balance</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-[var(--clr-border)] p-4 text-center">
                <div className="text-xs text-[var(--clr-muted)]">Sick</div>
                <div className="text-2xl font-bold">{leaveBalance.sick}</div>
              </div>
              <div className="rounded-lg border border-[var(--clr-border)] p-4 text-center">
                <div className="text-xs text-[var(--clr-muted)]">Casual</div>
                <div className="text-2xl font-bold">{leaveBalance.casual}</div>
              </div>
              <div className="rounded-lg border border-[var(--clr-border)] p-4 text-center">
                <div className="text-xs text-[var(--clr-muted)]">Emergency</div>
                <div className="text-2xl font-bold">{leaveBalance.emergency}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="card p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">My Tasks</h2>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {myTasks.length === 0 && (
                <div className="text-[var(--clr-muted)]">No tasks yet.</div>
              )}
              {myTasks.map(t => (
                <div key={t.id} className="rounded-lg border border-[var(--clr-border)] p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{t.title}</div>
                    <div
                      className={`badge ${
                        t.status === "done"
                          ? "bdg-done"
                          : t.status === "in_progress"
                          ? "bdg-progress"
                          : "bdg-todo"
                      }`}
                    >
                      {t.status.replace("_", " ")}
                    </div>
                  </div>
                  <div className="text-xs mt-1">
                    <span className={`badge ${prioBadge(t.priority)}`}>{t.priority}</span>
                  </div>
                  {t.description && (
                    <div className="text-[var(--clr-muted)] text-sm mt-1">{t.description}</div>
                  )}
                  {t.link && (
                    <div className="text-sm mt-1">
                      <a className="link" href={t.link} target="_blank" rel="noopener noreferrer">
                        Open task link
                      </a>
                    </div>
                  )}
                  {t.attachmentUrl && (
                    <div className="text-sm mt-1">
                      <a
                        className="link"
                        href={t.attachmentUrl}
                        download={t.attachmentName || 'attachment'}
                      >
                        Download attachment
                      </a>
                    </div>
                  )}
                  <div className="text-[var(--clr-muted)] text-sm mt-2">
                    Deadline: {fmtShort(t.deadline)}
                  </div>
                  <div className="mt-2">
                    <select
                      className="select w-auto"
                      value={t.status}
                      onChange={e => onUpdateTaskStatus(t.id, e.target.value)}
                    >
                      <option value="todo">To do</option>
                      <option value="in_progress">In progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">EOD Timesheet (Today)</h2>
                <button className="btn btn-ghost px-3 py-2" onClick={onAddEOD}>
                  Add Entry
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {myEODToday.length === 0 && (
                  <div className="text-[var(--clr-muted)]">No EOD entries yet.</div>
                )}
                {myEODToday.map(eo => (
                  <div key={eo.id} className="rounded-lg border border-[var(--clr-border)] p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">
                        {eo.project} {eo.task ? "- " + eo.task : ""}
                      </div>
                      <div className="text-sm text-[var(--clr-muted)]">{eo.hours.toFixed(2)}h</div>
                    </div>
                    {eo.notes && (
                      <div className="text-[var(--clr-muted)] text-sm mt-1">{eo.notes}</div>
                    )}
                    <div className="text-xs text-[var(--clr-muted)] mt-1">
                      {fmtShort(eo.dateKey)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">My Leave Requests</h2>
                <button className="btn btn-ghost px-3 py-2" onClick={onOpenLeaveModal}>
                  Request Leave
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {myLeaves.length === 0 && (
                  <div className="text-[var(--clr-muted)]">No leave history.</div>
                )}
                {myLeaves.map(l => (
                  <div
                    key={l.id}
                    className="rounded-lg border border-[var(--clr-border)] p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">
                        {fmtShort(l.date)} - {l.type}
                      </div>
                      <div className="text-xs text-[var(--clr-muted)]">{l.reason || "-"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`badge ${
                          l.status === "approved"
                            ? "bdg-done"
                            : l.status === "rejected"
                            ? "bdg-todo"
                            : "bdg-progress"
                        }`}
                      >
                        {l.status}
                      </div>
                      {l.status === "pending" && (
                        <button
                          className="btn btn-ghost px-3 py-1.5"
                          onClick={() => onCancelLeave(l.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Today's Goals</h2>
                <button className="btn btn-ghost px-3 py-2" onClick={onOpenGoal}>
                  Add Goal
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {myGoalsToday.length === 0 && (
                  <div className="text-[var(--clr-muted)]">No goals added.</div>
                )}
                {myGoalsToday.map(g => (
                  <div key={g.id} className="rounded-lg border border-[var(--clr-border)] p-3 text-sm">
                    {g.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Today's Achievements</h2>
                <button className="btn btn-ghost px-3 py-2" onClick={onOpenAch}>
                  Add Achievement
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {myAchToday.length === 0 && (
                  <div className="text-[var(--clr-muted)]">No achievements added.</div>
                )}
                {myAchToday.map(a => (
                  <div key={a.id} className="rounded-lg border border-[var(--clr-border)] p-3 text-sm">
                    {a.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Hiring Alerts</h2>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {openJobs.length === 0 && (
                  <div className="text-[var(--clr-muted)]">No openings yet.</div>
                )}
                {openJobs.map(j => (
                  <div key={j.id} className="rounded-lg border border-[var(--clr-border)] p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">
                        {j.title} <span className="chip ml-2">{j.department}</span>
                      </div>
                      <button
                        className="btn btn-ghost px-3 py-1.5"
                        onClick={() => {
                          navigator.clipboard?.writeText(j.applyUrl);
                        }}
                      >
                        Copy Link
                      </button>
                    </div>
                    <div className="text-xs text-[var(--clr-muted)]">
                      {j.location} - {fmtShort(j.date)}
                    </div>
                    {j.description && <div className="text-sm mt-1">{j.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6 md:col-span-3">
            <h2 className="text-xl font-semibold mb-3">My Attendance</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
              {myAttendance
                .slice(-12)
                .reverse()
                .map(r => (
                  <div key={r.id} className="rounded-lg border border-[var(--clr-border)] p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{r.dateLabel}</span>
                      <span className="text-[var(--clr-primary)] font-bold">
                        {Number(r.hours || 0).toFixed(2)} hrs
                      </span>
                    </div>
                    <div className="text-[var(--clr-muted)] text-sm">
                      {fmtTime(r.checkIn)} - {r.checkOut ? fmtTime(r.checkOut) : "Active"}
                    </div>
                  </div>
                ))}
              {myAttendance.length === 0 && (
                <div className="text-[var(--clr-muted)]">No records yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mnav md:hidden">
        <div className="max-w-7xl mx-auto flex">
          <button onClick={onOpenLeaveModal}>Leave</button>
          <button onClick={onAddEOD}>EOD</button>
          <button onClick={openChat}>Chat</button>
        </div>
      </div>
    </>
  );
};

EmployeeView.displayName = 'EmployeeView';

export default EmployeeView;

