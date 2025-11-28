import React, { useMemo, memo, useCallback, useState } from 'react';

// Constants
const DEFAULT_DAYS_PERIOD = 30;
const DEFAULT_TASK_COMPLETION_RATE = 0.5;
const EXPECTED_WORKING_DAYS = 22;
const EXPECTED_EOD_ENTRIES = 20;

// Performance scoring weights
const SCORE_WEIGHTS = {
  TASK: 50,
  ATTENDANCE: 30,
  EOD_ACTIVITY: 20,
};

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
};

// Performance status labels
const PERFORMANCE_STATUS = {
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  NEEDS_ATTENTION: 'Needs Attention',
};

// Sort order options
const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

/**
 * Calculates the cutoff date based on the number of days
 * @param {number} daysPeriod - Number of days to go back
 * @returns {Date} Cutoff date
 */
const getCutoffDate = (daysPeriod) => {
  const date = new Date();
  date.setDate(date.getDate() - daysPeriod);
  return date;
};

/**
 * Calculates task completion rate for an employee
 * @param {Array} tasks - All tasks
 * @param {number} employeeId - Employee ID
 * @param {Date} cutoffDate - Cutoff date for filtering
 * @returns {number} Completion rate (0-1)
 */
const calculateTaskCompletionRate = (tasks, employeeId, cutoffDate) => {
  const recentTasks = tasks.filter(
    (task) => task.assignedTo === employeeId && new Date(task.createdAt) >= cutoffDate
  );

  if (recentTasks.length === 0) {
    return DEFAULT_TASK_COMPLETION_RATE;
  }

  const completedTasks = recentTasks.filter((task) => task.status === 'done');
  return completedTasks.length / recentTasks.length;
};

/**
 * Calculates attendance metrics for an employee
 * @param {Array} attendanceRecords - All attendance records
 * @param {number} employeeId - Employee ID
 * @param {Date} cutoffDate - Cutoff date for filtering
 * @returns {Object} Attendance metrics
 */
const calculateAttendanceMetrics = (attendanceRecords, employeeId, cutoffDate) => {
  const recentAttendance = attendanceRecords.filter(
    (record) =>
      record.employeeId === employeeId &&
      new Date(record.checkIn) >= cutoffDate &&
      record.checkOut
  );

  const uniqueDaysPresent = new Set(recentAttendance.map((r) => r.dateKey)).size;
  const avgHours =
    recentAttendance.length > 0
      ? recentAttendance.reduce((sum, record) => sum + (record.hours || 0), 0) /
        recentAttendance.length
      : 0;

  return { uniqueDaysPresent, avgHours };
};

/**
 * Counts EOD entries for an employee within the period
 * @param {Array} eods - All EOD entries
 * @param {number} employeeId - Employee ID
 * @param {Date} cutoffDate - Cutoff date for filtering
 * @returns {number} Number of EOD entries
 */
const countEODEntries = (eods, employeeId, cutoffDate) => {
  return eods.filter(
    (eod) => eod.employeeId === employeeId && new Date(eod.dateKey) >= cutoffDate
  ).length;
};

/**
 * Calculates normalized attendance rate
 * @param {number} uniqueDaysPresent - Number of unique days present
 * @returns {number} Normalized rate (0-1)
 */
const calculateAttendanceRate = (uniqueDaysPresent) => {
  return Math.min(uniqueDaysPresent / EXPECTED_WORKING_DAYS, 1);
};

/**
 * Calculates normalized EOD activity rate
 * @param {number} eodEntries - Number of EOD entries
 * @returns {number} Normalized rate (0-1)
 */
const calculateActivityRate = (eodEntries) => {
  return Math.min(eodEntries / EXPECTED_EOD_ENTRIES, 1);
};

/**
 * Calculates overall performance score
 * @param {number} taskCompletionRate - Task completion rate (0-1)
 * @param {number} attendanceRate - Attendance rate (0-1)
 * @param {number} activityRate - EOD activity rate (0-1)
 * @returns {number} Overall score (0-100)
 */
const calculatePerformanceScore = (taskCompletionRate, attendanceRate, activityRate) => {
  return Math.round(
    taskCompletionRate * SCORE_WEIGHTS.TASK +
      attendanceRate * SCORE_WEIGHTS.ATTENDANCE +
      activityRate * SCORE_WEIGHTS.EOD_ACTIVITY
  );
};

/**
 * Determines performance status based on score
 * @param {number} score - Performance score (0-100)
 * @returns {string} Performance status
 */
