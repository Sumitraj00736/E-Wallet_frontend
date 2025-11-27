// src/pages/Wallet.jsx
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Wallet() {
  const {
    walletBalance,
    user,
    users,
    fetchUsers,
    topUpWallet,
    transferFunds,
    qrData,
    generateQR,
    setScannedQrData,
  } = useAuthContext();

  const [topupAmount, setTopupAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [qrAmount, setQrAmount] = useState("");
  const [generatedQr, setGeneratedQr] = useState(null);
  const [scanError, setScanError] = useState(null);

  // Fetch all users (once logged in)
  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  // ---------------- QR SCANNER INITIALIZATION -------------------
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (data) => {
        try {
          const parsed = JSON.parse(data); // data must be { userId, amount }

          if (!parsed.userId || !parsed.amount) {
            setScanError("Invalid QR Code: missing required fields");
            return;
          }

          setScanError(null);
          setScannedQrData(parsed);
        } catch (e) {
          setScanError("Invalid QR Code format");
        }
      },
      (err) => {
        setScanError("Camera error: " + err);
      }
    );

    return () => scanner.clear();
  }, []);

  // ---------------- Wallet Actions -------------------
  const handleTopup = async () => {
    if (!topupAmount) return alert("Enter amount");
    try {
      await topUpWallet(Number(topupAmount));
      setTopupAmount("");
      alert("Wallet topped up successfully!");
    } catch (err) {
      alert("Top-up failed: " + err.message);
    }
  };

  const handleTransfer = async () => {
    if (!receiverId || !transferAmount)
      return alert("Select user & enter amount");
    try {
      await transferFunds(receiverId, Number(transferAmount));
      setTransferAmount("");
      setReceiverId("");
      alert("Transfer successful!");
    } catch (err) {
      alert("Transfer failed: " + err.message);
    }
  };

  const handleGenerateQR = async () => {
    if (!qrAmount) return alert("Enter amount");

    try {
      const res = await generateQR(Number(qrAmount)); // backend returns {qrCodeData: JSON.stringify({...})}

      // Must encode JSON before placing inside IMG URL
      const encoded = encodeURIComponent(res.qrCodeData);

      setGeneratedQr(encoded);
      setQrAmount("");
    } catch (err) {
      alert("QR generation failed: " + err.message);
    }
  };

  const handlePayQr = async () => {
    if (!qrData) return alert("Invalid QR");

    try {
      await transferFunds(qrData.userId, qrData.amount);
      setScannedQrData(null);
      alert("Payment successful!");
    } catch (err) {
      alert("Payment failed: " + err.message);
    }
  };

  // ---------------- Inline Styles -------------------
  const containerStyle = {
    maxWidth: "450px",
    margin: "40px auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    color: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
    background: "#0d0d0d",
    minHeight: "100vh",
  };

  const cardStyle = {
    background: "#1a1a1a",
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    border: "1px solid #2e2e2e",
    boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
  };

  const inputStyle = {
    width: "100%",
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

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  return (
    <div style={containerStyle}>

      {/* ---------------- QR Scanner ---------------- */}
      <motion.div style={cardStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={titleStyle}>Scan QR Code</div>
        <div id="qr-reader" style={{ width: "100%", borderRadius: "10px" }}></div>

        {scanError && <p style={{ color: "red" }}>{scanError}</p>}

        {qrData && (
          <motion.button
            style={buttonStyle}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePayQr}
          >
            Pay ₹{qrData.amount}
          </motion.button>
        )}
      </motion.div>

      {/* ---------------- Balance ---------------- */}
      <motion.h2
        style={{ textAlign: "center", fontSize: "28px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Wallet Balance: ₹ {walletBalance.toFixed(2)}
      </motion.h2>

      {/* ---------------- Top Up ---------------- */}
      <motion.div style={cardStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={titleStyle}>Top-Up Wallet</div>
        <input
          style={inputStyle}
          type="number"
          placeholder="Enter amount"
          value={topupAmount}
          onChange={(e) => setTopupAmount(e.target.value)}
        />
        <motion.button
          style={buttonStyle}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTopup}
        >
          Top Up
        </motion.button>
      </motion.div>

      {/* ---------------- Transfer ---------------- */}
      <motion.div style={cardStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={titleStyle}>Transfer Funds</div>
        <select
          style={inputStyle}
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        >
          <option value="">Select Receiver</option>
          {users
            .filter((u) => u.id !== user.id)
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
        </select>

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
          onClick={handleTransfer}
        >
          Send
        </motion.button>
      </motion.div>

      {/* ---------------- Generate QR ---------------- */}
      <motion.div style={cardStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={titleStyle}>Generate QR Code</div>
        <input
          style={inputStyle}
          type="number"
          placeholder="Enter amount"
          value={qrAmount}
          onChange={(e) => setQrAmount(e.target.value)}
        />

        <motion.button
          style={buttonStyle}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateQR}
        >
          Generate QR
        </motion.button>

        {generatedQr && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${generatedQr}&size=150x150`}
              alt="QR Code"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
