import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/css/auth.css'
import { API_AUTH } from '../config/api'
import { postPublic } from '../utils/http'
import { saveSession } from '../utils/auth'



const InicioSeccion = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') 
  // CAMBIO 1: Usamos 'email' en lugar de 'username'
  const [form, setForm] = useState({ email: '', password: '', rol: 'USER' })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('Conectando...')
    
    // CAMBIO 2: Validación de email
    if (!form.email || !form.password) {
        setMessage('Por favor ingresa correo y contraseña');
        return;
    }

    try {
  const data = await postPublic(API_AUTH.LOGIN, {
    email: form.email,
    password: form.password
  });

  // Guardar sesión con los datos reales del backend
  saveSession(data);

  setMessage('Inicio de sesión correcto');
  window.dispatchEvent(new CustomEvent('user-changed', {
    detail: { name: data.nombre, email: form.email, rol: data.rol }
  }));

  // Redirigir según rol real que devuelve el backend
  data.rol === 'ADMIN' ? navigate('/panel') : navigate('/home');

} catch (err) {
  setMessage(err.message || 'Credenciales incorrectas');
}
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!form.email || !form.password) {
      setMessage('Completa todos los campos')
      return
    }

    try {
  setMessage('Registrando...')
  await postPublic(API_AUTH.REGISTER, form);
  setMessage('Registro exitoso. Ahora inicia sesión.');
  setMode('login');
  setForm(prev => ({ ...prev, password: '' }));
} catch (err) {
  setMessage(err.message || 'Error al registrar. El correo podría ya existir.');
}
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">{mode === 'login' ? 'Iniciar Sesión' : 'Registro'}</h2>
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
            
            {/* CAMBIO 5: Input de tipo Email */}
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