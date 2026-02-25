import React from 'react';
import { List } from 'lucide-react';


// Componente TablaEmpleado
// Recibe la lista de empleados y la renderiza en una tabla

const TablaEmpleado = ({ empleados }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* HEADER DE LA TABLA: Titulo y contador de registros mostrados */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <List size={20} className="text-sky-600" />
            Tabla de Empleados
          </h2>
          {/* Nota aclaratoria sobre el limite de registros para el usuario */}
          <p className="text-xs text-slate-400 mt-0.5 italic">* Mostrando últimos 100 registros de la base de datos</p>
        </div>
        {/* Aclaramos cuantos registros se estan mostrando por si hay menos de 100 */}
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
          Total: {empleados.length}
        </span>
      </div>

      {/* CONTENEDOR CON SCROLL: Mantiene la tabla dentro de un limite de 600px de alto */}
      <div className="overflow-x-auto h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          {/* ENCABEZADO FIJO: Permite ver los nombres de las columnas mientras haces scroll */}
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 border-b border-slate-100">Empleado</th>
              <th className="px-6 py-4 border-b border-slate-100">Contacto</th>
              <th className="px-6 py-4 border-b border-slate-100">Cargo / Depto</th>
              <th className="px-6 py-4 border-b border-slate-100 text-right">Salario</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {/* RENDERIZADO DE FILAS: Mapeo del array de empleados  */}
            {empleados.map((emp) => (
              /* Usamos el ID para que React identifique cada fila de forma unica */
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                
                {/* Columna: Nombre e ID */}
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-700 group-hover:text-sky-600 transition-colors capitalize">
                    {emp.nombre} {emp.apellido}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">ID: {emp.id}</p>
                </td>

                {/* Columna: Informacion de contacto */}
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">{emp.email}</p>
                  <p className="text-xs text-slate-400">{emp.telefono}</p>
                </td>

                {/* Columna: Puesto y Departamento */}
                <td className="px-6 py-4">
                  <span className="text-xs font-semibold bg-sky-50 text-sky-700 px-2 py-0.5 rounded uppercase">
                    {emp.cargo}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium uppercase">{emp.departamento}</p>
                </td>

                {/* Columna: Salario*/}
                <td className="px-6 py-4 text-right">
                  <p className="font-mono font-bold text-slate-700">
                    {/* Convertimos a numero y aplicamos formato de miles con 2 decimales */}
                    ${parseFloat(emp.salario).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </td>
              </tr>
            ))}

            {/* ESTADO VACIO: Si el array viene vacio, mostramos un mensaje */}
            {empleados.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center text-slate-400 font-medium">
                  No hay registros disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaEmpleado;