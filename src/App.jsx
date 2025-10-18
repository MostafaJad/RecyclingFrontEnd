// src/App.jsx

import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./auth-context";
import AuthPage from "./pages/AuthPage";
import UploadPage from "./pages/UploadPage";
import RewardsPage from "./pages/RewardsPage";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // This hook runs once to check localStorage for a logged-in user
  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      if (storedData && storedData.token && storedData.user) {
        setToken(storedData.token);
        setUser(storedData.user);
      }
    } catch (error) {
      console.error("Could not parse user data from localStorage", error);
    }
    setIsCheckingAuth(false);
  }, []);

  // --- THESE ARE THE CORRECTED, REGULAR FUNCTIONS ---
  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem(
      "userData",
      JSON.stringify({ token: token, user: userData })
    );
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("userData");
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem(
      "userData",
      JSON.stringify({ token: token, user: updatedUserData })
    );
  };

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  const router = createBrowserRouter([
    { path: "/", element: !token ? <AuthPage /> : <Navigate to="/app" /> },
    { path: "/app", element: token ? <UploadPage /> : <Navigate to="/" /> },
    {
      path: "/rewards",
      element: token ? <RewardsPage /> : <Navigate to="/" />,
    },
    { path: "*", element: <Navigate to="/" /> },
  ]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token, user, login, logout, updateUser }}
    >
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
