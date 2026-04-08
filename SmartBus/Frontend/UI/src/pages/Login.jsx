import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Eye, Sparkles, Smile, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      if (user?.role === "ADMIN") navigate("/admin/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="hero-container" style={{ minHeight: "calc(100vh - 80px)", margin: 0 }}>
      <Sun className="shape shape-1" />
      <Sparkles className="shape shape-3" />
      <Eye className="shape shape-4" />
      <Star className="shape shape-2" style={{ top: '60%', left: '15%', animationDelay: '-1s' }} />
      <form onSubmit={handleLogin} className="main-card form-grid" style={{ maxWidth: "480px", width: "100%", display: "flex", flexDirection: "column", flex: "none", margin: "auto" }}>
        <h2 className="section-title" style={{ color: "var(--accent-pink)", fontSize: "2.5rem", marginBottom: "0.5rem" }}>Welcome Back</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Enter your credentials to manage your trips.</p>
        
        {error && <div style={{ color: "#ff4d4f", background: "rgba(255, 77, 79, 0.1)", padding: "0.5rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "left" }}>{error}</div>}

        <div className="form-group" style={{ textAlign: "left" }}>
          <label>Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="form-group" style={{ textAlign: "left" }}>
          <label>Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="primary-btn" style={{ background: "var(--accent-pink)", color: "#000" }}>
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
