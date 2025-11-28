import React, { useMemo, memo } from 'react';
import { DEPARTMENTS } from '../../utils/constants';

const DepartmentBreakdown = memo(({ employees }) => {
  const counts = useMemo(() => {
    const map = {};
    DEPARTMENTS.forEach(d => {
      map[d] = 0;
    });
    employees.forEach(e => {
      if (e.department && map.hasOwnProperty(e.department)) {
        map[e.department] += 1;
      }
    });
    return map;
  }, [employees]);

  return (
    <div className="card p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Department Breakdown</h2>
      <div className="grid md:grid-cols-3 gap-3">
        {DEPARTMENTS.map(dep => (
          <div
            key={dep}
            className="rounded-lg border border-[var(--clr-border)] p-4 flex items-center justify-between"
          >
            <div className="text-sm font-medium">{dep}</div>
            <div className="text-2xl font-bold">{counts[dep] || 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

DepartmentBreakdown.displayName = 'DepartmentBreakdown';

export default DepartmentBreakdown;

