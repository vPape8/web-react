import React, { useState, useEffect } from 'react';
import ModalDetalles from '../components/ModalDetalles';
import '../assets/css/styleReporte.css';
import { API_URLS, API_REPORTES, API_OPERACIONES } from '../config/api';

const Reportes = () => {
  const [calculos, setCalculos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [estadisticas, setEstadisticas] = useState({});
  const [calculoSeleccionado, setCalculoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exportando, setExportando] = useState(false);
  const [estadoExportacion, setEstadoExportacion] = useState('');

  // --- LÓGICA DE CARGA HÍBRIDA (BD + LOCALSTORAGE) ---
  const cargarDatosCombinados = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    let datosReales = [];
    let datosSimulados = [];

    // 1. Obtener Datos Reales de AWS (Si hay login)
    if (token) {
        try {
            const response = await fetch(API_OPERACIONES.BASE, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                datosReales = await response.json();
            }
        } catch (error) {
            console.error("Error conectando con BD:", error);
        }
    }

    // 2. Obtener Simulaciones del Navegador
    try {
        datosSimulados = JSON.parse(localStorage.getItem('simulaciones') || '[]');
    } catch (e) {
        console.error("Error leyendo simulaciones locales", e);
    }

    // 3. Unificar y Normalizar
    // Combinamos ambos arrays
    const todosLosDatos = [...datosReales, ...datosSimulados];
    
    // Convertimos todo al mismo formato para que la tabla no falle
    const datosNormalizados = todosLosDatos.map(normalizarBoleta);

    // 4. Ordenar por fecha (más reciente primero)
    datosNormalizados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    setCalculos(datosNormalizados);
    calcularEstadisticas(datosNormalizados);
    setLoading(false);
  };

  // Cargar datos al montar
  useEffect(() => {
    cargarDatosCombinados();
  }, []);

  // Esta función es clave: Convierte el objeto Java o el objeto LocalStorage a un formato común
  const normalizarBoleta = (item) => {
    const esSimulacion = item.esSimulacion === true;
    
    // Determinar tipo visual
    let tipo = 'comercial';
    let tipoDisplay = 'Comercial';

    if (esSimulacion) {
        tipo = 'simulacion';
        tipoDisplay = '⚠️ Simulación';
    } else if (item.buque?.codBuque?.includes('PAS')) {
        tipo = 'pasajero';
        tipoDisplay = 'Pasajero';
    } else if (item.buque?.codBuque?.includes('ESP')) {
        tipo = 'especial';
        tipoDisplay = 'Especial';
    }

    return {
        id: item.idBoleta || item.id, // ID de BD o ID temporal
        fecha: item.fechaEmision || new Date().toISOString(),
        total: item.monto,
        tipo: tipo,
        tipoDisplay: tipoDisplay,
        esSimulacion: esSimulacion,
        // Detalles unificados para la tabla y el modal
        details: {
            buque: item.buque ? item.buque.nombre : 'Desconocido',
            codigo: item.buque ? item.buque.codBuque : 'N/A',
            puerto: item.puerto ? item.puerto.nombre : 'N/A',
            funcionario: item.funcionario ? item.funcionario.nombre : 'N/A'
        }
    };
  };

  const calcularEstadisticas = (lista) => {
    if (lista.length === 0) {
      setEstadisticas({});
      return;
    }

    const totales = lista.reduce((acc, curr) => acc + curr.total, 0);
    const promedio = totales / lista.length;
    
    // Contadores por tipo
    const porTipo = lista.reduce((acc, curr) => {
        const key = curr.esSimulacion ? 'simulacion' : 'real';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    setEstadisticas({
      totalCalculos: lista.length,
      totalIngresos: totales,
      promedio: promedio,
      porTipo: porTipo // { real: 5, simulacion: 2 }
    });
  };

  // --- ACCIONES ---

  const eliminarCalculo = async (id, esSimulacion) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;

    if (esSimulacion) {
        // Eliminar de LocalStorage
        const simulaciones = JSON.parse(localStorage.getItem('simulaciones') || '[]');
        const nuevasSimulaciones = simulaciones.filter(s => s.id !== id);
        localStorage.setItem('simulaciones', JSON.stringify(nuevasSimulaciones));
        cargarDatosCombinados(); // Recargar
    } else {
        // Eliminar de Base de Datos (AWS)
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URLS.BOLETAS}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                cargarDatosCombinados(); // Recargar
            } else {
                alert("No se pudo eliminar de la base de datos (Revisa permisos).");
            }
        } catch {
            alert("Error de conexión al intentar eliminar.");
        }
    }
  };

  const limpiarSimulaciones = () => {
      if(window.confirm("¿Borrar solo las simulaciones locales?")) {
          localStorage.removeItem('simulaciones');
          cargarDatosCombinados();
      }
  };

  // --- FILTROS Y EXPORTACIÓN ---

  const calculosFiltrados = filtroTipo === 'todos' 
    ? calculos 
    : calculos.filter(c => c.tipo === filtroTipo);

  const exportarExcel = async () => {
    if (calculosFiltrados.length === 0) return alert('Sin datos');
    const token = localStorage.getItem('token');

    setMostrarDropdown(false);
    setExportando(true);
    setEstadoExportacion('Preparando exportación...');

    try {
      const response = await fetch(API_REPORTES.EXPORT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: 'application/json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        body: JSON.stringify({
          reporte: 'reportes-portuarios',
          filtro: filtroTipo,
          totalRegistros: calculosFiltrados.length,
          datos: calculosFiltrados,
        }),
      });

      const contentType = response.headers.get('content-type') || '';

      if (response.ok) {
        if (contentType.includes('application/json')) {
          const data = await response.json();

          if (data.downloadUrl || data.url) {
            setEstadoExportacion('Descargando archivo...');
            await downloadFromUrl(data.downloadUrl || data.url, token, data.fileName || getFileName());
          } else if (data.jobId || data.job || data.id) {
            setEstadoExportacion(data.message || 'Exportación en cola...');
            await waitForReport(data.jobId || data.job || data.id, token);
          } else {
            setEstadoExportacion(data.message || 'Exportación solicitada');
          }
        } else {
          const blob = await response.blob();
          downloadBlob(blob, getFileName());
          setEstadoExportacion('Exportación completada');
        }

        return;
      }

      throw new Error(`Error ${response.status}`);
    } catch (error) {
      console.error(error);

      const { exportToExcel } = await import('../utils/exportToExcel');
      await exportToExcel(calculosFiltrados, 'reporte_portuario');
      setEstadoExportacion('Exportación local usada como respaldo');
      alert('El backend no respondió para la exportación; se usó la exportación local como respaldo.');
    } finally {
      setExportando(false);
    }
  };

  const toggleDropdown = () => setMostrarDropdown(!mostrarDropdown);
  const closeDropdown = () => setMostrarDropdown(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getFileName = () => `reporte_portuario_${new Date().toISOString().split('T')[0]}.xlsx`;

  const downloadBlob = (blob, fileName) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  };

  const downloadFromUrl = async (url, token, fileName) => {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error('No se pudo descargar el archivo generado');
    }

    const blob = await response.blob();
    downloadBlob(blob, fileName);
  };

  const waitForReport = async (jobId, token) => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const response = await fetch(API_REPORTES.STATUS(jobId), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('No se pudo consultar el estado de la exportación');
      }

      const data = await response.json();
      const status = String(data.status || data.estado || '').toLowerCase();
      const ready = data.downloadUrl || data.url || status === 'completed' || status === 'ready' || data.ready === true;

      if (status === 'failed' || status === 'error') {
        throw new Error(data.message || data.error || 'La exportación falló');
      }

      if (ready) {
        const downloadUrl = data.downloadUrl || data.url || API_REPORTES.DOWNLOAD(jobId);
        await downloadFromUrl(downloadUrl, token, data.fileName || getFileName());
        return;
      }

      setEstadoExportacion(data.message || 'Procesando exportación...');
      await sleep(2000);
    }

    throw new Error('La exportación tardó demasiado');
  };

  // --- RENDER ---

  if (loading) return <div className="page-shell reportes-page"><div className="alert alert-info">Cargando datos del sistema...</div></div>;

  return (
    <div className="page-shell reportes-page">
      <div className="reporte-header">
        <h1>Reportes de Operaciones</h1>
        <p>Vista unificada: Base de Datos (AWS) + Simulaciones</p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="estadisticas">
        <h3>Resumen Financiero</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Transacciones Totales</h4>
            <p className="stat-number">{estadisticas.totalCalculos || 0}</p>
          </div>
          <div className="stat-card">
            <h4>Recaudación Total</h4>
            <p className="stat-number text-success">${(estadisticas.totalIngresos || 0).toLocaleString('es-CL')}</p>
          </div>
          <div className="stat-card">
            <h4>Reales vs Simulados</h4>
            <small>Reales: {estadisticas.porTipo?.real || 0} | Simulados: {estadisticas.porTipo?.simulacion || 0}</small>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="controles-reporte">
        <div className="filtros">
          <label>Filtrar:</label>
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="todos">Ver Todo</option>
            <option value="comercial">Comerciales (BD)</option>
            <option value="pasajero">Pasajeros (BD)</option>
            <option value="simulacion">Solo Simulaciones</option>
          </select>
        </div>

        <div className="acciones">
          <div className="dropdown">
            <button className="btn btn-exportar dropdown-toggle" onClick={toggleDropdown} disabled={exportando}>
              {exportando ? 'Exportando...' : 'Exportar'}
            </button>
            {mostrarDropdown && (
              <ul className="dropdown-menu show">
                <li><button className="dropdown-item" onClick={() => { exportarExcel(); closeDropdown(); }}>📊 Descargar Excel</button></li>
              </ul>
            )}
          </div>
          <button className="btn btn-limpiar" onClick={limpiarSimulaciones} disabled={exportando}>🧹 Limpiar Simulaciones</button>
        </div>
      </div>

      {estadoExportacion && <div className="alert alert-info">{estadoExportacion}</div>}

      {/* Tabla de Datos */}
      <div className="tabla-reportes">
        {calculosFiltrados.length > 0 ? (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Buque / ID</th>
                <th>Monto</th>
                <th>Origen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {calculosFiltrados.map((item) => (
                <tr key={item.id} className={item.esSimulacion ? "table-warning" : ""}>
                  <td>{new Date(item.fecha).toLocaleDateString()}</td>
                  <td><span className={`badge ${item.esSimulacion ? 'bg-warning text-dark' : 'bg-primary'}`}>{item.tipoDisplay}</span></td>
                  <td>
                    <strong>{item.details.buque}</strong><br/>
                    <small className="text-muted">{item.details.codigo}</small>
                  </td>
                  <td className="fw-bold">${item.total.toLocaleString('es-CL')}</td>
                  <td>{item.esSimulacion ? "💻 Local" : "☁️ AWS BD"}</td>
                  <td>
                    <button className="btn btn-sm btn-info me-2" onClick={() => { setCalculoSeleccionado(item); setMostrarModal(true); }}>Ver</button>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminarCalculo(item.id, item.esSimulacion)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <h3>Sin registros</h3>
            <p>No hay datos que coincidan con el filtro.</p>
          </div>
        )}
      </div>

      {/* Modal y Overlay */}
      {mostrarModal && <ModalDetalles calculo={calculoSeleccionado} onClose={() => setMostrarModal(false)} />}
      {mostrarDropdown && <div className="dropdown-overlay" onClick={closeDropdown} />}
    </div>
  );
};

export default Reportes;