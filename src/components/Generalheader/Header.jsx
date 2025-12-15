// src/components/Header.jsx
import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // import navigate

const Header = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate(); // initialize navigate
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout(); // clear auth
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      navigate("/login"); // redirect to login page
    }, 1000); // simulate 1s logout process
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.container}>
          {/* Logo */}
          <div style={styles.logo}>QCK Wallet</div>

          {/* Actions */}
          <div style={styles.actions}>
            <motion.button
              style={styles.primaryBtn}
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px #d4a017" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </header>

      {/* Separator */}
      <div style={styles.separator}></div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalBackdrop}
            onClick={() => !isLoggingOut && setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={styles.modalTitle}>Confirm Logout</h2>
              <p style={styles.modalText}>Are you sure you want to logout?</p>

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <motion.button
                  style={styles.cancelBtn}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                >
                  Cancel
                </motion.button>

                <motion.button
                  style={styles.confirmBtn}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const styles = {
  header: {
    height: "84px",
    width: "100%",
    backgroundColor: "#0d0d0d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    borderRadius: "0 0 12px 12px",
    borderBottom: "2px solid #d4a017",
  },
  container: {
    width: "95%",
    maxWidth: "1200px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  primaryBtn: {
    backgroundColor: "#d4a017",
    color: "#000000",
    border: "none",
    padding: "8px 20px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 0 6px #d4a017",
  },
  separator: {
    height: "1px",
    backgroundColor: "#ffffff",
  },
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
  },
  modalContent: {
    background: "#1a1a1a",
    borderRadius: "15px",
    padding: "30px",
    width: "100%",
    maxWidth: "400px",
    border: "2px solid #d4a017",
    boxShadow: "0 8px 30px rgba(212,160,23,0.3)",
    textAlign: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: "22px",
    marginBottom: "10px",
  },
  modalText: {
    color: "#ccc",
    fontSize: "14px",
  },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #888",
    background: "transparent",
    color: "#ccc",
    cursor: "pointer",
    fontWeight: "600",
  },
  confirmBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#d4a017",
    color: "#000",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Header;
