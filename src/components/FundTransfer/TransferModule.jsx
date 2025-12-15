// src/components/FundTransfer/TransferModule.jsx
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function TransferModule() {
  const { users, user, fetchUsers, transferFunds } = useAuthContext();

  const [receiverId, setReceiverId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // ---------------- Fetch users on mount ----------------
  useEffect(() => {
    if (user && (!users || users.length === 0)) {
      fetchUsers().catch((err) => console.error("Failed to fetch users:", err));
    }
  }, [user, users, fetchUsers]);

  const handleSendClick = () => {
    if (!receiverId || !transferAmount) {
      alert("Select receiver & enter amount");
      return;
    }
    setShowPasswordModal(true);
  };

  const handleTransfer = async () => {
    if (!password) return alert("Enter your password");

    setLoading(true);
    try {
      await transferFunds(receiverId, Number(transferAmount), password);
      alert("Transfer successful!");
      setReceiverId("");
      setTransferAmount("");
      setPassword("");
      setShowPasswordModal(false);
    } catch (err) {
      alert("Transfer failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Styles ----------------
  const cardStyle = {
    background: "#1a1a1a",
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    border: "1px solid #2e2e2e",
    boxShadow: "0 0 15px #d4a017",
  };

  const inputStyle = {
    width: "94%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#121212",
    color: "#f5f5f5",
    fontSize: "14px",
    outline: "none",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#d4a017",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
    fontSize: "15px",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#333",
    color: "#f5f5f5",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalCardStyle = {
    background: "#1a1a1a",
    padding: "30px",
    borderRadius: "15px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 0 15px #d4a017",
  };

  const modalTitleStyle = {
    color: "#f5f5f5",
    textAlign: "center",
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      style={cardStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div style={titleStyle}>Transfer Funds</div>

      {/* ---------------- Dropdown ---------------- */}
      <div style={{ position: "relative" }}>
        <motion.div
          style={{
            padding: "12px",
            borderRadius: "8px",
            background: "#121212",
            color: receiverId ? "#f5f5f5" : "#aaa",
            border: "1px solid #333",
            cursor: "pointer",
          }}
          onClick={() => setDropdownOpen((prev) => !prev)}
          whileHover={{ scale: 1.02 }}
        >
          {receiverId
            ? users?.find((u) => u.id === receiverId)?.name
            : fetchingUsers
            ? "Loading users..."
            : "Select Receiver"}
        </motion.div>

        <AnimatePresence>
          {dropdownOpen && users && users.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dropdownVariants}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                width: "100%",
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                maxHeight: "150px",
                overflowY: "auto",
                zIndex: 10,
                boxShadow: "0 0 10px #d4a017",
              }}
            >
              {users
                .filter((u) => u.id !== user.id)
                .map((u) => (
                  <div
                    key={u.id}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #2e2e2e",
                    }}
                    onClick={() => {
                      setReceiverId(u.id);
                      setDropdownOpen(false);
                    }}
                  >
                    {u.name} ({u.email})
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- Amount Input ---------------- */}
      <input
        style={inputStyle}
        type="number"
        placeholder="Enter amount"
        value={transferAmount}
        onChange={(e) => setTransferAmount(e.target.value)}
      />

      <motion.button
        style={buttonStyle}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSendClick}
      >
        Send
      </motion.button>

      {/* ---------------- Password Modal ---------------- */}
      {showPasswordModal && (
        <div style={modalOverlayStyle}>
          <motion.div
            style={modalCardStyle}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 style={modalTitleStyle}>Enter Password</h3>
            <input
              style={inputStyle}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <motion.button
              style={buttonStyle}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTransfer}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Transfer"}
            </motion.button>
            <motion.button
              style={cancelButtonStyle}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </motion.button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
