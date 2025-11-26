import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import QrReader from "react-qr-reader";
import styled from "styled-components";

const Container = styled.div`
  max-width: 400px;
  margin: 50px auto;
  background-color: #111;
  padding: 20px;
  border-radius: 10px;
  color: #ccc;
`;

export default function QRScanner() {
  const { setQrData } = useContext(AuthContext);

  const handleScan = (data) => {
    if (data) {
      try {
        const parsed = JSON.parse(data); // expect QR payload as JSON {userId, amount, qrCodeData}
        setQrData(parsed);
        alert(`QR scanned! Pay ${parsed.amount} to user.`);
      } catch {
        alert("Invalid QR code.");
      }
    }
  };

  const handleError = (err) => console.error(err);

  return (
    <Container>
      <h2>Scan QR Code</h2>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
    </Container>
  );
}
