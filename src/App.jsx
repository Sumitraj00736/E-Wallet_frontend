
import React from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import QR from "./pages/QR";

function App() {
  return (
    <Router>
      <div style={styles.app}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/qr" element={<QR />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#000000",
    color: "#ffffff",
  },
};

export default App;
