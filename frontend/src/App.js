import React, { useEffect } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SideBar from "./components/sideBar";
import Overview from "./components/overview/Overview";
import VillageManagement from "./components/villagemanagemant/VillageManagement";
import Chat from "./components/chat/chat";
import Gallery from "./components/gallery/gallery";
import Login from "./components/Authentication/login";
import SignUp from "./components/Authentication/signUp";
import styles from "./syles/mainStyles.module.css";
import { isTokenExpired } from "./components/Authentication/auth"; 

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null && !isTokenExpired();
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isTokenExpired()) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <ApolloProvider client={client}>
      {isAuthenticated() && <SideBar />}
      <main className={styles.main}>
        <Routes>
          {/* صفحات بدون السايد بار */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* صفحات محمية مع السايد بار */}
          {isAuthenticated() ? (
            <>
              <Route path="/Overview" element={<Overview />} />
              <Route path="/VillageManagement" element={<VillageManagement />} />
              <Route path="/Chat" element={<Chat />} />
              <Route path="/Gallery" element={<Gallery />} />
              {/* التوجيه الافتراضي */}
              <Route path="*" element={<Navigate to="/Overview" />} />
            </>
          ) : (
            // توجيه إلى تسجيل الدخول إذا لم يكن المستخدم مسجلًا
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </main>
    </ApolloProvider>
  );
}

export default App;
