import React from 'react';
import RegisterPage from './pages/Register';
import Home from "./pages/Home";
import ResetPasswordPage from "./pages/ResetPassword";
import LoginPage from "./pages/Login";
import ChangePasswordPage from "./pages/ChangePasswordPages";
import Logout from "./components/login/Logout";
import Profile from "./pages/Profile";
import CarDetail from "./pages/CarPage";
import CarPage from "./pages/CarPage";
import AdminPage from "./pages/AdminPage";
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/admin/Admin";
import ConditiiPage from "./pages/TermeniConditiiPage";
import AboutPage from "./pages/AboutPage";



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/product/:id" element={<CarDetail />} />
        <Route path="/car-page" element={<CarPage />} />
        <Route path="/conditii" element={<ConditiiPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
