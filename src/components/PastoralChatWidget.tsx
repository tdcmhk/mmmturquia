import React, { useState } from 'react';

export const PastoralChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [motivo, setMotivo] = useState('Petición de Oración');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !mensaje.trim()) return;

    const texto = `*Petición desde la Intranet MMM Turquía*\n\n` +
      `👤 *Nombre:* ${nombre.trim()}\n` +
      `📌 *Motivo:* ${motivo}\n\n` +
      `💬 *Mensaje:* ${mensaje.trim()}`;

    const numero = '51938204456';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

    window.open(url, '_blank');
    setIsOpen(false);
    setNombre('');
    setMensaje('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Popup Window */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80 sm:w-88 bg-white dark:bg-[#131d33] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col mb-2 animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a365d] to-[#0e9594] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">diversity_1</span>
              </div>
              <div>
                <h4 className="font-serif-title text-sm font-bold leading-tight">Equipo Pastoral</h4>
                <span className="text-[11px] text-slate-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  En línea para Turquía
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Cerrar ventana"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Body & Form */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 space-y-3 max-h-[420px] overflow-y-auto">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 leading-relaxed shadow-2xs">
              <p>¡Dios te bendiga! Escribe tu petición o consulta y te responderemos directamente por WhatsApp.</p>
              <span className="block text-[10px] text-slate-400 text-right mt-1 font-mono-code">Equipo de Movilización</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#0e9594]"
              />

              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
              >
                <option value="Petición de Oración">🙏 Petición de Oración</option>
                <option value="Testimonio / Agradecimiento">✨ Testimonio o Agradecimiento</option>
                <option value="Consulta sobre el Boletín">📖 Consulta sobre el Boletín</option>
                <option value="Apoyo a Expedición Misionera">🗺️ Apoyo a Expedición</option>
                <option value="Otro motivo">✉️ Otro motivo</option>
              </select>

              <textarea
                required
                rows={3}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe tu mensaje o motivo de oración aquí..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#0e9594] resize-none"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#0e9594] hover:bg-[#0b7a79] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Enviar a WhatsApp</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1a365d] to-[#0e9594] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform"
        aria-label="Abrir contacto pastoral"
      >
        <span className="material-symbols-outlined text-[24px]">
          {isOpen ? 'close' : 'chat'}
        </span>
      </button>
    </div>
  );
};
