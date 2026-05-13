import React, { useState } from 'react';
import '../assets/css/styleCalcula.css';
import { API_URLS } from '../config/api';

const Calculadora = () => {
  // Switch de Modo
  const [modoManual, setModoManual] = useState(false);

  // --- ESTADOS MODO BD (Registrado) ---
  const [codBuque, setCodBuque] = useState('');
  const [idPuerto, setIdPuerto] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  const [tipoServicio, setTipoServicio] = useState('BASICO'); // Nuevo: Requerido por Backend
  const [diasEstancia, setDiasEstancia] = useState('');      // Nuevo: Requerido por Backend

  // --- ESTADOS MODO MANUAL (Simulación) ---
  const [manualData, setManualData] = useState({
    eslora: '',
    dias: '',
    tipoBuque: 'general',
    pasajeros: 0,
    servicios: 'basico'
  });

  // --- RESULTADOS ---
  const [resultado, setResultado] = useState({ 
    mostrar: false, 
    total: 0, 
    mensaje: '',
    nombrePuerto: '', 
    nombreBuque: ''
  });
  
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleManualChange = (e) => {
    setManualData({ ...manualData, [e.target.name]: e.target.value });
  };

  const calcular = async () => {
    setStatus({ loading: false, error: '' });
    setResultado({ mostrar: false, total: 0, mensaje: '', nombrePuerto: '', nombreBuque: '' });
    
    const token = localStorage.getItem('token');
    if (!token) {
        setStatus({ loading: false, error: 'Debes iniciar sesión para realizar cálculos.' });
        return;
    }

    try {
        setStatus({ loading: true, error: '' });
        let url, body;

        if (modoManual) {
            // --- MODO SIMULACIÓN ---
            url = `${API_URLS.BOLETAS}/simular`;
            body = {
                eslora: parseFloat(manualData.eslora),
                dias: parseInt(manualData.dias),
                tipoBuque: manualData.tipoBuque,
                servicios: manualData.servicios,
                pasajeros: parseInt(manualData.pasajeros || 0)
            };
        } else {
            // --- MODO BASE DE DATOS (Real) ---
            // Validación local antes de enviar
            if (!codBuque || !idPuerto || !idFuncionario || !diasEstancia) {
                setStatus({ loading: false, error: 'Por favor completa todos los campos obligatorios.' });
                return;
            }

            url = `${API_URLS.BOLETAS}/calcular`;
            body = {
                codBuque: codBuque,
                idPuerto: parseInt(idPuerto),
                idFuncionario: parseInt(idFuncionario),
                tipoServicio: tipoServicio,             // Enviamos el valor del Select
                diasEstancia: parseInt(diasEstancia)    // Enviamos el valor del Input
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
            
            if (modoManual) {
                // Lógica de guardado local para simulaciones
                const simulacion = {
                    id: 'SIM-' + Date.now(),
                    monto: data,
                    nombrePuerto: 'Puerto Simulado',
                    nombreBuque: `Buque ${manualData.tipoBuque}`
                };
                const simulaciones = JSON.parse(localStorage.getItem('simulaciones') || '[]');
                simulaciones.push(simulacion);
                localStorage.setItem('simulaciones', JSON.stringify(simulaciones));

                setResultado({
                    mostrar: true,
                    total: data,
                    mensaje: "Simulación guardada localmente",
                    nombrePuerto: "Puerto Simulado",
                    nombreBuque: `Buque ${manualData.tipoBuque}`
                });
            } else {
                // Respuesta real del Backend (BoletaResponse)
                setResultado({
                    mostrar: true,
                    total: data.monto,
                    mensaje: `Boleta generada: ID ${data.idBoleta}`,
                    nombrePuerto: data.puerto ? data.puerto.nombre : 'Puerto Registrado',
                    nombreBuque: data.buque ? data.buque.nombre : codBuque
                });
            }
            setStatus({ loading: false, error: '' });
        } else {
            // Si el backend envía un 400, aquí capturamos el error detallado
            const errorData = await response.json().catch(() => ({}));
            setStatus({ 
                loading: false, 
                error: errorData.error || 'Error en el cálculo. Revisa que los IDs existan.' 
            });
        }
    } catch (error) {
        console.error(error);
        setStatus({ loading: false, error: 'No se pudo conectar con el servidor.' });
    }
  };

  const limpiar = () => {
      setCodBuque(''); setIdPuerto(''); setIdFuncionario('');
      setDiasEstancia(''); setTipoServicio('BASICO');
      setManualData({ eslora: '', dias: '', tipoBuque: 'general', pasajeros: 0, servicios: 'basico' });
      setResultado({ mostrar: false, total: 0, mensaje: '', nombrePuerto: '' });
      setStatus({ loading: false, error: '' });
  };

  return (
    <div className="container mt-4">
      <div className="calculator">
        <div className="calculator-header text-center">
          <h2>Calculadora Portuaria Unificada</h2>
          <p>Gestión de tarifas y servicios en tiempo real</p>
          
          <div className="form-check form-switch mt-3 d-flex justify-content-center gap-2">
            <input 
                className="form-check-input" 
                type="checkbox" 
                checked={modoManual} 
                onChange={() => { setModoManual(!modoManual); setResultado({ mostrar: false }); }} 
            />
            <label className="form-check-label fw-bold">
              {modoManual ? "📝 Modo Manual (Simulación)" : "🗄️ Modo Base de Datos (Oficial)"}
            </label>
          </div>
        </div>
        
        <div className="calculator-grid mt-4">
          
          {modoManual ? (
            /* --- CAMPOS MODO MANUAL --- */
            <>
              <div className="form-group">
                <label>Tipo de Buque</label>
                <select name="tipoBuque" value={manualData.tipoBuque} onChange={handleManualChange} className="form-control">
                    <option value="general">Carga General</option>
                    <option value="pesquero">Pesquero</option>
                    <option value="militar">Militar</option>
                    <option value="crucero">Crucero / Pasajeros</option>
                </select>
              </div>
              <div className="form-group">
                <label>Eslora (metros)</label>
                <input name="eslora" type="number" value={manualData.eslora} onChange={handleManualChange} placeholder="150" />
              </div>
              <div className="form-group">
                <label>Días Estancia</label>
                <input name="dias" type="number" value={manualData.dias} onChange={handleManualChange} placeholder="3" />
              </div>
            </>
          ) : (
            /* --- CAMPOS MODO BASE DE DATOS --- */
            <>
              <div className="form-group">
                <label>Código del Buque</label>
                <input type="text" value={codBuque} onChange={(e) => setCodBuque(e.target.value)} placeholder="BUQUE-001" />
              </div>
              
              <div className="form-group">
                  <label>Tipo de Servicio</label>
                  <select 
                      value={tipoServicio} 
                      onChange={(e) => setTipoServicio(e.target.value)} 
                      className="form-control"
                  >
                      {/* El texto que ve el usuario puede ser cualquiera, 
                          pero el VALUE debe ser el que espera Java */}
                      <option value="BASICO">Servicio Básico (Amarre)</option>
                      <option value="MEDIO">Servicio Medio (Carga/Descarga)</option>
                      <option value="COMPLETO">Servicio Completo (Suministros)</option>
                  </select>
              </div>

              <div className="form-group">
                <label>Días de Estancia</label>
                <input type="number" value={diasEstancia} onChange={(e) => setDiasEstancia(e.target.value)} placeholder="Ej: 2" />
              </div>

              <div className="form-group">
                <label>ID Puerto</label>
                <input type="number" value={idPuerto} onChange={(e) => setIdPuerto(e.target.value)} placeholder="1" />
              </div>
              
              <div className="form-group">
                <label>ID Funcionario</label>
                <input type="number" value={idFuncionario} onChange={(e) => setIdFuncionario(e.target.value)} placeholder="1" />
              </div>
            </>
          )}

        </div>
        
        {status.error && <div className="alert alert-danger mt-3">{status.error}</div>}
        
        <div className="button-group mt-4">
          <button className="btn btn-primary btn-lg w-100" onClick={calcular} disabled={status.loading}>
            {status.loading ? 'Procesando...' : 'Calcular Tarifa'}
          </button>
          <button className="btn btn-outline-secondary w-100 mt-2" onClick={limpiar}>
            Limpiar Datos
          </button>
        </div>
        
        {resultado.mostrar && (
          <div className="result mt-4 p-4 shadow-sm border rounded bg-white">
            <h4 className="text-center text-secondary">Monto Total</h4>
            <div className="display-4 text-center my-2 text-dark fw-bold">
                $ {resultado.total.toLocaleString('es-CL')}
            </div>
            <hr />
            <div className="row small">
                <div className="col-6">
                    <p className="mb-1"><strong>Estado:</strong> {resultado.mensaje}</p>
                    <p className="mb-1"><strong>Buque:</strong> {resultado.nombreBuque}</p>
                </div>
                <div className="col-6 text-end">
                    <p className="mb-1"><strong>Puerto:</strong> {resultado.nombrePuerto}</p>
                    <p className="mb-1"><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculadora;