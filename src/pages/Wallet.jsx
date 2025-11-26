// src/pages/Wallet.jsx
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext"; // fixed import
import styled from "styled-components";
import { motion } from "framer-motion";
import { colors } from "../styles/theme";

const WalletContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #111;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  color: ${colors.text};
`;

const Section = styled(motion.div)`
  margin-bottom: 30px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid ${colors.border};
  border-radius: 5px;
  background-color: #222;
  color: ${colors.text};
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #D4A017;
  color: #000;
  font-weight: bold;
  border-radius: 5px;
  margin-top: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #222;
  color: ${colors.text};
  border: 1px solid ${colors.border};
`;

export default function Wallet() {
  const {
    walletBalance,
    user,
    users,
    fetchUsers,
    topUpWallet,
    transferFunds,
    qrCode,
    generateQR,
    qrData,
    setScannedQrData,
  } = useAuthContext();

  const [topupAmount, setTopupAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [qrAmount, setQrAmount] = useState("");
  const [generatedQr, setGeneratedQr] = useState(null);

  useEffect(() => {
    if (user) fetchUsers(); // fetch users on load
  }, [user]);

  // --- Top-up wallet ---
  const handleTopup = async () => {
    if (!topupAmount) return;
    try {
      await topUpWallet(Number(topupAmount));
      setTopupAmount("");
      alert("Wallet topped up successfully!");
    } catch (err) {
      alert("Top-up failed: " + (err.message || err));
    }
  };

  // --- Transfer funds ---
  const handleTransfer = async () => {
    if (!receiverId || !transferAmount) return;
    try {
      await transferFunds(receiverId, Number(transferAmount));
      setTransferAmount("");
      setReceiverId("");
      alert("Transfer successful!");
    } catch (err) {
      alert("Transfer failed: " + (err.message || err));
    }
  };

  // --- Generate QR code ---
  const handleGenerateQR = async () => {
    if (!qrAmount) return;
    try {
      const res = await generateQR(Number(qrAmount));
      setGeneratedQr(res);
      setQrAmount("");
    } catch (err) {
      alert("QR generation failed: " + (err.message || err));
    }
  };

  // --- Pay via scanned QR ---
  const handlePayQr = async () => {
    if (!qrData) return;
    try {
      await transferFunds(qrData.userId, qrData.amount);
      setScannedQrData(null);
      alert("Payment successful via QR!");
    } catch (err) {
      alert("Payment failed: " + (err.message || err));
    }
  };

  return (
    <WalletContainer>
      <h2>Wallet Balance: ₹ {walletBalance.toFixed(2)}</h2>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Top-Up Wallet</h3>
        <Input
          type="number"
          value={topupAmount}
          onChange={e => setTopupAmount(e.target.value)}
          placeholder="Amount"
        />
        <Button onClick={handleTopup}>Top Up</Button>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>Transfer Funds</h3>
        <Select value={receiverId} onChange={e => setReceiverId(e.target.value)}>
          <option value="">Select Receiver</option>
          {users
            .filter(u => u.id !== user.id)
            .map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
        </Select>
        <Input
          type="number"
          value={transferAmount}
          onChange={e => setTransferAmount(e.target.value)}
          placeholder="Amount"
        />
        <Button onClick={handleTransfer}>Send</Button>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3>Generate QR Code</h3>
        <Input
          type="number"
          value={qrAmount}
          onChange={e => setQrAmount(e.target.value)}
          placeholder="Amount"
        />
        <Button onClick={handleGenerateQR}>Generate QR</Button>
        {generatedQr && (
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <p>QR Code ID: {generatedQr.id}</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${generatedQr.qrCodeData}&size=150x150`}
              alt="QR Code"
            />
          </div>
        )}
      </Section>

      {qrData && (
        <Section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3>Pay via Scanned QR</h3>
          <p>QR Data: {qrData.qrCodeData}</p>
          <Button onClick={handlePayQr}>Pay</Button>
        </Section>
      )}
    </WalletContainer>
  );
}
