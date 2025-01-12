import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Routes, Route, Navigate } from "react-router-dom";
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

const ProtectedLayout = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  return (
    <>
      <SideBar />
      <main className={styles.main}>{children}</main>
    </>
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <Routes>
        {/* صفحات بدون السايد بار */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* صفحات محمية مع السايد بار */}
        <Route
          path="/Overview"
          element={
            <ProtectedLayout>
              <Overview />
            </ProtectedLayout>
          }
        />
        <Route
          path="/VillageManagement"
          element={
            <ProtectedLayout>
              <VillageManagement />
            </ProtectedLayout>
          }
        />
        <Route
          path="/Chat"
          element={
            <ProtectedLayout>
              <Chat />
            </ProtectedLayout>
          }
        />
        <Route
          path="/Gallery"
          element={
            <ProtectedLayout>
              <Gallery />
            </ProtectedLayout>
          }
        />

        {/* التوجيه الافتراضي */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </ApolloProvider>
  );
}

export default App;
