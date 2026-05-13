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
  if (res.status === 401) {
    // Token expirado o inválido → limpiar sesión
    localStorage.clear();
    window.location.href = '/login';
    return;
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Error del servidor' }));
    throw new Error(error.error || `Error ${res.status}`);
  }
  // DELETE puede no retornar body
  if (res.status === 204) return null;
  return res.json();
};