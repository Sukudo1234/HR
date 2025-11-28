import React, { useState, useCallback, memo, useMemo } from "react";

const DEMO_CREDENTIALS_STRING = "Demo: admin@company.com/admin123 | sub@company.com/sub123 | hr@company.com/hr123 | john@company.com/emp123";

// Parse demo credentials string into array of objects
const parseDemoCredentials = (str) => {
  if (!str || !str.includes("Demo:")) return [];
  
  const credentials = str.replace("Demo:", "").trim();
  const parts = credentials.split("|").map(p => p.trim());
  
  return parts.map(part => {
    const [email, password] = part.split("/").map(s => s.trim());
    const role = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);
    return { email, password, role };
  });
};

const Login = memo(({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const demoCredentials = useMemo(() => parseDemoCredentials(DEMO_CREDENTIALS_STRING), []);

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

  const handleQuickLogin = useCallback((demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    // Auto-submit after a brief delay for visual feedback
    setTimeout(() => {
      onLogin(demoEmail, demoPassword);
    }, 150);
  }, [onLogin]);

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
          {demoCredentials.length > 0 && (
            <div className="mt-6">
              <div className="mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--clr-text)' }}>
                  <span className="brand-dot"></span>
                  Quick Access
                </h3>
                <p className="text-xs ml-5 mt-1" style={{ color: 'var(--clr-muted)' }}>
                  Click to auto-fill and sign in
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {demoCredentials.map((cred, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickLogin(cred.email, cred.password)}
                    className="p-3 rounded-lg border text-left transition-all hover:shadow-sm"
                    style={{ 
                      borderColor: 'var(--clr-border)',
                      background: 'var(--clr-surface)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--clr-primary)';
                      e.currentTarget.style.background = 'var(--clr-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--clr-border)';
                      e.currentTarget.style.background = 'var(--clr-surface)';
                    }}
                  >
                    <div className="text-xs font-bold mb-1 uppercase" style={{ color: 'var(--clr-primary)' }}>
                      {cred.role}
                    </div>
                    <div className="text-xs font-medium truncate" style={{ color: 'var(--clr-text)' }}>
                      {cred.email}
                    </div>
                    <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--clr-muted)' }}>
                      {cred.password}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
    </div>
  );
});

Login.displayName = "Login";

export default Login;

