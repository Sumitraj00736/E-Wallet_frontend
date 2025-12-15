import axios from "axios";
const baseURL = "https://e-wallet-springboot-backend-production.up.railway.app"; // your backend URL
// const baseURL2 = "http://localhost:8080"; 


export const api = axios.create({
  baseURL,
});

export const registerUser = (payload) => api.post("/api/auth/register", payload);
export const loginUser = (email, password) => api.post("/api/auth/login", { email, password });
export const getProfile = (token) => api.get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } });
export const getAllUsers = () => api.get("/api/auth/users");
export const topupWallet = (amount) => api.post("/api/wallet/topup", { amount });
export const transferFunds = (receiverId, amount) => api.post("/api/wallet/transfer", { receiverId, amount });
export const generateQR = (amount) => api.post("/api/qr/generate", { amount });
