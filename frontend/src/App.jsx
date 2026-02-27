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
  const [error, setError] = useState(null)
  const [exitoRecarga, setExitoRecarga] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Obtiene la lista de empleados desde el backend
  const fetchEmpleados = async (esRecargaManual = false) => {
    // Resetear errores al iniciar
    setError(null);

    try {
      const response = await fetch(API_URL);

      const tipo = response.headers.get("content-type")
      let res = {};

      if (tipo && tipo.includes("application/json")) {
        res = await response.json()
      }

      if (!response.ok) {
        const mensajeError = res.error || `Error del servidor (${response.status})`;

        const error = new Error(mensajeError);
        error.status = response.status;
        error.tipo = response.status >= 500 ? 'server' : 'client';
        throw error;
      }

      setEmpleados(res.data?.slice(0, 100) || []);

      if (esRecargaManual) {
        setExitoRecarga(true);
        setTimeout(() => setExitoRecarga(false), 3000);
      }

    } catch (err) {
      if (err.message.includes("fetch") || !err.status) {
        setError({
          mensaje: "No se pudo conectar con el servidor",
          tipo: "conexion",
          status: 503
        });
      } else {
        setError({
          mensaje: err.message,
          tipo: err.tipo,
          status: err.status
        });
      }
    }
  };

  useEffect(() => { fetchEmpleados(); }, []); // Carga los empleados al entrar a la pagina

  // Gestiona la carga y envo del archivo CSV al backend
  const handleImport = async (e) => {
    setError(null);

    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const response = await fetch(`${API_URL}/importar`, {
        method: 'POST',
        body: formData
      });

      const tipo = response.headers.get("content-type")

      let res = {}

      if(tipo && tipo.includes("application/json")){
        res = await response.json()
      }
      if (!response.ok) {
        const errorMensaje = res.error || `Error del servidor (${response.status})`
        const error = new Error(errorMensaje);
        error.status = response.status;
        error.tipo = response.status >= 500 ? 'server' : 'client';
        throw error;
      }

      if (res.success) {
        setResumen(res.data);
        await fetchEmpleados(); // Refresca la tabla
      }

    } catch (err) {
      if (err.message.includes("fetch") || !err.status) {
        setError({
          mensaje: "No se pudo conectar con el servidor",
          tipo: "conexion",
          status: 503
        });
      } else {
        setError({
          mensaje: err.message,
          tipo: err.tipo,
          status: err.status
        });
      }
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">

      {/* HEADER */}
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

        {/* Banner de errores */}
        {error && (
          <div className={`mb-6 p-4 border rounded-xl flex items-start gap-3 transition-all ${error.tipo === 'client'
            ? "bg-amber-50 border-amber-200 text-amber-800"
            : "bg-red-50 border-red-200 text-red-800"
            }`}>
            <AlertCircle className={error.tipo === 'client' ? "text-amber-500" : "text-red-500"} size={20} />

            <div className="flex-1">
              <p className="text-sm font-bold">
                {error.tipo === 'client' ? 'Atención' : 'Error del Sistema'}
              </p>
              <p className="text-sm opacity-90">{error.mensaje}</p>
            </div>

            <span className="text-xs font-mono opacity-50 bg-white/50 px-2 py-1 rounded">
              HTTP {error.status}
            </span>
          </div>
        )}

        {exitoRecarga && (
          <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">Tabla actualizada</span>
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