import React, { useState } from 'react';
import '../assets/css/styleCalcula.css';
import { API_URLS } from '../config/api';

const Calculadora = () => {
  // Switch de Modo
  const [modoManual, setModoManual] = useState(false);

  // --- ESTADOS MODO BD ---
  const [codBuque, setCodBuque] = useState('');
  const [idPuerto, setIdPuerto] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');

  // --- ESTADOS MODO MANUAL ---
  const [manualData, setManualData] = useState({
    eslora: '',
    dias: '',
    tipoBuque: 'general', // Valor por defecto
    pasajeros: 0,
    servicios: 'basico'
  });

  // --- RESULTADOS ---
  const [resultado, setResultado] = useState({ 
    mostrar: false, 
    total: 0, 
    mensaje: '',
    nombrePuerto: '', // Nuevo campo para el nombre
    nombreBuque: ''
  });
  
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleManualChange = (e) => {
    setManualData({ ...manualData, [e.target.name]: e.target.value });
  };

  const calcular = async () => {
    setStatus({ loading: false, error: '' });
    setResultado({ mostrar: false, total: 0, mensaje: '', nombrePuerto: '', nombreBuque: '' }); // Limpiar resultado anterior
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert("Debes iniciar sesión para realizar cálculos.");
        return;
    }

    try {
        setStatus({ loading: true, error: '' });
        let url, body;

        if (modoManual) {
            // --- SIMULACIÓN ---
            url = `${API_URLS.BOLETAS}/simular`;
            body = {
                eslora: parseFloat(manualData.eslora),
                dias: parseInt(manualData.dias),
                tipoBuque: manualData.tipoBuque,
                servicios: manualData.servicios,
                pasajeros: parseInt(manualData.pasajeros || 0)
            };
        } else {
            // --- BASE DE DATOS ---
            if (!codBuque || !idPuerto || !idFuncionario) {
                setStatus({ loading: false, error: 'Por favor completa todos los IDs' });
                return;
            }
            url = `${API_URLS.BOLETAS}/calcular`;
            body = {
                codBuque: codBuque,
                idPuerto: parseInt(idPuerto),
                idFuncionario: parseInt(idFuncionario)
            };
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const data = await response.json();
            
            // Procesar respuesta según el modo
            if (modoManual) {
                // El endpoint /simular devuelve solo un número (Double)
                const simulacion = {
                    id: 'SIM-' + Date.now(),
                    esSimulacion: true,
                    monto: data,
                    fechaEmision: new Date().toISOString(),
                    buque: {
                        nombre: `Buque ${manualData.tipoBuque}`,
                        codBuque: `SIM-${manualData.tipoBuque.toUpperCase()}`
                    },
                    puerto: {
                        nombre: 'Puerto Simulado'
                    },
                    funcionario: {
                        nombre: 'Funcionario Simulado'
                    },
                    detalles: {
                        eslora: manualData.eslora,
                        dias: manualData.dias,
                        tipoBuque: manualData.tipoBuque,
                        servicios: manualData.servicios,
                        pasajeros: manualData.pasajeros
                    }
                };

                // Guardar en localStorage
                const simulaciones = JSON.parse(localStorage.getItem('simulaciones') || '[]');
                simulaciones.push(simulacion);
                localStorage.setItem('simulaciones', JSON.stringify(simulaciones));

                setResultado({
                    mostrar: true,
                    total: data,
                    mensaje: "Simulación guardada en localStorage",
                    nombrePuerto: "Puerto Simulado",
                    nombreBuque: `Buque ${manualData.tipoBuque}`
                });
            } else {
                // El endpoint /calcular devuelve el objeto Boleta completo
                setResultado({
                    mostrar: true,
                    total: data.monto,
                    mensaje: `Guardado: ID ${data.idBoleta}`,
                    // Extraemos el nombre del puerto del objeto anidado
                    nombrePuerto: data.puerto ? data.puerto.nombre : 'Puerto Desconocido',
                    nombreBuque: data.buque ? data.buque.nombre : codBuque
                });
            }
            setStatus({ loading: false, error: '' });
        } else {
            setStatus({ loading: false, error: 'Error en el cálculo. Verifica los datos.' });
        }
    } catch (error) {
        console.error(error);
        setStatus({ loading: false, error: 'No se pudo conectar con el servidor.' });
    }
  };

  const limpiar = () => {
      setCodBuque(''); setIdPuerto(''); setIdFuncionario('');
      setManualData({ eslora: '', dias: '', tipoBuque: 'general', pasajeros: 0, servicios: 'basico' });
      setResultado({ mostrar: false, total: 0, mensaje: '', nombrePuerto: '' });
      setStatus({ loading: false, error: '' });
  };

  return (
    <div className="container mt-4">
      <div className="calculator">
        <div className="calculator-header">
          <h2>Calculadora Portuaria Unificada</h2>
          <p>Gestión centralizada de tarifas y servicios</p>
          
          {/* INTERRUPTOR DE MODO */}
          <div className="form-check form-switch mt-3 d-flex justify-content-center gap-2">
            <input 
                className="form-check-input" 
                type="checkbox" 
                checked={modoManual} 
                onChange={() => { setModoManual(!modoManual); setResultado({ mostrar: false }); }} 
            />
            <label className="form-check-label fw-bold">
              {modoManual ? "📝 Modo Manual (Nuevo Buque)" : "🗄️ Modo Base de Datos (Registrado)"}
            </label>
          </div>
        </div>
        
        <div className="calculator-grid">
          
          {modoManual ? (
            /* --- CAMPOS MANUALES --- */
            <>
              <div className="form-group">
                <label>Tipo de Buque</label>
                <select name="tipoBuque" value={manualData.tipoBuque} onChange={handleManualChange} className="form-control">
                    <option value="general">Carga General</option>
                    <option value="pesquero">Pesquero</option>
                    <option value="militar">Militar</option>
                    <option value="investigacion">Investigación</option>
                    <option value="crucero">Crucero / Pasajeros</option>
                </select>
              </div>

              <div className="form-group">
                <label>Eslora (metros)</label>
                <input name="eslora" type="number" value={manualData.eslora} onChange={handleManualChange} placeholder="Ej: 150" />
              </div>

              <div className="form-group">
                <label>Días Estancia</label>
                <input name="dias" type="number" value={manualData.dias} onChange={handleManualChange} placeholder="Ej: 3" />
              </div>

              {/* Campo condicional: Solo si es crucero mostramos pasajeros */}
              {(manualData.tipoBuque === 'crucero' || manualData.tipoBuque === 'pasajero') && (
                  <div className="form-group">
                    <label>Cantidad Pasajeros</label>
                    <input name="pasajeros" type="number" value={manualData.pasajeros} onChange={handleManualChange} placeholder="Ej: 2000" />
                  </div>
              )}

              <div className="form-group">
                <label>Servicios Adicionales</label>
                <select name="servicios" value={manualData.servicios} onChange={handleManualChange} className="form-control">
                    <option value="basico">Básico</option>
                    <option value="medio">Medio (Remolque)</option>
                    <option value="completo">Completo (Suministros)</option>
                </select>
              </div>
            </>
          ) : (
            /* --- CAMPOS BASE DE DATOS --- */
            <>
              <div className="form-group">
                <label>Código del Buque</label>
                <input 
                    type="text" 
                    value={codBuque} 
                    onChange={(e) => setCodBuque(e.target.value)} 
                    placeholder="Ej: BUQUE-001" 
                />
                <small className="text-muted">El sistema detectará tipo y eslora automáticamente.</small>
              </div>
              <div className="form-group">
                <label>ID Puerto</label>
                <input type="number" value={idPuerto} onChange={(e) => setIdPuerto(e.target.value)} placeholder="Ej: 1" />
              </div>
              <div className="form-group">
                <label>ID Funcionario</label>
                <input type="number" value={idFuncionario} onChange={(e) => setIdFuncionario(e.target.value)} placeholder="Ej: 1" />
              </div>
            </>
          )}

        </div>
        
        {/* Mensajes de Error/Carga */}
        {status.error && <div className="alert alert-danger mt-3">{status.error}</div>}
        
        <div className="button-group mt-4">
          <button className="btn btn-primary btn-lg" onClick={calcular} disabled={status.loading}>
            {status.loading ? 'Calculando...' : 'Calcular Tarifa'}
          </button>
          <button className="btn btn-secondary mt-2" onClick={limpiar}>
            Nueva Consulta
          </button>
        </div>
        
        {/* --- SECCIÓN DE RESULTADOS --- */}
        {resultado.mostrar && (
          <div className="result mt-4 p-4 shadow rounded bg-light text-center" style={{display: 'block'}}>
            <h3 className="text-primary">Resumen de Operación</h3>
            
            <div className="display-4 my-3 font-weight-bold text-dark">
                $ {resultado.total.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
            </div>
            
            <div className="row text-start mt-4">
                <div className="col-6">
                    <p><strong>Estado:</strong> <span className={modoManual ? "text-warning" : "text-success"}>{resultado.mensaje}</span></p>
                    <p><strong>Buque:</strong> {resultado.nombreBuque}</p>
                </div>
                <div className="col-6">
                    {/* AQUÍ SE MUESTRA EL NOMBRE DEL PUERTO */}
                    <p><strong>Puerto:</strong> {resultado.nombrePuerto}</p>
                    <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculadora;