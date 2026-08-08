import { useEffect, useState } from "react";
import "./Layout.css";
import {
  useNavigate,
  useLocation
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


function Layout({ children }) {

  const navigate = useNavigate();

  const location = useLocation();

  const { user, logout } = useAuth();


  const [darkMode, setDarkMode] =
    useState(false);


  // =========================
  // LOAD SETTINGS
  // =========================

  useEffect(() => {

    const loadSettings = () => {

      const savedSettings =
        JSON.parse(
          localStorage.getItem("settings")
        ) || {};


      setDarkMode(
        savedSettings.darkMode === true
      );

    };


    loadSettings();


    window.addEventListener(
      "settingsUpdated",
      loadSettings
    );


    return () => {

      window.removeEventListener(
        "settingsUpdated",
        loadSettings
      );

    };

  }, []);


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  return (

    <div
      className={
        darkMode
          ? "layout dark-mode"
          : "layout"
      }
    >


      {/* SIDEBAR */}

      <aside className="sidebar">


        {/* LOGO */}

        <div className="logo">

          <h2>
            ⚡ Stock Count
          </h2>

          {user && (

            <p className="sidebar-user">

              👋 {user.name}

            </p>

          )}

        </div>


        {/* MENU */}

        <nav className="menu">


          {/* DASHBOARD */}

          <button
            className={
              location.pathname === "/"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() =>
              navigate("/")
            }
          >

            🏠 Dashboard

          </button>


          {/* PRODUCTS */}

          <button
            className={
              location.pathname === "/products"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() =>
              navigate("/products")
            }
          >

            📦 Products

          </button>


          {/* SETTINGS */}

          <button
            className={
              location.pathname === "/settings"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() =>
              navigate("/settings")
            }
          >

            ⚙️ Settings

          </button>


        </nav>


        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          🚪 Logout

        </button>


      </aside>


      {/* MAIN CONTENT */}

      <main className="content">

        {children}

      </main>


    </div>

  );

}


export default Layout;

