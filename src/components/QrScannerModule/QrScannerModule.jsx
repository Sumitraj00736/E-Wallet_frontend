// src/components/QrScannerModule/QrScannerModule.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { useAuthContext } from "../../context/AuthContext";

const QrScannerModule = () => {
  const { payWithQr } = useAuthContext();
  const [qrId, setQrId] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleScan = (result) => {
    if (result) {
      console.log("QR scanned:", result); // log scanned data
      setQrId(result);
      setScanError(null);
      setShowModal(true); // show modal to pay
    }
  };

  const handleError = (err) => {
    console.error("QR scanner error:", err);
    setScanError(err?.message || "Unknown scanning error");
  };

  const handlePay = async () => {
    if (!qrId) return alert("No QR scanned");
    try {
      console.log("Paying QR ID:", qrId);
      await payWithQr(qrId);
      alert("Payment successful!");
      setQrId(null);
      setShowModal(false);
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed: " + (err.message || JSON.stringify(err)));
    }
  };

  return (
    <motion.div
      style={{
        background: "#1a1a1a",
        borderRadius: "15px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        border: "1px solid #2e2e2e",
        boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
        Scan QR Code
      </div>

      <QrReader
        onResult={(result, error) => {
          if (!!result) handleScan(result?.text);
          if (!!error) handleError(error);
        }}
        constraints={{ facingMode: "environment" }}
        containerStyle={{ width: "100%" }}
      />

      {scanError && <p style={{ color: "red" }}>{scanError}</p>}

      {showModal && (
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            style={{
              background: "#1a1a1a",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
              minWidth: "300px",
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>
              QR Scanned: {qrId}
            </p>
            <button
              onClick={handlePay}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                backgroundColor: "#d4a017",
                color: "#000",
                fontWeight: "bold",
                cursor: "pointer",
                border: "none",
                fontSize: "16px",
              }}
            >
              Pay
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QrScannerModule;
