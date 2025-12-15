// src/pages/Register.jsx
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register({ name, email, phone, password });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  const pageWrapperStyle = {
    width: "100%",
    minHeight: "auto",
    display: "flex",
    justifyContent: "center",
    padding: "30px 32px", 
    background: "radial-gradient(circle at top, #1a1a1a, #000)",
    boxSizing: "border-box",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "420px",
    padding: "30px",
    borderRadius: "18px",
    backdropFilter: "blur(12px)",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#f5f5f5",
    boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxSizing: "border-box",
    marginTop: "64px", // optional, leave space below sticky header
  };

  const titleStyle = {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "10px",
    color: "#f5f5f5",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#121212",
    color: "#e3e3e3",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    backgroundColor: "#d4a017",
    color: "#000",
    fontWeight: "bold",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    boxSizing: "border-box",
  };

  return (
    <motion.div
      style={pageWrapperStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        style={cardStyle}
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 style={titleStyle}>Create Account</h2>

        <motion.input
          style={inputStyle}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          whileFocus={{
            scale: 1.02,
            borderColor: "#d4a017",
            boxShadow: "0 0 6px #d4a017",
          }}
        />

        <motion.input
          style={inputStyle}
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          whileFocus={{
            scale: 1.02,
            borderColor: "#d4a017",
            boxShadow: "0 0 6px #d4a017",
          }}
        />

        <motion.input
          style={inputStyle}
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          whileFocus={{
            scale: 1.02,
            borderColor: "#d4a017",
            boxShadow: "0 0 6px #d4a017",
          }}
        />

        <motion.input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          whileFocus={{
            scale: 1.02,
            borderColor: "#d4a017",
            boxShadow: "0 0 6px #d4a017",
          }}
        />

        <motion.button
          style={buttonStyle}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleRegister}
        >
          Register
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
