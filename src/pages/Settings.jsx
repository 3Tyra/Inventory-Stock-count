import { useEffect, useState } from "react";
import "./Settings.css";

import { useAuth } from "../context/AuthContext";


function Settings() {


  const {
    user,
    updateProfile
  } = useAuth();


  const [settings, setSettings] =
    useState({

      shopName: "Stock Count",

      phone: "",

      location: "",

      currency: "KSh",

      lowStockLimit: 10,

      darkMode: false

    });


  const [profile, setProfile] =
    useState({

      name: "",

      email: ""

    });


  const [password, setPassword] =
    useState({

      current: "",

      newPassword: "",

      confirm: ""

    });


  const [message, setMessage] =
    useState("");


  const [error, setError] =
    useState("");


  useEffect(() => {

    const savedSettings =
      JSON.parse(
        localStorage.getItem(
          "settings"
        )
      );


    if (savedSettings) {

      setSettings(
        savedSettings
      );

    }


    if (user) {

      setProfile({

        name:
          user.name || "",

        email:
          user.email || ""

      });

    }

  }, [user]);


  // =========================
  // SETTINGS
  // =========================

  const handleSettings = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target;


    setSettings({

      ...settings,

      [name]:
        type === "checkbox"
          ? checked
          : value

    });


    setMessage("");

    setError("");

  };


  // =========================
  // PROFILE
  // =========================

  const handleProfile = (e) => {

    setProfile({

      ...profile,

      [e.target.name]:
        e.target.value

    });


    setMessage("");

    setError("");

  };


  // =========================
  // PASSWORD
  // =========================

  const handlePassword = (e) => {

    setPassword({

      ...password,

      [e.target.name]:
        e.target.value

    });


    setMessage("");

    setError("");

  };


  // =========================
  // SAVE
  // =========================

  const saveAll = () => {

    setMessage("");

    setError("");


    // Validate profile

    if (
      !profile.name.trim()
    ) {

      setError(
        "Please enter your name."
      );

      return;

    }


    if (
      !profile.email.trim()
    ) {

      setError(
        "Please enter your email."
      );

      return;

    }


    // Password validation

    if (
      password.current ||
      password.newPassword ||
      password.confirm
    ) {


      if (
        !password.current
      ) {

        setError(
          "Please enter your current password."
        );

        return;

      }


      if (
        !password.newPassword
      ) {

        setError(
          "Please enter a new password."
        );

        return;

      }


      if (
        password.newPassword.length < 6
      ) {

        setError(
          "New password must be at least 6 characters."
        );

        return;

      }


      if (
        password.newPassword !==
        password.confirm
      ) {

        setError(
          "New passwords do not match."
        );

        return;

      }


      const users =
        JSON.parse(
          localStorage.getItem(
            "users"
          )
        ) || [];


      const currentUser =
        users.find(
          (u) =>
            u.email ===
            user.email
        );


      if (
        !currentUser
      ) {

        setError(
          "Account could not be found."
        );

        return;

      }


      if (
        currentUser.password !==
        password.current
      ) {

        setError(
          "Current password is incorrect."
        );

        return;

      }


      const updatedUsers =
        users.map((u) => {

          if (
            u.email ===
            user.email
          ) {

            return {

              ...u,

              password:
                password.newPassword

            };

          }


          return u;

        });


      localStorage.setItem(
        "users",
        JSON.stringify(
          updatedUsers
        )
      );

    }


    // Save shop settings

    localStorage.setItem(
      "settings",
      JSON.stringify(
        settings
      )
    );


    // Update profile

    if (user) {

      updateProfile({

        ...user,

        name:
          profile.name,

        email:
          profile.email

      });

    }


    // Clear password fields

    setPassword({

      current: "",

      newPassword: "",

      confirm: ""

    });


    setMessage(
      "✓ Settings updated successfully."
    );

  };


  return (

    <div className="settings-page">


      <div className="settings-header">

        <h1>
          ⚙️ Settings
        </h1>

        <p>
          Manage your shop and account.
        </p>

      </div>


      {/* SUCCESS MESSAGE */}

      {message && (

        <div className="settings-success">

          ✓ {message.replace(
            "✓ ",
            ""
          )}

        </div>

      )}


      {/* ERROR MESSAGE */}

      {error && (

        <div className="settings-error">

          ⚠️ {error}

        </div>

      )}


      <div className="settings-card">


        {/* PROFILE */}

        <section>

          <h2>
            👤 Profile
          </h2>


          <label>
            Name
          </label>


          <input
            name="name"
            value={
              profile.name
            }
            onChange={
              handleProfile
            }
          />


          <label>
            Email
          </label>


          <input
            type="email"
            name="email"
            value={
              profile.email
            }
            onChange={
              handleProfile
            }
          />

        </section>


        <hr />


        {/* SHOP */}

        <section>

          <h2>
            🏪 Shop
          </h2>


          <label>
            Shop Name
          </label>


          <input
            name="shopName"
            value={
              settings.shopName
            }
            onChange={
              handleSettings
            }
          />


          <label>
            Phone
          </label>


          <input
            name="phone"
            value={
              settings.phone
            }
            onChange={
              handleSettings
            }
            placeholder="07xxxxxxxx"
          />


          <label>
            Location
          </label>


          <input
            name="location"
            value={
              settings.location
            }
            onChange={
              handleSettings
            }
            placeholder="Shop location"
          />


          <label>
            Currency
          </label>


          <select
            name="currency"
            value={
              settings.currency
            }
            onChange={
              handleSettings
            }
          >

            <option>
              KSh
            </option>

            <option>
              USD
            </option>

            <option>
              EUR
            </option>

          </select>


          <label>
            Low Stock Alert
          </label>


          <input
            type="number"
            name="lowStockLimit"
            min="1"
            value={
              settings.lowStockLimit
            }
            onChange={
              handleSettings
            }
          />

        </section>


        <hr />


        {/* APPEARANCE */}

        <section>

          <h2>
            🌙 Appearance
          </h2>


          <label className="switch">

            <input
              type="checkbox"
              name="darkMode"
              checked={
                settings.darkMode
              }
              onChange={
                handleSettings
              }
            />

            Enable Dark Mode

          </label>

        </section>


        <hr />


        {/* PASSWORD */}

        <section>

          <h2>
            🔒 Change Password
          </h2>


          <input
            type="password"
            name="current"
            placeholder="Current Password"
            value={
              password.current
            }
            onChange={
              handlePassword
            }
          />


          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={
              password.newPassword
            }
            onChange={
              handlePassword
            }
          />


          <input
            type="password"
            name="confirm"
            placeholder="Confirm New Password"
            value={
              password.confirm
            }
            onChange={
              handlePassword
            }
          />

        </section>


        <button
          className="save-settings-btn"
          onClick={saveAll}
        >

          💾 Save Changes

        </button>


      </div>


    </div>

  );

}


export default Settings;

