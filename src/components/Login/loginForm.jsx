// src/pages/Login.jsx
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import LoginHeader from "../components/LoginHeader";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login({ email, password });
      navigate("/wallet");
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <>

      {/* Page */}
      <motion.div
        style={styles.page}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          style={styles.card}
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 style={styles.title}>Sign in to QCK Wallet</h2>
          <p style={styles.subtitle}>Secure access to your wallet</p>

          <motion.input
            style={styles.input}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            whileFocus={styles.focus}
          />

          <motion.input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            whileFocus={styles.focus}
          />

          <motion.button
            style={styles.button}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLogin}
          >
            Login
          </motion.button>

          <div style={styles.footer}>
            <span>New to QCK?</span>
            <span style={styles.link}>Create account</span>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 64px)", // header height
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    background: "radial-gradient(circle at top, #1a1a1a, #000)",
  },

  card: {
    maxWidth: "420px",
    width: "100%",
    padding: "32px",
    borderRadius: "18px",
    backdropFilter: "blur(14px)",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#f5f5f5",
    boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  title: {
    textAlign: "center",
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "4px",
  },

  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#bdbdbd",
    marginBottom: "12px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#121212",
    color: "#e3e3e3",
    fontSize: "15px",
    outline: "none",
  },

  focus: {
    scale: 1.02,
    borderColor: "#d4a017",
    boxShadow: "0 0 6px #d4a017",
  },

  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#d4a017",
    color: "#000",
    fontWeight: "700",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    marginTop: "8px",
  },

  footer: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#aaa",
  },

  link: {
    color: "#d4a017",
    cursor: "pointer",
    fontWeight: "600",
  },
};
