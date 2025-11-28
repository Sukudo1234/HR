import { useState, useEffect, useMemo, useRef } from 'react';
import { todayKey } from '../utils/helpers';
import { DEPARTMENTS } from '../utils/constants';
import {
  seedEmployees,
  seedAnnouncements,
  seedHolidays,
  seedConversations,
  seedMessages,
  seedJobs,
  seedProjects
} from '../data/seedData';

/**
 * Custom hook for App business logic
 * Manages all state and business logic functions
 */
export const useAppLogic = () => {
  // State
  const [currentUser, setCurrentUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [eods, setEods] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [view, setView] = useState("login");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [adminTab, setAdminTab] = useState("overview");
  const [offices, setOffices] = useState(["Headquarters", "Branch Office", "Regional Office", "Remote"]);
  const [modal, setModal] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [celebrations, setCelebrations] = useState([]);
  const [goals, setGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [chatDraft, setChatDraft] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [projects, setProjects] = useState([]);

  // Initialize seed data
  useEffect(() => {
    setEmployees(seedEmployees);
    setAnnouncements(seedAnnouncements);
    setHolidays(seedHolidays);
    setConversations(seedConversations);
    setMessages(seedMessages);
    setJobs(seedJobs);
    setProjects(seedProjects);
  }, []);

  // Update current time every second
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Notification helpers
  const pushNotification = (userId, message) =>
    setNotifications(p => [
      ...p,
      { id: Date.now() + Math.random(), userId, message, date: new Date().toISOString(), read: false }
    ]);

  const notifyTaskChange = (task, action) => {
    const targets = new Set([task.assignedTo, task.createdById].filter(Boolean));
    targets.forEach(uid => {
      if (uid !== currentUser?.id) pushNotification(uid, `Task '${task.title}' ${action}.`);
    });
  };

  // Auto-open notifications
  const dingSrc = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";
  const lastNotifRef = useRef(0);

  useEffect(() => {
    if (!currentUser) return;
    const mine = notifications.filter(n => n.userId === currentUser.id);
    if (mine.length === 0) return;
    const latest = mine[mine.length - 1];
    if (latest && latest.id !== lastNotifRef.current) {
      lastNotifRef.current = latest.id;
      setNotifOpen(true);
      try {
        new Audio(dingSrc).play();
      } catch (e) {}
    }
  }, [notifications, currentUser]);

  // Daily celebration notifications
  const lastCelebDateRef = useRef("");
  useEffect(() => {
    const today = new Date();
    const key = today.toDateString();
    if (lastCelebDateRef.current === key) return;
    const todaysBD = employees.filter(
      e =>
        e.dob &&
        new Date(e.dob).getMonth() === today.getMonth() &&
        new Date(e.dob).getDate() === today.getDate()
    );
    const todaysDOJ = employees.filter(
      e =>
        e.doj &&
        new Date(e.doj).getMonth() === today.getMonth() &&
        new Date(e.doj).getDate() === today.getDate()
    );
    const audience = employees.map(u => u.id);
    todaysBD.forEach(e =>
      audience.forEach(uid => pushNotification(uid, `Today is ${e.name}'s Birthday!`))
    );
    todaysDOJ.forEach(e =>
      audience.forEach(uid => pushNotification(uid, `Today is ${e.name}'s Work Anniversary!`))
    );
    if (todaysBD.length || todaysDOJ.length) {
      lastCelebDateRef.current = key;
    }
  }, [currentTime, employees]);

  // Authentication
  const login = (email, pw) => {
    const u = employees.find(e => e.email === email && e.password === pw);
    if (!u) {
      alert("Invalid credentials");
      return;
    }
    if (u.active === false) {
      alert("This account is deactivated.");
      return;
    }
    setCurrentUser(u);
    setView(u.role === "employee" ? "employee" : "admin");
    if (u.role !== "employee") setAdminTab("overview");
  };

  const logout = () => {
    setCurrentUser(null);
    setView("login");
  };

  // Attendance
  const saveRecord = (loc) => {
    if (!currentUser) return;
    const now = new Date();
    const rec = {
      id: Date.now(),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      dateKey: todayKey(),
      dateLabel: now.toLocaleDateString(),
      checkIn: now.toISOString(),
      checkOut: null,
      location: loc,
      hours: 0
    };
    setAttendanceRecords(p => [...p, rec]);
    alert("Checked in successfully!");
  };

  const checkIn = () => {
    if (!currentUser) return;
    const existing = attendanceRecords.find(
      r => r.employeeId === currentUser.id && r.dateKey === todayKey() && !r.checkOut
    );
    if (existing) {
      alert("Already checked in.");
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => saveRecord(`${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`),
        () => saveRecord("Manual/Unknown"),
        { timeout: 5000 }
      );
    } else {
      saveRecord("Manual/Unsupported");
    }
  };

  const checkOut = () => {
    if (!currentUser) return;
    const rec = attendanceRecords.find(
      r => r.employeeId === currentUser.id && r.dateKey === todayKey() && !r.checkOut
    );
    if (!rec) {
      alert("No active check-in found for today");
      return;
    }
    const now = new Date();
    const hrs = (now - new Date(rec.checkIn)) / (1000 * 60 * 60);
    setAttendanceRecords(p =>
      p.map(r =>
        r.id === rec.id
          ? { ...r, checkOut: now.toISOString(), hours: Number(hrs.toFixed(2)) }
          : r
      )
    );
    alert("Checked out successfully!");
  };

  // Leaves
  const submitLeave = (ld) => {
    if (!currentUser) return;
    const emp = employees.find(e => e.id === currentUser.id);
    const bal = emp?.leaveBalance?.[ld.type] ?? 0;
    if (bal <= 0) {
      alert("Insufficient leave balance for " + ld.type);
      return;
    }
    const nl = {
      id: Date.now(),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      ...ld,
      isPaid: false,
      status: "pending"
    };
    setLeaveRequests(p => [...p, nl]);
    setModal(null);
    alert("Leave request submitted!");
    const targets = new Set();
    if (emp?.reportingManagerId) {
      targets.add(emp.reportingManagerId);
    } else {
      employees.filter(u => u.role === "hr" || u.role === "admin").forEach(u => targets.add(u.id));
    }
    Array.from(targets).forEach(uid => {
      if (uid !== currentUser.id)
        pushNotification(uid, `${currentUser.name} requested ${ld.type} leave on ${ld.date}.`);
    });
  };

  const cancelLeave = (id) =>
    setLeaveRequests(p =>
      p.map(l => (l.id === id && l.status === "pending" ? { ...l, status: "cancelled" } : l))
    );

  const decideLeave = (id, status) => {
    const lv = leaveRequests.find(l => l.id === id);
    if (!lv) return;
    const emp = employees.find(e => e.id === lv.employeeId);
    if (status !== "approved" && status !== "rejected") return;
    setLeaveRequests(p => p.map(l => (l.id === id ? { ...l, status } : l)));
    if (status === "approved" && emp && lv.status === "pending") {
      const t = lv.type;
      setEmployees(ps =>
        ps.map(e => {
          if (e.id !== emp.id) return e;
          const cur = e.leaveBalance?.[t] ?? 0;
          return { ...e, leaveBalance: { ...e.leaveBalance, [t]: Math.max(0, cur - 1) } };
        })
      );
    }
    if (emp) pushNotification(emp.id, `Your leave on ${lv.date} was ${status}.`);
  };

  // Documents
  const uploadDocument = (d) => {
    const doc = {
      id: Date.now(),
      employeeId: d.employeeId,
      title: d.title,
      docType: d.docType,
      fileName: d.fileName,
      url: d.url,
      shared: false,
      uploadedById: currentUser?.id,
      date: new Date().toISOString()
    };
    setDocuments(p => [...p, doc]);
    setModal(null);
    alert("Document uploaded!");
  };

  const toggleShareDoc = (id) =>
    setDocuments(p => p.map(x => (x.id === id ? { ...x, shared: !x.shared } : x)));

  const deleteDoc = (id) => setDocuments(p => p.filter(x => x.id !== id));

  // Tasks
  const addTask = (t) => {
    const task = {
      id: Date.now(),
      title: t.title,
      description: t.description,
      assignedTo: t.assignedTo,
      deadline: t.deadline,
      status: "todo",
      priority: t.priority || "general",
      link: t.link || "",
      createdAt: new Date().toISOString(),
      createdById: currentUser?.id,
      attachmentUrl: t.attachmentUrl || "",
      attachmentName: t.attachmentName || ""
    };
    setTasks(p => [...p, task]);
    setModal(null);
    alert("Task created!");
    notifyTaskChange(task, "created");
  };

  const updateTask = (id, status) => {
    setTasks(p =>
      p.map(t => {
        if (t.id === id) {
          const nt = { ...t, status };
          notifyTaskChange(nt, "updated");
          return nt;
        }
        return t;
      })
    );
  };

  const deleteTask = (id) => {
    const tsk = tasks.find(x => x.id === id);
    setTasks(p => p.filter(t => t.id !== id));
    if (tsk) notifyTaskChange(tsk, "deleted");
    setModal(null);
  };

  const startEditTask = (id) => {
    setEditTaskId(id);
    setModal("edit-task");
  };

  const saveEditedTask = (payload) => {
    const id = editTaskId;
    if (!id) return;
    setTasks(p => p.map(t => (t.id === id ? { ...t, ...payload } : t)));
    const after = tasks.find(t => t.id === id);
    if (after) notifyTaskChange({ ...after, ...payload }, "updated");
    setModal(null);
    setEditTaskId(null);
  };

  // Employee Management
  const addEmployee = (emp) => {
    const newEmployee = {
      id: Date.now(),
      name: emp.name,
      email: emp.email,
      password: emp.password || "emp123",
      role: emp.role || "employee",
      office: emp.office || "Headquarters",
      department: emp.department || DEPARTMENTS[0],
      dob: emp.dob || null,
      doj: emp.doj || new Date().toISOString().split("T")[0],
      active: true,
      reportingManagerId: null,
      leaveBalance: { sick: 6, casual: 12, emergency: 3 }
    };
    setEmployees(p => [...p, newEmployee]);
    setModal(null);
    alert("Employee added successfully!");
  };

  const changeEmpOffice = (id, o) =>
    setEmployees(p => p.map(e => (e.id === id ? { ...e, office: o } : e)));

  const changeEmpRole = (id, r) =>
    setEmployees(p => p.map(e => (e.id === id ? { ...e, role: r } : e)));

  const changeReportingManager = (id, rmId) =>
    setEmployees(p => p.map(e => (e.id === id ? { ...e, reportingManagerId: rmId } : e)));

  const toggleEmpActive = (id) =>
    setEmployees(p =>
      p.map(e => (e.id === id ? { ...e, active: e.active === false ? true : false } : e))
    );

  const resetPassword = (id) => {
    const np = Math.random().toString(36).slice(-8);
    setEmployees(p => p.map(e => (e.id === id ? { ...e, password: np } : e)));
    const target = employees.find(e => e.id === id);
    alert(`${target?.name || "User"}'s new password: ${np}`);
  };

  const addOffice = (name) => {
    setOffices(p => (p.includes(name) ? p : [...p, name]));
    setModal(null);
  };

  // Hiring
  const addJob = (f) => {
    setJobs(p => [
      ...p,
      { id: Date.now(), ...f, active: true, date: new Date().toISOString() }
    ]);
    setModal(null);
  };

  const toggleJob = (id) =>
    setJobs(p => p.map(j => (j.id === id ? { ...j, active: j.active === false ? true : false } : j)));

  const deleteJob = (id) => setJobs(p => p.filter(j => j.id !== id));

  // Projects
  const addProject = (p) => {
    const proj = {
      id: Date.now(),
      name: p.name,
      quantity: p.quantity,
      deadline: p.deadline,
      status: p.status || "not_started",
      link: p.link || "",
      attachmentUrl: p.attachmentUrl || "",
      attachmentName: p.attachmentName || ""
    };
    setProjects(prev => [...prev, proj]);
    setModal(null);
    alert("Project added!");
  };

  const updateProject = (id, patch) => {
    setProjects(prev => prev.map(pr => (pr.id === id ? { ...pr, ...patch } : pr)));
  };

  // Announcements
  const addAnnouncement = (a) => {
    setAnnouncements(p => [
      ...p,
      { id: Date.now(), title: a.title, message: a.message, date: new Date().toISOString() }
    ]);
    setModal(null);
  };

  // Holidays
  const addHoliday = (h) => {
    setHolidays(p => [...p, { id: Date.now(), date: h.date, name: h.name }]);
    setModal(null);
  };

  // EOD
  const addEOD = (entry) => {
    if (!currentUser) return;
    const eo = {
      id: Date.now(),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      dateKey: entry.date,
      project: entry.project,
      task: entry.task,
      notes: entry.notes || "",
      hours: entry.hours
    };
    setEods(p => [...p, eo]);
    setModal(null);
    alert("EOD saved!");
  };

  // Celebrations
  const addCelebration = (f) => {
    setCelebrations(p => [...p, { id: Date.now(), ...f }]);
    setModal(null);
  };

  // Goals
  const addGoal = (g) => {
    if (!currentUser) return;
    setGoals(p => [...p, { id: Date.now(), userId: currentUser.id, date: g.date, text: g.text }]);
    setModal(null);
  };

  // Achievements
  const addAchievement = (a) => {
    if (!currentUser) return;
    setAchievements(p => [
      ...p,
      { id: Date.now(), userId: currentUser.id, date: a.date, text: a.text }
    ]);
    setModal(null);
  };

  // Celebrations
  const setEmpDate = ({ employeeId, type, date }) => {
    setEmployees(p =>
      p.map(e => (e.id === employeeId ? { ...e, [type]: new Date(date).toISOString() } : e))
    );
  };

  const wishEmp = (employeeId, kind) => {
    const target = employees.find(e => e.id === employeeId);
    if (!currentUser || !target) return;
    const pair = [currentUser.id, target.id].slice().sort((a, b) => a - b).join(",");
    let conv = conversations.find(
      c => c.type === "dm" && c.memberIds.slice().sort().join(",") === pair
    );
    if (!conv) {
      conv = { id: Date.now(), type: "dm", memberIds: [currentUser.id, target.id] };
      setConversations(p => [...p, conv]);
    }
    const message =
      kind === "birthday"
        ? `Happy Birthday, ${target.name}!`
        : `Happy Work Anniversary, ${target.name}!`;
    setSelectedConvId(conv.id);
    setChatOpen(true);
    setChatDraft(message);
  };

  // Chat
  const openChat = () => setChatOpen(true);
  const closeChat = () => setChatOpen(false);

  const createConversation = ({ memberIds, name }) => {
    const uniq = Array.from(new Set(memberIds));
    const isGroup = uniq.length > 2;
    if (!isGroup) {
      const existing = conversations.find(
        c =>
          c.type === "dm" &&
          c.memberIds.slice().sort().join(",") === uniq.slice().sort().join(",")
      );
      if (existing) {
        setSelectedConvId(existing.id);
        setShowNewChat(false);
        return;
      }
    }
    const conv = {
      id: Date.now(),
      type: isGroup ? "group" : "dm",
      memberIds: uniq,
      name: isGroup ? name : undefined
    };
    setConversations(p => [...p, conv]);
    setSelectedConvId(conv.id);
    setShowNewChat(false);
  };

  const selectConv = (id) => setSelectedConvId(id);

  const sendMessage = (conversationId, body) => {
    const msg = {
      id: Date.now(),
      conversationId,
      senderId: currentUser.id,
      body,
      date: new Date().toISOString()
    };
    setMessages(p => [...p, msg]);
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      const preview = `${body.slice(0, 40)}${body.length > 40 ? "..." : ""}`;
      const allTargets = conv.memberIds.filter(uid => uid !== currentUser.id);
      const mentionNames = Array.from(
        new Set((body.match(/@([A-Za-z][A-Za-z0-9_]*)/g) || []).map(m => m.slice(1).toLowerCase()))
      );
      const mentionedIds = employees
        .filter(e => mentionNames.includes((e.name.split(" ")[0] || "").toLowerCase()))
        .map(e => e.id);
      const targets = new Set(allTargets);
      mentionedIds.forEach(id => {
        if (allTargets.includes(id)) targets.add(id);
      });
      Array.from(targets).forEach(uid =>
        pushNotification(uid, `New message from ${currentUser.name}: ${preview}`)
      );
    }
  };

  // Notifications
  const openNotifs = () => setNotifOpen(true);

  const markAllRead = () =>
    setNotifications(p => p.map(n => (n.userId === currentUser?.id ? { ...n, read: true } : n)));

  const clearAllNotifs = () =>
    setNotifications(p => p.filter(n => n.userId !== currentUser?.id));

  // Computed values
  const assignableEmployees = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "admin" || currentUser.role === "hr")
      return employees.filter(
        e => ["employee", "hr", "sub_admin"].includes(e.role) && e.active !== false
      );
    return employees.filter(
      e => e.role === "employee" && e.reportingManagerId === currentUser.id && e.active !== false
    );
  }, [employees, currentUser]);

  const currentUserLeaveBalance = currentUser
    ? employees.find(e => e.id === currentUser.id)?.leaveBalance || {
        sick: 0,
        casual: 0,
        emergency: 0
      }
    : { sick: 0, casual: 0, emergency: 0 };

  const myNotifs = notifications.filter(n => n.userId === currentUser?.id).slice().reverse();

  return {
    // State
    currentUser,
    employees,
    attendanceRecords,
    leaveRequests,
    tasks,
    announcements,
    holidays,
    eods,
    documents,
    notifications,
    view,
    currentTime,
    adminTab,
    offices,
    modal,
    notifOpen,
    jobs,
    celebrations,
    goals,
    achievements,
    chatOpen,
    conversations,
    messages,
    selectedConvId,
    showNewChat,
    chatDraft,
    editTaskId,
    projects,
    // Setters
    setModal,
    setAdminTab,
    setNotifOpen,
    setChatOpen,
    setShowNewChat,
    setChatDraft,
    setEditTaskId,
    // Actions
    login,
    logout,
    checkIn,
    checkOut,
    submitLeave,
    cancelLeave,
    decideLeave,
    uploadDocument,
    toggleShareDoc,
    deleteDoc,
    addTask,
    updateTask,
    deleteTask,
    startEditTask,
    saveEditedTask,
    addEmployee,
    changeEmpOffice,
    changeEmpRole,
    changeReportingManager,
    toggleEmpActive,
    resetPassword,
    addOffice,
    addJob,
    toggleJob,
    deleteJob,
    addProject,
    updateProject,
    addAnnouncement,
    addHoliday,
    addEOD,
    addCelebration,
    addGoal,
    addAchievement,
    setEmpDate,
    wishEmp,
    openChat,
    closeChat,
    createConversation,
    selectConv,
    sendMessage,
    openNotifs,
    markAllRead,
    clearAllNotifs,
    // Computed
    assignableEmployees,
    currentUserLeaveBalance,
    myNotifs
  };
};

