import { useState } from "react";
import "./Register.css";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Register() {

  const navigate = useNavigate();

  const { register } = useAuth();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");



const handleSubmit = (e) => {

  e.preventDefault();

  setError("");

  if (password !== confirmPassword) {

    setError("Passwords do not match.");

    toast.error("Passwords do not match.");

    return;

  }

  const result = register({
    name,
    email,
    password,
  });

  if (result.success) {

    toast.success("Account created successfully! 🎉");

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    navigate("/");

  } else {

    setError(result.message);

    toast.error(result.message);

  }

};



  return (

    <div className="register-page">

      <div className="register-card">

        <h1>⚡ Stock Count</h1>

        <h2>Create Account</h2>

        <p>Create your shop account</p>

        <form onSubmit={handleSubmit}>

          <input

            type="text"

            placeholder="Full Name"

            value={name}

            onChange={(e) =>
              setName(e.target.value)
            }

            required

          />



          <input

            type="email"

            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }

            required

          />



          <div className="password-box">

            <input

              type={
                showPassword
                  ? "text"
                  : "password"
              }

              placeholder="Password"

              value={password}

              onChange={(e) =>
                setPassword(e.target.value)
              }

              required

            />

            <button

              type="button"

              className="show-btn"

              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }

            >

              {showPassword ? "🙈" : "👁"}

            </button>

          </div>



          <input

            type={
              showPassword
                ? "text"
                : "password"
            }

            placeholder="Confirm Password"

            value={confirmPassword}

            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }

            required

          />



          {error && (

            <p className="error">

              {error}

            </p>

          )}



          <button
            className="register-btn"
          >

            Create Account

          </button>

        </form>



        <p className="login-link">

          Already have an account?

          <Link to="/login">

            Login

          </Link>

        </p>

      </div>

    </div>

  );

}

export default Register;