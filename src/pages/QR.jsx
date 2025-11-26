import React, { useState } from "react";
import styled from "styled-components";
import { useAuthContext } from "../context/AuthContext.jsx";
import { FaQrcode } from "react-icons/fa";

const QrContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #000;
  color: #808080;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
`;

const QrHeader = styled.h2`
  color: #d4a017;
  margin-bottom: 1rem;
  text-align: center;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #808080;
  background-color: #000;
  color: #808080;
`;

const Button = styled.button`
  padding: 0.7rem;
  border: none;
  border-radius: 8px;
  background-color: #d4a017;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 5px;

  &:hover {
    opacity: 0.8;
  }
`;

const QrImage = styled.img`
  display: block;
  margin: 1rem auto;
  max-width: 200px;
`;

const Qr = () => {
  const { generateQR, payWithQr, setScannedQrData } = useAuthContext();
  const [amount, setAmount] = useState("");
  const [qrData, setQrData] = useState(null);
  const [scanData, setScanData] = useState("");

  // Generate QR
  const handleGenerateQr = async () => {
    if (!amount) return alert("Enter an amount");
    try {
      const res = await generateQR(parseFloat(amount));
      setQrData(res);
    } catch (error) {
      console.error("QR generation failed:", error);
      alert("QR generation failed!");
    }
  };

  // Pay via scanned QR
  const handleScanPayment = async () => {
    if (!scanData || !amount) return alert("Enter scanned QR and amount");
    try {
      await payWithQr({ userId: scanData, amount: parseFloat(amount) });
      setScanData("");
      setScannedQrData(null);
      alert("Payment successful!");
    } catch (error) {
      console.error("QR payment failed:", error);
      alert("Payment failed!");
    }
  };

  return (
    <QrContainer>
      <QrHeader>
        <FaQrcode /> QR Payment
      </QrHeader>

      {/* Generate QR */}
      <FormRow>
        <Label>Amount to Generate QR:</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </FormRow>
      <Button onClick={handleGenerateQr}>Generate QR</Button>

      {qrData && (
        <QrImage
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData.qrCodeData}`}
          alt="QR Code"
        />
      )}

      {/* Scan QR */}
      <FormRow>
        <Label>Scanned QR Data (Receiver ID):</Label>
        <Input
          type="text"
          value={scanData}
          onChange={(e) => setScanData(e.target.value)}
        />
      </FormRow>
      <Button onClick={handleScanPayment}>Pay via QR</Button>
    </QrContainer>
  );
};

export default Qr;
