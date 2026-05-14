import axios from 'axios';

// Usamos VITE_API_URL que es la que definiste en tu archivo .env
const BASE = import.meta.env.VITE_API_URL;

// ── EL OBJETO QUE TUS PÁGINAS BUSCAN (API_URLS) ────────────────
export const API_URLS = {
  AUTH:        `${BASE}/auth`,
  PUERTOS:     `${BASE}/api/puertos`,
  BUQUES:      `${BASE}/api/buques`,
  OPERACIONES: `${BASE}/api/operaciones`,
};

// ── Rutas específicas (Por si las usas en otros lados) ──────────
export const API_AUTH = {
  LOGIN:    `${BASE}/auth/login`,
  REGISTER: `${BASE}/auth/register`,
};

export const API_PUERTOS = {
  BASE:     `${BASE}/api/puertos`,
  BY_ID:    (id) => `${BASE}/api/puertos/${id}`,
};

export const API_BUQUES = {
  BASE:     `${BASE}/api/buques`,
  BY_ID:    (id) => `${BASE}/api/buques/${id}`,
};

export const API_OPERACIONES = {
  BASE:     `${BASE}/api/operaciones`,
  BY_ID:    (id) => `${BASE}/api/operaciones/${id}`,
  SIMULAR:  `${BASE}/api/operaciones/simular`,
  CALCULAR: `${BASE}/api/operaciones/calcula`,
};

// ── Instancia de Axios ─────────────────────────────────────────
const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("Conectado a:", BASE);

export default api;