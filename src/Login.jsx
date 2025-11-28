import React, { useState, useCallback, memo } from "react";

const DEMO_CREDENTIALS = "Demo: admin@company.com/admin123 | sub@company.com/sub123 | hr@company.com/hr123 | john@company.com/emp123";

const Login = memo(({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onLogin(email, password);
  }, [email, password, onLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center py-10 md:py-12">
        <div className="max-w-md w-full mx-auto card p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 justify-center text-[var(--clr-primary)] font-bold text-xl">
              Welcome to AttendX
            </div>
            <p className="text-[var(--clr-muted)] text-sm mt-1">Sign in to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-3">
            <input
              className="input"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              type="email"
              autoComplete="email"
            />
            <input
              className="input"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              type="password"
              autoComplete="current-password"
            />
            <button
              className="btn btn-primary py-2.5"
              type="submit"
            >
              Sign In
            </button>
          </form>
          <div className="mt-6 p-4 bg-[#F9FAFB] border border-[var(--clr-border)] rounded-xl text-sm">
            {DEMO_CREDENTIALS}
          </div>
        </div>
    </div>
  );
});

Login.displayName = "Login";

export default Login;

