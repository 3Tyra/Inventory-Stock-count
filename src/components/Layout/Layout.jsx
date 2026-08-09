import { useEffect, useState } from "react";
import "./Layout.css";
import Footer from "../Footer/Footer";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Layout({ children }) {

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {

    setSidebarOpen(false);

  }, [location.pathname]);

  const handleLogout = () => {

    logout();

    setSidebarOpen(false);

    navigate("/login");

  };

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

      {/* MOBILE BUTTON */}

      <button
        className="sidebar-toggle"
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>


      {/* OVERLAY */}

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


      {/* SIDEBAR */}

      <aside
        className={
          sidebarOpen
            ? "sidebar open"
            : "sidebar"
        }
      >

        <div className="logo">

          <h2>
            ⚡ TIMELINE ELECTRONICS STOCK-COUNT APP
          </h2>

          {user && (
            <p className="sidebar-user">
              👋 {user.name}
            </p>
          )}

        </div>


        <nav className="menu">

          <button
            className={
              location.pathname === "/"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => goTo("/")}
          >
            🏠 Dashboard
          </button>


          <button
            className={
              location.pathname === "/products"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => goTo("/products")}
          >
            📦 Products
          </button>


          <button
            className={
              location.pathname === "/settings"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => goTo("/settings")}
          >
            ⚙️ Settings
          </button>

        </nav>


        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>


      {/* MAIN AREA */}

      <main className="content">

        {children}

        <Footer />

      </main>

    </div>

  );

}

export default Layout;