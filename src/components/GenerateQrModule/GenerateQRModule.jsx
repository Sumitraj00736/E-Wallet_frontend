// src/components/GenerateQR/GenerateQRModule.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthContext } from "../../context/AuthContext";

export default function GenerateQRModule() {
  const { generateQR } = useAuthContext();

  const [amount, setAmount] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateQR = async () => {
    if (!amount) return alert("Enter amount");

    setLoading(true);
    try {
      const res = await generateQR(Number(amount));
      setQrCode(encodeURIComponent(res.id));
      setAmount("");
    } catch (err) {
      alert("QR generation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- styles ---------- */
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
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
  };

  return (
    <motion.div
      style={cardStyle}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={titleStyle}>Generate QR Code</div>

      <input
        style={inputStyle}
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <motion.button
        style={buttonStyle}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleGenerateQR}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate QR"}
      </motion.button>

      {qrCode && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${qrCode}&size=150x150`}
            alt="QR Code"
          />
        </div>
      )}
    </motion.div>
  );
}
