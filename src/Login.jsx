import React, { useState } from "react";

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

const Login = ({onLogin}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Topbar />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-10 md:py-12">
        <div className="max-w-md w-full mx-auto card p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 justify-center text-[var(--clr-primary)] font-bold text-xl">
              Welcome to AttendX
            </div>
            <p className="text-[var(--clr-muted)] text-sm mt-1">Sign in to continue</p>
          </div>
          <div className="grid gap-3">
            <input
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <input
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <button
              className="btn btn-primary py-2.5"
              onClick={() => onLogin(email, password)}
            >
              Sign In
            </button>
          </div>
          <div className="mt-6 p-4 bg-[#F9FAFB] border border-[var(--clr-border)] rounded-xl text-sm">
            Demo: admin@company.com/admin123 | sub@company.com/sub123 | hr@company.com/hr123 | john@company.com/emp123
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

