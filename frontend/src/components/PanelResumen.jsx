import React from 'react';
import { AlertCircle, Copy, Database } from 'lucide-react';

// Componente PanelResumen
// Muestra la informacion detalladada del procesamiento: errores de validacion, 
// duplicados dentro del CSV y registros que ya existen en la base de datos

const PanelResumen = ({ resumen }) => {
    return (
        /* Contenedor principal */
        <div className="lg:w-1/3 flex flex-col gap-4">
            
            {/* SECCION DE ERRORES DE VALIDACION */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[280px] overflow-hidden">
                {/* Cabecera de la caja de errores */}
                <div className="p-3 border-b border-red-100 bg-red-50/50 flex justify-between items-center">
                    <h2 className="text-xs font-black text-red-700 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={14} /> 
                        {/* Uso de el encadenamiento opcional para evitar errores si resumen es null */}
                        Errores de Validación ({resumen?.erroneos.total || 0})
                    </h2>
                </div>

                {/* Listado dinamico de errores */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white font-sans">
                    {!resumen ? (
                        /* Estado inicial: Aun no se ha cargado ningun archivo */
                        <p className="text-[11px] text-slate-400 text-center mt-10 italic">Esperando archivo...</p>
                    ) : resumen.erroneos.total === 0 ? (
                        /* Caso de exito: El archivo no tiene errores de validacion */
                        <p className="text-[11px] text-emerald-600 text-center mt-10 font-medium">✓ Sin errores de formato</p>
                    ) : (
                        /* Mapeo de errores: Por cada fila con problemas, se listan sus campos fallidos */
                        resumen.erroneos.data.map((err, i) => (
                            <div key={i} className="p-2 bg-red-50/30 border border-red-100 rounded-lg">
                                <p className="text-[10px] font-bold text-red-600 mb-1">FILA {err.fila}</p>
                                {err.errores.map((e, idx) => (
                                    <div key={idx} className="flex gap-2 mt-1.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                        <p className="text-[12px] text-slate-600 leading-tight">
                                            <span className="font-bold text-slate-800 capitalize">
                                                {e.campo[0]}:
                                            </span>{" "}
                                            {e.mensaje}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* SECCION DE DUPLICADOS EN EL CSV */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[200px] overflow-hidden">
                <div className="p-3 border-b border-orange-100 bg-orange-50/50">
                    <h2 className="text-xs font-black text-orange-700 uppercase tracking-widest flex items-center gap-2">
                        <Copy size={14} /> Duplicados en el archivo ({resumen?.duplicadosCsv.total || 0})
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white">
                    {resumen?.duplicadosCsv.data.map((dup, i) => (
                        <div key={i} className="p-2 border border-orange-100 bg-orange-50/50 rounded-lg">
                            <p className="text-[10px] font-bold text-orange-600">FILA {dup.fila}</p>
                            <p className="text-[11px] text-slate-700 truncate">{dup.empleado.email}</p>
                        </div>
                    ))}
                    {/* Mensaje si no hay duplicados en el CSV */}
                    {resumen && resumen.duplicadosCsv.total === 0 && (
                        <p className="text-[11px] text-slate-400 text-center mt-6 italic">No hay duplicados internos</p>
                    )}
                </div>
            </div>

            {/* SECCION DE COLISIONES CON LA DB */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[200px] overflow-hidden">
                <div className="p-3 border-b border-amber-100 bg-amber-50/50">
                    <h2 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center gap-2">
                        <Database size={14} /> Ya registrados en DB ({resumen?.duplicadosDb.total || 0})
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white">
                    {resumen?.duplicadosDb.data.map((dup, i) => (
                        <div key={i} className="p-2 border border-amber-100 bg-amber-50/50 rounded-lg">
                            <p className="text-[10px] text-amber-600 font-bold uppercase ">Email</p>
                            <p className="text-[11px] text-slate-700 truncate">{dup.email}</p>
                        </div>
                    ))}
                    {/* Mensaje si la base de datos no tiene colisiones con el archivo */}
                    {resumen && resumen.duplicadosDb.total === 0 && (
                        <p className="text-[11px] text-slate-400 text-center mt-6 italic">No hay colisiones con la DB</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PanelResumen;