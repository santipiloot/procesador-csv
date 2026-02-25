import React, { useState, useEffect } from 'react';
import { RefreshCw, Upload, Database, FileText, CheckCircle2, AlertCircle, Copy, Download } from 'lucide-react';
import TarjetaKPI from './components/TarjetaKPI';
import TablaEmpleado from './components/TablaEmpleado';
import PanelResumen from './components/PanelResumen';

// Componente Principal 

const App = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resumen, setResumen] = useState(null);
  const [errorConexion, setErrorConexion] = useState(false);

  // VARIABLES DE ENTORNO: URLs dinamicas
  const API_URL = import.meta.env.VITE_API_URL;
  const IMPORT_URL = import.meta.env.VITE_IMPORT_URL;

  // Obtiene la lista de empleados desde el backend
  // esRecargaManual: Si es true, muestra una alerta al finalizar
  const fetchEmpleados = async (esRecargaManual = false) => {
    setErrorConexion(false) // Reseteamos el estado de error antes de intentar
    
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setEmpleados(result.data.slice(0, 100));  // Mostramos solo 100 para no exigir cargar tantos empleados
        if (esRecargaManual) {
          alert("Datos actualizados con exito");
        }
      }
    } catch (error) {
      console.error("Error al obtener empleados:", error);

      setErrorConexion(true); // Activa el banner de error visual
    }
  };

  useEffect(() => { fetchEmpleados(); }, []); // Carga los empleados al entrar a la pagina

  // Gestiona la carga y envío del archivo CSV al backend
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true); // Bloquea la UI para evitar múltiples envíos
    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const response = await fetch(IMPORT_URL, { method: 'POST', body: formData });
      const result = await response.json();
      if (response.ok && result.success) {
        setResumen(result.data); // Guardamos las estadísticas del procesamiento
        fetchEmpleados(); // Refrescamos la tabla para mostrar los nuevos registros
      } else {
        // Si el servidor tira 400, 429 o 500, mostramos el mensaje que viene del backend
        alert(`Error: ${result.error || "No se pudo procesar el archivo"}`);
      }
    } catch (error) {
      alert("Error en la conexión con el servidor");
    } finally {
      setLoading(false); // Desbloquea la UI
      e.target.value = null; // Limpia el input para permitir subir el mismo archivo otra vez
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">

      {/* HEADER: Navegacion y acciones principales */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">

            {/* LOGO Y TITULO */}
            <div className="bg-sky-600 p-2 rounded-lg"><Database className="text-white" size={24} /></div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none">Procesador de CSV</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium tracking-wider uppercase">API de importación de empleados</p>
            </div>
          </div>

          {/* BOTONES DE ACCION */}
          <div className="flex items-center gap-4">
            {/* Boton de recarga */}
            <button onClick={() => fetchEmpleados(true)} className="cursor-pointer p-2 text-slate-400 hover:text-sky-600 transition-colors active:scale-95" title="Recargar tabla de empleados">
              <RefreshCw size={20} />
            </button>

            {/* Boton de descarga */}
            <a
              href="/archivo-prueba.csv" download="archivo-prueba.csv" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 border border-slate-200" title="Descargar archivo de ejemplo"
            >
              <Download size={18} />
              <span className="hidden md:inline">Descargar Ejemplo</span>
            </a>
            <label className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md flex items-center gap-2 active:scale-95" title="Subir archivo">
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Upload size={18} />}
              {loading ? 'Procesando...' : 'Cargar Archivo CSV'}
              <input type="file" className="hidden" accept=".csv" onChange={handleImport} disabled={loading} />
            </label>
          </div>
        </div>
      </header>



      <main className="max-w-[1600px] mx-auto px-6 py-8">

        {/* Banner de error de conexion */}
        {errorConexion && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">No se pudo conectar con el servidor. Verifica tu API.</p>
          </div>
        )}
        {/* INDICADORES KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <TarjetaKPI titulo="Filas Procesadas" valor={resumen?.procesados || 0} icono={<FileText />} color="blue" />
          <TarjetaKPI titulo="Nuevos Ingresos" valor={resumen?.insertados || 0} icono={<CheckCircle2 />} color="green" />
          <TarjetaKPI titulo="Registros con Error" valor={resumen?.erroneos.total || 0} icono={<AlertCircle />} color="red" />
          <TarjetaKPI titulo="Duplicados en CSV" valor={resumen?.duplicadosCsv.total || 0} icono={<Copy />} color="orange" />
          <TarjetaKPI titulo="Ya en Base de Datos" valor={resumen?.duplicadosDb.total || 0} icono={<Database />} color="amber" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 ">
          {/* TABLA DE EMPLEADOS */}
          <div className="lg:w-2/3">
            <TablaEmpleado empleados={empleados} />
          </div>

          {/* PANEL DE DETALLES (DUPLICADOS Y ERRORES) */}
          <PanelResumen resumen={resumen} />
        </div>
      </main>
    </div>
  );
};

export default App;