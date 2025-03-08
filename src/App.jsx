import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function ProtectedRoute({ element }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="text-center text-white">Loading...</div>; // Show loading while Firebase checks auth
  return user ? element : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
      </Routes>
    </Router>
  );
}

export default App;
