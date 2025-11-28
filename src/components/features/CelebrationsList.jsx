import React, { useMemo, memo } from 'react';
import { fmtShort, withinDays } from '../../utils/helpers';

const CelebrationsList = memo(({ employees, customCelebrations = [] }) => {
  const upcomingBD = useMemo(
    () =>
      employees.filter(e => {
        if (!e.dob) return false;
        const thisYearBD = new Date(
          new Date().getFullYear(),
          new Date(e.dob).getMonth(),
          new Date(e.dob).getDate()
        ).toISOString();
        return withinDays(thisYearBD, 30);
      }),
    [employees]
  );

  const upcomingDOJ = useMemo(
    () =>
      employees.filter(e => {
        if (!e.doj) return false;
        const thisYearDOJ = new Date(
          new Date().getFullYear(),
          new Date(e.doj).getMonth(),
          new Date(e.doj).getDate()
        ).toISOString();
        return withinDays(thisYearDOJ, 30);
      }),
    [employees]
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Upcoming Birthdays (30 days)</h3>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {upcomingBD.length === 0 && (
            <div className="text-[var(--clr-muted)]">No upcoming birthdays.</div>
          )}
          {upcomingBD.map(e => (
            <div
              key={e.id}
              className="flex items-center justify-between border-b border-[var(--clr-border)] py-2"
            >
              <div>
                <div className="font-semibold">{e.name}</div>
                <div className="text-sm text-[var(--clr-muted)]">
                  {fmtShort(
                    new Date(
                      new Date().getFullYear(),
                      new Date(e.dob).getMonth(),
                      new Date(e.dob).getDate()
                    )
                  )}
                </div>
              </div>
              <div className="text-xs text-[var(--clr-muted)]">{e.department}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Work Anniversaries (30 days)</h3>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {upcomingDOJ.length === 0 && (
            <div className="text-[var(--clr-muted)]">No upcoming anniversaries.</div>
          )}
          {upcomingDOJ.map(e => (
            <div
              key={e.id}
              className="flex items-center justify-between border-b border-[var(--clr-border)] py-2"
            >
              <div>
                <div className="font-semibold">{e.name}</div>
                <div className="text-sm text-[var(--clr-muted)]">
                  {fmtShort(
                    new Date(
                      new Date().getFullYear(),
                      new Date(e.doj).getMonth(),
                      new Date(e.doj).getDate()
                    )
                  )}
                </div>
              </div>
              <div className="text-xs text-[var(--clr-muted)]">{e.department}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="md:col-span-2 card p-6">
        <h3 className="text-xl font-semibold mb-4">Team Celebrations</h3>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {customCelebrations.length === 0 && (
            <div className="text-[var(--clr-muted)]">No custom celebrations yet.</div>
          )}
          {customCelebrations.slice().reverse().map(c => (
            <div
              key={c.id}
              className="flex items-center justify-between border-b border-[var(--clr-border)] py-2"
            >
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-[var(--clr-muted)]">{c.description || "-"}</div>
              </div>
              <div className="text-xs text-[var(--clr-muted)]">{fmtShort(c.date)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

CelebrationsList.displayName = 'CelebrationsList';

export default CelebrationsList;

