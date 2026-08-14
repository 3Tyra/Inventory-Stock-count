import { useEffect, useState } from "react";
import "./Layout.css";
import Footer from "../Footer/Footer";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  FaBolt,
  FaBars,
  FaTimes,
  FaHome,
  FaBox,
  FaCog,
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";


function Layout({ children }) {

  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    logout
  } = useAuth();

  const [darkMode, setDarkMode] =
    useState(false);

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
  // CLOSE SIDEBAR
  // =========================

  useEffect(() => {

    setSidebarOpen(false);

  }, [location.pathname]);


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {

    await logout();

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
          MOBILE BUTTON
      ========================= */}

      <button
        className="sidebar-toggle"
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
        aria-label={
          sidebarOpen
            ? "Close menu"
            : "Open menu"
        }
      >

        {sidebarOpen ? (
          <FaTimes />
        ) : (
          <FaBars />
        )}

      </button>


      {/* =========================
          OVERLAY
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

            <FaBolt className="logo-icon" />

            TIMELINE ELECTRONICS STOCK-COUNT APP
            <span></span>

          </h2>


          {user && (

            <p className="sidebar-user">

              <FaUser className="user-icon" />

              {user.name}

            </p>

          )}

        </div>


        {/* =========================
            NAVIGATION
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

            <FaHome />

            <span>
              Dashboard
            </span>

          </button>


          {/* PRODUCTS */}

          <button
            className={
              location.pathname ===
              "/products"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() =>
              goTo("/products")
            }
          >

            <FaBox />

            <span>
              Products
            </span>

          </button>


          {/* SETTINGS */}

          <button
            className={
              location.pathname ===
              "/settings"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() =>
              goTo("/settings")
            }
          >

            <FaCog />

            <span>
              Settings
            </span>

          </button>


        </nav>


        {/* =========================
            LOGOUT
        ========================= */}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          <span>
            Logout
          </span>

        </button>


      </aside>


      {/* =========================
          MAIN AREA
      ========================= */}

      <main className="content">

        {children}

        <Footer />

      </main>


    </div>

  );

}


export default Layout;