import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const register = (newUser) => {
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(
      (user) => user.email === newUser.email
    );

    if (exists) {
      return {
        success: false,
        message: "Email already exists.",
      };
    }

    users.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    localStorage.setItem(
      "currentUser",
      JSON.stringify(newUser)
    );

    setUser(newUser);

    return {
      success: true,
    };
  };

  const login = (email, password) => {
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (user) =>
        user.email === email &&
        user.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify(foundUser)
    );

    setUser(foundUser);

    return {
      success: true,
    };
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const updateProfile = (updatedUser) => {
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((user) =>
      user.email === updatedUser.email
        ? updatedUser
        : user
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}