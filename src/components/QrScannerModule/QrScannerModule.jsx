import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useAuthContext } from "../../context/AuthContext";

const QrScannerModule = () => {
  const { payWithQr } = useAuthContext();
  const [scannedQrId, setScannedQrId] = useState(null);
  const [scanError, setScanError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      scannerRef.current.id,
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (qrId) => {
        console.log("QR scanned:", qrId);
        if (!qrId) {
          setScanError("Empty QR code");
          console.warn("Scanned QR is empty");
          return;
        }
        setScanError(null);
        setScannedQrId(qrId);
        console.log("Stored scanned QR ID:", qrId);
      },
      (err) => {
        console.error("QR scanner camera/error callback:", err);
        setScanError("Camera error: " + err);
      }
    );

    return () => {
      scanner
        .clear()
        .then(() => console.log("Scanner cleared"))
        .catch((e) => console.error("Failed to clear scanner:", e));
    };
  }, []);

  const handlePay = async () => {
    if (!scannedQrId) return alert("No QR scanned");

    console.log("Paying with QR ID:", scannedQrId);

    try {
      const res = await payWithQr(scannedQrId);
      console.log("Payment response:", res);
      alert("Payment successful!");
      setScannedQrId(null);
    } catch (err) {
      console.error("Payment error:", err);
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

      <div
        ref={scannerRef}
        id="qr-reader"
        style={{ width: "100%", borderRadius: "10px" }}
      ></div>

      {scanError && <p style={{ color: "red" }}>{scanError}</p>}

      {scannedQrId && (
        <div>
          <p style={{ color: "#d4a017" }}>Scanned QR ID: {scannedQrId}</p>
          <motion.button
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#d4a017",
              color: "#000",
              fontWeight: "bold",
              cursor: "pointer",
              border: "none",
              fontSize: "15px",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePay}
          >
            Pay
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default QrScannerModule;
