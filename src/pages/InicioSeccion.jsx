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
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">{mode === 'login' ? 'Iniciar Sesión' : 'Registro'}</h2>
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
            
            {/* Campos adicionales para el modo Registro */}
            {mode === 'register' && (
              <>
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
              </>
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

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                {mode === 'login' ? 'Entrar' : 'Registrar'}
              </button>
            </div>
            
            <div className="mt-3 text-center">
              <button 
                type="button" 
                className="btn btn-link" 
                onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setMessage('');
                }}
              >
                {mode === 'login' ? '¿Crear cuenta?' : '¿Ya tienes cuenta?'}
              </button>
            </div>
        </form>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  )
}

export default InicioSeccion