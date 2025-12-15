import React from "react";
import { Link, useLocation } from "react-router-dom";

const LoginHeader = () => {
  const location = useLocation();
  const isRegister = location.pathname === "/register";

  return (
    <>
      <header style={styles.header}>
        {/* Logo */}
        <div style={styles.logo}>QCK Wallet</div>

        {/* Actions */}
        <div style={styles.actions}>
          <Link to="/register" style={styles.link}>
            <button
              style={
                isRegister ? styles.primaryBtn : styles.outlineBtn
              }
            >
              Register
            </button>
          </Link>

          <Link to="/login" style={styles.link}>
            <button
              style={
                isRegister ? styles.outlineBtn : styles.primaryBtn
              }
            >
              Login
            </button>
          </Link>
        </div>
      </header>

      <div style={styles.separator}></div>
    </>
  );
};

const styles = {
  header: {
    height: "64px",
    backgroundColor: "#000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 32px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
  },

  logo: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "2px",
    cursor: "pointer",
  },

  actions: {
    display: "flex",
    gap: "12px",
  },

  link: {
    textDecoration: "none",
  },

  primaryBtn: {
    backgroundColor: "#d4a017",
    color: "#000000",
    border: "none",
    padding: "8px 20px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },

  outlineBtn: {
    backgroundColor: "transparent",
    color: "#d4a017",
    border: "1px solid #d4a017",
    padding: "8px 20px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },

  separator: {
    height: "1px",
    backgroundColor: "#ffffff",
  },
};

export default LoginHeader;
