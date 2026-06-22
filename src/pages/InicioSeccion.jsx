import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/css/auth.css'
import { API_AUTH } from '../config/api'
import { postPublic } from '../utils/http'
import { saveSession } from '../utils/auth'

const InicioSeccion = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') 
  // Se agregan nombre y apellido al estado inicial
  const [form, setForm] = useState({ 
    nombre: '', 
    apellido: '', 
    email: '', 
    password: '', 
    rol: 'USER' 
  })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('Conectando...')
    
    if (!form.email || !form.password) {
        setMessage('Por favor ingresa correo y contraseña');
        return;
    }

    try {
      const data = await postPublic(API_AUTH.LOGIN, {
        email: form.email,
        password: form.password
      });

      // 1. Guardar para las utilidades de auth (token, rol, etc.)
      saveSession(data);

      // 2. CORRECCIÓN: Guardar el objeto 'current_user' que esperan Header y Panel
      const userObj = { name: data.nombre, email: form.email, rol: data.rol };
      localStorage.setItem('current_user', JSON.stringify(userObj));

      setMessage('Inicio de sesión correcto');
      
      // 3. Notificar al sistema
      window.dispatchEvent(new CustomEvent('user-changed', {
        detail: userObj
      }));

      // Redirigir
      data.rol === 'ADMIN' ? navigate('/panel') : navigate('/home');

    } catch (err) {
      setMessage(err.message || 'Credenciales incorrectas');
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    // Validación para asegurar que todos los campos requeridos por la BD estén presentes
    if (!form.email || !form.password || !form.nombre || !form.apellido) {
      setMessage('Completa todos los campos')
      return
    }

    try {
      setMessage('Registrando...')
      // Se envía el objeto form completo incluyendo nombre y apellido
      await postPublic(API_AUTH.REGISTER, form);
      setMessage('Registro exitoso. Ahora inicia sesión.');
      setMode('login');
      setForm({ nombre: '', apellido: '', email: '', password: '', rol: 'USER' });
    } catch (err) {
      setMessage(err.message || 'Error al registrar. El correo podría ya existir.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero">
          <div className="auth-brand">
            <img src="/logo.png" alt="LogistNav" className="auth-logo" />
            <span>LogistNav</span>
          </div>
          <h1>{mode === 'login' ? 'Acceso portuario sin ruido' : 'Crea tu acceso y sigue operando'}</h1>
          <p>Una sola entrada para cálculo, reportes y panel.</p>
{/*           <ul>
            <li>Login limpio, sin header ni footer.</li>
            <li>Ruta directa al home o panel según rol.</li>
            <li>Registro y acceso comparten el mismo lenguaje visual.</li>
          </ul> */}
        </section>

        <section className="auth-card card shadow-lg">
          <div className="auth-card-header">
            <p className="eyebrow">{mode === 'login' ? 'Bienvenido' : 'Registro nuevo'}</p>
            <h2>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
            <p>Usa las credenciales para entrar al sistema portuario.</p>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="auth-form">
            {mode === 'register' && (
              <div className="auth-grid-two">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    name="nombre"
                    type="text"
                    value={form.nombre}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    name="apellido"
                    type="text"
                    value={form.apellido}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Correo Electrónico</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 auth-submit">
              {mode === 'login' ? 'Entrar' : 'Registrar'}
            </button>

            <button
              type="button"
              className="btn btn-link auth-switch"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setMessage('')
              }}
            >
              {mode === 'login' ? '¿Crear cuenta?' : '¿Ya tienes cuenta?'}
            </button>
          </form>

          {message && <div className="alert alert-info mt-3 mb-0">{message}</div>}
        </section>
      </div>
    </div>
  )
}

export default InicioSeccion