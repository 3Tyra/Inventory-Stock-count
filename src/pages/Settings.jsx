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
  // SAVE SETTINGS
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


    // =========================
    // PASSWORD VALIDATION
    // =========================

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


    // =========================
    // SAVE SHOP SETTINGS
    // =========================

    localStorage.setItem(
      "settings",
      JSON.stringify(
        settings
      )
    );


    // =========================
    // UPDATE PROFILE
    // =========================

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


  // =========================
  // BACKUP DATA
  // =========================

  const backupData = () => {

    const backup = {

      products:
        JSON.parse(
          localStorage.getItem(
            "products"
          )
        ) || [],

      sales:
        JSON.parse(
          localStorage.getItem(
            "sales"
          )
        ) || [],

      settings:
        JSON.parse(
          localStorage.getItem(
            "settings"
          )
        ) || {},

      users:
        JSON.parse(
          localStorage.getItem(
            "users"
          )
        ) || []

    };


    const data =
      JSON.stringify(
        backup,
        null,
        2
      );


    const blob =
      new Blob(
        [data],
        {
          type:
            "application/json"
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        "a"
      );


    link.href = url;


    link.download =
      "stock-count-backup.json";


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );


    URL.revokeObjectURL(
      url
    );


    setMessage(
      "✓ Backup downloaded successfully."
    );

    setError("");

  };


  // =========================
  // RESTORE DATA
  // =========================

  const restoreData = (e) => {

    const file =
      e.target.files[0];


    if (!file) {
      return;
    }


    const reader =
      new FileReader();


    reader.onload = (event) => {

      try {

        const backup =
          JSON.parse(
            event.target.result
          );


        // Validate backup

        if (
          !backup ||
          typeof backup !==
            "object"
        ) {

          throw new Error(
            "Invalid backup file."
          );

        }


        // Restore products

        if (
          Array.isArray(
            backup.products
          )
        ) {

          localStorage.setItem(
            "products",
            JSON.stringify(
              backup.products
            )
          );

        }


        // Restore sales

        if (
          Array.isArray(
            backup.sales
          )
        ) {

          localStorage.setItem(
            "sales",
            JSON.stringify(
              backup.sales
            )
          );

        }


        // Restore settings

        if (
          backup.settings &&
          typeof backup.settings ===
            "object"
        ) {

          localStorage.setItem(
            "settings",
            JSON.stringify(
              backup.settings
            )
          );

        }


        // Restore users

        if (
          Array.isArray(
            backup.users
          )
        ) {

          localStorage.setItem(
            "users",
            JSON.stringify(
              backup.users
            )
          );

        }


        // Tell the application
        // that the data changed

        window.dispatchEvent(
          new Event(
            "productsUpdated"
          )
        );


        window.dispatchEvent(
          new Event(
            "salesUpdated"
          )
        );


        setMessage(
          "✓ Data restored successfully. Refresh the page to see everything."
        );

        setError("");


      } catch (error) {

        console.log(error);

        setError(
          "Invalid backup file. Please select a valid Stock Count backup."
        );

        setMessage("");

      }

    };


    reader.readAsText(
      file
    );


    // Allow selecting
    // the same file again

    e.target.value = "";

  };


  // =========================
  // CLEAR ALL DATA
  // =========================

  const clearAllData = () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete ALL products, sales and shop data? This cannot be undone."
      );


    if (!confirmed) {
      return;
    }


    localStorage.removeItem(
      "products"
    );

    localStorage.removeItem(
      "sales"
    );

    localStorage.removeItem(
      "settings"
    );


    window.dispatchEvent(
      new Event(
        "productsUpdated"
      )
    );


    window.dispatchEvent(
      new Event(
        "salesUpdated"
      )
    );


    setMessage(
      "✓ Shop data cleared successfully."
    );

    setError("");

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

          {message}

        </div>

      )}


      {/* ERROR MESSAGE */}

      {error && (

        <div className="settings-error">

          ⚠️ {error}

        </div>

      )}


      <div className="settings-card">


        {/* =========================
            PROFILE
        ========================= */}

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


        {/* =========================
            SHOP
        ========================= */}

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


        {/* =========================
            APPEARANCE
        ========================= */}

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


        {/* =========================
            PASSWORD
        ========================= */}

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


        <hr />


        {/* =========================
            BACKUP & RESTORE
        ========================= */}

        <section>

          <h2>
            💾 Backup & Restore
          </h2>

          <p className="backup-description">

            Protect your inventory by
            downloading a backup of your
            products, sales and shop settings.

          </p>


          <button
            className="backup-btn"
            onClick={backupData}
          >

            💾 Download Backup

          </button>


          <label
            className="restore-btn"
          >

            📂 Restore Backup

            <input
              type="file"
              accept=".json,application/json"
              onChange={
                restoreData
              }
              hidden
            />

          </label>


          <button
            className="clear-data-btn"
            onClick={
              clearAllData
            }
          >

            🗑️ Clear Shop Data

          </button>

        </section>


      </div>


    </div>

  );

}


export default Settings;