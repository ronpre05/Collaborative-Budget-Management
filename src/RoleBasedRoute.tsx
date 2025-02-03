import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface RoleBasedRouteProps {
  allowedRoles: number[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const userRole = parseInt(localStorage.getItem("userRole") || "0", 10);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle navigation and error message
  useEffect(() => {
    if (!allowedRoles.includes(userRole)) {
      // Set the error message
      setErrorMessage("You do not have permission to access this page.");
    }
  }, [allowedRoles, userRole]);

  const handleCloseError = () => {
    // Clear the error message
    setErrorMessage(null);
    // Redirect the user to the home page when the error message is closed
    navigate("/", { replace: true });
  };

  return (
    <div>
      {/* Show the error message if not allowed */}
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
          <button onClick={handleCloseError}>Close</button>
        </div>
      )}

      {/* Allow navigation if role matches */}
      {allowedRoles.includes(userRole) ? <Outlet /> : null}
    </div>
  );
};

export default RoleBasedRoute;



