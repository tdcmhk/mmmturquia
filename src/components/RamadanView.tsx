import React from 'react';

export const RamadanView: React.FC = () => {
  const ramadanDays = [
    { day: 1, title: 'El Despertar Espiritual en Anatolia', scripture: 'Isaías 9:2', focus: 'Que la luz de Cristo resplandezca en las familias que buscan a Dios sinceramente.' },
    { day: 2, title: 'La Revelación del Salvador a Través de Sueños', scripture: 'Hechos 2:17', focus: 'Que el Señor se revele con poder a hombres y mujeres sedientos de verdad.' },
    { day: 3, title: 'Los Jóvenes Universitarios en Estambul', scripture: 'Eclesiastés 12:1', focus: 'Por las nuevas generaciones que cuestionan el vacío y anhelan un propósito eterno.' },
    { day: 4, title: 'La Literatura Bíblica en Hogares Turcos', scripture: 'Salmos 119:105', focus: 'Por la distribución de la Biblia (Kutsal Kitap) y que ninguna palabra vuelva vacía.' },
    { day: 5, title: 'La Paz en Matrimonios y Familias', scripture: 'Josué 24:15', focus: 'Por los hogares mixtos y la victoria del amor sacrificial cristiano.' },
    { day: 6, title: 'Los Obreros y Movilizadores en Primera Línea', scripture: '2 Tesalonicenses 3:1', focus: 'Por protección sobrenatural, salud y denuedo al predicar el Evangelio.' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1a365d] via-[#102a45] to-[#0e9594] text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#e5a93b] text-xs font-bold tracking-wide mb-2 border border-white/15">
            <span className="material-symbols-outlined text-[16px]">nightlight</span>
            <span>Programa Especial de Intercesión</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold mb-2">
            30 Días de Clamor por Turquía
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Durante el mes de Ramadán, cuando millones ayunan buscando agradar a Dios, la iglesia global intensifica su clamor para que el Príncipe de Paz se manifieste como el Camino, la Verdad y la Vida.
          </p>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ramadanDays.map((d) => (
          <div
            key={d.day}
            className="p-5 rounded-2xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-[#0e9594]/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-mono-code px-2 py-0.5 rounded-md bg-[#1a365d] text-white">
                DÍA {d.day}
              </span>
              <span className="text-xs font-semibold text-[#0e9594] italic font-serif-title">
                {d.scripture}
              </span>
            </div>
            <h4 className="font-serif-title text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {d.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Motivo:</strong> {d.focus}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
