// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

const Home = lazy(() => import('./pages/Home'));
const InicioSeccion = lazy(() => import('./pages/InicioSeccion'));
const Calculadora = lazy(() => import('./pages/Calculadora'));
const Comerciales = lazy(() => import('./pages/Comerciales'));
const Reportes = lazy(() => import('./pages/Reportes'));
const Contacto = lazy(() => import('./pages/Contacto'));
const Panel = lazy(() => import('./pages/Panel'));

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<div className="page-shell">Cargando...</div>}>
          <Routes>
            <Route path="/" element={<InicioSeccion />} />
            <Route path="/login" element={<InicioSeccion />} />
            <Route path="/home" element={<Layout><PrivateRoute><Home /></PrivateRoute></Layout>} />
            <Route path="/calculadora" element={<Layout><PrivateRoute><Calculadora /></PrivateRoute></Layout>} />
            <Route path="/comerciales" element={<Layout><PrivateRoute><Comerciales /></PrivateRoute></Layout>} />
            <Route path="/reportes" element={<Layout><PrivateRoute><Reportes /></PrivateRoute></Layout>} />
            <Route path="/contacto" element={<Layout><PrivateRoute><Contacto /></PrivateRoute></Layout>} />
            <Route path="/panel" element={<Layout><PrivateRoute><Panel /></PrivateRoute></Layout>} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;