const getPerformanceStatus = (score) => {
  if (score >= PERFORMANCE_THRESHOLDS.EXCELLENT) {
    return PERFORMANCE_STATUS.EXCELLENT;
  }
  if (score >= PERFORMANCE_THRESHOLDS.GOOD) {
    return PERFORMANCE_STATUS.GOOD;
  }
  return PERFORMANCE_STATUS.NEEDS_ATTENTION;
};

/**
 * Gets CSS class for performance status badge
 * @param {string} status - Performance status
 * @returns {string} CSS class name
 */
const getStatusBadgeClass = (status) => {
  const statusClassMap = {
    [PERFORMANCE_STATUS.EXCELLENT]: 'bdg-done',
    [PERFORMANCE_STATUS.GOOD]: 'bdg-progress',
    [PERFORMANCE_STATUS.NEEDS_ATTENTION]: 'bdg-todo',
  };
  return statusClassMap[status] || 'bdg-todo';
};

/**
 * Performance Table Row Component
 * Displays a single employee's performance metrics
 */
const PerformanceTableRow = memo(({ performanceData }) => {
  const {
    employee,
    taskCompletionRate,
    uniqueDaysPresent,
    avgHours,
    eodEntries,
    score,
    status,
  } = performanceData;

  return (
    <tr className="border-t border-[var(--clr-border)] hover:bg-[var(--clr-hover)] transition-colors">
      <td className="py-3 font-medium">{employee.name}</td>
      <td className="py-3 text-[var(--clr-muted)]">{employee.department}</td>
      <td className="py-3 text-[var(--clr-muted)]">
        {Math.round(taskCompletionRate * 100)}%
      </td>
      <td className="py-3 text-[var(--clr-muted)]">{uniqueDaysPresent}</td>
      <td className="py-3 text-[var(--clr-muted)]">{avgHours.toFixed(2)}</td>
      <td className="py-3 text-[var(--clr-muted)]">{eodEntries}</td>
      <td className="py-3 text-[var(--clr-primary)] font-semibold">{score}</td>
      <td className="py-3">
        <span className={`badge ${getStatusBadgeClass(status)}`}>{status}</span>
      </td>
    </tr>
  );
});

PerformanceTableRow.displayName = 'PerformanceTableRow';

/**
 * Table Header Component with sorting
 */
const TableHeader = memo(({ label, sortKey, currentSort, sortOrder, onSort }) => {
  const handleSort = useCallback(() => {
    onSort(sortKey);
  }, [sortKey, onSort]);

  const isActive = currentSort === sortKey;
  const sortIcon = isActive
    ? sortOrder === SORT_ORDER.ASC
      ? '↑'
      : '↓'
    : '⇅';

  return (
    <th className="text-left cursor-pointer select-none hover:bg-[var(--clr-hover)] transition-colors px-3 py-2">
      <div className="flex items-center gap-2" onClick={handleSort}>
        <span>{label}</span>
        <span className="text-xs text-[var(--clr-muted)]">{sortIcon}</span>
      </div>
    </th>
  );
});

TableHeader.displayName = 'TableHeader';

/**
 * EmployeeAssessment Component
 * Displays performance metrics for employees based on tasks, attendance, and EOD entries
 *
 * @param {Object} props
 * @param {Array} props.employees - List of all employees
 * @param {Array} props.tasks - List of all tasks
 * @param {Array} props.attendanceRecords - List of attendance records
 * @param {Array} props.eods - List of EOD entries
 * @param {number} props.daysPeriod - Number of days to assess (default: 30)
 */
