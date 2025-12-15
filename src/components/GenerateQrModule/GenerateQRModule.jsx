// src/components/GenerateQR/GenerateQRModule.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "../../context/AuthContext";

export default function GenerateQRModule() {
  const { generateQR } = useAuthContext();

  const [amount, setAmount] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateQR = async () => {
    if (!amount || Number(amount) <= 0) {
      return alert("Please enter a valid amount");
    }

    setLoading(true);
    try {
      const res = await generateQR(Number(amount));
      console.log("Generated QR response:", res);
      
      // Store the raw ID (this is what the scanner will read)
      const qrId = res.id;
      setQrData({ id: qrId, amount: Number(amount) });
      
      // Create QR code with the ID
      setQrCode(qrId);
      setAmount("");
    } catch (err) {
      console.error("QR generation error:", err);
      alert("QR generation failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQrCode(null);
    setQrData(null);
    setAmount("");
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
    boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
    maxWidth: "400px",
    margin: "0 auto"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#121212",
    color: "#f5f5f5",
    fontSize: "16px",
    boxSizing: "border-box"
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
    fontSize: "16px"
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center"
  };

  return (
    <motion.div
      style={cardStyle}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={titleStyle}>Generate QR Code</div>

      <AnimatePresence mode="wait">
        {!qrCode ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div>
              <label style={{ 
                color: "#888", 
                fontSize: "12px", 
                marginBottom: "5px",
                display: "block"
              }}>
                Amount to Receive
              </label>
              <input
                style={inputStyle}
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleGenerateQR();
                }}
              />
            </div>

            <motion.button
              style={buttonStyle}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateQR}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate QR Code"}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="qr"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              alignItems: "center"
            }}
          >
            {/* QR Code Display */}
            <div style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(212,160,23,0.3)"
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCode)}&size=200x200`}
                alt="QR Code"
                style={{
                  display: "block",
                  width: "200px",
                  height: "200px"
                }}
              />
            </div>

            {/* QR Info */}
            <div style={{
              width: "100%",
              background: "#0f0f0f",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #333"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px"
              }}>
                <span style={{ color: "#888", fontSize: "14px" }}>Amount:</span>
                <span style={{ 
                  color: "#d4a017", 
                  fontWeight: "bold",
                  fontSize: "16px" 
                }}>
                  ${qrData?.amount || 0}
                </span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between"
              }}>
                <span style={{ color: "#888", fontSize: "14px" }}>QR ID:</span>
                <span style={{ 
                  color: "#888", 
                  fontSize: "12px",
                  fontFamily: "monospace"
                }}>
                  {qrData?.id?.substring(0, 8)}...
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div style={{
              textAlign: "center",
              color: "#888",
              fontSize: "14px",
              padding: "10px"
            }}>
              📸 Show this QR code to receive payment
            </div>

            {/* Generate Another Button */}
            <motion.button
              style={{
                ...buttonStyle,
                background: "transparent",
                border: "1px solid #333",
                color: "#d4a017"
              }}
              whileHover={{ scale: 1.03, borderColor: "#d4a017" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
            >
              Generate Another QR
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}