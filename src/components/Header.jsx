// src/Header.jsx
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth-context";
import PointsJar from "./PointsJar";
import "./Header.css";

const Header = () => {
  const auth = useContext(AuthContext);

  // We need to make sure auth.user exists before trying to get points
  const userPoints = auth.user ? auth.user.points : 0;
  console.log("SPY #3 (Header): Rendering with points ->", userPoints);
  return (
    <header className="main-header">
      <h2>Recycle Snap 🌿</h2>
      <nav>
        <NavLink to="/app">Upload</NavLink>
        <NavLink to="/rewards">Rewards</NavLink>
      </nav>
      <div className="header-right">
        <PointsJar points={userPoints} />
        <button onClick={auth.logout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
