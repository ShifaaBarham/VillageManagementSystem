import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { NavLink, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import styles from "../syles/sidebarStyles.module.css";

// GraphQL Queries & Mutations
const GET_USER_INFO = gql`
  query GetUserInfo($userId: ID!) {
    user(id: $userId) {
      id
      full_name
      profile_image
    }
  }
`;

const UPDATE_USER_INFO = gql`
  mutation UpdateUserInfo(
    $userId: ID!
    $full_name: String
    $password: String
    $profileImage: String
  ) {
    updateUser(
      id: $userId
      full_name: $full_name
      password: $password
      profile_image: $profileImage
    ) {
      id
      full_name
      profile_image
    }
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const [full_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");
  const [passwordMatchWarning, setPasswordMatchWarning] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  // Decode token to get userId
  const getUserDataFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const userData = getUserDataFromToken();
  const userId = userData?.id;
  // Fetch user info
  const { data, loading, error } = useQuery(GET_USER_INFO, {
    variables: { userId },
    skip: !userId, 
  });
  console.log("Decoded User Data:", userData);
  
  useEffect(() => {
    if (data) {
      setUsername(data.user.full_name);
      setProfileImage(data.user.profile_image);
    }
  }, [data]);

  const [updateUserInfo] = useMutation(UPDATE_USER_INFO);

  // Handle profile update
  const handleUpdateUser = async () => {
    if (password && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const { data } = await updateUserInfo({
        variables: {
          userId,
          full_name,
          password: password || undefined,
          profileImage,
        },
      });

      if (data) {
        alert("User info updated successfully!");
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("Failed to update user info.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    alert("Logged out successfully!");
    navigate("/login"); 
  };
  

  
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };


  
  
  
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
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
            to="/VillageManagement"
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

            <span className={styles.full_name}>{user?.full_name || "User name"}</span>
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
      full_name:
  <input
    type="text"
    value={full_name}
    onChange={(e) => setUsername(e.target.value)} // إصلاح
  />
</label>

        
        <label>
  Password:
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)} // إصلاح
  />
  {passwordWarning && <span className={styles.warning}>{passwordWarning}</span>}
</label>

<label>
  Confirm Password:
  <input
    type="password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)} // إصلاح
  />
  {passwordMatchWarning && <span className={styles.warning}>{passwordMatchWarning}</span>}
</label>

<label>
  Profile Image:
  <input
    type="file"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        setProfileImage(file);
      }
    }}
  />
</label>

        <button type="button" onClick={handleUpdateUser}>
          Save Changes
        </button>
      </form>

      <button className="logoutButton" onClick={handleLogout} >
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
