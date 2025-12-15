import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiUser } from "react-icons/fi";

export default function BalanceModule() {
  const { walletBalance, user } = useAuthContext();
  const [showBalance, setShowBalance] = useState(false); // initially hidden

  const toggleBalance = () => setShowBalance((prev) => !prev);

  const containerStyle = {
    background: "#1a1a1a",
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    border: "1px solid #2e2e2e",
    boxShadow: "0 0 15px #d4a017", // yellow backlight
  };

  const userWrapperStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const nameStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffd700", // highlighted yellow color
  };

  const balanceWrapperStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const balanceStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#f5f5f5",
  };

  const buttonStyle = {
    background: "transparent",
    border: "none",
    color: "#d4a017",
    cursor: "pointer",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* User Name with Profile Icon */}
      <div style={userWrapperStyle}>
        <FiUser size={22} color="#d4a017" />
        <div style={nameStyle}>{user?.name || "User"}</div>
      </div>

      {/* Wallet Balance */}
      <div style={balanceWrapperStyle}>
        <div style={balanceStyle}>
          Wallet Balance: ₹ {showBalance ? walletBalance.toFixed(2) : "****"}
        </div>
        <button style={buttonStyle} onClick={toggleBalance}>
          {showBalance ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </motion.div>
  );
}
