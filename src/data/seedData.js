import { todayKey } from '../utils/helpers';

/**
 * Seed Data - Initial data for the application
 */
export const seedEmployees = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@company.com",
    password: "admin123",
    role: "admin",
    office: "Headquarters",
    department: "HR",
    dob: "1988-03-10",
    doj: "2019-01-15",
    active: true,
    reportingManagerId: null,
    leaveBalance: { sick: 6, casual: 12, emergency: 3 }
  },
  {
    id: 2,
    name: "Sub Admin",
    email: "sub@company.com",
    password: "sub123",
    role: "sub_admin",
    office: "Headquarters",
    department: "Engineering",
    dob: "1991-07-05",
    doj: "2021-06-01",
    active: true,
    reportingManagerId: 1,
    leaveBalance: { sick: 6, casual: 12, emergency: 3 }
  },
  {
    id: 3,
    name: "HR Manager",
    email: "hr@company.com",
    password: "hr123",
    role: "hr",
    office: "Branch Office",
    department: "HR",
    dob: "1990-11-20",
    doj: "2020-10-10",
    active: true,
    reportingManagerId: 1,
    leaveBalance: { sick: 6, casual: 12, emergency: 3 }
  },
  {
    id: 4,
    name: "John Doe",
    email: "john@company.com",
    password: "emp123",
    role: "employee",
    office: "Headquarters",
    department: "Quality Assurance",
    dob: "1995-12-01",
    doj: "2022-12-15",
    active: true,
    reportingManagerId: 3,
    leaveBalance: { sick: 6, casual: 12, emergency: 3 }
  },
  {
    id: 5,
    name: "Jane Smith",
    email: "jane@company.com",
    password: "emp123",
    role: "employee",
    office: "Branch Office",
    department: "Marketing",
    dob: "1993-02-18",
    doj: "2023-08-07",
    active: true,
    reportingManagerId: 2,
    leaveBalance: { sick: 6, casual: 12, emergency: 3 }
  }
];

export const seedAnnouncements = [
  {
    id: 1001,
    title: "Welcome to AttendX",
    message: "Log attendance, EOD, goals & achievements; see tasks, leaves, docs, hiring & chat.",
    date: new Date().toISOString()
  }
];

export const seedHolidays = [
  {
    id: 2001,
    date: new Date(new Date().getFullYear(), 10, 12).toISOString(),
    name: "Diwali"
  }
];

export const seedConversations = [
  { id: 3001, type: "dm", memberIds: [1, 3] }
];

export const seedMessages = [
  {
    id: 4001,
    conversationId: 3001,
    senderId: 1,
    body: "Welcome to AttendX chat!",
    date: new Date().toISOString()
  }
];

export const seedJobs = [
  {
    id: 5001,
    title: "Senior Video Editor",
    department: "Engineering",
    location: "Noida / Hybrid",
    description: "Own end-to-end edits for OTT-style content.",
    applyUrl: "https://example.com/apply",
    active: true,
    date: new Date().toISOString()
  }
];

export const seedProjects = [
  {
    id: 6001,
    name: "CEO's Wife Series",
    quantity: "60 Episodes",
    deadline: todayKey(),
    status: "in_progress"
  }
];

