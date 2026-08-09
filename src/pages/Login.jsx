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

  const [loading, setLoading] =
    useState(false);


  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);


    try {

      const result =
        await login(
          email,
          password
        );


      if (result.success) {

        toast.success(
          "Welcome back! 👋"
        );

        navigate("/");

      } else {

        setError(
          result.message
        );

        toast.error(
          result.message
        );

      }

    } catch (error) {

      console.log(error);

      setError(
        "Something went wrong. Please try again."
      );

      toast.error(
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-page">

      <div className="login-card">


        <h1>
          TIMELINE ELECTRONICS STOCK-COUNT APP
        </h1>


        <h2>
          Welcome Back
        </h2>


        <p>
          Sign in to continue
        </p>


        <form
          onSubmit={handleSubmit}
        >


          {/* EMAIL */}

          <input

            type="email"

            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }

            required

          />


          {/* PASSWORD */}

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
                setPassword(
                  e.target.value
                )
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

              {
                showPassword
                  ? "🙈"
                  : "👁"
              }

            </button>

          </div>


          {/* ERROR */}

          {error && (

            <p className="error">

              {error}

            </p>

          )}


          {/* LOGIN BUTTON */}

          <button

            type="submit"

            className="login-btn"

            disabled={loading}

          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>


        </form>


        {/* REGISTER */}

        <p className="register-link">

          Don't have an account?

          {" "}

          <Link to="/register">

            Register

          </Link>

        </p>


      </div>

    </div>

  );

}


export default Login;