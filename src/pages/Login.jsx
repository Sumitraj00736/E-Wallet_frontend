// src/pages/Login.jsx
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  max-width: 400px;
  margin: 50px auto;
  background-color: #111;
  padding: 20px;
  border-radius: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #808080;
  background-color: #222;
  color: #ccc;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #D4A017;
  color: #000;
  font-weight: bold;
  border-radius: 5px;
  margin-top: 10px;
`;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login({ email, password }); // pass as object
      navigate("/wallet"); // redirect to wallet page on success
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <Container>
      <h2>Login</h2>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleLogin}>Login</Button>
    </Container>
  );
}
