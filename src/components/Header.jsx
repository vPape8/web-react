// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const Header = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('current_user')
      if (raw) setUser(JSON.parse(raw))
    } catch {
      // ignore
    }
    const onUserChanged = (e) => {
      try {
        const detail = e?.detail
        if (detail === undefined) {
          // storage event will be handled separately
          return
        }
        setUser(detail)
      } catch {
        // ignore
      }
    }

    const onStorage = (e) => {
      if (e.key === 'current_user') {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null)
        } catch {
          setUser(null)
        }
      }
    }

    window.addEventListener('user-changed', onUserChanged)
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('user-changed', onUserChanged)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem('current_user')
    } catch {
      // ignore
    }
    setUser(null)
    try {
      window.dispatchEvent(new CustomEvent('user-changed', { detail: null }))
    } catch {
      // ignore
    }
    navigate('/login')
  }

  return (
    <Navbar expand="lg" className="site-navbar navbar-dark">
      <Container fluid className="px-3 px-lg-5">
        <Navbar.Brand as={Link} to="/home" className="site-brand d-flex align-items-center">
          <img 
            src="/logo.png" 
            alt="Logo" 
            height="40" 
            className="d-inline-block me-2 logo-img" 
          />
          LogistNav
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="site-nav-toggle" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto site-nav-group">
            <Nav.Link as={NavLink} to="/home" className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/calculadora" className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}>
              Calculadora
            </Nav.Link>
            <Nav.Link as={NavLink} to="/reportes" className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}>
              Reportes
            </Nav.Link>
          </Nav>
          
          <Nav id="dynamic-nav-items" className="ms-auto d-flex align-items-center gap-3">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="user-pill">{user.name}</span>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <Nav.Link as={Link} to="/login" className="site-nav-link">Iniciar sesión</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;