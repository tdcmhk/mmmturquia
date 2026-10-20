import React, { useState } from 'react';
import { DailyPrayerEntry, DailyPrayerMotive, Language, PrayerBlock, UserProfile } from '../types';
import { INITIAL_PRAYER_BLOCKS } from '../data/initialData';

interface DiarioViewProps {
  entries: DailyPrayerEntry[];
  lang: Language;
  blocks?: PrayerBlock[];
  currentUser?: UserProfile | null;
  onAddEntry: (entry: Omit<DailyPrayerEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
  onToggleMotiveAnswered?: (entryId: string, motiveId: string) => void;
  onToggleEntryAnswered?: (entryId: string) => void;
  onAddResponseComment?: (entryId: string, motiveId: string | undefined, text: string) => void;
}

export const DiarioView: React.FC<DiarioViewProps> = ({
  entries,
  blocks = INITIAL_PRAYER_BLOCKS,
  currentUser,
  onAddEntry,
  onDeleteEntry,
  onToggleMotiveAnswered,
  onToggleEntryAnswered,
  onAddResponseComment
}) => {
  const [activeTab, setActiveTab] = useState<'todos' | 'guardado' | 'orado' | 'contestado' | 'propio'>('todos');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Entry Form State
  const [newTitle, setNewTitle] = useState('');
  const [newScripture, setNewScripture] = useState('');
  const [newCategory, setNewCategory] = useState<'orado' | 'guardado' | 'contestado' | 'propio'>('propio');
  const [newNotes, setNewNotes] = useState('');
  const [newMotivesList, setNewMotivesList] = useState<{ title: string; description: string }[]>([]);
  const [tempMotiveTitle, setTempMotiveTitle] = useState('');
  const [tempMotiveDesc, setTempMotiveDesc] = useState('');

  // Comment Box toggles and state: key is either `entry-${entryId}` or `motive-${entryId}-${motiveId}`
  const [openCommentBox, setOpenCommentBox] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  // Helper to resolve block prayer items if not already stored on the entry
  const getEntryItems = (entry: DailyPrayerEntry): DailyPrayerMotive[] => {
    if (entry.items && entry.items.length > 0) {
      return entry.items;
    }
    // Try to find matching block by blockId or title
    let matchedBlock = blocks.find((b) => b.id === entry.blockId);
    if (!matchedBlock && entry.blockNumber) {
      matchedBlock = blocks.find((b) => b.number === entry.blockNumber);
    }
    if (!matchedBlock && entry.title) {
      // Look for "(Bloque X)"
      const match = entry.title.match(/Bloque\s+(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        matchedBlock = blocks.find((b) => b.number === num);
      }
    }

    if (matchedBlock && matchedBlock.items) {
      return matchedBlock.items.map((it, idx) => ({
        id: `motive-${entry.id}-${idx}`,
        title: it.title,
        description: it.description,
        isAnswered: false,
        responseComments: []
      }));
    }

    return [];
  };

  const handleAddTempMotive = () => {
    if (!tempMotiveTitle.trim()) return;
    setNewMotivesList((prev) => [
      ...prev,
      { title: tempMotiveTitle.trim(), description: tempMotiveDesc.trim() }
    ]);
    setTempMotiveTitle('');
    setTempMotiveDesc('');
  };

  const handleRemoveTempMotive = (index: number) => {
    setNewMotivesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const formattedItems: DailyPrayerMotive[] = newMotivesList.map((m, idx) => ({
      id: `motive-user-${Date.now()}-${idx}`,
      title: m.title,
      description: m.description,
      isAnswered: newCategory === 'contestado',
      responseComments: []
    }));

    onAddEntry({
      title: newTitle.trim(),
      scripture: newScripture.trim() || undefined,
      category: newCategory,
      notes: newNotes.trim() || undefined,
      isAnswered: newCategory === 'contestado',
      answeredDate: newCategory === 'contestado' ? new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : undefined,
      items: formattedItems.length > 0 ? formattedItems : undefined,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    });

    setNewTitle('');
    setNewScripture('');
    setNewNotes('');
    setNewMotivesList([]);
    setTempMotiveTitle('');
    setTempMotiveDesc('');
    setShowAddForm(false);
  };

  const handleSendComment = (entryId: string, motiveId?: string) => {
    const key = motiveId ? `motive-${entryId}-${motiveId}` : `entry-${entryId}`;
    const text = (commentText[key] || '').trim();
    if (!text) return;

    if (onAddResponseComment) {
      onAddResponseComment(entryId, motiveId, text);
    }
    setCommentText((prev) => ({ ...prev, [key]: '' }));
    setOpenCommentBox(null);
  };

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    if (activeTab === 'todos') return true;
    if (activeTab === 'guardado') return entry.category === 'guardado';
    if (activeTab === 'orado') return entry.category === 'orado';
    if (activeTab === 'propio') return entry.category === 'propio';
    if (activeTab === 'contestado') {
      const items = getEntryItems(entry);
      const hasAnsweredMotive = items.some((m) => m.isAnswered);
      return entry.category === 'contestado' || entry.isAnswered || hasAnsweredMotive;
    }
    return true;
  });

