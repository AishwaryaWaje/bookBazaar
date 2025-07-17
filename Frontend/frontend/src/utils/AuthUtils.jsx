export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};
