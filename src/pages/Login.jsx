import { useState } from "react";
import "./Login.css";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");



  const handleSubmit = (e) => {

  e.preventDefault();

  const result = login(email, password);

  if (result.success) {

    toast.success("Welcome back! 👋");

    navigate("/");

  } else {

    setError(result.message);

    toast.error(result.message);

  }

};



  return (

    <div className="login-page">

      <div className="login-card">

        <h1>⚡ Stock Count</h1>

        <h2>Welcome Back</h2>

        <p>Sign in to continue</p>

        <form onSubmit={handleSubmit}>

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



          {error && (

            <p className="error">

              {error}

            </p>

          )}



          <button
            className="login-btn"
          >

            Login

          </button>

        </form>



        <p className="register-link">

          Don't have an account?

          <Link to="/register">

            Register

          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;