const EmployeeAssessment = ({
  employees = [],
  tasks = [],
  attendanceRecords = [],
  eods = [],
  daysPeriod = DEFAULT_DAYS_PERIOD,
}) => {
  // Sort state
  const [sortConfig, setSortConfig] = useState({
    key: 'score',
    order: SORT_ORDER.DESC,
  });

  // Filter only employee role users
  const employeeList = useMemo(
    () => employees.filter((employee) => employee.role === 'employee'),
    [employees]
  );

  // Calculate performance metrics for each employee
  const performanceData = useMemo(() => {
    if (employeeList.length === 0) {
      return [];
    }

    const cutoffDate = getCutoffDate(daysPeriod);

    return employeeList.map((employee) => {
      // Calculate individual metrics
      const taskCompletionRate = calculateTaskCompletionRate(
        tasks,
        employee.id,
        cutoffDate
      );

      const { uniqueDaysPresent, avgHours } = calculateAttendanceMetrics(
        attendanceRecords,
        employee.id,
        cutoffDate
      );

      const eodEntries = countEODEntries(eods, employee.id, cutoffDate);

      // Calculate normalized rates
      const attendanceRate = calculateAttendanceRate(uniqueDaysPresent);
      const activityRate = calculateActivityRate(eodEntries);

      // Calculate overall score
      const score = calculatePerformanceScore(
        taskCompletionRate,
        attendanceRate,
        activityRate
      );

      // Determine status
      const status = getPerformanceStatus(score);

      return {
        employee,
        taskCompletionRate,
        uniqueDaysPresent,
        avgHours,
        eodEntries,
        score,
        status,
      };
    });
  }, [employeeList, tasks, attendanceRecords, eods, daysPeriod]);

  // Sort handler with useCallback to prevent unnecessary re-renders
  const handleSort = useCallback(
    (sortKey) => {
      setSortConfig((prevConfig) => {
        // If clicking the same column, toggle order; otherwise, set new column with DESC
        if (prevConfig.key === sortKey) {
          return {
            key: sortKey,
            order:
              prevConfig.order === SORT_ORDER.DESC
                ? SORT_ORDER.ASC
                : SORT_ORDER.DESC,
          };
        }
        return {
          key: sortKey,
          order: SORT_ORDER.DESC,
        };
      });
    },
    [] // Empty deps array since setSortConfig is stable
  );

  // Sort performance data based on current sort configuration
  const sortedPerformanceData = useMemo(() => {
    if (performanceData.length === 0) {
      return [];
    }

    const sorted = [...performanceData].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'name':
          aValue = a.employee.name.toLowerCase();
          bValue = b.employee.name.toLowerCase();
          break;
        case 'department':
          aValue = a.employee.department.toLowerCase();
          bValue = b.employee.department.toLowerCase();
          break;
        case 'taskCompletion':
          aValue = a.taskCompletionRate;
          bValue = b.taskCompletionRate;
          break;
        case 'daysPresent':
          aValue = a.uniqueDaysPresent;
          bValue = b.uniqueDaysPresent;
          break;
        case 'avgHours':
          aValue = a.avgHours;
          bValue = b.avgHours;
          break;
        case 'eodEntries':
          aValue = a.eodEntries;
          bValue = b.eodEntries;
          break;
        case 'score':
        default:
          aValue = a.score;
          bValue = b.score;
          break;
      }

      // Handle string comparison
      if (typeof aValue === 'string') {
        return sortConfig.order === SORT_ORDER.ASC
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle number comparison
      return sortConfig.order === SORT_ORDER.ASC
        ? aValue - bValue
        : bValue - aValue;
    });

    return sorted;
  }, [performanceData, sortConfig]);

  return (
    <div className="card p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Performance (Last {daysPeriod} days)
        </h2>
        <span className="text-[var(--clr-muted)] text-sm">
          Score = Tasks ({SCORE_WEIGHTS.TASK}) + Attendance ({SCORE_WEIGHTS.ATTENDANCE}) + EOD
          Activity ({SCORE_WEIGHTS.EOD_ACTIVITY})
        </span>
      </div>

      {sortedPerformanceData.length === 0 ? (
        <div className="text-[var(--clr-muted)] text-center py-8">
          No employee data available for assessment.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr>
                <TableHeader
                  label="Employee"
                  sortKey="name"
                  currentSort={sortConfig.key}
                  sortOrder={sortConfig.order}
                  onSort={handleSort}
                />
                <TableHeader
                  label="Department"
                  sortKey="department"
                  currentSort={sortConfig.key}
                  sortOrder={sortConfig.order}
                  onSort={handleSort}
                />
                <TableHeader
                  label="Task Completion %"
                  sortKey="taskCompletion"
                  currentSort={sortConfig.key}
                  sortOrder={sortConfig.order}
                  onSort={handleSort}
                />
                <TableHeader
                  label="Days Present"
                  sortKey="daysPresent"
                  currentSort={sortConfig.key}
                  sortOrder={sortConfig.order}
                  onSort={handleSort}
                />
                <TableHeader
                  label="Avg Hours"
                  sortKey="avgHours"
                  currentSort={sortConfig.key}
                  sortOrder={sortConfig.order}
                  onSort={handleSort}
                />
                <TableHeader
                  label="EOD Entries"
                  sortKey="eodEntries"
                  currentSort={sortConfig.key}
                  sortOrder={sortConfig.order}
                  onSort={handleSort}
                />
                <TableHeader
                  label="Score"
                  sortKey="score"
                  currentSort={sortConfig.key}
                  sortOrder={sortConfig.order}
                  onSort={handleSort}
                />
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedPerformanceData.map((data) => (
                <PerformanceTableRow key={data.employee.id} performanceData={data} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

EmployeeAssessment.displayName = 'EmployeeAssessment';

export default memo(EmployeeAssessment);
