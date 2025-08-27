import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAdminUser } from "../utils/AuthUtils";

/**
 * @description A higher-order component that restricts access to its children to authenticated admin users only.
 * If the user is not an admin, it displays an access denied message and redirects to the admin login page.
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - The child components to render if the user is an admin.
 * @returns {JSX.Element} The children components if authenticated as admin, or a redirect/access denied message.
 */
const RequireAdmin = ({ children }) => {
  /** @type {boolean} */
  const [unauthorized, setUnauthorized] = useState(false);
  /** @type {boolean} */
  const [redirect, setRedirect] = useState(false);
  const user = getAdminUser();

  /**
   * @description Effect hook to check admin status on component mount or when user changes.
   * Sets `unauthorized` and `redirect` states based on admin status.
   */
  useEffect(() => {
    if (!user || !user.isAdmin) {
      setUnauthorized(true);
      const timeout = setTimeout(() => setRedirect(true), 4000);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  if (redirect) return <Navigate to="/bookbazaar-admin" replace />;

  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-700">You must be an admin to access this page.</p>
        <p className="text-sm text-gray-500">Redirecting to admin login...</p>
      </div>
    );
  }

  return children;
};

export default RequireAdmin;
