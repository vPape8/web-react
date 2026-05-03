// Configuración centralizada de APIs
// Cambia estas URLs según necesites

const API_CONFIG = {
  // Opción 1: Servidor local (para desarrollo)
  LOCAL: {
    BASE_URL: 'http://localhost:8080',
    BOLETA: '/api/boleta',
    BOLETAS: '/api/boletas', 
    AUTH: '/auth'
  },
  
  // Opción 2: Servidor AWS EC2 (producción)
  PRODUCTION: {
    BASE_URL: 'http://54.88.10.118:8080',
    BOLETA: '/api/boleta',
    BOLETAS: '/api/boletas',
    AUTH: '/auth'
  },
  
  // Opción 3: Servidor mock/datos falsos (para pruebas)
  MOCK: {
    BASE_URL: 'http://localhost:3001',
    BOLETA: '/api/boleta',
    BOLETAS: '/api/boletas',
    AUTH: '/auth'
  }
};

// Selecciona qué configuración usar: 'LOCAL', 'PRODUCTION', o 'MOCK'
const CURRENT_ENV = 'MOCK'; // Cambia esto según necesites

export const API_URLS = {
  BOLETA: `${API_CONFIG[CURRENT_ENV].BASE_URL}${API_CONFIG[CURRENT_ENV].BOLETA}`,
  BOLETAS: `${API_CONFIG[CURRENT_ENV].BASE_URL}${API_CONFIG[CURRENT_ENV].BOLETAS}`,
  AUTH: `${API_CONFIG[CURRENT_ENV].BASE_URL}${API_CONFIG[CURRENT_ENV].AUTH}`
};

export default API_URLS;
