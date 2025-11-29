import React, { useState, useMemo } from 'react';
import Topbar from '../../Topbar';
import { HeaderActions, AttendanceCard } from '../common';
import { TabButton, DepartmentBreakdown, CelebrationsList, SetEmpDateForm } from '../features';
import EmployeeAssessment from '../../EmployeeAssessment';
import { todayKey, fmtShort, fmtTime } from '../../utils/helpers';
import { DEPARTMENTS, ROLES, PROJECT_STATUSES } from '../../utils/constants';

const AdminView = ({
  currentUser,
  employees,
  attendanceRecords,
  leaveRequests,
  offices,
  tasks,
  announcements,
  holidays,
  eods,
  documents,
  onOpenAddEmpModal,
  onOpenAddTaskModal,
  onOpenAddAnnouncementModal,
  onOpenAddHolidayModal,
  onOpenAddOfficeModal,
  onOpenAddDocModal,
  onLogout,
  onLeaveApproval,
  onUpdateTaskStatus,
  onChangeEmployeeOffice,
  onChangeEmployeeRole,
  onChangeReportingManager,
  onToggleEmployeeActive,
  onResetPassword,
  adminTab,
  setAdminTab,
  notifications,
  openNotifs,
  onToggleShareDoc,
  onDeleteDoc,
  openChat,
  jobs,
  onAddJob,
  onToggleJob,
  onDeleteJob,
  currentTime,
  onCheckIn,
  onCheckOut,
  onEditTask,
  onDeleteTask,
  celebrations,
  onOpenAddCelebration,
  onOpenLeaveModal,
  goals,
  achievements,
  onOpenGoal,
  onOpenAch,
  onSetEmpDate,
  onWish,
  onCancelLeave,
  onAddEOD,
  projects,
  onAddProject,
  onUpdateProject
}) => {
  const isAdmin = currentUser.role === "admin";
  const isHR = currentUser.role === "hr";
  const isSub = currentUser.role === "sub_admin";

  const employeesOnly = useMemo(
    () => employees.filter(e => e.role === "employee"),
    [employees]
  );

  const myReports = useMemo(
    () => employees.filter(e => e.reportingManagerId === currentUser.id && e.role === "employee"),
    [employees, currentUser]
  );

  const presentTodayAll = useMemo(
    () => attendanceRecords.filter(r => r.dateKey === todayKey()),
    [attendanceRecords]
  );

  const presentTodayView = useMemo(
    () =>
      isSub
        ? presentTodayAll.filter(r => myReports.some(m => m.id === r.employeeId))
        : presentTodayAll,
    [presentTodayAll, isSub, myReports]
  );

  const [selectedOffice, setSelectedOffice] = useState("all");
  const [selectedDept, setSelectedDept] = useState("all");

  const filteredEmployees = useMemo(
    () =>
      (isSub ? myReports : employees).filter(
        e =>
          (selectedOffice === "all" || e.office === selectedOffice) &&
          (selectedDept === "all" || e.department === selectedDept)
      ),
    [employees, myReports, selectedOffice, selectedDept, isSub]
  );

  const filteredAttendance = useMemo(() => {
    const base = isSub
      ? attendanceRecords.filter(r => myReports.some(m => m.id === r.employeeId))
      : attendanceRecords;
    return selectedOffice === "all"
      ? base
      : base.filter(r => {
          const emp = employees.find(e => e.id === r.employeeId);
          return emp && emp.office === selectedOffice;
        });
  }, [attendanceRecords, employees, selectedOffice, isSub, myReports]);

  const unreadCount = notifications.filter(n => !n.read && n.userId === currentUser.id).length;
  const prWeight = (p) => (p === "hot" ? 0 : p === "general" ? 1 : 2);

  const sortedTasks = useMemo(() => {
    const base = isSub
      ? tasks.filter(t => myReports.some(m => m.id === t.assignedTo))
      : tasks;
    return base.slice().sort((a, b) => prWeight(a.priority) - prWeight(b.priority));
  }, [tasks, isSub, myReports]);

  const myOwnTasks = useMemo(
    () => tasks.filter(t => t.assignedTo === currentUser.id),
    [tasks, currentUser]
  );

  const onlyAdmin = isAdmin;

  const [eodDate, setEodDate] = useState(todayKey());
  const [attMonth, setAttMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const eodForDateMemo = useMemo(
    () =>
      eods
        .filter(e => e.dateKey === eodDate)
        .map(e => ({
          ...e,
          employeeName: employees.find(x => x.id === e.employeeId)?.name || "-"
        })),
    [eods, eodDate, employees]
  );

  const eodForDate = useMemo(
    () =>
      isSub
        ? eodForDateMemo.filter(e => myReports.some(m => m.id === e.employeeId))
        : eodForDateMemo,
    [eodForDateMemo, isSub, myReports]
  );

  const todayStatus = useMemo(
    () =>
      attendanceRecords.find(
        r => r.employeeId === currentUser.id && r.dateKey === todayKey()
      ) || null,
    [attendanceRecords, currentUser]
  );

  const totalUsersLabel = isSub ? "My Reports" : "Total Users";
  const totalUsersCount = isSub ? myReports.length : employees.length;
  const openTasksCount = isSub ? sortedTasks.length : tasks.length;

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

        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton id="overview" label="Overview" active={adminTab === "overview"} onClick={setAdminTab} />
          {(isAdmin || isHR) && (
            <TabButton id="departments" label="Departments" active={adminTab === "departments"} onClick={setAdminTab} />
          )}
          {(isAdmin || isHR) && (
            <TabButton id="employees" label="Employees" active={adminTab === "employees"} onClick={setAdminTab} />
          )}
          <TabButton id="presentToday" label="Present Today" active={adminTab === "presentToday"} onClick={setAdminTab} />
          <TabButton id="leaves" label="Leaves" active={adminTab === "leaves"} onClick={setAdminTab} />
          <TabButton id="tasks" label="Tasks" active={adminTab === "tasks"} onClick={setAdminTab} />
          <TabButton id="eod" label="EOD" active={adminTab === "eod"} onClick={setAdminTab} />
          <TabButton id="performance" label="Performance" active={adminTab === "performance"} onClick={setAdminTab} />
          <TabButton id="celebrations" label="Celebrations" active={adminTab === "celebrations"} onClick={setAdminTab} />
          {(isAdmin || isHR) && (
            <TabButton id="projects" label="Project Tracking" active={adminTab === "projects"} onClick={setAdminTab} />
          )}
          {(isAdmin || isHR) && (
            <TabButton id="documents" label="Documents" active={adminTab === "documents"} onClick={setAdminTab} />
          )}
          <TabButton id="announcements" label="Announcements" active={adminTab === "announcements"} onClick={setAdminTab} />
          <TabButton id="holidays" label="Holidays" active={adminTab === "holidays"} onClick={setAdminTab} />
          {(isAdmin || isHR) && (
            <TabButton id="offices" label="Offices" active={adminTab === "offices"} onClick={setAdminTab} />
          )}
          <TabButton id="hiring" label="Hiring" active={adminTab === "hiring"} onClick={setAdminTab} />
          {onlyAdmin && (
            <TabButton id="access" label="Access (Admin)" active={adminTab === "access"} onClick={setAdminTab} />
          )}
        </div>

        {adminTab === "overview" && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <AttendanceCard
                currentTime={currentTime}
                todayStatus={todayStatus}
                onCheckIn={onCheckIn}
                onCheckOut={onCheckOut}
              />
              <div className="card p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="kpi p-5 card">
                    <div className="text-[var(--clr-muted)] text-sm">{totalUsersLabel}</div>
                    <div className="text-3xl font-bold">{totalUsersCount}</div>
                  </div>
                  <div className="kpi p-5 card">
                    <div className="text-[var(--clr-muted)] text-sm">Present Today</div>
                    <div className="text-3xl font-bold text-[var(--clr-positive)]">
                      {presentTodayView.length}
                    </div>
                  </div>
                  <div className="kpi p-5 card">
                    <div className="text-[var(--clr-muted)] text-sm">My Reports</div>
                    <div className="text-3xl font-bold text-[var(--clr-primary)]">{myReports.length}</div>
                  </div>
                  <div className="kpi p-5 card">
                    <div className="text-[var(--clr-muted)] text-sm">Open Tasks</div>
                    <div className="text-3xl font-bold text-[var(--clr-warning)]">{openTasksCount}</div>
                  </div>
                </div>
              </div>
              {(isHR || isSub) && (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold">My Leave Balance</h2>
                    <button className="btn btn-ghost px-3 py-2" onClick={onOpenLeaveModal}>
                      Request Leave
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-[var(--clr-border)] p-4 text-center">
                      <div className="text-xs text-[var(--clr-muted)]">Sick</div>
                      <div className="text-2xl font-bold">
                        {employees.find(e => e.id === currentUser.id)?.leaveBalance?.sick || 0}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[var(--clr-border)] p-4 text-center">
                      <div className="text-xs text-[var(--clr-muted)]">Casual</div>
                      <div className="text-2xl font-bold">
                        {employees.find(e => e.id === currentUser.id)?.leaveBalance?.casual || 0}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[var(--clr-border)] p-4 text-center">
                      <div className="text-xs text-[var(--clr-muted)]">Emergency</div>
                      <div className="text-2xl font-bold">
                        {employees.find(e => e.id === currentUser.id)?.leaveBalance?.emergency || 0}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {(isHR || isSub) && (
                <div className="card p-6 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold">My Leave Requests</h2>
                    <button className="btn btn-ghost px-3 py-2" onClick={onOpenLeaveModal}>
                      Request Leave
                    </button>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {leaveRequests
                      .filter(l => l.employeeId === currentUser.id)
                      .slice()
                      .reverse()
                      .map(l => (
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
                    {leaveRequests.filter(l => l.employeeId === currentUser.id).length === 0 && (
                      <div className="text-[var(--clr-muted)]">No leave history.</div>
                    )}
                  </div>
                </div>
              )}
              <div className="card p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">My Tasks</h2>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {myOwnTasks.length === 0 && (
                    <div className="text-[var(--clr-muted)]">No tasks assigned to you.</div>
                  )}
                  {myOwnTasks
                    .slice()
                    .reverse()
                    .map(t => (
                      <div key={t.id} className="rounded-lg border border-[var(--clr-border)] p-3">
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
                          <span
                            className={`badge ${
                              t.priority === "hot"
                                ? "prio-hot"
                                : t.priority === "cold"
                                ? "prio-cold"
                                : "prio-general"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>
                        <div className="text-[var(--clr-muted)] text-sm mt-1">
                          Deadline: {fmtShort(t.deadline)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {(isHR || isSub) && (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold">EOD Timesheet (Today)</h2>
                    <button className="btn btn-ghost px-3 py-2" onClick={() => setAdminTab('eod')}>
                      View All
                    </button>
                    <button className="btn btn-ghost px-3 py-2" onClick={onAddEOD}>
                      Add Entry
                    </button>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {attendanceRecords &&
                      eods
                        .filter(e => e.employeeId === currentUser.id && e.dateKey === todayKey())
                        .map(eo => (
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
                    {eods.filter(e => e.employeeId === currentUser.id && e.dateKey === todayKey())
                      .length === 0 && <div className="text-[var(--clr-muted)]">No EOD entries yet.</div>}
                  </div>
                </div>
              )}

              {(isHR || isSub) && (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold">Today's Goals</h2>
                    <button className="btn btn-ghost px-3 py-2" onClick={onOpenGoal}>
                      Add Goal
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {goals.filter(g => g.userId === currentUser.id && g.date === todayKey()).length ===
                      0 && <div className="text-[var(--clr-muted)]">No goals added.</div>}
                    {goals
                      .filter(g => g.userId === currentUser.id && g.date === todayKey())
                      .map(g => (
                        <div key={g.id} className="rounded-lg border border-[var(--clr-border)] p-3 text-sm">
                          {g.text}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {(isHR || isSub) && (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold">Today's Achievements</h2>
                    <button className="btn btn-ghost px-3 py-2" onClick={onOpenAch}>
                      Add Achievement
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {achievements.filter(a => a.userId === currentUser.id && a.date === todayKey())
                      .length === 0 && <div className="text-[var(--clr-muted)]">No achievements added.</div>}
                    {achievements
                      .filter(a => a.userId === currentUser.id && a.date === todayKey())
                      .map(a => (
                        <div key={a.id} className="rounded-lg border border-[var(--clr-border)] p-3 text-sm">
                          {a.text}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {(isAdmin || isHR) && <DepartmentBreakdown employees={employees} />}

            <div className="card p-6 mb-6 overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Attendance Records</h2>
                <div className="flex gap-2 items-center">
                  <select
                    className="select w-auto"
                    value={selectedOffice}
                    onChange={e => setSelectedOffice(e.target.value)}
                  >
                    <option value="all">All Offices</option>
                    {offices.map(o => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <input
                    type="month"
                    className="select w-auto"
                    value={attMonth}
                    onChange={e => setAttMonth(e.target.value)}
                  />
                  <button
                    className="btn btn-ghost px-3 py-1.5"
                    onClick={() => {
                      const rows = filteredAttendance
                        .filter(r => r.dateKey && r.dateKey.startsWith(attMonth))
                        .map(r => {
                          const emp = employees.find(e => e.id === r.employeeId);
                          return {
                            Employee: r.employeeName,
                            Office: emp?.office || "",
                            Date: r.dateLabel,
                            CheckIn: fmtTime(r.checkIn),
                            CheckOut: r.checkOut ? fmtTime(r.checkOut) : "",
                            Hours: Number(r.hours || 0).toFixed(2),
                            Location: r.location || ""
                          };
                        });
                      const header = ["Employee", "Office", "Date", "CheckIn", "CheckOut", "Hours", "Location"];
                      const csv = [
                        header.join(","),
                        ...rows.map(o =>
                          header.map(h => `"${String(o[h]).replaceAll('"', '""')}"`).join(",")
                        )
                      ].join("\n");
                      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `attendance_${attMonth}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download CSV
                  </button>
                </div>
              </div>
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Office</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance
                    .slice(-20)
                    .reverse()
                    .map(rec => {
                      const emp = employees.find(e => e.id === rec.employeeId);
                      return (
                        <tr key={rec.id} className="border-t border-[var(--clr-border)]">
                          <td>{rec.employeeName}</td>
                          <td className="text-[var(--clr-muted)]">{emp?.office}</td>
                          <td className="text-[var(--clr-muted)]">{rec.dateLabel}</td>
                          <td>{fmtTime(rec.checkIn)}</td>
                          <td>{rec.checkOut ? fmtTime(rec.checkOut) : "Active"}</td>
                          <td className="text-[var(--clr-primary)] font-semibold">
                            {Number(rec.hours || 0).toFixed(2)} hrs
                          </td>
                          <td className="text-[var(--clr-muted)] text-sm">{rec.location}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {adminTab === "departments" && (isAdmin || isHR) && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Department Breakdown</h2>
              <div className="flex gap-2">
                <select
                  className="select w-auto"
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  className="select w-auto"
                  value={selectedOffice}
                  onChange={e => setSelectedOffice(e.target.value)}
                >
                  <option value="all">All Offices</option>
                  {offices.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="bg-[var(--clr-bg)]">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Office</th>
                    <th>Role</th>
                    <th>Reporting Manager</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => {
                    const managers = employees.filter(x =>
                      ["admin", "sub_admin", "hr"].includes(x.role)
                    );
                    return (
                      <tr key={emp.id} className="border-t border-[var(--clr-border)] hover:bg-[#FAFAFA] transition-colors">
                        <td className="font-medium">{emp.name}</td>
                        <td className="text-[var(--clr-muted)]">{emp.email}</td>
                        <td className="text-[var(--clr-muted)] font-medium">{emp.department}</td>
                        <td className="text-[var(--clr-muted)]">{emp.office}</td>
                        <td className="text-[var(--clr-muted)]">{emp.role}</td>
                        <td>
                          {emp.role !== "admin" ? (
                            <select
                              className="select-table"
                              value={emp.reportingManagerId || ""}
                              onChange={e =>
                                onChangeReportingManager(emp.id, Number(e.target.value) || null)
                              }
                            >
                              <option value="">Select Manager</option>
                              {managers.map(m => (
                                <option key={m.id} value={m.id}>
                                  {m.name} ({m.role})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-[var(--clr-muted)]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === "employees" && (isAdmin || isHR) && (
          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl font-semibold">Users / Employees</h2>
              <button className="btn btn-primary px-3 py-2 text-sm sm:px-4 sm:py-2.5 sm:text-base" onClick={onOpenAddEmpModal}>
                Add
              </button>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--clr-bg)]">
                    <th className="min-w-[120px]">Name</th>
                    <th className="min-w-[150px]">Email</th>
                    <th className="min-w-[120px]">Office</th>
                    <th className="min-w-[110px]">Department</th>
                    <th className="min-w-[100px]">Role</th>
                    <th className="min-w-[150px]">Reporting Manager</th>
                    <th className="min-w-[80px]">Status</th>
                    <th className="min-w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => {
                    const managers = employees.filter(x =>
                      ["admin", "sub_admin", "hr"].includes(x.role)
                    );
                    return (
                      <tr key={emp.id} className="border-t border-[var(--clr-border)] hover:bg-[#FAFAFA] transition-colors">
                        <td className="font-medium text-sm">{emp.name}</td>
                        <td className="text-[var(--clr-muted)] text-sm truncate max-w-[150px]" title={emp.email}>{emp.email}</td>
                        <td>
                          <select
                            className="select-table-compact"
                            value={emp.office}
                            onChange={e => onChangeEmployeeOffice(emp.id, e.target.value)}
                          >
                            {offices.map(o => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <span className="text-[var(--clr-muted)] font-medium text-sm">{emp.department}</span>
                        </td>
                        <td>
                          <select
                            className="select-table-compact"
                            value={emp.role}
                            onChange={e => onChangeEmployeeRole(emp.id, e.target.value)}
                          >
                            {ROLES.map(r => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {emp.role !== "admin" ? (
                            <select
                              className="select-table-compact"
                              value={emp.reportingManagerId || ""}
                              onChange={e =>
                                onChangeReportingManager(emp.id, Number(e.target.value) || null)
                              }
                            >
                              <option value="">Select</option>
                              {managers.map(m => (
                                <option key={m.id} value={m.id}>
                                  {m.name} ({m.role})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-[var(--clr-muted)]">-</span>
                          )}
                        </td>
                        <td>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            emp.active === false 
                              ? "bg-red-100 text-red-700" 
                              : "bg-green-100 text-green-700"
                          }`}>
                            {emp.active === false ? "Inactive" : "Active"}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1.5 flex-wrap">
                            <button
                              className="btn btn-ghost px-2 py-1 text-xs"
                              onClick={() => onToggleEmployeeActive(emp.id)}
                            >
                              {emp.active === false ? "Activate" : "Deactivate"}
                            </button>
                            <button
                              className="btn btn-ghost px-2 py-1 text-xs"
                              onClick={() => onResetPassword(emp.id)}
                            >
                              Reset
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === "projects" && (isAdmin || isHR) && (
          <div className="card p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Project Tracking</h2>
              <button className="btn btn-primary px-4 py-2.5" onClick={onAddProject}>
                Add Project
              </button>
            </div>
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="bg-[var(--clr-bg)]">
                  <th>Project Name</th>
                  <th>Total Episodes / Quantity</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Link</th>
                  <th>Attachment</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} className="border-t border-[var(--clr-border)] hover:bg-[#FAFAFA] transition-colors">
                    <td className="font-medium">{p.name}</td>
                    <td className="text-[var(--clr-muted)]">{p.quantity || "-"}</td>
                    <td>
                      <input
                        type="date"
                        className="select-table"
                        value={p.deadline ? String(p.deadline).slice(0, 10) : ""}
                        onChange={e => onUpdateProject(p.id, { deadline: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="select-table"
                        value={p.status || "not_started"}
                        onChange={e => onUpdateProject(p.id, { status: e.target.value })}
                      >
                        {PROJECT_STATUSES.map(s => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {p.link ? (
                        <a className="link" href={p.link} target="_blank" rel="noopener noreferrer">
                          Open
                        </a>
                      ) : (
                        <span className="text-[var(--clr-muted)]">-</span>
                      )}
                    </td>
                    <td>
                      {p.attachmentUrl ? (
                        <a
                          className="link"
                          href={p.attachmentUrl}
                          download={p.attachmentName || 'attachment'}
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-[var(--clr-muted)]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td className="text-[var(--clr-muted)] p-3" colSpan="6">
                      No projects added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === "presentToday" && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {isSub ? "Present Today (My Reports)" : "Present Today"}
              </h2>
              <span className="text-[var(--clr-muted)]">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Office</th>
                    <th>Check In</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {presentTodayView.map(r => {
                    const emp = employees.find(e => e.id === r.employeeId);
                    return (
                      <tr key={r.id} className="border-t border-[var(--clr-border)]">
                        <td>{r.employeeName}</td>
                        <td className="text-[var(--clr-muted)]">{emp?.office}</td>
                        <td>{fmtTime(r.checkIn)}</td>
                        <td className="text-[var(--clr-positive)]">
                          {r.checkOut ? "Checked Out" : "Active"}
                        </td>
                      </tr>
                    );
                  })}
                  {presentTodayView.length === 0 && (
                    <tr>
                      <td className="text-[var(--clr-muted)] p-3" colSpan="4">
                        No one is present today yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === "leaves" && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Leave Requests{" "}
                {isAdmin ? "(All)" : isHR ? "(All)" : "(My Reports)"}
              </h2>
            </div>
            <div className="grid gap-3">
              {leaveRequests.map(l => {
                const emp = employees.find(e => e.id === l.employeeId);
                const canSee =
                  isAdmin || isHR || (emp && emp.reportingManagerId === currentUser.id);
                if (!canSee) return null;
                const canAct =
                  isAdmin || isHR || (emp && emp.reportingManagerId === currentUser.id);
                return (
                  <div
                    key={l.id}
                    className="rounded-lg border border-[var(--clr-border)] p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">{emp?.name}</div>
                      <div className="text-sm text-[var(--clr-muted)]">
                        {l.date} - {l.type}
                      </div>
                      <div className="text-sm text-[var(--clr-muted)]">{l.reason}</div>
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
                      {l.status === "pending" && canAct && (
                        <>
                          <button
                            className="btn px-3 py-2"
                            style={{ background: "var(--clr-positive)", color: "#fff" }}
                            onClick={() => onLeaveApproval(l.id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn px-3 py-2"
                            style={{ background: "var(--clr-negative)", color: "#fff" }}
                            onClick={() => onLeaveApproval(l.id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {adminTab === "celebrations" && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Celebrations</h2>
              {(isAdmin || isHR) && (
                <button className="btn btn-primary px-3 py-2" onClick={onOpenAddCelebration}>
                  Add Celebration
                </button>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="card p-4">
                <h3 className="font-semibold mb-2">Today's Birthdays</h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {employees
                    .filter(
                      e =>
                        e.dob &&
                        new Date(e.dob).getMonth() === new Date().getMonth() &&
                        new Date(e.dob).getDate() === new Date().getDate()
                    )
                    .map(e => (
                      <div key={e.id} className="flex items-center justify-between border rounded-lg p-2">
                        <div>
                          <div className="font-semibold">{e.name}</div>
                          <div className="text-xs text-[var(--clr-muted)]">{e.department}</div>
                        </div>
                        <button
                          className="btn btn-ghost px-3 py-1.5"
                          onClick={() => onWish(e.id, 'birthday')}
                        >
                          Wish
                        </button>
                      </div>
                    ))}
                  {employees.filter(
                    e =>
                      e.dob &&
                      new Date(e.dob).getMonth() === new Date().getMonth() &&
                      new Date(e.dob).getDate() === new Date().getDate()
                  ).length === 0 && (
                    <div className="text-[var(--clr-muted)] text-sm">No birthdays today.</div>
                  )}
                </div>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold mb-2">Today's Work Anniversaries</h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {employees
                    .filter(
                      e =>
                        e.doj &&
                        new Date(e.doj).getMonth() === new Date().getMonth() &&
                        new Date(e.doj).getDate() === new Date().getDate()
                    )
                    .map(e => (
                      <div key={e.id} className="flex items-center justify-between border rounded-lg p-2">
                        <div>
                          <div className="font-semibold">{e.name}</div>
                          <div className="text-xs text-[var(--clr-muted)]">{e.department}</div>
                        </div>
                        <button
                          className="btn btn-ghost px-3 py-1.5"
                          onClick={() => onWish(e.id, 'anniversary')}
                        >
                          Wish
                        </button>
                      </div>
                    ))}
                  {employees.filter(
                    e =>
                      e.doj &&
                      new Date(e.doj).getMonth() === new Date().getMonth() &&
                      new Date(e.doj).getDate() === new Date().getDate()
                  ).length === 0 && (
                    <div className="text-[var(--clr-muted)] text-sm">No anniversaries today.</div>
                  )}
                </div>
              </div>
              {(isAdmin || isHR) && (
                <div className="card p-4">
                  <h3 className="font-semibold mb-2">Set Employee Date</h3>
                  <SetEmpDateForm employees={employees} onSave={onSetEmpDate} />
                </div>
              )}
            </div>
            <CelebrationsList employees={employees} customCelebrations={celebrations} />
          </div>
        )}

        {adminTab === "tasks" && (
          <div className="card p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {isSub ? "Tasks (My Reports)" : "Tasks"}
              </h2>
              <button className="btn btn-primary px-3 py-2" onClick={onOpenAddTaskModal}>
                Add Task
              </button>
            </div>
            <table className="w-full min-w-[980px]">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Assignee</th>
                  <th>Department</th>
                  <th>Deadline</th>
                  <th>Priority</th>
                  <th>Link</th>
                  <th>Attachment</th>
                  <th>Status</th>
                  <th>Update</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks.map(t => {
                  const emp = employees.find(e => e.id === t.assignedTo);
                  const badge =
                    t.status === "done"
                      ? "bdg-done"
                      : t.status === "in_progress"
                      ? "bdg-progress"
                      : "bdg-todo";
                  return (
                    <tr key={t.id} className="border-t border-[var(--clr-border)]">
                      <td>{t.title}</td>
                      <td className="text-[var(--clr-muted)]">{emp?.name || "-"}</td>
                      <td className="text-[var(--clr-muted)]">{emp?.department || "-"}</td>
                      <td className="text-[var(--clr-muted)]">{fmtShort(t.deadline)}</td>
                      <td>
                        <span
                          className={`badge ${
                            t.priority === "hot"
                              ? "prio-hot"
                              : t.priority === "cold"
                              ? "prio-cold"
                              : "prio-general"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td>
                        {t.link ? (
                          <a className="link" href={t.link} target="_blank" rel="noopener noreferrer">
                            Open
                          </a>
                        ) : (
                          <span className="text-[var(--clr-muted)]">-</span>
                        )}
                      </td>
                      <td>
                        {t.attachmentUrl ? (
                          <a
                            className="link"
                            href={t.attachmentUrl}
                            download={t.attachmentName || 'attachment'}
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-[var(--clr-muted)]">-</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${badge}`}>{t.status.replace("_", " ")}</span>
                      </td>
                      <td>
                        <select
                          className="select w-auto"
                          value={t.status}
                          onChange={e => onUpdateTaskStatus(t.id, e.target.value)}
                        >
                          <option value="todo">To do</option>
                          <option value="in_progress">In progress</option>
                          <option value="done">Done</option>
                        </select>
                      </td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-ghost px-3 py-1.5"
                          onClick={() => onEditTask(t.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-ghost px-3 py-1.5"
                          onClick={() => onDeleteTask(t.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {sortedTasks.length === 0 && (
                  <tr>
                    <td className="text-[var(--clr-muted)] p-3" colSpan="9">
                      No tasks yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === "eod" && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {isSub ? "EOD Timesheets (My Reports)" : "EOD Timesheets"}
              </h2>
              <input
                type="date"
                className="select w-auto"
                value={eodDate}
                onChange={e => setEodDate(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Project</th>
                    <th>Task</th>
                    <th>Hours</th>
                    <th>Notes</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {eodForDate.map(eo => (
                    <tr key={eo.id} className="border-t border-[var(--clr-border)]">
                      <td>{eo.employeeName}</td>
                      <td className="text-[var(--clr-muted)]">{eo.project}</td>
                      <td className="text-[var(--clr-muted)]">{eo.task || "-"}</td>
                      <td className="text-[var(--clr-primary)] font-semibold">{eo.hours.toFixed(2)}</td>
                      <td className="text-[var(--clr-muted)]">{eo.notes || "-"}</td>
                      <td className="text-[var(--clr-muted)]">{fmtShort(eo.dateKey)}</td>
                    </tr>
                  ))}
                  {eodForDate.length === 0 && (
                    <tr>
                      <td className="text-[var(--clr-muted)] p-3" colSpan="6">
                        No EOD entries for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === "performance" && (
          <EmployeeAssessment
            employees={employees}
            tasks={tasks}
            attendanceRecords={attendanceRecords}
            eods={eods}
            daysPeriod={30}
          />
        )}

        {adminTab === "documents" && (isAdmin || isHR) && (
          <div className="card p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Employee Documents</h2>
              <button className="btn btn-primary px-3 py-2" onClick={onOpenAddDocModal}>
                Upload
              </button>
            </div>
            <table className="w-full min-w-[760px]">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>File</th>
                  <th>Shared to Employee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(d => {
                  const emp = employees.find(e => e.id === d.employeeId);
                  return (
                    <tr key={d.id} className="border-t border-[var(--clr-border)]">
                      <td>{emp?.name || "-"}</td>
                      <td className="text-[var(--clr-muted)]">{d.title}</td>
                      <td className="text-[var(--clr-muted)]">{d.docType}</td>
                      <td>
                        <a className="link" href={d.url} download={d.fileName}>
                          Download
                        </a>
                      </td>
                      <td>
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={!!d.shared}
                            onChange={() => onToggleShareDoc(d.id)}
                          />
                          <span>{d.shared ? "Shared" : "Private"}</span>
                        </label>
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost px-3 py-1.5"
                          onClick={() => onDeleteDoc(d.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {documents.length === 0 && (
                  <tr>
                    <td className="text-[var(--clr-muted)] p-3" colSpan="6">
                      No documents uploaded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === "announcements" && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Announcements</h2>
              <button className="btn btn-primary px-3 py-2" onClick={onOpenAddAnnouncementModal}>
                New
              </button>
            </div>
            <div className="grid gap-3">
              {announcements
                .slice()
                .reverse()
                .map(a => (
                  <div key={a.id} className="rounded-lg border border-[var(--clr-border)] p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{a.title}</div>
                      <div className="text-xs text-[var(--clr-muted)]">{fmtShort(a.date)}</div>
                    </div>
                    <div className="text-sm text-[var(--clr-muted)]">{a.message}</div>
                  </div>
                ))}
              {announcements.length === 0 && (
                <div className="text-[var(--clr-muted)]">No announcements yet.</div>
              )}
            </div>
          </div>
        )}

        {adminTab === "holidays" && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Holiday List</h2>
              <button className="btn btn-primary px-3 py-2" onClick={onOpenAddHolidayModal}>
                Add Holiday
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Holiday</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays
                    .slice()
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(h => (
                      <tr key={h.id} className="border-t border-[var(--clr-border)]">
                        <td>{fmtShort(h.date)}</td>
                        <td className="text-[var(--clr-muted)]">{h.name}</td>
                      </tr>
                    ))}
                  {holidays.length === 0 && (
                    <tr>
                      <td className="text-[var(--clr-muted)] p-3" colSpan="2">
                        No holidays added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === "offices" && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Office Locations</h2>
              <button className="btn btn-primary px-3 py-2" onClick={onOpenAddOfficeModal}>
                Add Office
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {offices.map(o => (
                <div key={o} className="rounded-lg border border-[var(--clr-border)] p-4">
                  <div className="font-semibold mb-1">{o}</div>
                  <div className="text-sm text-[var(--clr-muted)]">
                    {employees.filter(e => e.office === o).length} employees
                  </div>
                  <div className="mt-2 max-h-40 overflow-y-auto pr-1">
                    {employees
                      .filter(e => e.office === o)
                      .map(e => (
                        <div key={e.id} className="text-sm">
                          - {e.name}
                        </div>
                      ))}
                    {employees.filter(e => e.office === o).length === 0 && (
                      <div className="text-[var(--clr-muted)] text-sm">No employees yet</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === "hiring" && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Hiring Alerts</h2>
              <button className="btn btn-primary px-3 py-2" onClick={onAddJob}>
                Add Opening
              </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {jobs.length === 0 && (
                <div className="text-[var(--clr-muted)]">No openings yet.</div>
              )}
              {jobs
                .slice()
                .reverse()
                .map(j => (
                  <div
                    key={j.id}
                    className="rounded-lg border border-[var(--clr-border)] p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">
                        {j.title} <span className="chip ml-2">{j.department}</span>
                      </div>
                      <div className="text-xs text-[var(--clr-muted)]">
                        {j.location} • {fmtShort(j.date)}
                      </div>
                      {j.description && <div className="text-sm mt-1">{j.description}</div>}
                      <div className="text-sm mt-1">
                        <span className="text-[var(--clr-muted)]">Apply: </span>
                        <a className="link" href={j.applyUrl} target="_blank" rel="noopener noreferrer">
                          {j.applyUrl}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={j.active !== false}
                          onChange={() => onToggleJob(j.id)}
                        />
                        <span>{j.active !== false ? "Active" : "Hidden"}</span>
                      </label>
                      <button
                        className="btn btn-ghost px-3 py-1.5"
                        onClick={() => onDeleteJob(j.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {adminTab === "access" && isAdmin && (
          <div className="card p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Access & Passwords (Admin)</h2>
              <button className="btn btn-primary px-3 py-2" onClick={onOpenAddEmpModal}>
                Create User
              </button>
            </div>
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Reset Password</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} className="border-t border-[var(--clr-border)]">
                    <td>{emp.name}</td>
                    <td className="text-[var(--clr-muted)]">{emp.email}</td>
                    <td className="text-[var(--clr-muted)]">{emp.role}</td>
                    <td className="text-[var(--clr-muted)]">
                      {emp.active === false ? "Inactive" : "Active"}
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost px-3 py-1.5"
                        onClick={() => onResetPassword(emp.id)}
                      >
                        Reset
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mnav md:hidden">
        <div className="max-w-7xl mx-auto flex">
          <button onClick={() => setAdminTab('leaves')}>Leaves</button>
          <button onClick={() => setAdminTab('eod')}>EOD</button>
          <button onClick={openChat}>Chat</button>
        </div>
      </div>
    </>
  );
};

AdminView.displayName = 'AdminView';

export default AdminView;

