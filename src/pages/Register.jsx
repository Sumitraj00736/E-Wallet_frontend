// src/pages/Register.jsx
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

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register({ name, email, phone, password }); // use context register
      alert("Registration successful! Please login.");
      navigate("/login"); // redirect to login page
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  return (
    <Container>
      <h2>Register</h2>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleRegister}>Register</Button>
    </Container>
  );
}
