# Configuración de URLs del Backend

## Problema
Las URLs del backend ya no están disponibles y necesitas configurarlas temporalmente para que la página funcione.

## Soluciones Disponibles

### Opción 1: Usar Servidor Mock (Recomendado para pruebas)
1. Instala las dependencias:
   ```bash
   npm install express cors
   ```

2. Inicia el servidor mock:
   ```bash
   node mock-server.js
   ```

3. Cambia la configuración a modo MOCK:
   - Edita `src/config/api.js`
   - Cambia `const CURRENT_ENV = 'PRODUCTION';` a `const CURRENT_ENV = 'MOCK';`

### Opción 2: Usar Servidor Local
Si tienes tu backend corriendo localmente:
1. Edita `src/config/api.js`
2. Cambia `const CURRENT_ENV = 'PRODUCTION';` a `const CURRENT_ENV = 'LOCAL';`
3. Asegúrate que tu backend corra en `http://localhost:8080`

### Opción 3: Mantener URLs de Producción
Las URLs actuales son:
- **Comerciales**: `http://54.88.10.118:8080/api/boleta`
- **Pasajeros**: `http://54.88.10.118:8080/api/boletas`
- **Autenticación**: `http://54.88.10.118:8080/auth`

Para mantener estas, asegúrate que `CURRENT_ENV = 'PRODUCTION'` en `src/config/api.js`

## Cambios Realizados

1. **Configuración centralizada**: Se creó `src/config/api.js` para manejar todas las URLs
2. **Servidor mock**: Se agregó `mock-server.js` para pruebas sin backend
3. **Actualización de componentes**: `Comerciales.jsx` ahora usa la configuración centralizada

## Pasos para Actualizar Otros Componentes

✅ **Componentes Actualizados:**
- `src/pages/Comerciales.jsx` - usa `API_URLS.BOLETA`
- `src/pages/Pasajeros.jsx` - usa `API_URLS.BOLETAS`
- `src/pages/InicioSeccion.jsx` - usa `API_URLS.AUTH`
- `src/pages/Reportes.jsx` - usa `API_URLS.BOLETAS`
- `src/pages/Historial.jsx` - usa `API_URLS.BOLETAS`
- `src/pages/Especiales.jsx` - usa `API_URLS.BOLETAS`
- `src/pages/Calculadora.jsx` - usa `API_URLS.BOLETAS`

Todos los componentes ahora usan la configuración centralizada.

## Uso Rápido

Para probar inmediatamente:
```bash
# 1. Iniciar servidor mock
node mock-server.js

# 2. Cambiar a modo MOCK en src/config/api.js
# 3. Iniciar tu app React
npm start
```

El servidor mock responderá con datos falsos pero permitirá que tu aplicación funcione completamente.
