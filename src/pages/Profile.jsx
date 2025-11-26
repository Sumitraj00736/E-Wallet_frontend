// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext"; // fixed import
import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";

const ProfileContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #000000;
  color: #808080;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const UserName = styled.h2`
  color: #d4a017;
  font-size: 1.5rem;
`;

const ProfileRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #808080;
`;

const ProfileLabel = styled.span`
  font-weight: bold;
`;

const ProfileValue = styled.span``;

const Profile = () => {
  const { user, fetchProfile, token } = useAuthContext(); // use context
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;
      setLoading(true);
      try {
        await fetchProfile(); // fetchProfile from context updates the user
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, fetchProfile]);

  if (loading) return <p style={{ color: "#D4A017" }}>Loading profile...</p>;
  if (!user) return <p style={{ color: "#D4A017" }}>No user data available.</p>;

  return (
    <ProfileContainer>
      <ProfileHeader>
        <FaUserCircle size={60} color="#D4A017" />
        <UserName>{user.name}</UserName>
      </ProfileHeader>

      <ProfileRow>
        <ProfileLabel>Email:</ProfileLabel>
        <ProfileValue>{user.email}</ProfileValue>
      </ProfileRow>

      <ProfileRow>
        <ProfileLabel>Wallet Balance:</ProfileLabel>
        <ProfileValue>₹ {user.walletBalance.toFixed(2)}</ProfileValue>
      </ProfileRow>

      <ProfileRow>
        <ProfileLabel>KYC Status:</ProfileLabel>
        <ProfileValue>{user.kycDocument ? "Verified" : "Pending"}</ProfileValue>
      </ProfileRow>

      <ProfileRow>
        <ProfileLabel>Role:</ProfileLabel>
        <ProfileValue>{user.role}</ProfileValue>
      </ProfileRow>

      <ProfileRow>
        <ProfileLabel>Status:</ProfileLabel>
        <ProfileValue>{user.active ? "Active" : "Inactive"}</ProfileValue>
      </ProfileRow>
    </ProfileContainer>
  );
};

export default Profile;
