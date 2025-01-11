import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from '@apollo/client';
//import argon2 from 'argon2';  // استيراد مكتبة argon2 لتشفير كلمة المرور
import { NavLink } from 'react-router-dom';

import styles from "../syles/sidebarStyles.module.css";

// GraphQL queries
const GET_USER_INFO = gql`
  query GetUserInfo($userId: ID!) {
    user(id: $userId) {
      id
      username
      profile_image
      email
    }
  }
`;

const UPDATE_USER_INFO = gql`
  mutation UpdateUserInfo(
    $userId: ID!, 
    $username: String, 
    $email: String, 
    $password: String, 
    $profileImage: String
  ) {
    updateUser(
      id: $userId, 
      username: $username, 
      email: $email, 
      password: $password, 
      profile_image: $profileImage
    ) {
      id
      username
      profile_image
      email
    }
  }
`;



const Sidebar = () => {
  const [password, setPassword] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // جديد: حقل تأكيد كلمة المرور
const [profileImage, setProfileImage] = useState(""); // جديد: حقل صورة الملف الشخصي
const [passwordWarning, setPasswordWarning] = useState("");
const [passwordMatchWarning, setPasswordMatchWarning] = useState(""); // جديد: تحذير عدم تطابق كلمات المرور


const userId = 1;

// Check if the userId exists
if (userId) {
    console.log(`User ID retrieved from sessionStorage: ${userId}`);
} else {
    console.log('User ID not found in sessionStorage.');
}

const { data, loading, error } = useQuery(GET_USER_INFO, {
  variables: { userId },
});

useEffect(() => {
  if (data) {
    setUsername(data.user.username);
    setEmail(data.user.email);
    setProfileImage(data.user.profile_image); // تعيين الصورة الشخصية من البيانات
  }
}, [data]);


  const [updateUserInfo] = useMutation(UPDATE_USER_INFO);
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length < 6) {
      setPasswordWarning("Password is too weak. It should be at least 6 characters.");
    } else {
      setPasswordWarning("");
    }
  };
  
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
  
    // تحقق من تطابق كلمة المرور مع تأكيدها
    if (password !== newConfirmPassword) {
      setPasswordMatchWarning("Passwords do not match.");
    } else {
      setPasswordMatchWarning("");
    }
  };
  
  
  

  const handleSaveChanges = async () => {
    if (passwordMatchWarning) {
      alert("Please fix the password mismatch issue.");
      return;
    }
  
    // كائن لتخزين المتغيرات المحدثة
    const variables = {
      userId, // معرف المستخدم الأساسي
    };
  
    console.log(variables); // طباعة المتغيرات
    console.log(profileImage); // طباعة الصورة
  
    // إضافة الحقول فقط إذا كانت تحتوي على قيم
    if (username) {
      variables.username = username;
    }
  
    if (email) {
      variables.email = email;
    }
  
    if (password) {
      const hashedPassword = password; // يمكنك تشفير كلمة المرور إذا لزم الأمر
      variables.password = hashedPassword;
    }
  
    if (profileImage) {
      variables.profileImage = profileImage;
    }
  
    // إرسال التحديثات
    updateUserInfo({ variables })
      .then(() => {
        toggleModal(); // إغلاق النافذة بعد الحفظ
      })
      .catch((err) => {
        console.error("Error updating user info:", err);
        alert("Failed to update user info. Please check the console for details.");
      });
  };
  



  
  
  
  
  
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error loading user info. Please try again later.</div>;
  
  const user = data?.user;
  
  return (
    <>
      <nav className={styles.sideBar}>
      <ul>
        <li className={styles.header}>
          <span className={styles.sectionsHeader}>Dashboard</span>
        </li>

        <li>
          <NavLink
            to="/Overview"
            className={({ isActive }) =>
              isActive ? styles.active : styles.sectionsName
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
            >
              <path d="M120-200q-33 0-56.5-23.5T40-280v-400q0-33 23.5-56.5T120-760h400q33 0 56.5 23.5T600-680v400q0 33-23.5 56.5T520-200H120Zm0-80h400v-400H120v400Zm560 80v-560h80v560h-80Zm160 0v-560h80v560h-80Zm-720-80v-400 400Z" />
            </svg>
            <span>Overview</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/VellageManagement"
            className={({ isActive }) =>
              isActive ? styles.active : styles.sectionsName
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
            >
              <path d="M666-440 440-666l226-226 226 226-226 226Zm-546-80v-320h320v320H120Zm400 400v-320h320v320H520Zm-400 0v-320h320v320H120Zm80-480h160v-160H200v160Zm467 48 113-113-113-113-113 113 113 113Zm-67 352h160v-160H600v160Zm-400 0h160v-160H200v160Zm160-400Zm194-65ZM360-360Zm240 0Z" />
            </svg>
            <span>Village Management</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/Chat"
            className={({ isActive }) =>
              isActive ? styles.active : styles.sectionsName
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
            >
              <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
            </svg>
            <span>Chat</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/Gallery"
            className={({ isActive }) =>
              isActive ? styles.active : styles.sectionsName
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
            >
              <path d="M120-200q-33 0-56.5-23.5T40-280v-400q0-33 23.5-56.5T120-760h400q33 0 56.5 23.5T600-680v400q0 33-23.5 56.5T520-200H120Zm600-320q-17 0-28.5-11.5T680-560v-160q0-17 11.5-28.5T720-760h160q17 0 28.5 11.5T920-720v160q0 17-11.5 28.5T880-520H720Zm40-80h80v-80h-80v80ZM120-280h400v-400H120v400Zm40-80h320L375-500l-75 100-55-73-85 113Zm560 160q-17 0-28.5-11.5T680-240v-160q0-17 11.5-28.5T720-440h160q17 0 28.5 11.5T920-400v160q0 17-11.5 28.5T880-200H720Zm40-80h80v-80h-80v80Zm-640 0v-400 400Zm640-320v-80 80Zm0 320v-80 80Z" />
            </svg>
            <span>Gallery</span>
          </NavLink>
        </li>
      </ul>

        <li className={styles.accountSection}>
          <div className={styles.information} onClick={toggleModal}>
          <img
          src={user?.profile_image ? `/uploads/profile_images/${user.profile_image}` : "/images/profile-image.png"} 
          alt="profile-image"
  className={styles.profileImage}
/>

            <span className={styles.username}>{user?.username || "User name"}</span>
          </div>
        </li>
      </nav>

      {isModalOpen && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <h2>Account Information</h2>
      <img
          src={user?.profile_image ? `/uploads/profile_images/${user.profile_image}` : "/images/profile-image.png"} 
          alt="profile-image"
        className={styles.profileImageLarge}
      />

      <form className={styles.modalForm}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordWarning && <span className={styles.warning}>{passwordWarning}</span>}
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {passwordMatchWarning && <span className={styles.warning}>{passwordMatchWarning}</span>}
        </label>
        <label>
          Profile Image:
          <input
            type="file"
            
            />
        </label>
        <button type="button" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </form>

      <button className="logoutButton" onClick={() => alert("Logged Out!")}>
        Logout
      </button>
      <button className={styles.modalCloseButton} onClick={toggleModal}>
        Close
      </button>
    </div>
  </div>
)}

    </>
  );
};

export default Sidebar;
