import React, { useState, useEffect, useMemo } from "react";
import Login from "./Login";

const todayKey=()=>new Date().toISOString().slice(0,10);
    const fmtDate=(d)=>new Date(d).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
    const fmtShort=(d)=>new Date(d).toLocaleDateString();
    const fmtTime=(d)=>new Date(d).toLocaleTimeString();
    const withinDays=(iso,days)=>{const d=new Date(iso);const now=new Date();const diff=(d-now)/(1000*60*60*24);return diff>=0 && diff<=days};
    const DEPARTMENTS=["Engineering","HR","Marketing","Sales","Finance","Quality Assurance"];
    const ROLES=["admin","sub_admin","hr","employee"];
    const PRIORITIES=["hot","general","cold"];
    const PROJECT_STATUSES=["not_started","in_progress","on_hold","completed"];

    const Bell = ({count,onClick}) => (
      <button className="btn btn-ghost px-3 py-1.5 text-white relative" onClick={onClick} title="Notifications">
        <span className="text-white">Bell</span> {count>0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{count}</span>}
      </button>
    );
    const Topbar = ({right}) => (
      <div className="topbar bg-[#0f1a3a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="brand-dot"></span>
            <span className="font-bold tracking-wide">AttendX</span>
            <span className="text-white/60 hidden sm:inline">  HR   Attendance  Tasks  EOD  Docs Chat</span>
          </div>
          <div className="flex items-center gap-2">{right}</div>
        </div>
      </div>
    );
    const Shell=({title,children,onClose,maxW="max-w-lg"})=>(
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
        <div className={"card w-full "+maxW+" max-h-[90vh] overflow-hidden flex flex-col"}>
          <div className="px-6 py-4 border-b border-[var(--clr-border)] flex items-center justify-between">
            <h2 className="font-semibold">{title}</h2>
            <button className="btn btn-ghost px-3 py-1.5" onClick={onClose}>Close</button>
          </div>
          <div className="p-6 overflow-y-auto">{children}</div>
        </div>
      </div>
    );

    const AddTaskModal=({onClose,onSubmit,employees})=>{
      const [f,setF]=useState({title:"",description:"",assignedTo:employees[0]?.id||"",deadline:"",priority:"general",link:"",file:null});
      const save=()=>{
        if(!f.title||!f.assignedTo||!f.deadline){alert('Fill Title, Assignee, Deadline');return;}
        const payload={...f};
        if(f.file){ payload.attachmentUrl=URL.createObjectURL(f.file); payload.attachmentName=f.file.name; }
        onSubmit(payload);
      };
      return <Shell title="Add Task" onClose={onClose}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2"><label className="text-sm text-[var(--clr-muted)]">Title</label><input className="input mt-1" value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></div>
          <div className="md:col-span-2"><label className="text-sm text-[var(--clr-muted)]">Description</label><textarea className="w-full mt-1" rows="4" value={f.description} onChange={e=>setF({...f,description:e.target.value})}></textarea></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Assign to</label><select className="select mt-1" value={f.assignedTo} onChange={e=>setF({...f,assignedTo:Number(e.target.value)})}>{employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Deadline</label><input type="date" className="input mt-1" value={f.deadline} onChange={e=>setF({...f,deadline:e.target.value})}/></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Priority</label><select className="select mt-1" value={f.priority} onChange={e=>setF({...f,priority:e.target.value})}>{PRIORITIES.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
          <div className="md:col-span-2"><label className="text-sm text-[var(--clr-muted)]">Task Link (optional)</label><input className="input mt-1" value={f.link} onChange={e=>setF({...f,link:e.target.value})} placeholder="https://..."/></div>
          <div className="md:col-span-2"><label className="text-sm text-[var(--clr-muted)]">Attachment (optional)</label><input type="file" className="input mt-1" onChange={e=>setF({...f,file:e.target.files?.[0]||null})}/></div>
        </div>
        <div className="flex gap-3 mt-5"><button className="btn btn-primary px-4 py-2 flex-1" onClick={save}>Create Task</button><button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>Cancel</button></div>
      </Shell>;
    };

    const SetEmpDateForm = ({employees,onSave}) => {
      const [empId,setEmpId]=useState(employees[0]?.id||"");
      const [type,setType]=useState("dob");
      const [date,setDate]=useState(todayKey());
      return (
        <div className="grid gap-3">
          <div>
            <label className="text-sm text-[var(--clr-muted)]">Employee</label>
            <select className="select mt-1" value={empId} onChange={e=>setEmpId(Number(e.target.value))}>
              {employees.map(e=> <option key={e.id} value={e.id}>{e.name} ({e.department})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Type</label>
              <select className="select mt-1" value={type} onChange={e=>setType(e.target.value)}>
                <option value="dob">Birthday</option>
                <option value="doj">Work Anniversary</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Date</label>
              <input type="date" className="input mt-1" value={date} onChange={e=>setDate(e.target.value)}/>
            </div>
          </div>
          <button className="btn btn-primary px-4 py-2" onClick={()=>{ if(!empId||!date) return; onSave({employeeId:Number(empId), type, date}); }}>Save</button>
        </div>
      );
    };

    const AddCelebrationModal = ({onClose,onSubmit}) => {
      const [f,setF]=useState({date: todayKey(), title:"", description:""});
      return <Shell title="Add Celebration" onClose={onClose}>
        <div className="grid gap-4">
          <div><label className="text-sm text-[var(--clr-muted)]">Date</label><input type="date" className="input mt-1" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Title</label><input className="input mt-1" value={f.title} onChange={e=>setF({...f,title:e.target.value})} placeholder="e.g., Team Lunch"/></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Description</label><textarea rows="4" className="w-full mt-1" value={f.description} onChange={e=>setF({...f,description:e.target.value})} placeholder="Optional notes..."></textarea></div>
          <div className="flex gap-3"><button className="btn btn-primary px-4 py-2 flex-1" onClick={()=>{if(!f.date||!f.title) return alert('Add Date and Title'); onSubmit(f);}}>Save</button><button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>Cancel</button></div>
        </div>
      </Shell>;
    };

    const EditTaskModal = ({onClose,onSubmit,task,employees}) => {
      const [f,setF]=useState(task?{title:task.title,description:task.description||"",assignedTo:task.assignedTo,deadline:task.deadline.slice(0,10),priority:task.priority||"general",link:task.link||""}:{title:"",description:"",assignedTo:employees[0]?.id||"",deadline:todayKey(),priority:"general",link:""});
      useEffect(()=>{ if(task){ setF({title:task.title,description:task.description||"",assignedTo:task.assignedTo,deadline:task.deadline.slice(0,10),priority:task.priority||"general",link:task.link||""}); } },[task]);
      const save=()=>{ if(!f.title||!f.assignedTo||!f.deadline){ alert('Fill Title, Assignee, Deadline'); return;} onSubmit({...f}); };
      return <Shell title="Edit Task" onClose={onClose}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2"><label className="text-sm text-[var(--clr-muted)]">Title</label><input className="input mt-1" value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></div>
          <div className="md:col-span-2"><label className="text-sm text-[var(--clr-muted)]">Description</label><textarea className="w-full mt-1" rows="4" value={f.description} onChange={e=>setF({...f,description:e.target.value})}></textarea></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Assign to</label><select className="select mt-1" value={f.assignedTo} onChange={e=>setF({...f,assignedTo:Number(e.target.value)})}>{employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Deadline</label><input type="date" className="input mt-1" value={f.deadline} onChange={e=>setF({...f,deadline:e.target.value})}/></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Priority</label><select className="select mt-1" value={f.priority} onChange={e=>setF({...f,priority:e.target.value})}>{PRIORITIES.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
          <div className="md:col-span-2"><label className="text-sm text-[var(--clr-muted)]">Task Link (optional)</label><input className="input mt-1" value={f.link} onChange={e=>setF({...f,link:e.target.value})} placeholder="https://..."/></div>
        </div>
        <div className="flex gap-3 mt-5"><button className="btn btn-primary px-4 py-2 flex-1" onClick={save}>Save Changes</button><button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>Cancel</button></div>
      </Shell>;
    };

    const AddGoalModal = ({onClose,onSubmit}) => {
      const [text,setText]=useState("");
      const [date,setDate]=useState(todayKey());
      return <Shell title="Add Goal" onClose={onClose}>
        <div className="grid gap-4">
          <div><label className="text-sm text-[var(--clr-muted)]">Date</label><input type="date" className="input mt-1" value={date} onChange={e=>setDate(e.target.value)}/></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Goal</label><textarea rows="4" className="w-full mt-1" value={text} onChange={e=>setText(e.target.value)} placeholder="Today's goal..."></textarea></div>
          <div className="flex gap-3"><button className="btn btn-primary px-4 py-2 flex-1" onClick={()=>{ if(!text.trim()) return; onSubmit({date,text:text.trim()}); }}>Save</button><button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>Cancel</button></div>
        </div>
      </Shell>;
    };

    const AddAchievementModal = ({onClose,onSubmit}) => {
      const [text,setText]=useState("");
      const [date,setDate]=useState(todayKey());
      return <Shell title="Add Achievement" onClose={onClose}>
        <div className="grid gap-4">
          <div><label className="text-sm text-[var(--clr-muted)]">Date</label><input type="date" className="input mt-1" value={date} onChange={e=>setDate(e.target.value)}/></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Achievement</label><textarea rows="4" className="w-full mt-1" value={text} onChange={e=>setText(e.target.value)} placeholder="What did you achieve today?"></textarea></div>
          <div className="flex gap-3"><button className="btn btn-primary px-4 py-2 flex-1" onClick={()=>{ if(!text.trim()) return; onSubmit({date,text:text.trim()}); }}>Save</button><button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>Cancel</button></div>
        </div>
      </Shell>;
    };

    const NotificationsModal = ({list,onClose,markAll,clearAll}) => (
      <Shell title="Notifications" onClose={onClose}>
        <div className="space-y-3">
          {list.length===0 && <div className="text-[var(--clr-muted)]">No notifications.</div>}
          {list.map(n => (
            <div key={n.id} className="rounded-lg border border-[var(--clr-border)] p-3">
              <div className="text-sm">{n.message}</div>
              <div className="text-xs text-[var(--clr-muted)] mt-1">{fmtShort(n.date)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button className="btn btn-ghost px-3 py-1.5" onClick={markAll}>Mark all read</button>
          <button className="btn btn-ghost px-3 py-1.5" onClick={clearAll}>Clear all</button>
        </div>
      </Shell>
    );

    const AddHolidayModal=({onClose,onSubmit})=>{
      const [f,setF]=useState({date:"",name:""});
      return <Shell title="Add Holiday" onClose={onClose} maxW="max-w-md">
        <div className="grid gap-4">
          <div><label className="text-sm text-[var(--clr-muted)]">Date</label><input type="date" className="input mt-1" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Holiday Name</label><input className="input mt-1" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div>
          <div className="flex gap-3"><button className="btn btn-primary px-4 py-2 flex-1" onClick={()=>{if(!f.date||!f.name) return alert('Fill both'); onSubmit(f)}}>Add</button><button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>Cancel</button></div>
        </div>
      </Shell>;
    };

    const AddOfficeModal=({onClose,onSubmit})=>{
      const [name,setName]=useState("");
      return <Shell title="Add Office Location" onClose={onClose} maxW="max-w-md">
        <div className="grid gap-4">
          <div><label className="text-sm text-[var(--clr-muted)]">Office Name</label><input className="input mt-1" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., Noida HQ"/></div>
          <div className="flex gap-3"><button className="btn btn-primary px-4 py-2 flex-1" onClick={()=>{const s=name.trim(); if(!s) return; onSubmit(s)}}>Add</button><button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>Cancel</button></div>
        </div>
      </Shell>;
    };

    const AddJobModal = ({onClose,onSubmit,departments}) => {
      const [f,setF]=useState({title:"",department:departments[0],location:"Remote / Onsite",description:"",applyUrl:""});
      return (
        <Shell title="Add Hiring Alert" onClose={onClose} maxW="max-w-2xl">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm text-[var(--clr-muted)]">Title</label><input className="input mt-1" value={f.title} onChange={e=>setF({...f,title:e.target.value})} placeholder="e.g., Senior Video Editor"/></div>
            <div><label className="text-sm text-[var(--clr-muted)]">Department</label>
              <select className="select mt-1" value={f.department} onChange={e=>setF({...f,department:e.target.value})}>
                {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div><label className="text-sm text-[var(--clr-muted)]">Location</label><input className="input mt-1" value={f.location} onChange={e=>setF({...f,location:e.target.value})} placeholder="Noida / Remote"/></div>
            <div className="md:col-span-2"><label className="text-sm text-[var(--clr-muted)]">Description</label><textarea rows="4" className="w-full mt-1" value={f.description} onChange={e=>setF({...f,description:e.target.value})} placeholder="Short JD / expectations..."></textarea></div>
            <div className="md:col-span-2"><label className="text-sm text-[var(--clr-muted)]">Apply URL</label><input className="input mt-1" value={f.applyUrl} onChange={e=>setF({...f,applyUrl:e.target.value})} placeholder="https://forms.gle/..."/></div>
          </div>
          <div className="mt-4 flex gap-3"><button className="btn btn-primary px-4 py-2" onClick={()=>{if(!f.title||!f.applyUrl) return alert("Add Title and Apply URL"); onSubmit(f)}}>Publish</button><button className="btn btn-ghost px-4 py-2" onClick={onClose}>Cancel</button></div>
        </Shell>
      );
    };

    const AddProjectModal = ({onClose,onSubmit}) => {
      const [f,setF]=useState({name:"",quantity:"",deadline:todayKey(),status:"not_started",link:"",file:null});

      const save = () => {
        if (!f.name || !f.deadline) {
          alert('Fill Project Name and Deadline');
          return;
        }
        const payload = {
          name: f.name,
          quantity: f.quantity,
          deadline: f.deadline,
          status: f.status,
          link: f.link,
        };
        if (f.file) {
          payload.attachmentUrl = URL.createObjectURL(f.file);
          payload.attachmentName = f.file.name;
        }
        onSubmit(payload);
      };

      return (
        <Shell title="Add Project" onClose={onClose} maxW="max-w-lg">
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Project Name</label>
              <input
                className="input mt-1"
                value={f.name}
                onChange={e=>setF({...f,name:e.target.value})}
                placeholder="e.g., CEO's Wife Series"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Total Episodes / Quantity</label>
              <input
                className="input mt-1"
                value={f.quantity}
                onChange={e=>setF({...f,quantity:e.target.value})}
                placeholder="e.g., 60 Episodes"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Project Deadline</label>
              <input
                type="date"
                className="input mt-1"
                value={f.deadline}
                onChange={e=>setF({...f,deadline:e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Current Status</label>
              <select
                className="select mt-1"
                value={f.status}
                onChange={e=>setF({...f,status:e.target.value})}
              >
                {PROJECT_STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace("_"," ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Project Link (optional)</label>
              <input
                className="input mt-1"
                value={f.link}
                onChange={e=>setF({...f,link:e.target.value})}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Attachment (optional)</label>
              <input
                type="file"
                className="input mt-1"
                onChange={e=>setF({...f,file:e.target.files?.[0]||null})}
              />
            </div>
            <div className="flex gap-3 mt-2">
              <button
                className="btn btn-primary px-4 py-2 flex-1"
                onClick={save}
              >
                Save Project
              </button>
              <button
                className="btn btn-ghost px-4 py-2 flex-1"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </Shell>
      );
    };

    const AddEmployeeModal = ({onClose, onSubmit, offices}) => {
      const [f,setF]=useState({
        name:"",
        email:"",
        role:"employee",
        office:offices[0]||"Headquarters",
        department:DEPARTMENTS[0],
        password:"emp123"
      });

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!f.name || !f.email) {
          alert('Please fill in all required fields');
          return;
        }
        onSubmit(f);
      };

      return (
        <Shell title="Add Employee" onClose={onClose} maxW="max-w-lg">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Full Name *</label>
              <input 
                className="input mt-1 w-full" 
                value={f.name} 
                onChange={e => setF({...f, name: e.target.value})} 
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Email *</label>
              <input 
                type="email" 
                className="input mt-1 w-full" 
                value={f.email} 
                onChange={e => setF({...f, email: e.target.value})} 
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Role</label>
              <select 
                className="select mt-1 w-full" 
                value={f.role} 
                onChange={e => setF({...f, role: e.target.value})}
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Department</label>
              <select 
                className="select mt-1 w-full" 
                value={f.department} 
                onChange={e => setF({...f, department: e.target.value})}
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Office</label>
              <select 
                className="select mt-1 w-full" 
                value={f.office} 
                onChange={e => setF({...f, office: e.target.value})}
              >
                {offices.map(office => (
                  <option key={office} value={office}>{office}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-[var(--clr-muted)]">Temporary Password</label>
              <input 
                type="password" 
                className="input mt-1 w-full" 
                value={f.password} 
                onChange={e => setF({...f, password: e.target.value})} 
                placeholder="Enter password"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" className="btn btn-primary px-4 py-2 flex-1">
                Add Employee
              </button>
              <button type="button" className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </Shell>
      );
    };

    const CelebrationsList = ({employees,customCelebrations=[]}) => {
      const upcomingBD=useMemo(()=>employees.filter(e=>e.dob && withinDays(new Date(new Date().getFullYear(), new Date(e.dob).getMonth(), new Date(e.dob).getDate()).toISOString(),30)),[employees]);
      const upcomingDOJ=useMemo(()=>employees.filter(e=>e.doj && withinDays(new Date(new Date().getFullYear(), new Date(e.doj).getMonth(), new Date(e.doj).getDate()).toISOString(),30)),[employees]);
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">Upcoming Birthdays (30 days)</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {upcomingBD.length===0 && <div className="text-[var(--clr-muted)]">No upcoming birthdays.</div>}
              {upcomingBD.map(e=> (
                <div key={e.id} className="flex items-center justify-between border-b border-[var(--clr-border)] py-2">
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-sm text-[var(--clr-muted)]">{fmtShort(new Date(new Date().getFullYear(), new Date(e.dob).getMonth(), new Date(e.dob).getDate()))}</div>
                  </div>
                  <div className="text-xs text-[var(--clr-muted)]">{e.department}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">Work Anniversaries (30 days)</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {upcomingDOJ.length===0 && <div className="text-[var(--clr-muted)]">No upcoming anniversaries.</div>}
              {upcomingDOJ.map(e=> (
                <div key={e.id} className="flex items-center justify-between border-b border-[var(--clr-border)] py-2">
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-sm text-[var(--clr-muted)]">{fmtShort(new Date(new Date().getFullYear(), new Date(e.doj).getMonth(), new Date(e.doj).getDate()))}</div>
                  </div>
                  <div className="text-xs text-[var(--clr-muted)]">{e.department}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 card p-6">
            <h3 className="text-xl font-semibold mb-4">Team Celebrations</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {customCelebrations.length===0 && <div className="text-[var(--clr-muted)]">No custom celebrations yet.</div>}
              {customCelebrations.slice().reverse().map(c=> (
                <div key={c.id} className="flex items-center justify-between border-b border-[var(--clr-border)] py-2">
                  <div>
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-sm text-[var(--clr-muted)]">{c.description||"-"}</div>
                  </div>
                  <div className="text-xs text-[var(--clr-muted)]">{fmtShort(c.date)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const TopActionsAttendance = ({currentTime,todayStatus,onCheckIn,onCheckOut}) => (
      <div className="card p-6 md:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-3xl font-bold text-[var(--clr-navy)]">{currentTime.toLocaleTimeString()}</div>
            <p className="text-[var(--clr-muted)]">{fmtDate(currentTime)}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button className="btn btn-primary px-4 py-2" onClick={onCheckIn} disabled={!!(todayStatus && !todayStatus.checkOut)}>Check In</button>
            <button className="btn btn-danger px-4 py-2" onClick={onCheckOut} disabled={!todayStatus || !!todayStatus.checkOut}>Check Out</button>
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-[var(--clr-border)]">
            <p className="text-[var(--clr-muted)] text-sm">Check In</p>
            <p className="font-semibold">{todayStatus ? fmtTime(todayStatus.checkIn) : "-"}</p>
          </div>
          <div className="p-4 rounded-lg border border-[var(--clr-border)]">
            <p className="text-[var(--clr-muted)] text-sm">Check Out</p>
            <p className="font-semibold">{todayStatus && todayStatus.checkOut ? fmtTime(todayStatus.checkOut) : (todayStatus ? "Active" : "-")}</p>
          </div>
          <div className="p-4 rounded-lg border border-[var(--clr-border)]">
            <p className="text-[var(--clr-muted)] text-sm">Hours</p>
            <p className="font-semibold">{todayStatus ? Number(todayStatus.hours||0).toFixed(2) : "0.00"} hrs</p>
          </div>
        </div>
      </div>
    );

    const EmployeeView=({currentUser,currentTime,attendanceRecords,leaveRequests,tasks,announcements,holidays,eods,documents,leaveBalance,onCheckIn,onCheckOut,onOpenLeaveModal,onUpdateTaskStatus,onAddEOD,onLogout,onCancelLeave,notifications,openNotifs,openChat,goals,achievements,onOpenGoal,onOpenAch,jobs})=>{
      const todayStatus=useMemo(()=>attendanceRecords.find(r=>r.employeeId===currentUser.id&&r.dateKey===todayKey())||null,[attendanceRecords,currentUser]);
      const myAttendance=useMemo(()=>attendanceRecords.filter(r=>r.employeeId===currentUser.id),[attendanceRecords,currentUser]);
      const myTasks=useMemo(()=>tasks.filter(t=>t.assignedTo===currentUser.id),[tasks,currentUser]);
      const myLeaves=useMemo(()=>leaveRequests.filter(l=>l.employeeId===currentUser.id).slice().reverse(),[leaveRequests,currentUser]);
      const myEODToday=useMemo(()=>eods.filter(e=>e.employeeId===currentUser.id && e.dateKey===todayKey()),[eods,currentUser]);
      const myDocs=useMemo(()=>documents.filter(d=>d.employeeId===currentUser.id && d.shared),[documents,currentUser]);
      const unreadCount=notifications.filter(n=>!n.read && n.userId===currentUser.id).length;
      const prioBadge = (p)=> p==="hot"?"prio-hot":p==="cold"?"prio-cold":"prio-general";
      const openJobs = useMemo(()=>jobs.filter(j=>j.active!==false).slice().reverse(),[jobs]);
      const myGoalsToday = useMemo(()=>goals.filter(g=>g.userId===currentUser.id && g.date===todayKey()),[goals,currentUser]);
      const myAchToday = useMemo(()=>achievements.filter(a=>a.userId===currentUser.id && a.date===todayKey()),[achievements,currentUser]);

      return <>
        <Topbar right={<>
          <button className="btn btn-ghost px-3 py-1.5 border border-white/40 hover:bg-white/10" onClick={openChat}><span className="text-white">Chat</span></button>
          <span className="inline-flex"><Bell count={unreadCount} onClick={openNotifs}/></span>
          <button onClick={onLogout} className="btn btn-ghost px-3 py-1.5 border border-white/40 hover:bg-white/10"><span className="text-white">Logout</span></button>
        </>}/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Hi, {currentUser.name}</h1>
            <p className="text-[var(--clr-muted)]">{currentUser.office} - {currentUser.department}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <TopActionsAttendance currentTime={currentTime} todayStatus={todayStatus} onCheckIn={onCheckIn} onCheckOut={onCheckOut}/>
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-3">Leave Balance</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-[var(--clr-border)] p-4 text-center"><div className="text-xs text-[var(--clr-muted)]">Sick</div><div className="text-2xl font-bold">{leaveBalance.sick}</div></div>
                <div className="rounded-lg border border-[var(--clr-border)] p-4 text-center"><div className="text-xs text-[var(--clr-muted)]">Casual</div><div className="text-2xl font-bold">{leaveBalance.casual}</div></div>
                <div className="rounded-lg border border-[var(--clr-border)] p-4 text-center"><div className="text-xs text-[var(--clr-muted)]">Emergency</div><div className="text-2xl font-bold">{leaveBalance.emergency}</div></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="card p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-3"><h2 className="text-xl font-semibold">My Tasks</h2></div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {myTasks.length===0 && <div className="text-[var(--clr-muted)]">No tasks yet.</div>}
                {myTasks.map(t=> (
                  <div key={t.id} className="rounded-lg border border-[var(--clr-border)] p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{t.title}</div>
                      <div className={"badge "+(t.status==="done"?"bdg-done":t.status==="in_progress"?"bdg-progress":"bdg-todo")}>{t.status.replace("_"," ")}</div>
                    </div>
                    <div className="text-xs mt-1"><span className={"badge "+prioBadge(t.priority)}>{t.priority}</span></div>
                    {t.description && <div className="text-[var(--clr-muted)] text-sm mt-1">{t.description}</div>}
                    {t.link && <div className="text-sm mt-1"><a className="link" href={t.link} target="_blank">Open task link</a></div>}
                    {t.attachmentUrl && <div className="text-sm mt-1"><a className="link" href={t.attachmentUrl} download={t.attachmentName||'attachment'}>Download attachment</a></div>}
                    <div className="text-[var(--clr-muted)] text-sm mt-2">Deadline: {fmtShort(t.deadline)}</div>
                    <div className="mt-2">
                      <select className="select w-auto" value={t.status} onChange={e=>onUpdateTaskStatus(t.id,e.target.value)}>
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
                  <button className="btn btn-ghost px-3 py-2" onClick={onAddEOD}>Add Entry</button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {myEODToday.length===0 && <div className="text-[var(--clr-muted)]">No EOD entries yet.</div>}
                  {myEODToday.map(eo=> (
                    <div key={eo.id} className="rounded-lg border border-[var(--clr-border)] p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{eo.project} {eo.task?"- "+eo.task:""}</div>
                        <div className="text-sm text-[var(--clr-muted)]">{eo.hours.toFixed(2)}h</div>
                      </div>
                      {eo.notes && <div className="text-[var(--clr-muted)] text-sm mt-1">{eo.notes}</div>}
                      <div className="text-xs text-[var(--clr-muted)] mt-1">{fmtShort(eo.dateKey)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">My Leave Requests</h2>
                  <button className="btn btn-ghost px-3 py-2" onClick={onOpenLeaveModal}>Request Leave</button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {myLeaves.length===0 && <div className="text-[var(--clr-muted)]">No leave history.</div>}
                  {myLeaves.map(l=> (
                    <div key={l.id} className="rounded-lg border border-[var(--clr-border)] p-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{fmtShort(l.date)} - {l.type}</div>
                        <div className="text-xs text-[var(--clr-muted)]">{l.reason||"-"}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={"badge "+(l.status==="approved"?"bdg-done":l.status==="rejected"?"bdg-todo":"bdg-progress")}>{l.status}</div>
                        {l.status==="pending" && <button className="btn btn-ghost px-3 py-1.5" onClick={()=>onCancelLeave(l.id)}>Cancel</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">Today's Goals</h2>
                  <button className="btn btn-ghost px-3 py-2" onClick={onOpenGoal}>Add Goal</button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {myGoalsToday.length===0 && <div className="text-[var(--clr-muted)]">No goals added.</div>}
                  {myGoalsToday.map(g=> (<div key={g.id} className="rounded-lg border border-[var(--clr-border)] p-3 text-sm">{g.text}</div>))}
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">Today's Achievements</h2>
                  <button className="btn btn-ghost px-3 py-2" onClick={onOpenAch}>Add Achievement</button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {myAchToday.length===0 && <div className="text-[var(--clr-muted)]">No achievements added.</div>}
                  {myAchToday.map(a=> (<div key={a.id} className="rounded-lg border border-[var(--clr-border)] p-3 text-sm">{a.text}</div>))}
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">Hiring Alerts</h2>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {openJobs.length===0 && <div className="text-[var(--clr-muted)]">No openings yet.</div>}
                  {openJobs.map(j=> (
                    <div key={j.id} className="rounded-lg border border-[var(--clr-border)] p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{j.title} <span className="chip ml-2">{j.department}</span></div>
                        <button className="btn btn-ghost px-3 py-1.5" onClick={()=>{navigator.clipboard?.writeText(j.applyUrl)}}>Copy Link</button>
                      </div>
                      <div className="text-xs text-[var(--clr-muted)]">{j.location} - {fmtShort(j.date)}</div>
                      {j.description && <div className="text-sm mt-1">{j.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card p-6 md:col-span-3">
              <h2 className="text-xl font-semibold mb-3">My Attendance</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                {myAttendance.slice(-12).reverse().map(r=> (
                  <div key={r.id} className="rounded-lg border border-[var(--clr-border)] p-4">
                    <div className="flex items-center justify-between"><span className="font-semibold">{r.dateLabel}</span><span className="text-[var(--clr-primary)] font-bold">{Number(r.hours||0).toFixed(2)} hrs</span></div>
                    <div className="text-[var(--clr-muted)] text-sm">{fmtTime(r.checkIn)} - {r.checkOut?fmtTime(r.checkOut):"Active"}</div>
                  </div>
                ))}
                {myAttendance.length===0 && <div className="text-[var(--clr-muted)]">No records yet.</div>}
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
      </>;
    };

    const DepartmentBreakdown = ({employees}) => {
      const counts = useMemo(() => {
        const map = {};
        DEPARTMENTS.forEach(d => { map[d] = 0; });
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
              <div key={dep} className="rounded-lg border border-[var(--clr-border)] p-4 flex items-center justify-between">
                <div className="text-sm font-medium">{dep}</div>
                <div className="text-2xl font-bold">{counts[dep] || 0}</div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const AdminView=({currentUser,employees,attendanceRecords,leaveRequests,offices,tasks,announcements,holidays,eods,documents,onOpenAddEmpModal,onOpenAddTaskModal,onOpenAddAnnouncementModal,onOpenAddHolidayModal,onOpenAddOfficeModal,onOpenAddDocModal,onLogout,onLeaveApproval,onUpdateTaskStatus,onChangeEmployeeOffice,onChangeEmployeeRole,onChangeReportingManager,onToggleEmployeeActive,onResetPassword,adminTab,setAdminTab,notifications,openNotifs,onToggleShareDoc,onDeleteDoc,openChat,jobs,onAddJob,onToggleJob,onDeleteJob,currentTime,onCheckIn,onCheckOut,onEditTask,onDeleteTask,celebrations,onOpenAddCelebration,onOpenLeaveModal,goals,achievements,onOpenGoal,onOpenAch,onSetEmpDate,onWish,onCancelLeave,onAddEOD,projects,onAddProject,onUpdateProject})=>{
      const isAdmin = currentUser.role==="admin";
      const isHR = currentUser.role==="hr";
      const isSub = currentUser.role==="sub_admin";

      const employeesOnly=useMemo(()=>employees.filter(e=>e.role==="employee"),[employees]);
      const myReports = useMemo(()=>employees.filter(e=>e.reportingManagerId===currentUser.id && e.role==="employee"),[employees,currentUser]);
      const presentTodayAll=useMemo(()=>attendanceRecords.filter(r=>r.dateKey===todayKey()),[attendanceRecords]);
      const presentTodayView = useMemo(()=> isSub ? presentTodayAll.filter(r=> myReports.some(m=>m.id===r.employeeId)) : presentTodayAll, [presentTodayAll,isSub,myReports]);

      const [selectedOffice,setSelectedOffice]=useState("all");
      const [selectedDept,setSelectedDept]=useState("all");
      const filteredEmployees=useMemo(()=> (isSub ? myReports : employees).filter(e=> (selectedOffice==="all"||e.office===selectedOffice) && (selectedDept==="all"||e.department===selectedDept) ),[employees,myReports,selectedOffice,selectedDept,isSub]);
      const filteredAttendance=useMemo(()=>{
        const base = isSub ? attendanceRecords.filter(r=> myReports.some(m=>m.id===r.employeeId)) : attendanceRecords;
        return selectedOffice==="all" ? base : base.filter(r=>{const emp=employees.find(e=>e.id===r.employeeId);return emp&&emp.office===selectedOffice;});
      },[attendanceRecords,employees,selectedOffice,isSub,myReports]);

      const unreadCount=notifications.filter(n=>!n.read && n.userId===currentUser.id).length;
      const prWeight = (p)=> p==="hot"?0 : p==="general"?1 : 2;
      const sortedTasks = useMemo(()=> {
        const base = isSub ? tasks.filter(t=> myReports.some(m=>m.id===t.assignedTo)) : tasks;
        return base.slice().sort((a,b)=> prWeight(a.priority)-prWeight(b.priority));
      },[tasks,isSub,myReports]);
      const myOwnTasks = useMemo(()=> tasks.filter(t=>t.assignedTo===currentUser.id),[tasks,currentUser]);

      const onlyAdmin = isAdmin;
      const canPostJobs = isAdmin || isHR;
      const canUploadDocs = isAdmin || isHR;

      const Tab=({id,label})=>(<button onClick={()=>setAdminTab(id)} className={"px-4 py-2 rounded-lg border "+(adminTab===id?"bg-[var(--clr-hover)] border-[var(--ring)] text-[#0B4680]":"bg-white hover:bg-[#F9FAFB]")}>{label}</button>);

      const [eodDate,setEodDate]=useState(todayKey());
      const [attMonth,setAttMonth]=useState(()=> new Date().toISOString().slice(0,7));
      const eodForDateMemo=useMemo(()=> eods.filter(e=>e.dateKey===eodDate).map(e=> ({...e,employeeName:(employees.find(x=>x.id===e.employeeId)?.name)||"-"}) ),[eods,eodDate,employees]);
      const eodForDate = useMemo(()=> isSub ? eodForDateMemo.filter(e=> myReports.some(m=>m.id===e.employeeId)) : eodForDateMemo, [eodForDateMemo,isSub,myReports]);

      const performancePool = useMemo(()=> isSub ? myReports : employeesOnly, [isSub,myReports,employeesOnly]);

      const todayStatus=useMemo(()=>attendanceRecords.find(r=>r.employeeId===currentUser.id&&r.dateKey===todayKey())||null,[attendanceRecords,currentUser]);

      const totalUsersLabel = isSub ? "My Reports" : "Total Users";
      const totalUsersCount = isSub ? myReports.length : employees.length;
      const openTasksCount = isSub ? sortedTasks.length : tasks.length;

      return <>
        <Topbar right={<>
          <button className="btn btn-ghost px-3 py-1.5 border border-white/40 hover:bg-white/10" onClick={openChat}><span className="text-white">Chat</span></button>
          <span className="inline-flex"><Bell count={unreadCount} onClick={openNotifs}/></span>
          <button onClick={onLogout} className="btn btn-ghost px-3 py-1.5 border border-white/40 hover:bg-white/10"><span className="text-white">Logout</span></button>
        </>}/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Hi, {currentUser.name}</h1>
            <p className="text-[var(--clr-muted)]">{currentUser.office} - {currentUser.department}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Tab id="overview" label="Overview"/>
            { (isAdmin || isHR) && <Tab id="departments" label="Departments"/> }
            { (isAdmin || isHR) && <Tab id="employees" label="Employees"/> }
            <Tab id="presentToday" label="Present Today"/>
            <Tab id="leaves" label="Leaves"/>
            <Tab id="tasks" label="Tasks"/>
            <Tab id="eod" label="EOD"/>
            <Tab id="performance" label="Performance"/>
            <Tab id="celebrations" label="Celebrations"/>
            { (isAdmin || isHR) && <Tab id="projects" label="Project Tracking"/> }
            { (isAdmin || isHR) && <Tab id="documents" label="Documents"/> }
            <Tab id="announcements" label="Announcements"/>
            <Tab id="holidays" label="Holidays"/>
            { (isAdmin || isHR) && <Tab id="offices" label="Offices"/> }
            <Tab id="hiring" label="Hiring"/>
            {onlyAdmin && <Tab id="access" label="Access (Admin)"/>}
          </div>

          {adminTab==="overview" && <>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <TopActionsAttendance currentTime={currentTime} todayStatus={todayStatus} onCheckIn={onCheckIn} onCheckOut={onCheckOut}/>
              <div className="card p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="kpi p-5 card">
                    <div className="text-[var(--clr-muted)] text-sm">{totalUsersLabel}</div>
                    <div className="text-3xl font-bold">{totalUsersCount}</div>
                  </div>
                  <div className="kpi p-5 card">
                    <div className="text-[var(--clr-muted)] text-sm">Present Today</div>
                    <div className="text-3xl font-bold text-[var(--clr-positive)]">{presentTodayView.length}</div>
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
              {(isHR || isSub) && <div className="card p-6">
                <div className="flex items-center justify-between mb-3"><h2 className="text-xl font-semibold">My Leave Balance</h2><button className="btn btn-ghost px-3 py-2" onClick={onOpenLeaveModal}>Request Leave</button></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-[var(--clr-border)] p-4 text-center"><div className="text-xs text-[var(--clr-muted)]">Sick</div><div className="text-2xl font-bold">{(employees.find(e=>e.id===currentUser.id)?.leaveBalance?.sick)||0}</div></div>
                  <div className="rounded-lg border border-[var(--clr-border)] p-4 text-center"><div className="text-xs text-[var(--clr-muted)]">Casual</div><div className="text-2xl font-bold">{(employees.find(e=>e.id===currentUser.id)?.leaveBalance?.casual)||0}</div></div>
                  <div className="rounded-lg border border-[var(--clr-border)] p-4 text-center"><div className="text-xs text-[var(--clr-muted)]">Emergency</div><div className="text-2xl font-bold">{(employees.find(e=>e.id===currentUser.id)?.leaveBalance?.emergency)||0}</div></div>
                </div>
              </div>}
              {(isHR || isSub) && <div className="card p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">My Leave Requests</h2>
                  <button className="btn btn-ghost px-3 py-2" onClick={onOpenLeaveModal}>Request Leave</button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {leaveRequests.filter(l=>l.employeeId===currentUser.id).slice().reverse().map(l=> (
                    <div key={l.id} className="rounded-lg border border-[var(--clr-border)] p-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{fmtShort(l.date)} - {l.type}</div>
                        <div className="text-xs text-[var(--clr-muted)]">{l.reason||"-"}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={"badge "+(l.status==="approved"?"bdg-done":l.status==="rejected"?"bdg-todo":"bdg-progress")}>{l.status}</div>
                        {l.status==="pending" && <button className="btn btn-ghost px-3 py-1.5" onClick={()=>onCancelLeave(l.id)}>Cancel</button>}
                      </div>
                    </div>
                  ))}
                  {leaveRequests.filter(l=>l.employeeId===currentUser.id).length===0 && <div className="text-[var(--clr-muted)]">No leave history.</div>}
                </div>
              </div>}
              <div className="card p-6 mb-6">
                <div className="flex items-center justify-between mb-3"><h2 className="text-xl font-semibold">My Tasks</h2></div>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {myOwnTasks.length===0 && <div className="text-[var(--clr-muted)]">No tasks assigned to you.</div>}
                  {myOwnTasks.slice().reverse().map(t=> (
                    <div key={t.id} className="rounded-lg border border-[var(--clr-border)] p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{t.title}</div>
                        <div className={"badge "+(t.status==="done"?"bdg-done":t.status==="in_progress"?"bdg-progress":"bdg-todo")}>{t.status.replace("_"," ")}</div>
                      </div>
                      <div className="text-xs mt-1"><span className={"badge "+(t.priority==="hot"?"prio-hot":t.priority==="cold"?"prio-cold":"prio-general")}>{t.priority}</span></div>
                      <div className="text-[var(--clr-muted)] text-sm mt-1">Deadline: {fmtShort(t.deadline)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {(isHR || isSub) && <div className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">EOD Timesheet (Today)</h2>
                  <button className="btn btn-ghost px-3 py-2" onClick={onOpenLeaveModal /* placeholder, actual EOD open below */} style={{display:'none'}}>Hidden</button>
                  <button className="btn btn-ghost px-3 py-2" onClick={()=>setAdminTab('eod')}>View All</button>
                  <button className="btn btn-ghost px-3 py-2" onClick={onAddEOD}>Add Entry</button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {attendanceRecords && eods.filter(e=>e.employeeId===currentUser.id && e.dateKey===todayKey()).map(eo=> (
                    <div key={eo.id} className="rounded-lg border border-[var(--clr-border)] p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{eo.project} {eo.task?"- "+eo.task:""}</div>
                        <div className="text-sm text-[var(--clr-muted)]">{eo.hours.toFixed(2)}h</div>
                      </div>
                      {eo.notes && <div className="text-[var(--clr-muted)] text-sm mt-1">{eo.notes}</div>}
                      <div className="text-xs text-[var(--clr-muted)] mt-1">{fmtShort(eo.dateKey)}</div>
                    </div>
                  ))}
                  {eods.filter(e=>e.employeeId===currentUser.id && e.dateKey===todayKey()).length===0 && <div className="text-[var(--clr-muted)]">No EOD entries yet.</div>}
                </div>
              </div>}

              {(isHR || isSub) && <div className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">Today's Goals</h2>
                  <button className="btn btn-ghost px-3 py-2" onClick={onOpenGoal}>Add Goal</button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {goals.filter(g=>g.userId===currentUser.id && g.date===todayKey()).length===0 && <div className="text-[var(--clr-muted)]">No goals added.</div>}
                  {goals.filter(g=>g.userId===currentUser.id && g.date===todayKey()).map(g=> (<div key={g.id} className="rounded-lg border border-[var(--clr-border)] p-3 text-sm">{g.text}</div>))}
                </div>
              </div>}

              {(isHR || isSub) && <div className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">Today's Achievements</h2>
                  <button className="btn btn-ghost px-3 py-2" onClick={onOpenAch}>Add Achievement</button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {achievements.filter(a=>a.userId===currentUser.id && a.date===todayKey()).length===0 && <div className="text-[var(--clr-muted)]">No achievements added.</div>}
                  {achievements.filter(a=>a.userId===currentUser.id && a.date===todayKey()).map(a=> (<div key={a.id} className="rounded-lg border border-[var(--clr-border)] p-3 text-sm">{a.text}</div>))}
                </div>
              </div>}
            </div>

            { (isAdmin || isHR) && <DepartmentBreakdown employees={employees}/> }

            <div className="card p-6 mb-6 overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Attendance Records</h2>
                <div className="flex gap-2 items-center">
                  <select className="select w-auto" value={selectedOffice} onChange={e=>setSelectedOffice(e.target.value)}>
                    <option value="all">All Offices</option>
                    {offices.map(o=> <option key={o} value={o}>{o}</option>)}
                  </select>
                  <input type="month" className="select w-auto" value={attMonth} onChange={e=>setAttMonth(e.target.value)} />
                  <button className="btn btn-ghost px-3 py-1.5" onClick={()=>{
                    const rows = filteredAttendance.filter(r=> r.dateKey && r.dateKey.startsWith(attMonth)).map(r=>{
                      const emp=employees.find(e=>e.id===r.employeeId);
                      return {
                        Employee: r.employeeName,
                        Office: emp?.office||"",
                        Date: r.dateLabel,
                        CheckIn: fmtTime(r.checkIn),
                        CheckOut: r.checkOut?fmtTime(r.checkOut):"",
                        Hours: Number(r.hours||0).toFixed(2),
                        Location: r.location||""
                      };
                    });
                    const header=["Employee","Office","Date","CheckIn","CheckOut","Hours","Location"]; 
                    const csv=[header.join(","), ...rows.map(o=> header.map(h=>`"${String(o[h]).replaceAll('"','""')}"`).join(","))].join("\n");
                    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
                    const url=URL.createObjectURL(blob);
                    const a=document.createElement('a');
                    a.href=url; a.download=`attendance_${attMonth}.csv`; a.click(); URL.revokeObjectURL(url);
                  }}>Download CSV</button>
                </div>
              </div>
              <table className="w-full min-w-[720px]">
                <thead><tr><th>Employee</th><th>Office</th><th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Location</th></tr></thead>
                <tbody>
                  {filteredAttendance.slice(-20).reverse().map(rec=>{
                    const emp=employees.find(e=>e.id===rec.employeeId);
                    return <tr key={rec.id} className="border-t border-[var(--clr-border)]">
                      <td>{rec.employeeName}</td>
                      <td className="text-[var(--clr-muted)]">{emp?.office}</td>
                      <td className="text-[var(--clr-muted)]">{rec.dateLabel}</td>
                      <td>{fmtTime(rec.checkIn)}</td>
                      <td>{rec.checkOut?fmtTime(rec.checkOut):"Active"}</td>
                      <td className="text-[var(--clr-primary)] font-semibold">{Number(rec.hours||0).toFixed(2)} hrs</td>
                      <td className="text-[var(--clr-muted)] text-sm">{rec.location}</td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
          </>}

          {adminTab==="departments" && (isAdmin || isHR) && <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Department Breakdown</h2>
              <div className="flex gap-2">
                <select className="select w-auto" value={selectedDept} onChange={e=>setSelectedDept(e.target.value)}>
                  <option value="all">All Departments</option>
                  {DEPARTMENTS.map(d=> <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="select w-auto" value={selectedOffice} onChange={e=>setSelectedOffice(e.target.value)}>
                  <option value="all">All Offices</option>
                  {offices.map(o=> <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Office</th><th>Role</th><th>Reporting Manager</th></tr></thead>
                <tbody>
                  {filteredEmployees.map(emp=> {
                    const managers = employees.filter(x=>["admin","sub_admin","hr"].includes(x.role));
                    return (
                      <tr key={emp.id} className="border-t border-[var(--clr-border)]">
                        <td>{emp.name}</td>
                        <td className="text-[var(--clr-muted)]">{emp.email}</td>
                        <td className="text-[var(--clr-muted)]">{emp.department}</td>
                        <td className="text-[var(--clr-muted)]">{emp.office}</td>
                        <td className="text-[var(--clr-muted)]">{emp.role}</td>
                        <td>
                          {emp.role!=="admin" ? (
                            <select className="select w-auto" value={emp.reportingManagerId||""} onChange={e=>onChangeReportingManager(emp.id, Number(e.target.value)||null)}>
                              {managers.map(m=> <option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
                            </select>
                          ) : <span className="text-[var(--clr-muted)]">-</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>}

          {adminTab==="employees" && (isAdmin || isHR) && <div className="card p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Users / Employees</h2><button className="btn btn-primary px-3 py-2" onClick={onOpenAddEmpModal}>Add</button></div>
            <table className="w-full min-w-[900px]">
              <thead><tr><th>Name</th><th>Email</th><th>Office</th><th>Department</th><th>Role</th><th>Reporting Manager</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {employees.map(emp=> {
                  const managers = employees.filter(x=>["admin","sub_admin","hr"].includes(x.role));
                  return (
                  <tr key={emp.id} className="border-t border-[var(--clr-border)]">
                    <td>{emp.name}</td>
                    <td className="text-[var(--clr-muted)]">{emp.email}</td>
                    <td>
                      <select className="select w-auto" value={emp.office} onChange={e=>onChangeEmployeeOffice(emp.id,e.target.value)}>
                        {offices.map(o=> <option key={o} value={o}>{o}</option>)}
                      </select>
                    </td>
                    <td><span className="text-[var(--clr-muted)]">{emp.department}</span></td>
                    <td>
                      <select className="select w-auto" value={emp.role} onChange={e=>onChangeEmployeeRole(emp.id,e.target.value)}>
                        {ROLES.map(r=> <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td>
                      {emp.role!=="admin" ? (
                        <select className="select w-auto" value={emp.reportingManagerId||""} onChange={e=>onChangeReportingManager(emp.id, Number(e.target.value)||null)}>
                          {managers.map(m=> <option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
                        </select>
                      ) : <span className="text-[var(--clr-muted)]">-</span>}
                    </td>
                    <td className="text-[var(--clr-muted)]">{emp.active===false?"Inactive":"Active"}</td>
                    <td className="flex gap-2">
                      <button className="btn btn-ghost px-3 py-1.5" onClick={()=>onToggleEmployeeActive(emp.id)}>{emp.active===false?"Activate":"Deactivate"}</button>
                      <button className="btn btn-ghost px-3 py-1.5" onClick={()=>onResetPassword(emp.id)}>Reset Password</button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>}

          {adminTab==="projects" && (isAdmin || isHR) && <div className="card p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Project Tracking</h2>
              <button className="btn btn-primary px-3 py-2" onClick={onAddProject}>Add Project</button>
            </div>
            <table className="w-full min-w-[720px]">
              <thead><tr><th>Project Name</th><th>Total Episodes / Quantity</th><th>Deadline</th><th>Status</th><th>Link</th><th>Attachment</th></tr></thead>
              <tbody>
                {projects.map(p=> (
                  <tr key={p.id} className="border-t border-[var(--clr-border)]">
                    <td>{p.name}</td>
                    <td className="text-[var(--clr-muted)]">{p.quantity||"-"}</td>
                    <td>
                      <input type="date" className="select w-auto" value={p.deadline?String(p.deadline).slice(0,10):""} onChange={e=>onUpdateProject(p.id,{deadline:e.target.value})}/>
                    </td>
                    <td>
                      <select className="select w-auto" value={p.status||"not_started"} onChange={e=>onUpdateProject(p.id,{status:e.target.value})}>
                        {PROJECT_STATUSES.map(s=>(<option key={s} value={s}>{s.replace("_"," ")}</option>))}
                      </select>
                    </td>
                    <td>
                      {p.link ? <a className="link" href={p.link} target="_blank">Open</a> : <span className="text-[var(--clr-muted)]">-</span>}
                    </td>
                    <td>
                      {p.attachmentUrl ? <a className="link" href={p.attachmentUrl} download={p.attachmentName||'attachment'}>Download</a> : <span className="text-[var(--clr-muted)]">-</span>}
                    </td>
                  </tr>
                ))}
                {projects.length===0 && <tr><td className="text-[var(--clr-muted)] p-3" colSpan="6">No projects added yet.</td></tr>}
              </tbody>
            </table>
          </div>}

          {adminTab==="presentToday" && <div className="card p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">{isSub ? "Present Today (My Reports)" : "Present Today"}</h2><span className="text-[var(--clr-muted)]">{new Date().toLocaleDateString()}</span></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead><tr><th>Employee</th><th>Office</th><th>Check In</th><th>Status</th></tr></thead>
                <tbody>
                  {presentTodayView.map(r=>{const emp=employees.find(e=>e.id===r.employeeId);return (
                    <tr key={r.id} className="border-t border-[var(--clr-border)]">
                      <td>{r.employeeName}</td>
                      <td className="text-[var(--clr-muted)]">{emp?.office}</td>
                      <td>{fmtTime(r.checkIn)}</td>
                      <td className="text-[var(--clr-positive)]">{r.checkOut?"Checked Out":"Active"}</td>
                    </tr>
                  )})}
                  {presentTodayView.length===0 && <tr><td className="text-[var(--clr-muted)] p-3" colSpan="4">No one is present today yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>}

          {adminTab==="leaves" && <div className="card p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Leave Requests {isAdmin? "(All)": isHR? "(All)" : "(My Reports)"}</h2></div>
            <div className="grid gap-3">
              {leaveRequests.map(l=> {
                const emp = employees.find(e=>e.id===l.employeeId);
                const canSee = isAdmin || isHR || (emp && emp.reportingManagerId===currentUser.id);
                if(!canSee) return null;
                const canAct = isAdmin || isHR || (emp && emp.reportingManagerId===currentUser.id);
                return (
                <div key={l.id} className="rounded-lg border border-[var(--clr-border)] p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{emp?.name}</div>
                    <div className="text-sm text-[var(--clr-muted)]">{l.date} - {l.type}</div>
                    <div className="text-sm text-[var(--clr-muted)]">{l.reason}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={"badge "+(l.status==="approved"?"bdg-done":l.status==="rejected"?"bdg-todo":"bdg-progress")}>{l.status}</div>
                    {l.status==="pending" && canAct && <>
                      <button className="btn px-3 py-2" style={{background:"var(--clr-positive)",color:"#fff"}} onClick={()=>onLeaveApproval(l.id,"approved")}>Approve</button>
                      <button className="btn px-3 py-2" style={{background:"var(--clr-negative)",color:"#fff"}} onClick={()=>onLeaveApproval(l.id,"rejected")}>Reject</button>
                    </>}
                  </div>
                </div>
              )})}
            </div>
          </div>}

          {adminTab==="celebrations" && <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Celebrations</h2>
              {(isAdmin||isHR) && <button className="btn btn-primary px-3 py-2" onClick={onOpenAddCelebration}>Add Celebration</button>}
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="card p-4">
                <h3 className="font-semibold mb-2">Today's Birthdays</h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {employees.filter(e=> e.dob && new Date(e.dob).getMonth()===new Date().getMonth() && new Date(e.dob).getDate()===new Date().getDate()).map(e=> (
                    <div key={e.id} className="flex items-center justify-between border rounded-lg p-2">
                      <div>
                        <div className="font-semibold">{e.name}</div>
                        <div className="text-xs text-[var(--clr-muted)]">{e.department}</div>
                      </div>
                      <button className="btn btn-ghost px-3 py-1.5" onClick={()=>onWish(e.id,'birthday')}>Wish</button>
                    </div>
                  ))}
                  {employees.filter(e=> e.dob && new Date(e.dob).getMonth()===new Date().getMonth() && new Date(e.dob).getDate()===new Date().getDate()).length===0 && <div className="text-[var(--clr-muted)] text-sm">No birthdays today.</div>}
                </div>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold mb-2">Today's Work Anniversaries</h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {employees.filter(e=> e.doj && new Date(e.doj).getMonth()===new Date().getMonth() && new Date(e.doj).getDate()===new Date().getDate()).map(e=> (
                    <div key={e.id} className="flex items-center justify-between border rounded-lg p-2">
                      <div>
                        <div className="font-semibold">{e.name}</div>
                        <div className="text-xs text-[var(--clr-muted)]">{e.department}</div>
                      </div>
                      <button className="btn btn-ghost px-3 py-1.5" onClick={()=>onWish(e.id,'anniversary')}>Wish</button>
                    </div>
                  ))}
                  {employees.filter(e=> e.doj && new Date(e.doj).getMonth()===new Date().getMonth() && new Date(e.doj).getDate()===new Date().getDate()).length===0 && <div className="text-[var(--clr-muted)] text-sm">No anniversaries today.</div>}
                </div>
              </div>
              {(isAdmin||isHR) && <div className="card p-4">
                <h3 className="font-semibold mb-2">Set Employee Date</h3>
                <SetEmpDateForm employees={employees} onSave={onSetEmpDate}/>
              </div>}
            </div>
            <CelebrationsList employees={employees} customCelebrations={celebrations}/>
          </div>}

          {adminTab==="tasks" && <div className="card p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">{isSub ? "Tasks (My Reports)" : "Tasks"}</h2><button className="btn btn-primary px-3 py-2" onClick={onOpenAddTaskModal}>Add Task</button></div>
            <table className="w-full min-w-[980px]">
              <thead><tr><th>Title</th><th>Assignee</th><th>Department</th><th>Deadline</th><th>Priority</th><th>Link</th><th>Attachment</th><th>Status</th><th>Update</th><th>Actions</th></tr></thead>
              <tbody>
                {sortedTasks.map(t=>{const emp=employees.find(e=>e.id===t.assignedTo);const badge=t.status==="done"?"bdg-done":t.status==="in_progress"?"bdg-progress":"bdg-todo";return (
                  <tr key={t.id} className="border-t border-[var(--clr-border)]">
                    <td>{t.title}</td>
                    <td className="text-[var(--clr-muted)]">{emp?.name||"-"}</td>
                    <td className="text-[var(--clr-muted)]">{emp?.department||"-"}</td>
                    <td className="text-[var(--clr-muted)]">{fmtShort(t.deadline)}</td>
                    <td><span className={"badge "+(t.priority==="hot"?"prio-hot":t.priority==="cold"?"prio-cold":"prio-general")}>{t.priority}</span></td>
                    <td>{t.link ? <a className="link" href={t.link} target="_blank">Open</a> : <span className="text-[var(--clr-muted)]">-</span>}</td>
                    <td>{t.attachmentUrl ? <a className="link" href={t.attachmentUrl} download={t.attachmentName||'attachment'}>Download</a> : <span className="text-[var(--clr-muted)]">-</span>}</td>
                    <td><span className={"badge "+badge}>{t.status.replace("_"," ")}</span></td>
                    <td>
                      <select className="select w-auto" value={t.status} onChange={e=>onUpdateTaskStatus(t.id,e.target.value)}>
                        <option value="todo">To do</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                    <td className="flex gap-2">
                      <button className="btn btn-ghost px-3 py-1.5" onClick={()=>onEditTask(t.id)}>Edit</button>
                      <button className="btn btn-ghost px-3 py-1.5" onClick={()=>onDeleteTask(t.id)}>Delete</button>
                    </td>
                  </tr>
                )})}
                {sortedTasks.length===0 && <tr><td className="text-[var(--clr-muted)] p-3" colSpan="9">No tasks yet.</td></tr>}
              </tbody>
            </table>
          </div>}

          {adminTab==="eod" && <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{isSub ? "EOD Timesheets (My Reports)" : "EOD Timesheets"}</h2>
              <input type="date" className="select w-auto" value={eodDate} onChange={e=>setEodDate(e.target.value)}/>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead><tr><th>Employee</th><th>Project</th><th>Task</th><th>Hours</th><th>Notes</th><th>Date</th></tr></thead>
                <tbody>
                  {eodForDate.map(eo=> (
                    <tr key={eo.id} className="border-t border-[var(--clr-border)]">
                      <td>{eo.employeeName}</td>
                      <td className="text-[var(--clr-muted)]">{eo.project}</td>
                      <td className="text-[var(--clr-muted)]">{eo.task||"-"}</td>
                      <td className="text-[var(--clr-primary)] font-semibold">{eo.hours.toFixed(2)}</td>
                      <td className="text-[var(--clr-muted)]">{eo.notes||"-"}</td>
                      <td className="text-[var(--clr-muted)]">{fmtShort(eo.dateKey)}</td>
                    </tr>
                  ))}
                  {eodForDate.length===0 && <tr><td className="text-[var(--clr-muted)] p-3" colSpan="6">No EOD entries for this date.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>}

          {adminTab==="performance" && <div className="card p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Performance (Last 30 days)</h2><span className="text-[var(--clr-muted)]">Score = Tasks (50) + Attendance (30) + EOD Activity (20)</span></div>
            <table className="w-full min-w-[900px]">
              <thead><tr><th>Employee</th><th>Department</th><th>Task Completion %</th><th>Days Present</th><th>Avg Hours</th><th>EOD Entries</th><th>Score</th><th>Status</th></tr></thead>
              <tbody>
                {employees.filter(e=>e.role==="employee").map(emp=>{
                  const days30Ago = new Date(); days30Ago.setDate(days30Ago.getDate()-30);
                  const tAll = tasks.filter(t=>t.assignedTo===emp.id && new Date(t.createdAt)>=days30Ago);
                  const tDone = tAll.filter(t=>t.status==="done");
                  const recs = attendanceRecords.filter(r=>r.employeeId===emp.id && new Date(r.checkIn)>=days30Ago && r.checkOut);
                  const uniqueDays = new Set(recs.map(r=>r.dateKey)).size;
                  const avgHours = recs.length? (recs.reduce((a,b)=>a+(b.hours||0),0)/recs.length):0;
                  const eodCount = eods.filter(eo=>eo.employeeId===emp.id && new Date(eo.dateKey)>=days30Ago).length;
                  const completionRate = tAll.length? (tDone.length/tAll.length):0.5;
                  const attendanceRate = Math.min(uniqueDays/22,1);
                  const activityRate = Math.min(eodCount/20,1);
                  const score = Math.round((completionRate*50)+(attendanceRate*30)+(activityRate*20));
                  const bucket = score>=80?"Excellent":score>=60?"Good":"Needs Attention";
                  return (
                    <tr key={emp.id} className="border-t border-[var(--clr-border)]">
                      <td>{emp.name}</td>
                      <td className="text-[var(--clr-muted)]">{emp.department}</td>
                      <td className="text-[var(--clr-muted)]">{Math.round(completionRate*100)}%</td>
                      <td className="text-[var(--clr-muted)]">{uniqueDays}</td>
                      <td className="text-[var(--clr-muted)]">{avgHours.toFixed(2)}</td>
                      <td className="text-[var(--clr-muted)]">{eodCount}</td>
                      <td className="text-[var(--clr-primary)] font-semibold">{score}</td>
                      <td><span className={"badge "+(bucket==="Excellent"?"bdg-done":bucket==="Good"?"bdg-progress":"bdg-todo")}>{bucket}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>}

          {adminTab==="documents" && (isAdmin || isHR) && <div className="card p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Employee Documents</h2><button className="btn btn-primary px-3 py-2" onClick={onOpenAddDocModal}>Upload</button></div>
            <table className="w-full min-w-[760px]">
              <thead><tr><th>Employee</th><th>Title</th><th>Type</th><th>File</th><th>Shared to Employee</th><th>Actions</th></tr></thead>
              <tbody>
                {documents.map(d=> {
                  const emp = employees.find(e=>e.id===d.employeeId);
                  return (
                  <tr key={d.id} className="border-t border-[var(--clr-border)]">
                    <td>{emp?.name||"-"}</td>
                    <td className="text-[var(--clr-muted)]">{d.title}</td>
                    <td className="text-[var(--clr-muted)]">{d.docType}</td>
                    <td><a className="link" href={d.url} download={d.fileName}>Download</a></td>
                    <td>
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={!!d.shared} onChange={()=>onToggleShareDoc(d.id)}/>
                        <span>{d.shared? "Shared":"Private"}</span>
                      </label>
                    </td>
                    <td><button className="btn btn-ghost px-3 py-1.5" onClick={()=>onDeleteDoc(d.id)}>Delete</button></td>
                  </tr>
                )})}
                {documents.length===0 && <tr><td className="text-[var(--clr-muted)] p-3" colSpan="6">No documents uploaded.</td></tr>}
              </tbody>
            </table>
          </div>}

          {adminTab==="announcements" && <div className="card p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Announcements</h2><button className="btn btn-primary px-3 py-2" onClick={onOpenAddAnnouncementModal}>New</button></div>
            <div className="grid gap-3">
              {announcements.slice().reverse().map(a=> (
                <div key={a.id} className="rounded-lg border border-[var(--clr-border)] p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-xs text-[var(--clr-muted)]">{fmtShort(a.date)}</div>
                  </div>
                  <div className="text-sm text-[var(--clr-muted)]">{a.message}</div>
                </div>
              ))}
              {announcements.length===0 && <div className="text-[var(--clr-muted)]">No announcements yet.</div>}
            </div>
          </div>}

          {adminTab==="holidays" && <div className="card p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Holiday List</h2><button className="btn btn-primary px-3 py-2" onClick={onOpenAddHolidayModal}>Add Holiday</button></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead><tr><th>Date</th><th>Holiday</th></tr></thead>
                <tbody>
                  {holidays.slice().sort((a,b)=>new Date(a.date)-new Date(b.date)).map(h=> (
                    <tr key={h.id} className="border-t border-[var(--clr-border)]"><td>{fmtShort(h.date)}</td><td className="text-[var(--clr-muted)]">{h.name}</td></tr>
                  ))}
                  {holidays.length===0 && <tr><td className="text-[var(--clr-muted)] p-3" colSpan="2">No holidays added yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>}

          {adminTab==="offices" && <div className="card p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Office Locations</h2><button className="btn btn-primary px-3 py-2" onClick={onOpenAddOfficeModal}>Add Office</button></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {offices.map(o=> (
                <div key={o} className="rounded-lg border border-[var(--clr-border)] p-4">
                  <div className="font-semibold mb-1">{o}</div>
                  <div className="text-sm text-[var(--clr-muted)]">{(employees.filter(e=>e.office===o)).length} employees</div>
                  <div className="mt-2 max-h-40 overflow-y-auto pr-1">
                    {employees.filter(e=>e.office===o).map(e=> (<div key={e.id} className="text-sm">- {e.name}</div>))}
                    {employees.filter(e=>e.office===o).length===0 && <div className="text-[var(--clr-muted)] text-sm">No employees yet</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>}

          {adminTab==="hiring" && <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Hiring Alerts</h2>
              <button className="btn btn-primary px-3 py-2" onClick={onAddJob}>Add Opening</button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {jobs.length===0 && <div className="text-[var(--clr-muted)]">No openings yet.</div>}
              {jobs.slice().reverse().map(j=> (
                <div key={j.id} className="rounded-lg border border-[var(--clr-border)] p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{j.title} <span className="chip ml-2">{j.department}</span></div>
                    <div className="text-xs text-[var(--clr-muted)]">{j.location} â€¢ {fmtShort(j.date)}</div>
                    {j.description && <div className="text-sm mt-1">{j.description}</div>}
                    <div className="text-sm mt-1">
                      <span className="text-[var(--clr-muted)]">Apply: </span>
                      <a className="link" href={j.applyUrl} target="_blank">{j.applyUrl}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm inline-flex items-center gap-2">
                      <input type="checkbox" checked={j.active!==false} onChange={()=>onToggleJob(j.id)}/>
                      <span>{j.active!==false?"Active":"Hidden"}</span>
                    </label>
                    <button className="btn btn-ghost px-3 py-1.5" onClick={()=>onDeleteJob(j.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>}

          {adminTab==="access" && isAdmin && <div className="card p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Access & Passwords (Admin)</h2><button className="btn btn-primary px-3 py-2" onClick={onOpenAddEmpModal}>Create User</button></div>
            <table className="w-full min-w-[640px]">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Reset Password</th></tr></thead>
              <tbody>
                {employees.map(emp=> (
                  <tr key={emp.id} className="border-t border-[var(--clr-border)]">
                    <td>{emp.name}</td>
                    <td className="text-[var(--clr-muted)]">{emp.email}</td>
                    <td className="text-[var(--clr-muted)]">{emp.role}</td>
                    <td className="text-[var(--clr-muted)]">{emp.active===false?"Inactive":"Active"}</td>
                    <td><button className="btn btn-ghost px-3 py-1.5" onClick={()=>onResetPassword(emp.id)}>Reset</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
        </div>
        <div className="mnav md:hidden">
          <div className="max-w-7xl mx-auto flex">
            <button onClick={()=>setAdminTab('leaves')}>Leaves</button>
            <button onClick={()=>setAdminTab('eod')}>EOD</button>
            <button onClick={openChat}>Chat</button>
          </div>
        </div>
      </>;
    };


    const AddDocumentModal=({onClose,onSubmit,employees})=>{
      const [f,setF]=useState({employeeId:employees[0]?.id||"",title:"",docType:"Offer",file:null});
      const changeFile=(e)=> setF({...f,file:e.target.files?.[0]||null});
      const save=()=>{
        if(!f.employeeId||!f.title||!f.docType||!f.file){alert("Fill all and attach a file");return;}
        const url=URL.createObjectURL(f.file);
        onSubmit({employeeId:Number(f.employeeId),title:f.title,docType:f.docType,fileName:f.file.name,url});
      };
      return (
        <Shell title="Upload Document" onClose={onClose}>
          <div className="grid gap-4">
            <div><label className="text-sm text-[var(--clr-muted)]">Employee</label>
              <select className="select mt-1" value={f.employeeId} onChange={e=>setF({...f,employeeId:e.target.value})}>{employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select>
            </div>
            <div><label className="text-sm text-[var(--clr-muted)]">Title</label><input className="input mt-1" value={f.title} onChange={e=>setF({...f,title:e.target.value})} placeholder="Offer / Appointment / Intent..."/></div>
            <div><label className="text-sm text-[var(--clr-muted)]">Type</label>
              <select className="select mt-1" value={f.docType} onChange={e=>setF({...f,docType:e.target.value})}>
                {["Offer","Appointment","Intent","Other"].map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="text-sm text-[var(--clr-muted)]">File</label><input type="file" className="input mt-1" onChange={changeFile} /></div>
            <div className="flex gap-3"><button className="btn btn-primary px-4 py-2 flex-1" onClick={save}>Upload</button><button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>Cancel</button></div>
          </div>
        </Shell>
      );
    };

    const AddAnnouncementModal=({onClose,onSubmit})=>{
      const [f,setF]=useState({title:"",message:""});
      return <Shell title="New Announcement" onClose={onClose}>
        <div className="grid gap-4">
          <div><label className="text-sm text-[var(--clr-muted)]">Title</label><input className="input mt-1" value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Message</label><textarea rows="5" className="w-full mt-1" value={f.message} onChange={e=>setF({...f,message:e.target.value})}></textarea></div>
          <div className="flex gap-3"><button className="btn btn-primary px-4 py-2 flex-1" onClick={()=>{if(!f.title||!f.message) return alert('Fill both'); onSubmit(f)}}>Publish</button><button className="btn btn-ghost px-4 py-2 flex-1" onClick={onClose}>Cancel</button></div>
        </div>
      </Shell>;
    };

    const AddEODModal = ({onClose,onSubmit}) => {
      const [f,setF]=useState({date: todayKey(), project:"", task:"", hours:"", notes:""});
      return <Shell title="Add EOD Entry" onClose={onClose}>
        <div className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm text-[var(--clr-muted)]">Date</label><input type="date" className="input mt-1" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/></div>
            <div><label className="text-sm text-[var(--clr-muted)]">Hours</label><input className="input mt-1" placeholder="e.g., 3.5" value={f.hours} onChange={e=>setF({...f,hours:e.target.value})}/></div>
          </div>
          <div><label className="text-sm text-[var(--clr-muted)]">Project</label><input className="input mt-1" value={f.project} onChange={e=>setF({...f,project:e.target.value})}/></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Task / Work Done</label><input className="input mt-1" value={f.task} onChange={e=>setF({...f,task:e.target.value})}/></div>
          <div><label className="text-sm text-[var(--clr-muted)]">Notes</label><textarea rows="4" className="w-full mt-1" value={f.notes} onChange={e=>setF({...f,notes:e.target.value})}></textarea></div>
          <button className="btn btn-primary px-4 py-2" onClick={()=>{if(!f.date||!f.project||!f.hours) return alert('Add Date, Project, Hours'); const h=parseFloat(f.hours); if(isNaN(h)||h<0) return alert('Hours invalid'); onSubmit({...f,hours:h})}}>Save EOD</button>
        </div>
      </Shell>;
    };

    const ChatModal = ({onClose,conversations,messages,employees,currentUser,onSend,openNewChat,selectConv,selectedConvId,draft}) => {
      const myConvs = conversations.filter(c=>c.memberIds.includes(currentUser.id));
      const selected = myConvs.find(c=>c.id===selectedConvId) || myConvs[0];
      const convMsgs = messages.filter(m=>m.conversationId===(selected?.id));
      const convTitle = (c)=>{
        if(!c) return "Chat";
        if(c.type==="group") return c.name;
        const others= c.memberIds.filter(id=>id!==currentUser.id);
        const user = employees.find(u=>u.id===others[0]);
        return user ? user.name : "Direct Chat";
      };
      const [text,setText]=useState("");
      const send=()=>{
        const t=text.trim();
        if(!t || !selected) return;
        onSend(selected.id, t);
        setText("");
      };
      return (
        <Shell title="Chat" onClose={onClose} maxW="max-w-5xl">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1 border border-[var(--clr-border)] rounded-xl p-3 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Conversations</div>
                <button className="btn btn-primary px-3 py-1.5" onClick={openNewChat}>New</button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {myConvs.length===0 && <div className="text-[var(--clr-muted)] text-sm">No chats yet.</div>}
                {myConvs.map(c=> (
                  <button key={c.id} className={"w-full text-left border rounded-lg p-2 "+(selected?.id===c.id?"bg-[var(--clr-hover)] border-[var(--ring)]":"border-[var(--clr-border)]")} onClick={()=>selectConv(c.id)}>
                    <div className="font-semibold">{convTitle(c)}</div>
                    <div className="text-xs text-[var(--clr-muted)]">{c.type==="group"?"Group":"Direct"} - {c.memberIds.length} members</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 border border-[var(--clr-border)] rounded-xl flex flex-col h-[60vh]">
              <div className="px-4 py-3 border-b border-[var(--clr-border)] font-semibold">{convTitle(selected)}</div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(!selected || convMsgs.length===0) && <div className="text-[var(--clr-muted)]">No messages yet.</div>}
                {convMsgs.map(m=>{
                  const mine = m.senderId===currentUser.id;
                  const sender = employees.find(u=>u.id===m.senderId);
                  return (
                    <div key={m.id} className={"max-w-[80%] rounded-xl p-3 "+(mine?"ml-auto bg-[var(--clr-hover)]":"bg-white border border-[var(--clr-border)]")}>
                      <div className="text-xs text-[var(--clr-muted)] mb-1">{sender?.name} - {fmtTime(m.date)}</div>
                      <div className="text-sm">{m.body}</div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t border-[var(--clr-border)] flex items-center gap-2">
                <input className="input" placeholder="Type a message..." value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") send();}}/>
                <button className="btn btn-primary px-4 py-2" onClick={send}>Send</button>
              </div>
            </div>
          </div>
        </Shell>
      );
    };

    const NewConversationModal = ({onClose,onCreate,employees,currentUser}) => {
      const [selected,setSelected]=useState([currentUser.id]);
      const [name,setName]=useState("");
      const toggle=(id)=> setSelected(prev=> prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
      const others = employees.filter(e=>e.id!==currentUser.id && e.active!==false);
      const create=()=>{
        const members = selected.slice().sort((a,b)=>a-b);
        if(members.length<2){alert("Select at least one other participant"); return;}
        const isGroup = members.length>2;
        onCreate({memberIds:members, name: isGroup ? (name.trim()|| "New Group") : undefined});
      };
      return (
        <Shell title="Start a Chat" onClose={onClose} maxW="max-w-xl">
          <div className="grid gap-3">
            <div className="text-sm text-[var(--clr-muted)]">Pick participants</div>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {others.map(u=> (
                <label key={u.id} className="border border-[var(--clr-border)] rounded-lg p-2 flex items-center gap-2">
                  <input type="checkbox" checked={selected.includes(u.id)} onChange={()=>toggle(u.id)}/>
                  <span className="text-sm">{u.name} <span className="text-[var(--clr-muted)]">({u.department})</span></span>
                </label>
              ))}
            </div>
            {selected.length>2 && <div>
              <label className="text-sm text-[var(--clr-muted)]">Group Name</label>
              <input className="input mt-1" placeholder="e.g., QA Squad" value={name} onChange={e=>setName(e.target.value)}/>
            </div>}
            <div className="flex gap-3"><button className="btn btn-primary px-4 py-2" onClick={create}>Create</button><button className="btn btn-ghost px-4 py-2" onClick={onClose}>Cancel</button></div>
          </div>
        </Shell>
      );
    };

    const App=()=>{
      const [currentUser,setCurrentUser]=useState(null);
      const [employees,setEmployees]=useState([]);
      const [attendanceRecords,setAttendanceRecords]=useState([]);
      const [leaveRequests,setLeaveRequests]=useState([]);
      const [tasks,setTasks]=useState([]);
      const [announcements,setAnnouncements]=useState([]);
      const [holidays,setHolidays]=useState([]);
      const [eods,setEods]=useState([]);
      const [documents,setDocuments]=useState([]);
      const [notifications,setNotifications]=useState([]);
      const [view,setView]=useState("login");
      const [currentTime,setCurrentTime]=useState(new Date());
      const [adminTab,setAdminTab]=useState("overview");
      const [offices,setOffices]=useState(["Headquarters","Branch Office","Regional Office","Remote"]);
      const [modal,setModal]=useState(null);
      const [notifOpen,setNotifOpen]=useState(false);
      const [jobs,setJobs]=useState([]);
      const [celebrations,setCelebrations]=useState([]);
      const [goals,setGoals]=useState([]);
      const [achievements,setAchievements]=useState([]);
      const [chatOpen,setChatOpen]=useState(false);
      const [conversations,setConversations]=useState([]);
      const [messages,setMessages]=useState([]);
      const [selectedConvId,setSelectedConvId]=useState(null);
      const [showNewChat,setShowNewChat]=useState(false);
      const [chatDraft,setChatDraft]=useState("");
      const [editTaskId,setEditTaskId]=useState(null);
      const [projects,setProjects]=useState([]);

      useEffect(()=>{
        const seed=[
          {id:1,name:"Admin User",email:"admin@company.com",password:"admin123",role:"admin",office:"Headquarters",department:"HR",dob:"1988-03-10",doj:"2019-01-15",active:true, reportingManagerId:null, leaveBalance:{sick:6,casual:12,emergency:3}},
          {id:2,name:"Sub Admin",email:"sub@company.com",password:"sub123",role:"sub_admin",office:"Headquarters",department:"Engineering",dob:"1991-07-05",doj:"2021-06-01",active:true, reportingManagerId:1, leaveBalance:{sick:6,casual:12,emergency:3}},
          {id:3,name:"HR Manager",email:"hr@company.com",password:"hr123",role:"hr",office:"Branch Office",department:"HR",dob:"1990-11-20",doj:"2020-10-10",active:true, reportingManagerId:1, leaveBalance:{sick:6,casual:12,emergency:3}},
          {id:4,name:"John Doe",email:"john@company.com",password:"emp123",role:"employee",office:"Headquarters",department:"Quality Assurance",dob:"1995-12-01",doj:"2022-12-15",active:true, reportingManagerId:3, leaveBalance:{sick:6,casual:12,emergency:3}},
          {id:5,name:"Jane Smith",email:"jane@company.com",password:"emp123",role:"employee",office:"Branch Office",department:"Marketing",dob:"1993-02-18",doj:"2023-08-07",active:true, reportingManagerId:2, leaveBalance:{sick:6,casual:12,emergency:3}}
        ];
        setEmployees(seed);
        setAnnouncements([{id:1001,title:"Welcome to AttendX",message:"Log attendance, EOD, goals & achievements; see tasks, leaves, docs, hiring & chat.",date:new Date().toISOString()}]);
        setHolidays([{id:2001,date:new Date(new Date().getFullYear(),10,12).toISOString(),name:"Diwali"}]);
        setConversations([{id:3001,type:"dm",memberIds:[1,3]}]);
        setMessages([{id:4001,conversationId:3001,senderId:1,body:"Welcome to AttendX chat!",date:new Date().toISOString()}]);
        setJobs([{id:5001,title:"Senior Video Editor",department:"Engineering",location:"Noida / Hybrid",description:"Own end-to-end edits for OTT-style content.",applyUrl:"https://example.com/apply",active:true,date:new Date().toISOString()}]);
        setProjects([{id:6001,name:"CEO's Wife Series",quantity:"60 Episodes",deadline:todayKey(),status:"in_progress"}]);
      },[]);

      useEffect(()=>{const t=setInterval(()=>setCurrentTime(new Date()),1000);return()=>clearInterval(t)},[]);

      const login=(email,pw)=>{
        const u=employees.find(e=>e.email===email&&e.password===pw);
        if(!u){alert("Invalid credentials");return;}
        if(u.active===false){alert("This account is deactivated.");return;}
        setCurrentUser(u); setView(u.role==="employee"?"employee":"admin"); if(u.role!=="employee") setAdminTab("overview");
      };
      const logout=()=>{setCurrentUser(null);setView("login")};

      const saveRecord=(loc)=>{if(!currentUser)return;const now=new Date();const rec={id:Date.now(),employeeId:currentUser.id,employeeName:currentUser.name,dateKey:todayKey(),dateLabel:now.toLocaleDateString(),checkIn:now.toISOString(),checkOut:null,location:loc,hours:0};setAttendanceRecords(p=>[...p,rec]);alert("Checked in successfully!")};
      const checkIn=()=>{if(!currentUser)return;const existing=attendanceRecords.find(r=>r.employeeId===currentUser.id&&r.dateKey===todayKey()&&!r.checkOut);if(existing){alert("Already checked in.");return;}if(navigator.geolocation){navigator.geolocation.getCurrentPosition(p=>saveRecord(`${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`),()=>saveRecord("Manual/Unknown"),{timeout:5000});}else saveRecord("Manual/Unsupported")};
      const checkOut=()=>{if(!currentUser)return;const rec=attendanceRecords.find(r=>r.employeeId===currentUser.id&&r.dateKey===todayKey()&&!r.checkOut);if(!rec){alert("No active check-in found for today");return;}const now=new Date();const hrs=(now-new Date(rec.checkIn))/(1000*60*60);setAttendanceRecords(p=>p.map(r=>r.id===rec.id?{...r,checkOut:now.toISOString(),hours:Number(hrs.toFixed(2))}:r));alert("Checked out successfully!")};

      // Leaves
      const submitLeave=(ld)=>{
        if(!currentUser)return;
        const emp = employees.find(e=>e.id===currentUser.id);
        const bal = emp?.leaveBalance?.[ld.type] ?? 0;
        if(bal<=0){alert("Insufficient leave balance for "+ld.type); return;}
        const nl={id:Date.now(),employeeId:currentUser.id,employeeName:currentUser.name,...ld,isPaid:false,status:"pending"};
        setLeaveRequests(p=>[...p,nl]);setModal(null);alert("Leave request submitted!");
        // Notify reporting manager (fallback to HR/Admin if no RM)
        const targets = new Set();
        if(emp?.reportingManagerId){ targets.add(emp.reportingManagerId); }
        else {
          employees.filter(u=> u.role==="hr" || u.role==="admin").forEach(u=>targets.add(u.id));
        }
        Array.from(targets).forEach(uid=>{
          if(uid!==currentUser.id) pushNotification(uid, `${currentUser.name} requested ${ld.type} leave on ${ld.date}.`);
        });
      };
      const cancelLeave=(id)=> setLeaveRequests(p=>p.map(l=>l.id===id && l.status==="pending" ? {...l,status:"cancelled"} : l));
      const pushNotification=(userId,message)=> setNotifications(p=>[...p,{id:Date.now()+Math.random(), userId, message, date:new Date().toISOString(), read:false}]);

      const notifyTaskChange=(task,action)=>{
        const targets = new Set([task.assignedTo, task.createdById].filter(Boolean));
        targets.forEach(uid=>{ if(uid!==currentUser?.id) pushNotification(uid, `Task '${task.title}' ${action}.`); });
      };
      const decideLeave=(id,status)=>{
        const lv = leaveRequests.find(l=>l.id===id);
        if(!lv) return;
        const emp = employees.find(e=>e.id===lv.employeeId);
        if(status!=="approved" && status!=="rejected") return;
        // Update request status
        setLeaveRequests(p=>p.map(l=> l.id===id ? {...l,status} : l));
        // On approval, deduct from employee's leave balance only when moving from pending -> approved
        if(status==="approved" && emp && lv.status==="pending"){
          const t = lv.type; // 'sick' | 'casual' | 'emergency'
          setEmployees(ps=> ps.map(e=>{
            if(e.id!==emp.id) return e;
            const cur = e.leaveBalance?.[t] ?? 0;
            return {...e, leaveBalance:{...e.leaveBalance, [t]: Math.max(0, cur-1)}};
          }));
        }
        // Notify requester
        if(emp) pushNotification(emp.id, `Your leave on ${lv.date} was ${status}.`);
      };

      // Documents
      const uploadDocument=(d)=>{
        const doc = {id:Date.now(), employeeId:d.employeeId, title:d.title, docType:d.docType, fileName:d.fileName, url:d.url, shared:false, uploadedById:currentUser?.id, date:new Date().toISOString()};
        setDocuments(p=>[...p,doc]); setModal(null); alert("Document uploaded!");
      };
      const toggleShareDoc=(id)=> setDocuments(p=>p.map(x=>x.id===id?{...x,shared:!x.shared}:x));
      const deleteDoc=(id)=> setDocuments(p=>p.filter(x=>x.id!==id));

      // Tasks
      const addTask=t=>{
        const task={id:Date.now(),title:t.title,description:t.description,assignedTo:t.assignedTo,deadline:t.deadline,status:"todo",priority:t.priority||"general",link:t.link||"",createdAt:new Date().toISOString(),createdById:currentUser?.id,attachmentUrl:t.attachmentUrl||"",attachmentName:t.attachmentName||""};
        setTasks(p=>[...p,task]); setModal(null); alert("Task created!");
        notifyTaskChange(task,"created");
      };
      const updateTask=(id,status)=>{
        setTasks(p=>p.map(t=>{
          if(t.id===id){ const nt={...t,status}; notifyTaskChange(nt,"updated"); return nt; }
          return t;
        }));
      };
      const deleteTask=(id)=>{
        const tsk = tasks.find(x=>x.id===id);
        setTasks(p=>p.filter(t=>t.id!==id));
        if(tsk) notifyTaskChange(tsk,"deleted");
        setModal(null);
      };
      const startEditTask=(id)=>{ setEditTaskId(id); setModal("edit-task"); };

      const saveEditedTask=(payload)=>{
        const id = editTaskId;
        if(!id) return;
        setTasks(p=>p.map(t=> t.id===id ? {...t,...payload} : t));
        const after = tasks.find(t=>t.id===id);
        if(after) notifyTaskChange({...after,...payload},"updated");
        setModal(null); setEditTaskId(null);
      };

      // Employee Management
      const addEmployee = (emp) => {
        const newEmployee = {
          id: Date.now(),
          name: emp.name,
          email: emp.email,
          password: emp.password || 'emp123',
          role: emp.role || 'employee',
          office: emp.office || 'Headquarters',
          department: emp.department || DEPARTMENTS[0],
          dob: emp.dob || null,
          doj: emp.doj || new Date().toISOString().split('T')[0],
          active: true,
          reportingManagerId: null,
          leaveBalance: { sick: 6, casual: 12, emergency: 3 }
        };
        setEmployees(p => [...p, newEmployee]);
        setModal(null);
        alert('Employee added successfully!');
      };

      // Employee Updates
      const addEmp=e=>{setEmployees(p=>[...p,{id:Date.now(),...e,active:true}]);setModal(null);alert("User added successfully!")};
      const changeEmpOffice=(id,o)=>setEmployees(p=>p.map(e=>e.id===id?{...e,office:o}:e));
      const changeEmpRole=(id,r)=>setEmployees(p=>p.map(e=>e.id===id?{...e,role:r}:e));
      const changeReportingManager=(id,rmId)=>setEmployees(p=>p.map(e=>e.id===id?{...e,reportingManagerId:rmId}:e));
      const toggleEmpActive=(id)=>setEmployees(p=>p.map(e=>e.id===id?{...e,active: e.active===false?true:false}:e));
      const resetPassword=(id)=>{const np=Math.random().toString(36).slice(-8);setEmployees(p=>p.map(e=>e.id===id?{...e,password:np}:e));const target=employees.find(e=>e.id===id);alert(`${target?.name||"User"}'s new password: ${np}`)};
      const addOffice=name=>{setOffices(p=>p.includes(name)?p:[...p,name]);setModal(null)};

      // Hiring
      const addJob=(f)=>{ setJobs(p=>[...p,{id:Date.now(),...f,active:true,date:new Date().toISOString()}]); setModal(null); };
      const toggleJob=(id)=> setJobs(p=>p.map(j=>j.id===id?{...j,active: j.active===false ? true : false}:j));
      const deleteJob=(id)=> setJobs(p=>p.filter(j=>j.id!==id));

      const addProject=p=>{
        const proj={id:Date.now(),name:p.name,quantity:p.quantity,deadline:p.deadline,status:p.status||"not_started",link:p.link||"",attachmentUrl:p.attachmentUrl||"",attachmentName:p.attachmentName||""};
        setProjects(prev=>[...prev,proj]);
        setModal(null);
        alert("Project added!");
      };
      const updateProject=(id,patch)=>{
        setProjects(prev=>prev.map(pr=>pr.id===id?{...pr,...patch}:pr));
      };

      // Celebrations: set DOB/DOJ and Wish action
      const setEmpDate=({employeeId,type,date})=>{
        setEmployees(p=>p.map(e=> e.id===employeeId ? {...e, [type]: new Date(date).toISOString()} : e));
      };
      const wishEmp=(employeeId, kind)=>{
        const target = employees.find(e=>e.id===employeeId);
        if(!currentUser || !target) return;
        // find or create DM conversation between currentUser and target
        const pair = [currentUser.id, target.id].slice().sort((a,b)=>a-b).join(",");
        let conv = conversations.find(c=> c.type==="dm" && c.memberIds.slice().sort().join(",")===pair);
        if(!conv){ conv={id:Date.now(), type:"dm", memberIds:[currentUser.id,target.id]}; setConversations(p=>[...p,conv]); }
        const message = kind==="birthday" ? `Happy Birthday, ${target.name}!` : `Happy Work Anniversary, ${target.name}!`;
        setSelectedConvId(conv.id);
        setChatOpen(true);
        setChatDraft(message);
      };

      // Chat
      const openChat=()=> setChatOpen(true);
      const closeChat=()=> setChatOpen(false);
      const openNewChat=()=> setShowNewChat(true);
      const closeNewChat=()=> setShowNewChat(false);
      const createConversation=({memberIds,name})=>{
        const uniq = Array.from(new Set(memberIds));
        const isGroup = uniq.length>2;
        if(!isGroup){
          const existing = conversations.find(c=>c.type==="dm" && c.memberIds.slice().sort().join(",")===uniq.slice().sort().join(","));
          if(existing){ setSelectedConvId(existing.id); setShowNewChat(false); return; }
        }
        const conv={id:Date.now(), type: (isGroup ? "group" : "dm"), memberIds:uniq, name: (isGroup ? name : undefined)};
        setConversations(p=>[...p,conv]);
        setSelectedConvId(conv.id);
        setShowNewChat(false);
      };
      const selectConv=(id)=> setSelectedConvId(id);
      const sendMessage=(conversationId, body)=>{
        const msg = {id:Date.now(), conversationId, senderId:currentUser.id, body, date:new Date().toISOString()};
        setMessages(p=>[...p,msg]);
        const conv = conversations.find(c=>c.id===conversationId);
        if(conv){
          const preview = `${body.slice(0,40)}${body.length>40?"...":""}`;
          const allTargets = conv.memberIds.filter(uid=>uid!==currentUser.id);
          // Simple @mention: match @FirstName (case-insensitive)
          const mentionNames = Array.from(new Set((body.match(/@([A-Za-z][A-Za-z0-9_]*)/g)||[]).map(m=>m.slice(1).toLowerCase())));
          const mentionedIds = employees.filter(e=> mentionNames.includes((e.name.split(' ')[0]||'').toLowerCase())).map(e=>e.id);
          const targets = new Set(allTargets);
          mentionedIds.forEach(id=>{ if(allTargets.includes(id)) targets.add(id); });
          Array.from(targets).forEach(uid=> pushNotification(uid, `New message from ${currentUser.name}: ${preview}`));
        }
      };

      // Notifications
      const openNotifs=()=> setNotifOpen(true);
      const closeNotifs=()=> setNotifOpen(false);
      const markAllRead=()=> setNotifications(p=>p.map(n=> n.userId===currentUser?.id ? {...n,read:true} : n));
      const clearAllNotifs=()=> setNotifications(p=> p.filter(n=> n.userId!==currentUser?.id));

      // Auto-open notifications and play a short ding for new notifications to current user
      const dingSrc = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';
      const lastNotifRef = React.useRef(0);
      useEffect(()=>{
        if(!currentUser) return;
        const mine = notifications.filter(n=>n.userId===currentUser.id);
        if(mine.length===0) return;
        const latest = mine[mine.length-1];
        if(latest && latest.id!==lastNotifRef.current){
          lastNotifRef.current = latest.id;
          setNotifOpen(true);
          try{ new Audio(dingSrc).play(); }catch(e){}
        }
      },[notifications,currentUser]);

      // Daily celebration notifications to all users
      const lastCelebDateRef = React.useRef("");
      useEffect(()=>{
        const today = new Date();
        const key = today.toDateString();
        if(lastCelebDateRef.current === key) return;
        // Only run once per day
        const todaysBD = employees.filter(e=> e.dob && new Date(e.dob).getMonth()===today.getMonth() && new Date(e.dob).getDate()===today.getDate());
        const todaysDOJ = employees.filter(e=> e.doj && new Date(e.doj).getMonth()===today.getMonth() && new Date(e.doj).getDate()===today.getDate());
        const audience = employees.map(u=>u.id);
        todaysBD.forEach(e=> audience.forEach(uid=> pushNotification(uid, `Today is ${e.name}'s Birthday!`)));
        todaysDOJ.forEach(e=> audience.forEach(uid=> pushNotification(uid, `Today is ${e.name}'s Work Anniversary!`)));
        if(todaysBD.length||todaysDOJ.length){ lastCelebDateRef.current = key; }
      },[currentTime,employees]);

      const managers = React.useMemo(()=> employees.filter(x=>["admin","sub_admin","hr"].includes(x.role)),[employees]);
      const assignableEmployees = React.useMemo(()=> {
        if(!currentUser) return [];
        if(currentUser.role==="admin" || currentUser.role==="hr") return employees.filter(e=>["employee","hr","sub_admin"].includes(e.role) && e.active!==false);
        return employees.filter(e=>e.role==="employee" && e.reportingManagerId===currentUser.id && e.active!==false);
      },[employees,currentUser]);

      const currentUserLeaveBalance = currentUser ? (employees.find(e=>e.id===currentUser.id)?.leaveBalance || {sick:0,casual:0,emergency:0}) : {sick:0,casual:0,emergency:0};
      const myNotifs = notifications.filter(n=>n.userId===currentUser?.id).slice().reverse();

      return <>
        {view==="login" && <Login onLogin={login}/>}
        {view==="employee" && currentUser && <EmployeeView
          currentUser={currentUser}
          currentTime={currentTime}
          attendanceRecords={attendanceRecords}
          leaveRequests={leaveRequests}
          tasks={tasks}
          announcements={announcements}
          holidays={holidays}
          eods={eods}
          documents={documents}
          leaveBalance={currentUserLeaveBalance}
          onCheckIn={checkIn}
          onCheckOut={checkOut}
          onOpenLeaveModal={()=>setModal("leave")}
          onUpdateTaskStatus={updateTask}
          onAddEOD={()=>setModal("add-eod")}
          onLogout={logout}
          onCancelLeave={(id)=>setLeaveRequests(p=>p.map(l=>l.id===id && l.status==="pending" ? {...l,status:"cancelled"} : l))}
          notifications={notifications}
          openNotifs={openNotifs}
          openChat={openChat}
          goals={goals} achievements={achievements} onOpenGoal={()=>setModal("add-goal")} onOpenAch={()=>setModal("add-ach")}
          jobs={jobs}
          hiringAlerts={jobs.filter(j=>j.active)}
        />}
        {view==="admin" && currentUser && <AdminView
          currentUser={currentUser}
          employees={employees}
          attendanceRecords={attendanceRecords}
          leaveRequests={leaveRequests}
          offices={offices}
          tasks={tasks}
          announcements={announcements}
          holidays={holidays}
          eods={eods}
          documents={documents}
          onOpenAddEmpModal={()=>setModal("add-emp")}
          onOpenAddTaskModal={()=>setModal("add-task")}
          onOpenAddAnnouncementModal={()=>setModal("add-ann")}
          onOpenAddHolidayModal={()=>setModal("add-holiday")}
          onOpenAddOfficeModal={()=>setModal("add-office")}
          onOpenAddDocModal={()=>setModal("add-doc")}
          onAddEmployee={addEmployee}
          onLogout={logout}
          onLeaveApproval={decideLeave}
          onUpdateTaskStatus={updateTask}
          onChangeEmployeeOffice={changeEmpOffice}
          onChangeEmployeeRole={changeEmpRole}
          onChangeReportingManager={changeReportingManager}
          onToggleEmployeeActive={toggleEmpActive}
          onResetPassword={resetPassword}
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          notifications={notifications}
          openNotifs={openNotifs}
          onToggleShareDoc={(id)=>setDocuments(p=>p.map(x=>x.id===id?{...x,shared:!x.shared}:x))}
          onDeleteDoc={(id)=>setDocuments(p=>p.filter(x=>x.id!==id))}
          openChat={openChat}
          jobs={jobs}
          onAddJob={()=>setModal("add-job")}
          onToggleJob={toggleJob}
          onDeleteJob={deleteJob}
          currentTime={currentTime}
          onCheckIn={checkIn}
          onCheckOut={checkOut}
          onEditTask={startEditTask}
          onDeleteTask={deleteTask}
          celebrations={celebrations}
          onOpenAddCelebration={()=>setModal("add-celeb")}
          onOpenLeaveModal={()=>setModal("leave")}
          onAddEOD={()=>setModal("add-eod")}
          onCancelLeave={(id)=>setLeaveRequests(p=>p.map(l=>l.id===id && l.status==="pending" ? {...l,status:"cancelled"} : l))}
          goals={goals}
          achievements={achievements}
          onOpenGoal={()=>setModal("add-goal")}
          onOpenAch={()=>setModal("add-ach")}
          onSetEmpDate={setEmpDate}
          onWish={wishEmp}
          projects={projects}
          onAddProject={()=>setModal("add-project")}
          onUpdateProject={updateProject}
        />}

        {modal==="leave" && <Shell title="Request Leave" onClose={()=>setModal(null)}>
          <div className="grid gap-4">
            <div><label className="text-[var(--clr-muted)] text-sm">Date</label><input id="lv-date" type="date" className="input mt-1"/></div>
            <div><label className="text-[var(--clr-muted)] text-sm">Type</label>
              <select id="lv-type" className="select mt-1">
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="emergency">Emergency Leave</option>
              </select>
            </div>
            <div><label className="text-[var(--clr-muted)] text-sm">Reason</label><textarea id="lv-reason" className="mt-1 w-full" rows="4" placeholder="Explain your reason..."></textarea></div>
            <button className="btn btn-primary px-4 py-2" onClick={()=>{
              const date=document.getElementById('lv-date').value;
              const type=document.getElementById('lv-type').value;
              const reason=document.getElementById('lv-reason').value;
              if(!date) return alert('Pick date');
              submitLeave({date,type,reason});
            }}>Submit</button>
          </div>
        </Shell>}
        {modal==="add-emp" && <AddEmployeeModal onClose={()=>setModal(null)} onSubmit={addEmployee} offices={offices}/>}
        {modal==="add-task" && <AddTaskModal onClose={()=>setModal(null)} onSubmit={addTask} employees={assignableEmployees}/>}
        {modal==="add-ann" && <AddAnnouncementModal onClose={()=>setModal(null)} onSubmit={(a)=>{setAnnouncements(p=>[...p,{id:Date.now(),title:a.title,message:a.message,date:new Date().toISOString()}]); setModal(null);}}/>}
        {modal==="add-holiday" && <AddHolidayModal onClose={()=>setModal(null)} onSubmit={(h)=>{setHolidays(p=>[...p,{id:Date.now(),date:h.date,name:h.name}]); setModal(null);}}/>}
        {modal==="add-office" && <AddOfficeModal onClose={()=>setModal(null)} onSubmit={name=>{setOffices(p=>p.includes(name)?p:[...p,name]); setModal(null);}}/>}
        {modal==="add-eod" && <AddEODModal onClose={()=>setModal(null)} onSubmit={(entry)=>{ if(!currentUser) return; const eo={id:Date.now(),employeeId:currentUser.id,employeeName:currentUser.name,dateKey:entry.date,project:entry.project,task:entry.task,notes:entry.notes||"",hours:entry.hours}; setEods(p=>[...p,eo]); setModal(null); alert("EOD saved!"); }}/>}      
        {modal==="add-doc" && <AddDocumentModal onClose={()=>setModal(null)} onSubmit={(d)=>{setDocuments(p=>[...p,{id:Date.now(),...d,shared:false,uploadedById:currentUser?.id,date:new Date().toISOString()}]); setModal(null);}} employees={employees.filter(e=>e.role==="employee")}/>}
        {modal==="add-job" && <AddJobModal onClose={()=>setModal(null)} onSubmit={f=>{setJobs(p=>[...p,{id:Date.now(),...f,active:true,date:new Date().toISOString()}]); setModal(null);}} departments={DEPARTMENTS}/>}
        {modal==="add-project" && <AddProjectModal onClose={()=>setModal(null)} onSubmit={addProject}/>}

        {modal==="edit-task" && <EditTaskModal onClose={()=>{setModal(null); setEditTaskId(null);}} onSubmit={saveEditedTask} task={tasks.find(t=>t.id===editTaskId)} employees={assignableEmployees}/>}
        {modal==="add-celeb" && <AddCelebrationModal onClose={()=>setModal(null)} onSubmit={(f)=>{ setCelebrations(p=>[...p,{id:Date.now(), ...f}]); setModal(null); }}/>}        
        {modal==="add-goal" && <AddGoalModal onClose={()=>setModal(null)} onSubmit={(g)=>{ if(!currentUser) return; setGoals(p=>[...p,{id:Date.now(), userId:currentUser.id, date:g.date, text:g.text}]); setModal(null); }}/>}        
        {modal==="add-ach" && <AddAchievementModal onClose={()=>setModal(null)} onSubmit={(a)=>{ if(!currentUser) return; setAchievements(p=>[...p,{id:Date.now(), userId:currentUser.id, date:a.date, text:a.text}]); setModal(null); }}/>}        

        {chatOpen && currentUser && <ChatModal onClose={()=>{closeChat(); setChatDraft("");}} conversations={conversations} messages={messages} employees={employees} currentUser={currentUser} onSend={sendMessage} openNewChat={()=>setShowNewChat(true)} selectConv={setSelectedConvId} selectedConvId={selectedConvId} draft={chatDraft}/>}
        {showNewChat && currentUser && <NewConversationModal onClose={()=>setShowNewChat(false)} onCreate={createConversation} employees={employees} currentUser={currentUser}/>}

        {notifOpen && <NotificationsModal list={myNotifs} onClose={()=>{setNotifOpen(false)}} markAll={markAllRead} clearAll={clearAllNotifs}/>} 
      </>;
    };

export default App;
