import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {

  const {
    user,
    loading
  } = useAuth();


  // =========================
  // WAIT FOR SUPABASE SESSION
  // =========================

  if (loading) {

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: "600"
        }}
      >
        Loading...
      </div>
    );

  }


  // =========================
  // NOT LOGGED IN
  // =========================

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // =========================
  // LOGGED IN
  // =========================

  return children;

}


export default ProtectedRoute;