export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => !!localStorage.getItem('token');

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};