import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loggingIn, setLoggingIn] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoggingIn(false);
        return;
      }

      // Store auth token and redirect to dashboard
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <div className="bg-surface rounded-lg shadow-card p-8 max-w-md w-full border border-border-subtle">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">SMM Automation</h2>

        {error && (
          <div className="mb-4 p-3 border-l-4 border-negative bg-negative-soft">
            <p className="text-sm text-secondary">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-secondary">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-surface border border-border-subtle rounded-md px-3 py-2 text-primary placeholder-secondary focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-secondary">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface border border-border-subtle rounded-md px-3 py-2 text-primary placeholder-secondary focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full bg-accent text-accent-on hover:bg-accent-strong text-sm font-medium py-2 rounded-md transition-colors"
          >
            {loggingIn ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-tertiary mt-4">
          Don't have an account? {" "}
          <a href="/register" className="underline underline-accent hover:text-accent-strong">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}