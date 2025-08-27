/**
 * @description Retrieves the current authenticated user from local storage.
 * @returns {object|null} The user object if found, otherwise null.
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * @description Logs out the current user by removing user and token data from local storage.
 * @returns {void}
 */
export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

/**
 * @description Retrieves the current authenticated admin user from local storage.
 * @returns {object|null} The admin user object if found, otherwise null.
 */
export const getAdminUser = () => {
  const admin = localStorage.getItem("admin");
  return admin ? JSON.parse(admin) : null;
};

/**
 * @description Logs out the current admin user by removing admin and token data from local storage.
 * @returns {void}
 */
export const logoutAdmin = () => {
  localStorage.removeItem("admin");
  localStorage.removeItem("token");
};

/**
 * @description Retrieves the authentication token from local storage.
 * @returns {string|null} The JWT token string if found, otherwise null.
 */
export const getToken = () => {
  return localStorage.getItem("token") || null;
};

/**
 * @description Simulates token refresh. In a real application, this would involve an API call.
 * Stores a new placeholder token in local storage.
 * @returns {Promise<string>} A promise that resolves with the new token.
 */
export const refreshToken = async () => {
  console.log("Simulating token refresh...");
  const newToken = "your_new_refreshed_token";
  localStorage.setItem("token", newToken);
  return newToken;
};
