// URL base del BFF — se inyecta desde .env según el entorno
const BASE = import.meta.env.VITE_API_BASE;

// ── Auth (rutas públicas, sin token) ──────────────────────────
export const API_AUTH = {
  LOGIN:    `${BASE}/auth/login`,
  REGISTER: `${BASE}/auth/register`,
};

// ── Puertos ───────────────────────────────────────────────────
export const API_PUERTOS = {
  BASE:     `${BASE}/api/puertos`,
  BY_ID:    (id) => `${BASE}/api/puertos/${id}`,
};

// ── Buques ────────────────────────────────────────────────────
export const API_BUQUES = {
  BASE:     `${BASE}/api/buques`,
  BY_ID:    (id) => `${BASE}/api/buques/${id}`,
};

// ── Operaciones ───────────────────────────────────────────────
export const API_OPERACIONES = {
  BASE:     `${BASE}/api/operaciones`,
  BY_ID:    (id) => `${BASE}/api/operaciones/${id}`,
  SIMULAR:  `${BASE}/api/operaciones/simular`,
  CALCULAR: `${BASE}/api/operaciones/calcula`,
};

// Agregar al final de src/config/api.js
export const API_URLS = {
  AUTH:    `${BASE}/auth`,
  BOLETA:  `${BASE}/api/operaciones`,
  BOLETAS: `${BASE}/api/operaciones`,
};

export default API_URLS;