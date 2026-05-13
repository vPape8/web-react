const getToken = () => localStorage.getItem('token');

const authHeader = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

const publicHeader = () => ({
  'Content-Type': 'application/json',
});

// GET autenticado
export const get = (url) =>
  fetch(url, { headers: authHeader() }).then(handleResponse);

// POST público (login, register)
export const postPublic = (url, body) =>
  fetch(url, {
    method: 'POST',
    headers: publicHeader(),
    body: JSON.stringify(body),
  }).then(handleResponse);

// POST autenticado
export const post = (url, body) =>
  fetch(url, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(body),
  }).then(handleResponse);

// DELETE autenticado
export const remove = (url) =>
  fetch(url, {
    method: 'DELETE',
    headers: authHeader(),
  }).then(handleResponse);

// Manejo centralizado de respuestas
const handleResponse = async (res) => {
  // 1. Si es 401 pero NO estamos en la página de login, redirigimos (Token expirado)
  if (res.status === 401) {
    const esPaginaLogin = window.location.pathname === '/login' || window.location.pathname === '/';
    
    if (!esPaginaLogin) {
      localStorage.clear();
      window.location.href = '/login';
      return;
    }
    // Si estamos en login, dejamos que el flujo siga al siguiente bloque (!res.ok)
  }

  // 2. Manejo de errores (incluyendo el 401 del login)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Error del servidor' }));
    // Lanzamos el error para que InicioSeccion lo capture en el 'catch'
    throw new Error(error.error || error.mensaje || `Error ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
};