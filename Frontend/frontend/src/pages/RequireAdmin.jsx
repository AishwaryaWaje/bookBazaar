import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAdminUser } from "../utils/AuthUtils";

const RequireAdmin = ({ children }) => {
  const [unauthorized, setUnauthorized] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const user = getAdminUser;

  useEffect(() => {
    if (!user || !user.isAdmin) {
      setUnauthorized(true);
      const timeout = setTimeout(() => {
        setRedirect(true);
      }, 8000);

      return () => clearTimeout(timeout);
    }
  }, [user]);

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-3xl font-semibold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-700">You must be an admin to access this page.</p>
        <p className="text-sm text-gray-500">Redirecting to home page...</p>
      </div>
    );
  }

  return children;
};

export default RequireAdmin;
