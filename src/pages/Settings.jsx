import { useEffect, useState } from "react";
import "./Settings.css";

import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user, updateProfile } = useAuth();

  const [settings, setSettings] = useState({
    shopName: "Stock Count",
    phone: "",
    location: "",
    currency: "KSh",
    lowStockLimit: 10,
    darkMode: false
  });

  const [profile, setProfile] = useState({
    name: "",
    email: ""
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD USER + SETTINGS
  // =========================

  useEffect(() => {
    if (!user) return;

    setProfile({
      name: user.name || "",
      email: user.email || ""
    });

    loadSettings();
  }, [user]);

  // =========================
  // LOAD SETTINGS
  // =========================

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Settings load error:", error);
        setError("Could not load your settings.");
        return;
      }

      if (data) {
        setSettings({
          shopName: data.shop_name || "Stock Count",
          phone: data.phone || "",
          location: data.location || "",
          currency: data.currency || "KSh",
          lowStockLimit:
            Number(data.low_stock_limit) || 10,
          darkMode: Boolean(data.dark_mode)
        });
      }
    } catch (err) {
      console.error("Settings loading failed:", err);
      setError("Could not load your settings.");
    }
  };

  // =========================
  // SETTINGS INPUT
  // =========================

  const handleSettings = (e) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));

    setMessage("");
    setError("");
  };

  // =========================
  // PROFILE INPUT
  // =========================

  const handleProfile = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setMessage("");
    setError("");
  };

  // =========================
  // PASSWORD INPUT
  // =========================

  const handlePassword = (e) => {
    setPassword((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setMessage("");
    setError("");
  };

  // =========================
  // SAVE EVERYTHING
  // =========================

  const saveAll = async () => {
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    setMessage("");
    setError("");
    setLoading(true);

    try {
      // =========================
      // VALIDATE PROFILE
      // =========================

      if (!profile.name.trim()) {
        setError("Please enter your name.");
        setLoading(false);
        return;
      }

      if (!profile.email.trim()) {
        setError("Please enter your email.");
        setLoading(false);
        return;
      }

      // =========================
      // SAVE SHOP SETTINGS
      // =========================

      const settingsData = {
        user_id: user.id,

        shop_name:
          settings.shopName.trim(),

        phone:
          settings.phone.trim() || null,

        location:
          settings.location.trim() || null,

        currency:
          settings.currency,

        low_stock_limit:
          Number(settings.lowStockLimit) || 10,

        dark_mode:
          Boolean(settings.darkMode)
      };

      const {
        error: settingsError
      } = await supabase
        .from("settings")
        .upsert(
          settingsData,
          {
            onConflict: "user_id"
          }
        );

      if (settingsError) {
        console.error(
          "Settings save error:",
          settingsError
        );

        setError(
          "Could not save shop settings."
        );

        setLoading(false);
        return;
      }

      // =========================
      // UPDATE PROFILE
      // =========================

      const profileResult =
        await updateProfile({
          ...user,
          name: profile.name.trim(),
          email: profile.email.trim()
        });

      if (
        profileResult &&
        !profileResult.success
      ) {
        setError(
          profileResult.message ||
            "Could not update profile."
        );

        setLoading(false);
        return;
      }

      // =========================
      // PASSWORD
      // =========================

      if (
        password.current ||
        password.newPassword ||
        password.confirm
      ) {
        if (!password.current) {
          setError(
            "Please enter your current password."
          );

          setLoading(false);
          return;
        }

        if (!password.newPassword) {
          setError(
            "Please enter a new password."
          );

          setLoading(false);
          return;
        }

        if (
          password.newPassword.length < 6
        ) {
          setError(
            "New password must be at least 6 characters."
          );

          setLoading(false);
          return;
        }

        if (
          password.newPassword !==
          password.confirm
        ) {
          setError(
            "New passwords do not match."
          );

          setLoading(false);
          return;
        }

        // Supabase does not require
        // the current password here.
        // The current password field
        // is kept as a confirmation field
        // for the UI.

        const {
          error: passwordError
        } = await supabase.auth.updateUser({
          password:
            password.newPassword
        });

        if (passwordError) {
          console.error(
            "Password update error:",
            passwordError
          );

          setError(
            passwordError.message ||
              "Could not update password."
          );

          setLoading(false);
          return;
        }
      }

      // =========================
      // CLEAR PASSWORD FIELDS
      // =========================

      setPassword({
        current: "",
        newPassword: "",
        confirm: ""
      });

      // =========================
      // SUCCESS
      // =========================

      setMessage(
        "✓ Settings updated successfully."
      );

    } catch (err) {
      console.error(
        "Save settings failed:",
        err
      );

      setError(
        "Something went wrong while saving."
      );
    }

    setLoading(false);
  };

  // =========================
  // BACKUP DATA
  // =========================

  const backupData = async () => {
    if (!user) return;

    try {
      const [
        productsResult,
        salesResult,
        historyResult,
        settingsResult
      ] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("user_id", user.id),

        supabase
          .from("sales")
          .select("*")
          .eq("user_id", user.id),

        supabase
          .from("stock_history")
          .select("*")
          .eq("user_id", user.id),

        supabase
          .from("settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()
      ]);

      if (productsResult.error) {
        throw productsResult.error;
      }

      if (salesResult.error) {
        throw salesResult.error;
      }

      if (historyResult.error) {
        throw historyResult.error;
      }

      if (settingsResult.error) {
        throw settingsResult.error;
      }

      const backup = {
        products:
          productsResult.data || [],

        sales:
          salesResult.data || [],

        stockHistory:
          historyResult.data || [],

        settings:
          settingsResult.data || null
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
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "stock-count-backup.json";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setMessage(
        "✓ Backup downloaded successfully."
      );

      setError("");

    } catch (err) {
      console.error(
        "Backup error:",
        err
      );

      setError(
        "Could not create backup."
      );
    }
  };

  // =========================
  // RESTORE DATA
  // =========================

  const restoreData = (e) => {
    const file =
      e.target.files[0];

    if (!file || !user) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = async (event) => {
      try {
        const backup =
          JSON.parse(
            event.target.result
          );

        if (
          !backup ||
          typeof backup !== "object"
        ) {
          throw new Error(
            "Invalid backup."
          );
        }

        // =========================
        // RESTORE PRODUCTS
        // =========================

        if (
          Array.isArray(
            backup.products
          )
        ) {
          const products =
            backup.products.map(
              (product) => ({
                ...product,
                user_id: user.id
              })
            );

          const {
            error
          } = await supabase
            .from("products")
            .upsert(products);

          if (error) {
            throw error;
          }
        }

        // =========================
        // RESTORE SALES
        // =========================

        if (
          Array.isArray(
            backup.sales
          )
        ) {
          const sales =
            backup.sales.map(
              (sale) => ({
                ...sale,
                user_id: user.id
              })
            );

          const {
            error
          } = await supabase
            .from("sales")
            .upsert(sales);

          if (error) {
            throw error;
          }
        }

        // =========================
        // RESTORE STOCK HISTORY
        // =========================

        if (
          Array.isArray(
            backup.stockHistory
          )
        ) {
          const history =
            backup.stockHistory.map(
              (record) => ({
                ...record,
                user_id: user.id
              })
            );

          const {
            error
          } = await supabase
            .from("stock_history")
            .upsert(history);

          if (error) {
            throw error;
          }
        }

        // =========================
        // RESTORE SETTINGS
        // =========================

        if (
          backup.settings &&
          typeof backup.settings ===
            "object"
        ) {
          const restoredSettings = {
            ...backup.settings,
            user_id: user.id
          };

          const {
            error
          } = await supabase
            .from("settings")
            .upsert(
              restoredSettings,
              {
                onConflict:
                  "user_id"
              }
            );

          if (error) {
            throw error;
          }
        }

        await loadSettings();

        setMessage(
          "✓ Data restored successfully."
        );

        setError("");

      } catch (err) {
        console.error(
          "Restore error:",
          err
        );

        setError(
          "Invalid backup file or restore failed."
        );

        setMessage("");
      }
    };

    reader.readAsText(file);

    e.target.value = "";
  };

  // =========================
  // CLEAR ALL DATA
  // =========================

  const clearAllData = async () => {
    if (!user) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete ALL products, sales and shop data? This cannot be undone."
      );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Delete sales

      const {
        error: salesError
      } = await supabase
        .from("sales")
        .delete()
        .eq("user_id", user.id);

      if (salesError) {
        throw salesError;
      }

      // Delete stock history

      const {
        error: historyError
      } = await supabase
        .from("stock_history")
        .delete()
        .eq("user_id", user.id);

      if (historyError) {
        throw historyError;
      }

      // Delete products

      const {
        error: productsError
      } = await supabase
        .from("products")
        .delete()
        .eq("user_id", user.id);

      if (productsError) {
        throw productsError;
      }

      // Delete settings

      const {
        error: settingsError
      } = await supabase
        .from("settings")
        .delete()
        .eq("user_id", user.id);

      if (settingsError) {
        throw settingsError;
      }

      setSettings({
        shopName: "Stock Count",
        phone: "",
        location: "",
        currency: "KSh",
        lowStockLimit: 10,
        darkMode: false
      });

      setMessage(
        "✓ Shop data cleared successfully."
      );

      setError("");

    } catch (err) {
      console.error(
        "Clear data error:",
        err
      );

      setError(
        "Could not clear shop data."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PAGE
  // =========================

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

      {/* SUCCESS */}

      {message && (
        <div className="settings-success">
          {message}
        </div>
      )}

      {/* ERROR */}

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
            value={profile.name}
            onChange={handleProfile}
          />

          <label>
            Email
          </label>

          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfile}
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
            value={settings.shopName}
            onChange={handleSettings}
          />

          <label>
            Phone
          </label>

          <input
            name="phone"
            value={settings.phone}
            onChange={handleSettings}
            placeholder="07xxxxxxxx"
          />

          <label>
            Location
          </label>

          <input
            name="location"
            value={settings.location}
            onChange={handleSettings}
            placeholder="Shop location"
          />

          <label>
            Currency
          </label>

          <select
            name="currency"
            value={settings.currency}
            onChange={handleSettings}
          >

            <option value="KSh">
              KSh
            </option>

            <option value="USD">
              USD
            </option>

            <option value="EUR">
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
            value={settings.lowStockLimit}
            onChange={handleSettings}
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
              checked={settings.darkMode}
              onChange={handleSettings}
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
            value={password.current}
            onChange={handlePassword}
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={password.newPassword}
            onChange={handlePassword}
          />

          <input
            type="password"
            name="confirm"
            placeholder="Confirm New Password"
            value={password.confirm}
            onChange={handlePassword}
          />

        </section>

        <button
          className="save-settings-btn"
          onClick={saveAll}
          disabled={loading}
        >

          {loading
            ? "Saving..."
            : "💾 Save Changes"}

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

          <label className="restore-btn">

            📂 Restore Backup

            <input
              type="file"
              accept=".json,application/json"
              onChange={restoreData}
              hidden
            />

          </label>

          <button
            className="clear-data-btn"
            onClick={clearAllData}
            disabled={loading}
          >

            🗑️ Clear Shop Data

          </button>

        </section>

      </div>

    </div>
  );
}

export default Settings;

