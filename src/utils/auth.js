export const saveSession = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('rol', data.rol);
  localStorage.setItem('nombre', data.nombre);
};

export const clearSession = () => localStorage.clear();

export const getToken = () => localStorage.getItem('token');
export const getRol = () => localStorage.getItem('rol');
export const getNombre = () => localStorage.getItem('nombre');
export const isAuthenticated = () => !!localStorage.getItem('token');
export const isAdmin = () => localStorage.getItem('rol') === 'ADMIN';