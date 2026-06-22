import React, { useEffect, useState } from 'react'
import '../assets/css/panel.css'
import { useNavigate } from 'react-router-dom'

const Panel = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: '', rol: '' })

  useEffect(() => {
    // Cargamos el usuario que guardamos en InicioSeccion.jsx
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login'); // Si no hay usuario, fuera
    }
  }, [navigate])

  const handleLogout = () => {
    // Limpiamos TODO para cerrar sesión real
    localStorage.removeItem('token');
    localStorage.removeItem('current_user');
    
    // Disparamos evento para que la barra de navegación se entere
    window.dispatchEvent(new CustomEvent('user-changed', { detail: null }));
    
    navigate('/login');
  }

  return (
    <div className="page-shell">
      <section className="surface-card p-4 p-md-5 panel-profile">
        <p className="eyebrow">Sesión activa</p>
        <h3>Panel de usuario</h3>
        <div className="panel-avatar">👤</div>
        <h4 className="mt-3">{user.name || 'Usuario'}</h4>
        <span className="badge bg-info text-dark">{user.rol || 'USER'}</span>

        <div className="surface-card p-3 mt-4 text-start">
          <h5>Información de cuenta</h5>
          <p><strong>Estado:</strong> <span className="text-success">● Conectado a Base de Datos</span></p>
          <p><strong>Permisos:</strong> Acceso a cálculo de tarifas y generación de reportes.</p>
          <small className="text-muted">* La edición de perfil está deshabilitada en esta versión.</small>
        </div>

        <button className="btn btn-primary w-100 mt-4" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </section>
    </div>
  )
}

export default Panel