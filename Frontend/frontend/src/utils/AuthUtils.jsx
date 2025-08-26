export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export const getAdminUser = () => {
  const admin = localStorage.getItem("admin");
  return admin ? JSON.parse(admin) : null;
};

export const logoutAdmin = () => {
  localStorage.removeItem("admin");
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token") || null;
};

export const refreshToken = async () => {
  console.log("Simulating token refresh...");
  const newToken = "your_new_refreshed_token";
  localStorage.setItem("token", newToken);
  return newToken;
};
