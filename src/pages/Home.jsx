// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/style.css';

const Home = () => {
  return (
    <div className="page-shell home-page">
      <section className="surface-card home-hero p-4 p-md-5">
        <div className="home-hero__copy">
          <p className="eyebrow">Sistema portuario</p>
          <h1>Gestiona cálculos, reportes y sesión desde un solo lugar</h1>
          <p>
            Interfaz unificada para trabajar rápido: entra al cálculo, revisa reportes y vuelve
            al panel sin perder contexto.
          </p>

          <div className="home-hero__actions">
            <Link to="/calculadora" className="btn btn-primary">Abrir calculadora</Link>
            <Link to="/reportes" className="btn btn-outline-secondary home-secondary">
              Ver reportes
            </Link>
          </div>
        </div>

        <aside className="home-hero__panel">
          <div className="home-metric">
            <span className="home-metric__label">Módulos principales</span>
            <strong>3</strong>
            <small>Calculadora, reportes y panel</small>
          </div>
          <div className="home-metric">
            <span className="home-metric__label">Noticias</span>
            <strong>Alertas</strong>
            <small>Actualizaciones importantes</small>
          </div>
          <div className="home-metric">
            <span className="home-metric__label">Info empresa</span>
            <strong>lorem ipsum</strong>
            <small>lorem ipsum dolor sit amet</small>
          </div>
        </aside>
      </section>

      <div className="home-grid">
        <article className="surface-card home-action-card home-action-card--featured p-4">
          <div className="home-card-icon"><i className="bi bi-calculator"></i></div>
          <h5>Calcular costos</h5>
          <p>Calcular la estadía del buque con el flujo oficial y datos de la base.</p>
          <Link to="/calculadora" className="btn btn-primary w-100">Ir a la calculadora</Link>
        </article>

        <article className="surface-card home-action-card p-4">
          <div className="home-card-icon"><i className="bi bi-graph-up-arrow"></i></div>
          <h5>Generar reportes</h5>
          <p>Revisar cálculos, exportar datos y limpiar simulaciones locales.</p>
          <Link to="/reportes" className="btn btn-primary w-100">Ir a reportes</Link>
        </article>

        <article className="surface-card home-action-card p-4">
          <div className="home-card-icon"><i className="bi bi-person-circle"></i></div>
          <h5>Panel</h5>
          <p>Consultar la sesión activa y cerrar la cuenta desde un mismo lugar.</p>
          <Link to="/panel" className="btn btn-primary w-100">Ir al panel</Link>
        </article>
      </div>
    </div>
  );
};

export default Home;