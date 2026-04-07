import { useState } from "react";
import { authService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Star, Eye, Sparkles, Smile, Sun } from "lucide-react";

const Signup = ({ setAuth }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "COMMUTER" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.signup(formData);
      if (res.data.status === "success") {
        setAuth(res.data.data.user);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="hero-container" style={{ minHeight: "calc(100vh - 80px)", margin: 0 }}>
      <Star className="shape shape-1" />
      <Smile className="shape shape-3" />
      <Sun className="shape shape-4" />
      <Sparkles className="shape shape-2" style={{ top: '60%', left: '15%', animationDelay: '-1s' }} />
      <form onSubmit={handleSignup} className="main-card form-grid" style={{ maxWidth: "480px", width: "100%", display: "flex", flexDirection: "column", flex: "none", margin: "auto" }}>
        <h2 className="section-title" style={{ color: "var(--accent-blue)", fontSize: "2.5rem", marginBottom: "0.5rem" }}>Create Account</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Join SmartBus to track, book, and manage rides.</p>
        
        {error && <div style={{ color: "#ff4d4f", background: "rgba(255, 77, 79, 0.1)", padding: "0.5rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "left" }}>{error}</div>}

        <div className="form-group" style={{ textAlign: "left" }}>
          <label>Full Name</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ textAlign: "left" }}>
          <label>Email</label>
          <input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        
        <div className="form-group" style={{ textAlign: "left" }}>
          <label>Password</label>
          <input
            required
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ textAlign: "left" }}>
          <label>I am a...</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="COMMUTER">Commuter</option>
            <option value="OPERATOR">Operator</option>
          </select>
        </div>

        <button type="submit" className="primary-btn" style={{ background: "var(--accent-blue)", color: "#000" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