  // Calculate statistics
  const totalEntries = entries.length;
  const savedCount = entries.filter((e) => e.category === 'guardado').length;
  const personalCount = entries.filter((e) => e.category === 'propio').length;
  const answeredCount = entries.filter((e) => {
    const items = getEntryItems(e);
    return e.category === 'contestado' || e.isAnswered || items.some((m) => m.isAnswered);
  }).length;

  const getCategoryBadge = (cat: DailyPrayerEntry['category'], isAnswered?: boolean) => {
    if (isAnswered || cat === 'contestado') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[11px] font-bold">
          <span className="material-symbols-outlined text-[14px]">task_alt</span>
          Respondido / Victoria
        </span>
      );
    }
    switch (cat) {
      case 'guardado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-700 text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">bookmark</span>
            Bloque Guardado
          </span>
        );
      case 'orado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border border-teal-300 dark:border-teal-700 text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
            Motivo Orado
          </span>
        );
      case 'propio':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300 dark:border-purple-700 text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">family_restroom</span>
            Petición Personal
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#0e9594] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[20px]">auto_stories</span>
            <span>Bitácora Espiritual del Intercesor</span>
          </div>
          <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#1a365d] dark:text-white">
            Diario de Oración por Turquía
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Guarda los motivos de cada bloque del boletín, haz seguimiento puntual con el botón de{' '}
            <strong className="text-[#0e9594]">«Respondido»</strong> y registra comentarios con el testimonio de cómo Dios contestó.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0e9594] to-[#0b7a79] hover:from-[#0b7a79] hover:to-[#085a59] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0 active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">
            {showAddForm ? 'close' : 'add_circle'}
          </span>
          <span>{showAddForm ? 'Cerrar Formulario' : 'Nueva Petición'}</span>
        </button>
      </div>

      {/* Quick Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">format_list_bulleted</span>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Total Registros</div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono-code">{totalEntries}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">bookmark</span>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Bloques Guardados</div>
            <div className="text-base sm:text-lg font-bold text-sky-600 dark:text-sky-400 font-mono-code">{savedCount}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">family_restroom</span>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Peticiones Propias</div>
            <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400 font-mono-code">{personalCount}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">task_alt</span>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">¡Respondidas!</div>
            <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono-code">{answeredCount}</div>
          </div>
        </div>
      </div>

      {/* Add Entry Form Modal / Box */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-[#0e9594]/40 dark:border-[#0e9594]/30 space-y-5 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#1a365d] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0e9594]">edit_note</span>
                Registrar Petición Personal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Podrás hacer seguimiento, marcarla como respondida y añadir comentarios de testimonio.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Título de la Petición *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej: Salud de mi familia y sustento en Turquía"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Versículo Bíblico de Promesa (opcional)
              </label>
              <input
                type="text"
                value={newScripture}
                onChange={(e) => setNewScripture(e.target.value)}
                placeholder="Ej: Filipenses 4:19 o Salmos 126:5"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoría / Pilar
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
              >
                <option value="propio">Petición Personal / Familiar</option>
                <option value="orado">Motivo Orado</option>
                <option value="guardado">Motivo Guardado para Vigilia</option>
                <option value="contestado">Testimonio de Oración Ya Contestada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Descripción o Notas
              </label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Detalles sobre lo que se está pidiendo a Dios..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
              />
            </div>
          </div>

          {/* Sub-motivos específicos (opcional) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#0e9594] text-[18px]">checklist</span>
                <span>Motivos o Puntos Específicos de Clamor (Opcional)</span>
              </label>
              <span className="text-[11px] text-slate-500">
                {newMotivesList.length} motivo(s) agregado(s)
              </span>
            </div>

            {newMotivesList.length > 0 && (
              <ul className="space-y-2">
                {newMotivesList.map((m, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-2"
                  >
                    <div className="text-xs">
                      <strong className="text-[#1a365d] dark:text-[#38bdf8] block">{m.title}</strong>
                      {m.description && <span className="text-slate-600 dark:text-slate-300">{m.description}</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTempMotive(idx)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <input
                type="text"
                value={tempMotiveTitle}
                onChange={(e) => setTempMotiveTitle(e.target.value)}
                placeholder="Título del punto (Ej: Provisión financiera)"
                className="sm:col-span-4 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={tempMotiveDesc}
                onChange={(e) => setTempMotiveDesc(e.target.value)}
                placeholder="Detalle o descripción del motivo puntual..."
                className="sm:col-span-6 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTempMotive}
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-semibold flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Añadir</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0e9594] hover:bg-[#0b7a79] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              Guardar en mi Diario
            </button>
          </div>
        </form>
      )}

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/70 dark:bg-[#131d33]/70 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        {[
          { id: 'todos', label: 'Todos los Motivos', icon: 'apps', count: totalEntries },
          { id: 'guardado', label: 'Bloques Guardados', icon: 'bookmark', count: savedCount },
          { id: 'contestado', label: 'Contestados / Respondidos', icon: 'task_alt', count: answeredCount },
          { id: 'propio', label: 'Peticiones Propias', icon: 'family_restroom', count: personalCount },
          { id: 'orado', label: 'Motivos Orados', icon: 'volunteer_activism', count: entries.filter((e) => e.category === 'orado').length }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-[#1a365d] to-[#0e9594] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono-code ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-[#131d33] rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">
              menu_book
            </span>
            <p className="text-sm font-semibold">No tienes motivos en esta categoría por ahora.</p>
            <p className="text-xs text-slate-400">
              Puedes guardar bloques desde el Boletín de Oración o pulsar en «Nueva Petición».
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const items = getEntryItems(entry);
            const isEntryAnswered = entry.isAnswered || entry.category === 'contestado';
            const entryCommentKey = `entry-${entry.id}`;
            const isEntryCommentOpen = openCommentBox === entryCommentKey;

            return (
              <div
                key={entry.id}
                className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131d33] border shadow-sm transition-all space-y-4 ${
                  isEntryAnswered
                    ? 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/20 dark:bg-[#0f1f2e]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-[#0e9594]/50'
                }`}
              >
                {/* Entry Top Header */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    {getCategoryBadge(entry.category, isEntryAnswered)}
                    <span className="text-[11px] text-slate-400 font-mono-code">{entry.date}</span>
                    {entry.blockNumber && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono-code">
                        BLOQUE {entry.blockNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Botón de Respondido para toda la entrada / petición personal */}
                    {onToggleEntryAnswered && (
                      <button
                        onClick={() => onToggleEntryAnswered(entry.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                          isEntryAnswered
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700'
                        }`}
                        title={isEntryAnswered ? 'Marcar como pendiente' : 'Marcar petición completa como contestada'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isEntryAnswered ? 'check_circle' : 'task_alt'}
                        </span>
                        <span>{isEntryAnswered ? 'Respondida' : 'Marcar Respondido'}</span>
                      </button>
                    )}

                    {/* Botón Eliminar */}
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1.5 text-slate-400 hover:text-[#c1272d] transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="Eliminar del diario"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Entry Title & Scripture */}
                <div>
                  <h4 className="font-serif-title text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {entry.title}
                  </h4>
                  {entry.scripture && (
                    <div className="text-xs sm:text-sm text-[#0e9594] font-semibold italic mt-1">
                      «{entry.scripture}»
                    </div>
                  )}
                  {entry.notes && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {entry.notes}
                    </p>
                  )}
                </div>

                {/* BOTÓN Y SECCIÓN DE COMENTARIO/TESTIMONIO A NIVEL DE ENTRADA (PETICIÓN PERSONAL O GENERAL) */}
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        setOpenCommentBox(isEntryCommentOpen ? null : entryCommentKey)
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0e9594] hover:text-[#0b7a79] dark:text-[#38bdf8] hover:underline"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_comment</span>
                      <span>
                        {entry.responseComments && entry.responseComments.length > 0
                          ? `Ver / Agregar testimonio de cómo se respondió (${entry.responseComments.length})`
                          : 'Agregar testimonio de cómo se respondió'}
                      </span>
                    </button>
                  </div>

                  {/* Formulario desplegable para agregar comentario a la petición */}
                  {isEntryCommentOpen && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 animate-fadeIn">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        ¿Cómo respondió Dios a esta petición? (Testimonio)
                      </label>
                      <textarea
                        rows={2}
                        value={commentText[entryCommentKey] || ''}
                        onChange={(e) =>
                          setCommentText({ ...commentText, [entryCommentKey]: e.target.value })
                        }
                        placeholder="Escribe aquí los detalles del testimonio o la confirmación recibida..."
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setOpenCommentBox(null)}
                          className="px-3 py-1.5 text-xs rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendComment(entry.id)}
                          className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#0e9594] hover:bg-[#0b7a79] text-white shadow-xs"
                        >
                          Guardar Testimonio
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lista de testimonios/comentarios existentes a nivel de la petición */}
                  {entry.responseComments && entry.responseComments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {entry.responseComments.map((c) => (
                        <div
                          key={c.id}
                          className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px]">verified</span>
                              {c.author}
                            </span>
                            <span className="text-[10px] font-mono-code">{c.date}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                            {c.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* MOTIVOS DE ORACIÓN DEL BLOQUE O DE LA PETICIÓN */}
                {items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1a365d] dark:text-[#38bdf8]">
                        <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                        <span>Motivos de Oración del Bloque ({items.length})</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {items.filter((m) => m.isAnswered).length} de {items.length} respondidos
                      </span>
                    </div>

                    <div className="space-y-3">
                      {items.map((motive) => {
                        const motiveCommentKey = `motive-${entry.id}-${motive.id}`;
                        const isMotiveCommentOpen = openCommentBox === motiveCommentKey;

                        return (
                          <div
                            key={motive.id}
                            className={`p-4 rounded-2xl border transition-all space-y-3 ${
                              motive.isAnswered
                                ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/70'
                                : 'bg-slate-50/90 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              {/* Texto del Motivo */}
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <strong className="text-xs sm:text-sm font-bold text-[#1a365d] dark:text-[#38bdf8]">
                                    {motive.title}:
                                  </strong>
                                  {motive.isAnswered ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold border border-emerald-300 dark:border-emerald-700">
                                      <span className="material-symbols-outlined text-[13px]">task_alt</span>
                                      ¡Respondido!
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-semibold border border-amber-200 dark:border-amber-800">
                                      <span className="material-symbols-outlined text-[13px]">hourglass_top</span>
                                      En clamor
                                    </span>
                                  )}
                                </div>
                                {motive.description && (
                                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {motive.description}
                                  </p>
                                )}
                              </div>

                              {/* BOTONES DE ACCIÓN PARA EL MOTIVO */}
                              <div className="flex items-center gap-2 self-start shrink-0">
                                {/* Botón Respondido */}
                                {onToggleMotiveAnswered && (
                                  <button
                                    onClick={() => onToggleMotiveAnswered(entry.id, motive.id)}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                                      motive.isAnswered
                                        ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-xs'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600'
                                    }`}
                                    title={motive.isAnswered ? 'Marcar como pendiente' : 'Marcar este motivo como contestado'}
                                  >
                                    <span className="material-symbols-outlined text-[15px]">
                                      {motive.isAnswered ? 'check_circle' : 'task_alt'}
                                    </span>
                                    <span>{motive.isAnswered ? 'Respondido' : 'Respondido'}</span>
                                  </button>
                                )}

                                {/* Botón Agregar Comentario de Respuesta */}
                                <button
                                  onClick={() =>
                                    setOpenCommentBox(isMotiveCommentOpen ? null : motiveCommentKey)
                                  }
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                                  title="Añadir comentario o testimonio de cómo Dios respondió"
                                >
                                  <span className="material-symbols-outlined text-[15px]">add_comment</span>
                                  <span>
                                    {motive.responseComments && motive.responseComments.length > 0
                                      ? `Comentarios (${motive.responseComments.length})`
                                      : '¿Cómo se respondió?'}
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Desplegable para escribir cómo se respondió */}
                            {isMotiveCommentOpen && (
                              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 animate-fadeIn">
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                  Agregar testimonio: ¿Cómo respondió Dios a este motivo?
                                </label>
                                <textarea
                                  rows={2}
                                  value={commentText[motiveCommentKey] || ''}
                                  onChange={(e) =>
                                    setCommentText({
                                      ...commentText,
                                      [motiveCommentKey]: e.target.value
                                    })
                                  }
                                  placeholder="Explica aquí cómo se respondió (fecha, testimonio, confirmación)..."
                                  className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setOpenCommentBox(null)}
                                    className="px-2.5 py-1 text-[11px] text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
                                  >
                                    Cerrar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSendComment(entry.id, motive.id)}
                                    className="px-3 py-1 text-[11px] font-bold rounded-md bg-[#0e9594] hover:bg-[#0b7a79] text-white shadow-xs"
                                  >
                                    Guardar Comentario
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Lista de comentarios / testimonios registrados para este motivo */}
                            {motive.responseComments && motive.responseComments.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Testimonios de respuesta registrados:
                                </div>
                                {motive.responseComments.map((comm) => (
                                  <div
                                    key={comm.id}
                                    className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200/80 dark:border-emerald-800/50 text-xs space-y-0.5"
                                  >
                                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                                      <span className="font-bold text-[#0e9594] dark:text-[#38bdf8] flex items-center gap-1 text-[11px]">
                                        <span className="material-symbols-outlined text-[13px]">verified</span>
                                        {comm.author}
                                      </span>
                                      <span className="text-[10px] font-mono-code">{comm.date}</span>
                                    </div>
                                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                                      {comm.text}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
