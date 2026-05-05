# 🚌 cordyTech Lab — Web React (Frontend)

Frontend del sistema de gestión de boletas y pasajeros de **cordyTech Lab**, desarrollado con React 19 y Vite. Permite administrar boletas comerciales, pasajeros, reportes, historial y más, conectándose a un backend REST.

---

## 🛠️ Tecnologías

| Tecnología | Versión |
|---|---|
| React | 19.x |
| Vite | 7.x |
| React Router DOM | 7.x |
| Bootstrap | 5.3.x |
| React Bootstrap | 2.x |
| ExcelJS | 4.x |
| FileSaver.js | 2.x |
| ESLint | 9.x |

---

## 📁 Estructura del Proyecto

```
web-react/
├── public/                  # Archivos estáticos públicos
├── src/
│   ├── assets/              # Imágenes y recursos estáticos
│   ├── components/          # Componentes reutilizables
│   │   ├── Header.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── ModalDetalles.jsx
│   │   └── PrivateRoute.jsx
│   ├── config/
│   │   └── api.js           # Configuración centralizada de URLs del backend
│   ├── pages/               # Páginas principales de la aplicación
│   │   ├── Home.jsx
│   │   ├── InicioSeccion.jsx  # Login
│   │   ├── Panel.jsx
│   │   ├── Comerciales.jsx
│   │   ├── Pasajeros.jsx
│   │   ├── Especiales.jsx
│   │   ├── Historial.jsx
│   │   ├── Reportes.jsx
│   │   ├── Calculadora.jsx
│   │   └── Contacto.jsx
│   ├── router/              # Configuración de rutas
│   ├── utils/               # Funciones utilitarias
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── mock-server.js           # Servidor mock para pruebas sin backend
├── vite.config.js
├── eslint.config.js
├── index.html
└── package.json
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js >= 18
- npm >= 9

### 1. Clonar el repositorio

```bash
git clone https://gitlab.com/cordytech-lab/web-react.git
cd web-react
git checkout develop
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar el entorno del backend

Edita el archivo `src/config/api.js` y cambia la variable `CURRENT_ENV` según tu entorno:

```js
// Opciones: 'LOCAL' | 'PRODUCTION' | 'MOCK'
const CURRENT_ENV = 'LOCAL';
```

| Entorno | URL Base | Descripción |
|---|---|---|
| `LOCAL` | `http://localhost:8080` | Backend corriendo localmente |
| `PRODUCTION` | `http://54.88.10.118:8080` | Servidor AWS EC2 |
| `MOCK` | `http://localhost:3001` | Servidor mock para pruebas |

### 4. (Opcional) Iniciar el servidor mock

Si no tienes el backend disponible, puedes usar el servidor mock incluido:

```bash
node mock-server.js
```

Luego asegúrate de tener `CURRENT_ENV = 'MOCK'` en `src/config/api.js`.

### 5. Iniciar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` por defecto.

---

## 📦 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint para análisis de código |

---

## 🔌 Endpoints del Backend

La configuración de las URLs se gestiona de forma centralizada en `src/config/api.js`:

| Clave | Ruta | Descripción |
|---|---|---|
| `API_URLS.BOLETA` | `/api/boleta` | Gestión de boletas comerciales |
| `API_URLS.BOLETAS` | `/api/boletas` | Gestión de boletas de pasajeros |
| `API_URLS.AUTH` | `/auth` | Autenticación de usuarios |

---

## 🔐 Autenticación

La aplicación cuenta con rutas protegidas mediante el componente `PrivateRoute`. El flujo de autenticación se gestiona desde la página `InicioSeccion.jsx` (Login), que consume el endpoint `/auth` del backend.

---

## 📊 Funcionalidades Principales

- **Comerciales** — Gestión de boletas comerciales
- **Pasajeros** — Gestión de boletas de pasajeros
- **Especiales** — Boletas de tipo especial
- **Historial** — Consulta del historial de boletas
- **Reportes** — Generación y exportación de reportes a Excel (ExcelJS + FileSaver)
- **Calculadora** — Herramienta de cálculo integrada
- **Contacto** — Página de contacto
- **Panel** — Panel de administración principal

---

## 🤝 Contribución

1. Crea una rama desde `develop`:
   ```bash
   git checkout -b feature/nombre-de-tu-feature
   ```
2. Realiza tus cambios y haz commit:
   ```bash
   git commit -m "feat: descripción del cambio"
   ```
3. Abre un Merge Request hacia `develop`.

---

## 📄 Licencia

Proyecto privado — © cordyTech Lab. Todos los derechos reservados.
