import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useAuthContext } from "../../context/AuthContext";

const QrScannerModule = () => {
  const { payWithQr } = useAuthContext();
  const [scannedQrId, setScannedQrId] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerInstanceRef = useRef(null);

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      initializeScanner();
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupScanner();
    };
  }, []);

  const initializeScanner = () => {
    // Make sure we don't initialize twice
    if (scannerInstanceRef.current) {
      console.log("Scanner already initialized");
      return;
    }

    try {
      const scanner = new Html5QrcodeScanner(
        "qr-reader", // Make sure this matches the div id
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          // Try different facing modes if back camera doesn't work
          // facingMode: { exact: "environment" } // or "user" for front camera
        },
        false // verbose
      );

      scannerInstanceRef.current = scanner;

      scanner.render(
        (decodedText, decodedResult) => {
          console.log("✅ QR Code scanned successfully:", decodedText);
          console.log("Full result:", decodedResult);
          
          if (!decodedText) {
            setScanError("Empty QR code");
            console.warn("Scanned QR is empty");
            return;
          }
          
          // Stop scanner immediately after successful scan
          cleanupScanner();
          
          setScanError(null);
          setScannedQrId(decodedText);
          setShowPopup(true);
          setIsScanning(false);
        },
        (errorMessage) => {
          // Only show actual errors, not "scan not found" messages
          if (!errorMessage.includes("NotFoundException") && 
              !errorMessage.includes("No MultiFormat Readers")) {
            console.error("Scanner error:", errorMessage);
          }
        }
      );

      setIsScanning(true);
      console.log("Scanner initialized successfully");

    } catch (error) {
      console.error("Failed to initialize scanner:", error);
      setScanError("Failed to initialize scanner: " + error.message);
    }
  };

  const cleanupScanner = () => {
    if (scannerInstanceRef.current) {
      scannerInstanceRef.current
        .clear()
        .then(() => {
          console.log("Scanner cleaned up");
          scannerInstanceRef.current = null;
        })
        .catch((e) => {
          console.error("Failed to clear scanner:", e);
          scannerInstanceRef.current = null;
        });
    }
  };

  const handlePay = async () => {
    if (!scannedQrId || isProcessing) return;

    setIsProcessing(true);
    console.log("Paying with QR ID:", scannedQrId);

    try {
      const res = await payWithQr(scannedQrId);
      console.log("Payment response:", res);
      alert("✅ Payment successful!");
      handleClosePopup();
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Payment failed: " + (err.message || JSON.stringify(err)));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setScannedQrId(null);
    setScanError(null);
    // Reload to restart scanner
    setTimeout(() => window.location.reload(), 300);
  };

  const handleRescan = () => {
    setScannedQrId(null);
    setShowPopup(false);
    setScanError(null);
    window.location.reload();
  };

  return (
    <>
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
          maxWidth: "600px",
          margin: "0 auto"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div style={{ 
          fontSize: "20px", 
          fontWeight: "bold", 
          marginBottom: "10px",
          textAlign: "center"
        }}>
          Scan QR Code to Pay
        </div>

        {/* Scanner Container */}
        <div
          id="qr-reader"
          style={{ 
            width: "100%", 
            borderRadius: "10px",
            minHeight: "300px"
          }}
        ></div>

        {/* Status Messages */}
        {isScanning && !scanError && (
          <p style={{ 
            color: "#d4a017", 
            textAlign: "center",
            fontSize: "14px"
          }}>
            📸 Point your camera at a QR code
          </p>
        )}

        {scanError && (
          <div style={{
            padding: "15px",
            background: "rgba(255,68,68,0.1)",
            border: "1px solid #ff4444",
            borderRadius: "8px"
          }}>
            <p style={{ color: "#ff4444", margin: 0 }}>{scanError}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                background: "#ff4444",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Debug Info */}
        <details style={{ 
          fontSize: "12px", 
          color: "#888",
          cursor: "pointer"
        }}>
          <summary>Troubleshooting</summary>
          <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
            <li>Make sure camera permissions are granted</li>
            <li>Ensure QR code is clear and well-lit</li>
            <li>Hold camera steady for 2-3 seconds</li>
            <li>Try different distances from QR code</li>
            <li>Make sure the QR code is not too large or too small in frame</li>
          </ul>
        </details>
      </motion.div>

      {/* Payment Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(5px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px"
              }}
              onClick={handleClosePopup}
            >
              {/* Popup Content */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25 }}
                style={{
                  background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
                  borderRadius: "20px",
                  padding: "30px",
                  maxWidth: "400px",
                  width: "100%",
                  border: "2px solid #d4a017",
                  boxShadow: "0 20px 60px rgba(212,160,23,0.3)",
                  position: "relative"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={handleClosePopup}
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "transparent",
                    border: "none",
                    color: "#888",
                    fontSize: "24px",
                    cursor: "pointer",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#333";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#888";
                  }}
                >
                  ×
                </button>

                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #d4a017 0%, #ffd700 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "40px"
                  }}
                >
                  ✓
                </motion.div>

                <h2 style={{
                  color: "#fff",
                  textAlign: "center",
                  marginBottom: "10px",
                  fontSize: "24px"
                }}>
                  QR Code Scanned
                </h2>

                <p style={{
                  color: "#888",
                  textAlign: "center",
                  marginBottom: "25px",
                  fontSize: "14px"
                }}>
                  Review the details and confirm payment
                </p>

                {/* QR Data Display */}
                <div style={{
                  background: "#0f0f0f",
                  padding: "15px",
                  borderRadius: "12px",
                  marginBottom: "25px",
                  border: "1px solid #333"
                }}>
                  <div style={{
                    color: "#888",
                    fontSize: "12px",
                    marginBottom: "5px",
                    textTransform: "uppercase",
                    letterSpacing: "1px"
                  }}>
                    QR Code ID
                  </div>
                  <div style={{
                    color: "#d4a017",
                    fontSize: "16px",
                    fontWeight: "bold",
                    wordBreak: "break-all"
                  }}>
                    {scannedQrId}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column"
                }}>
                  <motion.button
                    style={{
                      width: "100%",
                      padding: "15px",
                      borderRadius: "12px",
                      background: isProcessing 
                        ? "#888"
                        : "linear-gradient(135deg, #d4a017 0%, #ffd700 100%)",
                      color: "#000",
                      fontWeight: "bold",
                      cursor: isProcessing ? "not-allowed" : "pointer",
                      border: "none",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px"
                    }}
                    whileHover={!isProcessing ? { scale: 1.02 } : {}}
                    whileTap={!isProcessing ? { scale: 0.98 } : {}}
                    onClick={handlePay}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          style={{
                            width: "20px",
                            height: "20px",
                            border: "3px solid #000",
                            borderTopColor: "transparent",
                            borderRadius: "50%"
                          }}
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        💳 Confirm Payment
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    style={{
                      width: "100%",
                      padding: "15px",
                      borderRadius: "12px",
                      background: "transparent",
                      color: "#888",
                      fontWeight: "bold",
                      cursor: "pointer",
                      border: "1px solid #333",
                      fontSize: "16px"
                    }}
                    whileHover={{ scale: 1.02, borderColor: "#666" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClosePopup}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default QrScannerModule;