import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChannelPage from "./pages/ChannelPage.jsx";
import CreateChannelPage from "./pages/CreateChannelPage.jsx";
import EditChannelPage from "./pages/EditChannelPage.jsx";
import ChannelDetailPage from "./pages/ChannelDetailPage.jsx";
import { useGlobalShortcuts } from "./hooks/useGlobalShortcuts.js";

function RequireAuth({ children }) {
  const userID = sessionStorage.getItem("userID");

  if (!userID) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RedirectIfLoggedIn({ children }) {
  const userID = sessionStorage.getItem("userID");

  if (userID) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const navigate = useNavigate();

  useGlobalShortcuts([
    {
      combo: ["control", "h"],
      enabled: true,
      allowInInputs: false,
      handler: () => navigate("/"),
    },
  ]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfLoggedIn>
            <LoginPage />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfLoggedIn>
            <RegisterPage />
          </RedirectIfLoggedIn>
        }
      />

      <Route
        path="/"
        element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        }
      />
      <Route
        path="/create"
        element={
          <RequireAuth>
            <CreatePage />
          </RequireAuth>
        }
      />
      <Route
        path="/channels"
        element={
          <RequireAuth>
            <ChannelPage />
          </RequireAuth>
        }
      />
      <Route
        path="/channels/create"
        element={
          <RequireAuth>
            <CreateChannelPage />
          </RequireAuth>
        }
      />
      <Route
        path="/channels/:id/edit"
        element={
          <RequireAuth>
            <EditChannelPage />
          </RequireAuth>
        }
      />
      <Route
        path="/channels/:id"
        element={
          <RequireAuth>
            <ChannelDetailPage />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
