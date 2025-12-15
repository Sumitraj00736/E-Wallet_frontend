// src/components/Topup/TopUpCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthContext } from "../../context/AuthContext";

const TopUpCard = () => {
  const { topUpWallet } = useAuthContext();
  const [topupAmount, setTopupAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopup = async () => {
    if (!topupAmount || Number(topupAmount) <= 0) {
      return alert("Enter a valid amount");
    }

    setLoading(true);
    try {
      await topUpWallet(Number(topupAmount));
      setTopupAmount("");
      alert("Wallet topped up successfully!");
    } catch (err) {
      alert("Top-up failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: "#1a1a1a",
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    border: "2px solid #b7870eff 0 0 #fffff", // yellow accent border
    boxShadow: "0 8px 20px rgba(212,160,23,0.4)",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#d4a017",
    textAlign: "center",
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
    cursor: loading ? "not-allowed" : "pointer",
    border: "none",
    fontSize: "15px",
  };

  return (
    <motion.div style={cardStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={titleStyle}>Top-Up Wallet</div>
      <input
        style={inputStyle}
        type="number"
        placeholder="Enter amount"
        value={topupAmount}
        onChange={(e) => setTopupAmount(e.target.value)}
        disabled={loading}
      />
      <motion.button
        style={buttonStyle}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTopup}
        disabled={loading}
      >
        {loading ? "Processing..." : "Top Up"}
      </motion.button>
    </motion.div>
  );
};

export default TopUpCard;
