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


  // =========================
  // DARK MODE
  // =========================

  const [darkMode, setDarkMode] =
    useState(false);


  // =========================
  // MOBILE SIDEBAR
  // =========================

  const [sidebarOpen, setSidebarOpen] =
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
  // CLOSE SIDEBAR WHEN ROUTE CHANGES
  // =========================

  useEffect(() => {

    setSidebarOpen(false);

  }, [location.pathname]);


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    logout();

    setSidebarOpen(false);

    navigate("/login");

  };


  // =========================
  // NAVIGATION
  // =========================

  const goTo = (path) => {

    navigate(path);

    setSidebarOpen(false);

  };


  return (

    <div
      className={
        darkMode
          ? "layout dark-mode"
          : "layout"
      }
    >


      {/* =========================
          MOBILE MENU BUTTON
      ========================= */}

      <button
        className="sidebar-toggle"
        onClick={() =>
          setSidebarOpen(
            !sidebarOpen
          )
        }
        aria-label={
          sidebarOpen
            ? "Close menu"
            : "Open menu"
        }
        aria-expanded={sidebarOpen}
      >

        {sidebarOpen ? "✕" : "☰"}

      </button>


      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      <div
        className={
          sidebarOpen
            ? "sidebar-overlay visible"
            : "sidebar-overlay"
        }
        onClick={() =>
          setSidebarOpen(false)
        }
      />


      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={
          sidebarOpen
            ? "sidebar open"
            : "sidebar"
        }
      >


        {/* =========================
            LOGO
        ========================= */}

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


        {/* =========================
            MENU
        ========================= */}

        <nav className="menu">


          {/* DASHBOARD */}

          <button
            className={
              location.pathname === "/"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() =>
              goTo("/")
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
              goTo("/products")
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
              goTo("/settings")
            }
          >

            ⚙️ Settings

          </button>


        </nav>


        {/* =========================
            LOGOUT
        ========================= */}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          🚪 Logout

        </button>


      </aside>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="content">

        {children}

      </main>


    </div>

  );

}


export default Layout;