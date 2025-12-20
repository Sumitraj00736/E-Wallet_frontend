// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // --- Auth & User State ---
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  // --- Wallet State ---
  const [walletBalance, setWalletBalance] = useState(0);

  // --- Users (for transfer) ---
  const [users, setUsers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);

  // --- QR State ---
  const [qrCode, setQrCode] = useState(null); // generated QR
  const [scannedQrData, setScannedQrData] = useState(null); // scanned QR data

  // --- Helper to get headers dynamically ---
  const getAuthHeader = (overrideToken) => ({
    Authorization: `Bearer ${overrideToken || token}`,
  });

  // --- Effect: fetch profile if token exists ---
  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  // --- REGISTER ---
  const register = async ({ name, email, password, phone }) => {
    try {
      const res = await api.post("/api/auth/register", { name, email, password, phone });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // --- LOGIN ---
  const login = async ({ email, password }) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const userToken = res.data;
      console.log("user Token",userToken)
      setToken(userToken);
      localStorage.setItem("token", userToken);
      await fetchProfile(userToken); // fetch profile with new token
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    setToken("");
    setUser(null);
    setWalletBalance(0);
    localStorage.removeItem("token");
  };

  // --- FETCH PROFILE ---
  const fetchProfile = async (overrideToken) => {
    try {
      const res = await api.get("/api/auth/profile", {
        headers: getAuthHeader(overrideToken),
      });
      setUser(res.data);
      setWalletBalance(res.data.walletBalance);
      return res.data;
    } catch (err) {
      console.error("Profile fetch error:", err);
      logout();
      throw err;
    }
  };

  // --- FETCH ALL USERS ---
const fetchUsers = async () => {
  if (!token) throw new Error("No token available");
  try {
    const res = await api.get("/api/auth/users", { headers: getAuthHeader() });
    const filteredUsers = res.data.filter(u => user ? u.id !== user.id : true);
    setUsers(filteredUsers);
    console.log("All users:", res.data);
    console.log("Filtered users:", filteredUsers);
    return filteredUsers;
  } catch (err) {
    console.error("Fetch users error:", err);
    throw err;
  }
};


  // --- WALLET TOPUP ---
  const topUpWallet = async (amount) => {
    if (!token) throw new Error("No token available for authorization");
    try {
      const res = await api.post(
        "/api/wallet/topup",
        { amount },
        { headers: getAuthHeader() }
      );
      setWalletBalance(res.data.walletBalance);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // --- WALLET TRANSFER ---
  const transferFunds = async (receiverId, amount, password) => {
    if (!token) throw new Error("No token available for authorization");
    try {
      const res = await api.post(
        "/api/wallet/transfer",
        { receiverId, amount, password },
        { headers: getAuthHeader() }
      );
      setWalletBalance(prev => prev - amount);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // --- GENERATE QR ---
  const generateQR = async (amount) => {
    if (!token) throw new Error("No token available for authorization");
    try {
      const res = await api.post("/api/qr/generate", { amount }, { headers: getAuthHeader() });
      setQrCode(res.data);
      console.log("QR",res.data)
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // --- PAY USING SCANNED QR ---
  const payWithQr = async (qrCodeData) => {
  if (!token) throw new Error("No token available for authorization");
  if (!user?.id) throw new Error("User not authenticated");

  try {
    const res = await api.post(
      "/api/qr/pay",
      {
      qrCodeData: qrCodeData,
      payerId: user.id
    },
      { headers: getAuthHeader() }
    );

    // DO NOT manually deduct balance
    // Instead refetch wallet from backend
    await fetchProfile();

    setScannedQrData(null);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};


  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        walletBalance,
        users,
        selectedReceiver,
        setSelectedReceiver,
        qrCode,
        scannedQrData,
        setScannedQrData,
        register,
        login,
        logout,
        fetchProfile,
        fetchUsers,
        topUpWallet,
        transferFunds,
        generateQR,
        payWithQr,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- HOOK FOR EASY ACCESS ---
export const useAuthContext = () => useContext(AuthContext);
