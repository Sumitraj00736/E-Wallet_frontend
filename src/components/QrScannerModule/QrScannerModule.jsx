// src/components/QrScannerModule/QrScannerModule.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useAuthContext } from "../../context/AuthContext";

const QrScannerModule = () => {
  const { qrData, setScannedQrData, payWithQr } = useAuthContext();
  const [scanError, setScanError] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (data) => {
        try {
          const parsed = JSON.parse(data); // expects { userId, amount }

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
      (err) => setScanError("Camera error: " + err)
    );

    return () => scanner.clear();
  }, [setScannedQrData]);

  const handlePayQr = async () => {
    if (!qrData) return alert("Invalid QR");

    try {
      await payWithQr(qrData.id);
      alert("Payment successful!");
    } catch (err) {
      alert("Payment failed: " + (err.message || err));
    }
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
  );
};

export default QrScannerModule;
