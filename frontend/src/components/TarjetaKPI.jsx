import React from 'react';

//  Componente TarjetaKPI
//  Muestra indicadores clave (Key Performance Indicators) del procesamiento

const TarjetaKPI = ({ titulo, valor, icono, color }) => {
  
  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    green: "text-emerald-600 bg-emerald-50 border-emerald-100",
    red: "text-red-600 bg-red-50 border-red-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
  };

  return (
    /* Contenedor principal */
    <div className={`p-5 rounded-2xl border ${colorMap[color]} shadow-sm bg-white flex items-center gap-4 transition-transform hover:scale-[1.02]`}>
      
      {/* Contenedor del icono */}
      <div className={`p-3 rounded-xl bg-white shadow-sm border border-inherit`}>
        {React.cloneElement(icono, { size: 22 })}
      </div>

      {/* Textos */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">
          {titulo}
        </p>
        <p className="text-2xl font-black text-slate-800 leading-none">
          {valor}
        </p>
      </div>
    </div>
  );
};

export default TarjetaKPI;