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

  const [loading, setLoading] =
    useState(false);


  // =========================
  // REGISTER
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    // =========================
    // CHECK PASSWORDS
    // =========================

    if (
      password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      toast.error(
        "Passwords do not match."
      );

      return;

    }


    setLoading(true);


    try {

      const result =
        await register({

          name,
          email,
          password

        });


      // =========================
      // SUCCESS
      // =========================

      if (result.success) {

        toast.success(
          "Account created successfully! 🎉"
        );


        setName("");

        setEmail("");

        setPassword("");

        setConfirmPassword("");


        navigate("/");

      }


      // =========================
      // ERROR
      // =========================

      else {

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

    <div className="register-page">

      <div className="register-card">


        {/* =========================
            LOGO
        ========================= */}

        <h1>
          ⚡ Stock Count
        </h1>


        <h2>
          Create Account
        </h2>


        <p>
          Create your shop account
        </p>


        <form
          onSubmit={handleSubmit}
        >


          {/* =========================
              NAME
          ========================= */}

          <input

            type="text"

            placeholder="Full Name"

            value={name}

            onChange={(e) =>
              setName(e.target.value)
            }

            required

          />


          {/* =========================
              EMAIL
          ========================= */}

          <input

            type="email"

            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }

            required

          />


          {/* =========================
              PASSWORD
          ========================= */}

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


          {/* =========================
              CONFIRM PASSWORD
          ========================= */}

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


          {/* =========================
              ERROR
          ========================= */}

          {error && (

            <p className="error">

              {error}

            </p>

          )}


          {/* =========================
              REGISTER BUTTON
          ========================= */}

          <button

            type="submit"

            className="register-btn"

            disabled={loading}

          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

          </button>


        </form>


        {/* =========================
            LOGIN LINK
        ========================= */}

        <p className="login-link">

          Already have an account?

          {" "}

          <Link to="/login">

            Login

          </Link>

        </p>


      </div>

    </div>

  );

}


export default Register;

