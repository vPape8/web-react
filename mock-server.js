// Servidor mock temporal para que tu app funcione sin backend
// Ejecuta: node mock-server.js

import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

// Almacenamiento en memoria para las boletas del modo base de datos
let boletasBD = [];

// Mock de autenticación
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simula login exitoso
  if (email && password) {
    res.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: { email, rol: 'USER' }
    });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

app.post('/auth/register', (req, res) => {
  const { email, password } = req.body;
  
  if (email && password) {
    res.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: { email, rol: 'USER' }
    });
  } else {
    res.status(400).json({ error: 'Datos incompletos' });
  }
});

// Mock de API de boletas
app.post('/api/boleta/PostBoleta', (req, res) => {
  res.json({
    idBoleta: 'BOL-' + Date.now(),
    monto: Math.floor(Math.random() * 10000) + 1000,
    fechaEmision: new Date().toLocaleDateString()
  });
});

app.post('/api/boletas/PostBoleta', (req, res) => {
  res.json({
    idBoleta: 'BOL-PAS-' + Date.now(),
    monto: Math.floor(Math.random() * 5000) + 500,
    fechaEmision: new Date().toLocaleDateString()
  });
});

app.post('/api/boletas/calcular', (req, res) => {
  const { codBuque, idPuerto, idFuncionario } = req.body;
  const nuevaBoleta = {
    idBoleta: 'BOL-CALC-' + Date.now(),
    monto: Math.floor(Math.random() * 8000) + 2000,
    fechaEmision: new Date().toISOString(),
    puerto: { 
      id: idPuerto,
      nombre: 'Puerto Mock ' + idPuerto 
    },
    buque: { 
      codBuque: codBuque,
      nombre: 'Buque ' + codBuque 
    },
    funcionario: {
      id: idFuncionario,
      nombre: 'Funcionario ' + idFuncionario
    }
  };
  
  // Guardar en memoria
  boletasBD.push(nuevaBoleta);
  
  res.json(nuevaBoleta);
});

app.post('/api/boletas/simular', (req, res) => {
  const monto = Math.floor(Math.random() * 10000) + 1000;
  res.json(monto);
});

// Mock para otros endpoints específicos
app.get('/api/boletas', (req, res) => {
  res.json(boletasBD);
});

app.get('/api/boletas/:id', (req, res) => {
  res.json({ message: 'Mock response' });
});

app.delete('/api/boletas/:id', (req, res) => {
  res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor mock corriendo en http://localhost:${PORT}`);
  console.log('📡 Endpoints disponibles:');
  console.log('  POST /auth/login');
  console.log('  POST /auth/register');
  console.log('  POST /api/boleta/PostBoleta');
  console.log('  POST /api/boletas/PostBoleta');
  console.log('  POST /api/boletas/calcular');
  console.log('  POST /api/boletas/simular');
  console.log('  GET /api/boletas');
  console.log('  DELETE /api/boletas/:id');
});
