import { useState, useEffect, useRef } from 'react';
import { NavTab, Language, PrayerBlock, DailyPrayerEntry, ChatMessage, Poll, UserProfile, UserRole, PrayerResponseComment } from './types';
import {
  INITIAL_PRAYER_BLOCKS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_POLL,
  INITIAL_PROJECTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_BIRTHDAYS,
  INITIAL_ONLINE_INTERCESSORS,
  INITIAL_DIARY_ENTRIES
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { RootHomeView } from './components/RootHomeView';
import { RadioView } from './components/RadioView';
import { IntranetDashboard } from './components/IntranetDashboard';
import { BoletinView } from './components/BoletinView';
import { DiarioView } from './components/DiarioView';
import { ExpedicionesView } from './components/ExpedicionesView';
import { RamadanView } from './components/RamadanView';
import { PerfilView } from './components/PerfilView';
import { StreamingView } from './components/StreamingView';
import { AdminPanel } from './components/AdminPanel';
import { PastoralChatWidget } from './components/PastoralChatWidget';
import { Footer } from './components/Footer';
import {
  auth,
  onAuthStateChanged,
  loginWithGoogleFirebase,
  logoutFirebase,
  getUserFirestoreProfile,
  registerUserProfileFirestore,
  updateProfileInFirestore,
  listenUserProfileFirestore,
  subscribeToAllUsersFirestore,
  approveUserRoleFirestore,
  isPastorAdmin,
  toggleOrarBloqueFirestore,
  addBlockCommentFirestore
} from './firebase';

export default function App() {
  // Navigation & Theme
  const [currentTab, setCurrentTab] = useState<NavTab>('portal');
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('mmmturquia_lang');
    return (saved as Language) || 'es';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mmmturquia_theme');
    if (saved) return saved === 'dark';
    return true; // Por defecto versión oscura para el boletín y la misión
  });

  // User & Roles Management (Default null so Google Auth is shown on first visit!)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mmmturquia_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('mmmturquia_all_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // default below
      }
    }
    return [
      {
        uid: 'user-pastor-1',
        nombre: 'Pastor Ricardo Vicente Tapia',
        apellido: '',
        email: 'rvicentetapia@gmail.com',
        whatsapp: '+51 938 204 456',
        pais: 'Turquía',
        iglesia: 'MMM Estambul',
        rol: 'admin',
        aprobado: true,
        fechaRegistro: '01 Ene 2026'
      },
      {
        uid: 'user-2',
        nombre: 'Carmen',
        apellido: 'Ramírez',
        email: 'carmen@gmail.com',
        whatsapp: '+57 300 123 4567',
        pais: 'Colombia',
        iglesia: 'Medellín Central',
        rol: 'intercesor',
        aprobado: false,
        solicitud: 'intercesor',
        fechaRegistro: '16 Oct 2026'
      }
    ];
  });

  // Radio Streaming Engine
  const [isPlayingRadio, setIsPlayingRadio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Prayer collections state
  const [blocks, setBlocks] = useState<PrayerBlock[]>(() => {
    const saved = localStorage.getItem('mmmturquia_blocks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PRAYER_BLOCKS;
      }
    }
    return INITIAL_PRAYER_BLOCKS;
  });

  const [poll, setPoll] = useState<Poll>(() => {
    const saved = localStorage.getItem('mmmturquia_poll');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_POLL;
      }
    }
    return INITIAL_POLL;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('mmmturquia_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CHAT_MESSAGES;
      }
    }
    return INITIAL_CHAT_MESSAGES;
  });

  const [diaryEntries, setDiaryEntries] = useState<DailyPrayerEntry[]>(() => {
    const saved = localStorage.getItem('mmmturquia_diary');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DIARY_ENTRIES;
      }
    }
    return INITIAL_DIARY_ENTRIES;
  });

  const [totalWeeklyPrayers, setTotalWeeklyPrayers] = useState<number>(() => {
    const saved = localStorage.getItem('mmmturquia_weekly_prayers');
    return saved ? parseInt(saved, 10) : 14892;
  });

  const [hasPrayedWeekly, setHasPrayedWeekly] = useState<boolean>(() => {
    return localStorage.getItem('mmmturquia_has_prayed_weekly') === 'true';
  });

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mmmturquia_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mmmturquia_theme', 'light');
    }
  }, [darkMode]);

  // Firebase Authentication & Firestore User Sync Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        localStorage.removeItem('mmmturquia_current_user');
        return;
      }

      const cleanEmail = (firebaseUser.email || '').toLowerCase().trim();
      const isPastor = isPastorAdmin(cleanEmail);

      try {
        const existingProfile = await getUserFirestoreProfile(firebaseUser.uid);
        if (existingProfile) {
          const finalProfile = isPastor
            ? { ...existingProfile, rol: 'admin' as UserRole, aprobado: true }
            : existingProfile;
          setCurrentUser(finalProfile);
          localStorage.setItem('mmmturquia_current_user', JSON.stringify(finalProfile));
        } else {
          // Primera vez que ingresa con Google: preparar ficha para formulario de registro
          const parts = (firebaseUser.displayName || '').split(' ');
          const draftProfile: UserProfile = {
            uid: firebaseUser.uid,
            nombre: parts[0] || (isPastor ? 'Pastor Ricardo' : 'Hermano'),
            apellido: parts.slice(1).join(' ') || (isPastor ? 'Vicente Tapia' : ''),
            email: cleanEmail,
            whatsapp: '',
            pais: '',
            iglesia: '',
            rol: (isPastor ? 'admin' : 'intercesor') as UserRole,
            aprobado: isPastor ? true : false,
            fechaRegistro: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
          };
          setCurrentUser(draftProfile);
          localStorage.setItem('mmmturquia_current_user', JSON.stringify(draftProfile));
        }
      } catch (err) {
        console.warn('Error sincronizando usuario con Firestore:', err);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Escucha reactiva en tiempo real del perfil del usuario (para la sala de espera hasta aprobación)
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = listenUserProfileFirestore(currentUser.uid, (updatedProfile) => {
      if (updatedProfile) {
        setCurrentUser((prev) => {
          if (!prev) return updatedProfile;
          return { ...prev, ...updatedProfile };
        });
        localStorage.setItem('mmmturquia_current_user', JSON.stringify(updatedProfile));
      }
    });
    return () => unsub();
  }, [currentUser?.uid]);

  // Sync all users in real-time for Pastor Admin
  useEffect(() => {
    if (currentUser?.rol === 'admin' || isPastorAdmin(currentUser?.email)) {
      const unsubUsers = subscribeToAllUsersFirestore((users) => {
        if (users && users.length > 0) {
          setAllUsers(users);
          localStorage.setItem('mmmturquia_all_users', JSON.stringify(users));
        }
      });
      return () => unsubUsers();
    }
  }, [currentUser?.rol, currentUser?.email]);

  // Audio stream handler
  const handleToggleRadio = () => {
    if (!audioRef.current) return;
    if (isPlayingRadio) {
      audioRef.current.pause();
      setIsPlayingRadio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingRadio(true);
      }).catch((err) => {
        console.warn('Audio stream error:', err);
      });
    }
  };

  // Sync lang
  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('mmmturquia_lang', newLang);
  };

  // Google Login Trigger (abre el popup de Google en Firebase)
  const handleLoginWithGoogle = async () => {
    const user = await loginWithGoogleFirebase();
    const existing = await getUserFirestoreProfile(user.uid);
    const cleanEmail = (user.email || '').toLowerCase().trim();
    const isPastor = isPastorAdmin(cleanEmail);

    if (existing) {
      const activeUser = isPastor ? { ...existing, rol: 'admin' as UserRole, aprobado: true } : existing;
      setCurrentUser(activeUser);
      localStorage.setItem('mmmturquia_current_user', JSON.stringify(activeUser));
    } else {
      const parts = (user.displayName || '').split(' ');
      const draft: UserProfile = {
        uid: user.uid,
        nombre: parts[0] || (isPastor ? 'Pastor Ricardo' : 'Hermano'),
        apellido: parts.slice(1).join(' ') || (isPastor ? 'Vicente Tapia' : ''),
        email: cleanEmail,
        whatsapp: '',
        pais: '',
        iglesia: '',
        rol: (isPastor ? 'admin' : 'intercesor') as UserRole,
        aprobado: isPastor ? true : false,
        fechaRegistro: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      setCurrentUser(draft);
      localStorage.setItem('mmmturquia_current_user', JSON.stringify(draft));
    }
  };

  // Guardar ficha de registro (Vista 2)
  const handleRegisterUser = async (datos: {
    nombre: string;
    apellido: string;
    whatsapp: string;
    pais: string;
    iglesia: string;
    rol: UserRole;
  }) => {
    if (!auth.currentUser) return;
    const registered = await registerUserProfileFirestore(auth.currentUser, datos);
    setCurrentUser(registered);
    localStorage.setItem('mmmturquia_current_user', JSON.stringify(registered));

    // Si es seguidor, acceso directo a la portada
    if (datos.rol === 'seguidor') {
      setCurrentTab('portal');
    }
  };

  // Update current user and persist in Firestore
  const handleUpdateUser = async (updated: UserProfile) => {
    setCurrentUser(updated);
    localStorage.setItem('mmmturquia_current_user', JSON.stringify(updated));

    setAllUsers((prev) => {
      const exists = prev.some((u) => u.uid === updated.uid);
      const list = exists
        ? prev.map((u) => (u.uid === updated.uid ? updated : u))
        : [updated, ...prev];
      localStorage.setItem('mmmturquia_all_users', JSON.stringify(list));
      return list;
    });

    try {
      await updateProfileInFirestore(updated.uid, updated);
    } catch (err) {
      console.warn('Error actualizando perfil en Firestore:', err);
    }
  };

  // Pastoral 1-click approval in Firestore
  const handleApproveUser = async (uid: string, targetRole: UserRole, state: boolean) => {
    setAllUsers((prev) => {
      const uList = prev.map((u) => {
        if (u.uid === uid) {
          return { ...u, rol: targetRole, aprobado: state };
        }
        return u;
      });
      localStorage.setItem('mmmturquia_all_users', JSON.stringify(uList));
      return uList;
    });

    if (currentUser && currentUser.uid === uid) {
      const updated = { ...currentUser, rol: targetRole, aprobado: state };
      setCurrentUser(updated);
      localStorage.setItem('mmmturquia_current_user', JSON.stringify(updated));
    }

    try {
      await approveUserRoleFirestore(uid, targetRole, state);
    } catch (err) {
      console.warn('Error aprobando usuario en Firestore:', err);
    }
  };

  // Update prayer block in Admin
  const handleUpdateBlock = (updatedBlock: PrayerBlock) => {
    setBlocks((prev) => {
      const list = prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b));
      localStorage.setItem('mmmturquia_blocks', JSON.stringify(list));
      return list;
    });
  };

  // Actions for prayer blocks
  const handleTogglePrayBlock = (blockId: string) => {
    const targetBlock = blocks.find((b) => b.id === blockId);
    const currentlyPrayed = !!targetBlock?.hasPrayed;

    setBlocks((prev) => {
      const updated = prev.map((b) => {
        if (b.id === blockId) {
          const hasPrayed = !b.hasPrayed;
          const prayedCount = hasPrayed ? b.prayedCount + 1 : Math.max(0, b.prayedCount - 1);
          return { ...b, hasPrayed, prayedCount };
        }
        return b;
      });
      localStorage.setItem('mmmturquia_blocks', JSON.stringify(updated));
      return updated;
    });

    // Firestore counter & user bloquesOrados sync
    if (currentUser?.uid && targetBlock) {
      toggleOrarBloqueFirestore(blockId, targetBlock.title, currentUser.uid, currentlyPrayed);
    }
  };

  const handleToggleSaveBlock = (block: PrayerBlock) => {
    const newIsSaved = !block.isSaved;

    setBlocks((prev) => {
      const updated = prev.map((b) => (b.id === block.id ? { ...b, isSaved: newIsSaved } : b));
      localStorage.setItem('mmmturquia_blocks', JSON.stringify(updated));
      return updated;
    });

    if (newIsSaved) {
      const newEntry: DailyPrayerEntry = {
        id: `entry-${block.id}-${Date.now()}`,
        title: `${block.title} (Bloque ${block.number})`,
        scripture: block.scriptureRef,
        category: 'guardado',
        blockId: block.id,
        blockNumber: block.number,
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        notes: block.context,
        items: block.items.map((it, idx) => ({
          id: `motive-${block.id}-${idx}-${Date.now()}`,
          title: it.title,
          description: it.description,
          isAnswered: false,
          responseComments: []
        }))
      };
      setDiaryEntries((prev) => {
        const updated = [newEntry, ...prev];
        localStorage.setItem('mmmturquia_diary', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleAddCommentToBlock = (blockId: string, text: string) => {
    const authorName = `${currentUser?.nombre || 'Intercesor'} (${(currentUser?.rol || 'SEGUIDOR').toUpperCase()})`;
    setBlocks((prev) => {
      const updated = prev.map((b) => {
        if (b.id === blockId) {
          const newComment = {
            id: `comm-${Date.now()}`,
            author: authorName,
            text,
            date: 'Ahora mismo'
          };
          return { ...b, comments: [newComment, ...b.comments] };
        }
        return b;
      });
      localStorage.setItem('mmmturquia_blocks', JSON.stringify(updated));
      return updated;
    });

    // Firestore comments sync (/comentarios_bloques)
    if (currentUser?.uid) {
      const userIglesia = currentUser.iglesia || currentUser.pais || '';
      addBlockCommentFirestore(blockId, currentUser.uid, authorName, userIglesia, text);
    }
  };

  const handleIncrementWeeklyPrayers = () => {
    if (hasPrayedWeekly) return;
    const newTotal = totalWeeklyPrayers + 1;
    setTotalWeeklyPrayers(newTotal);
    setHasPrayedWeekly(true);
    localStorage.setItem('mmmturquia_weekly_prayers', newTotal.toString());
    localStorage.setItem('mmmturquia_has_prayed_weekly', 'true');
  };

  const handleVotePoll = (optionId: number) => {
    setPoll((prev) => {
      const updatedOptions = prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      );
      const updated = {
        ...prev,
        options: updatedOptions,
        totalVotes: prev.totalVotes + 1,
        userVotedOptionId: optionId
      };
      localStorage.setItem('mmmturquia_poll', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSendChatMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: currentUser?.uid || 'guest',
      userName: currentUser?.nombre || 'Hermano Creyente',
      role: `${(currentUser?.rol || 'SEGUIDOR').toUpperCase()}`,
      content: text,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      avatar: (currentUser?.nombre || 'HC').slice(0, 2).toUpperCase()
    };
    setChatMessages((prev) => {
      const updated = [...prev, newMsg];
      localStorage.setItem('mmmturquia_chat', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddDiaryEntry = (entry: Omit<DailyPrayerEntry, 'id'>) => {
    const newEntry: DailyPrayerEntry = {
      ...entry,
      id: `diary-${Date.now()}`
    };
    setDiaryEntries((prev) => {
      const updated = [newEntry, ...prev];
      localStorage.setItem('mmmturquia_diary', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteDiaryEntry = (id: string) => {
    setDiaryEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      localStorage.setItem('mmmturquia_diary', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleMotiveAnswered = (entryId: string, motiveId: string) => {
    setDiaryEntries((prev) => {
      const updated = prev.map((entry) => {
        if (entry.id !== entryId) return entry;
        const updatedItems = (entry.items || []).map((motive) => {
          if (motive.id !== motiveId) return motive;
          const nextState = !motive.isAnswered;
          return {
            ...motive,
            isAnswered: nextState,
            answeredDate: nextState ? new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : undefined
          };
        });
        const hasAnyAnswered = updatedItems.some((m) => m.isAnswered);
        return {
          ...entry,
          items: updatedItems,
          isAnswered: hasAnyAnswered || entry.isAnswered
        };
      });
      localStorage.setItem('mmmturquia_diary', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleEntryAnswered = (entryId: string) => {
    setDiaryEntries((prev) => {
      const updated = prev.map((entry) => {
        if (entry.id !== entryId) return entry;
        const nextAnswered = !entry.isAnswered;
        return {
          ...entry,
          isAnswered: nextAnswered,
          answeredDate: nextAnswered ? new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : undefined,
          category: nextAnswered && entry.category === 'propio' ? 'contestado' : entry.category
        };
      });
      localStorage.setItem('mmmturquia_diary', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddResponseComment = (entryId: string, motiveId: string | undefined, text: string) => {
    if (!text.trim()) return;
    const authorName = currentUser?.nombre
      ? `${currentUser.nombre} (${(currentUser.rol || 'SEGUIDOR').toUpperCase()})`
      : 'Intercesor en Turquía';

    const newComment: PrayerResponseComment = {
      id: `resp-${Date.now()}`,
      author: authorName,
      text: text.trim(),
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    };

    setDiaryEntries((prev) => {
      const updated = prev.map((entry) => {
        if (entry.id !== entryId) return entry;
        if (motiveId) {
          const updatedItems = (entry.items || []).map((motive) => {
            if (motive.id !== motiveId) return motive;
            return {
              ...motive,
              isAnswered: true,
              answeredDate: motive.answeredDate || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
              responseComments: [...(motive.responseComments || []), newComment]
            };
          });
          return {
            ...entry,
            isAnswered: true,
            items: updatedItems
          };
        } else {
          return {
            ...entry,
            isAnswered: true,
            answeredDate: entry.answeredDate || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
            responseComments: [...(entry.responseComments || []), newComment]
          };
        }
      });
      localStorage.setItem('mmmturquia_diary', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogout = async (redirectTab?: NavTab) => {
    try {
      await logoutFirebase();
    } catch (err) {
      console.warn('Firebase logout notice:', err);
    }
    setCurrentUser(null);
    localStorage.removeItem('mmmturquia_current_user');
    if (redirectTab) {
      setCurrentTab(redirectTab);
    } else if (currentTab === 'admin' || currentTab === 'home') {
      setCurrentTab('portal');
    }
    // If on perfil, stays on perfil so the Google Login screen is shown immediately
  };

  const handleQuickLoginPastor = () => {
    const pastorProfile: UserProfile = {
      uid: 'user-pastor-admin',
      nombre: 'Pastor Ricardo',
      apellido: 'Vicente Tapia',
      email: 'rvicentetapia@gmail.com',
      whatsapp: '+51 938 204 456',
      pais: 'Turquía',
      iglesia: 'MMM Estambul',
      rol: 'admin',
      aprobado: true,
      fechaRegistro: '01 Ene 2026'
    };
    setCurrentUser(pastorProfile);
    localStorage.setItem('mmmturquia_current_user', JSON.stringify(pastorProfile));
  };

  const prayedBlocksCount = blocks.filter((b) => b.hasPrayed).length;
  const savedEntriesCount = diaryEntries.length;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-[#070d19] text-slate-100' : 'bg-slate-100 text-slate-900'} antialiased selection:bg-[#0e9594]/30 selection:text-white transition-colors duration-200`}>
      {/* Background Audio Stream Player */}
      <audio
        ref={audioRef}
        preload="none"
        src="https://stream.zeno.fm/f3wvbbqmdg8uv"
        onPlay={() => setIsPlayingRadio(true)}
        onPause={() => setIsPlayingRadio(false)}
      />

      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        lang={lang}
        onLangChange={handleLangChange}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        savedCount={savedEntriesCount}
        userRole={currentUser?.rol || 'seguidor'}
        isUserApproved={currentUser?.aprobado || false}
        isPlayingRadio={isPlayingRadio}
        onToggleRadio={handleToggleRadio}
      />

      {/* Main Container Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: PORTAL DE RAÍZ / HOME & RADIO 24/7 (Limpio, enfocado en Radio y Misión) */}
        {currentTab === 'portal' && (
          <RootHomeView
            lang={lang}
            onNavigateTab={setCurrentTab}
            isPlayingRadio={isPlayingRadio}
            onToggleRadio={handleToggleRadio}
          />
        )}

        {/* TAB 2: RADIO ESPERANZA 24/7 (Consola Completa, Guía de Programación y Fonoteca a la carta) */}
        {currentTab === 'radio' && (
          <RadioView
            lang={lang}
            isPlayingRadio={isPlayingRadio}
            onToggleRadio={handleToggleRadio}
            onNavigateTab={setCurrentTab}
          />
        )}

        {/* TAB: STREAMING MMM PLAY (Estilo Prime Video / Netflix) */}
        {currentTab === 'streaming' && (
          <StreamingView onNavigateTab={setCurrentTab} />
        )}

        {/* TAB 3: INTRANET DASHBOARD (homeintranet - Protegido para Intercesores/Admins) */}
        {currentTab === 'home' && (
          <IntranetDashboard
            events={INITIAL_CALENDAR_EVENTS}
            poll={poll}
            projects={INITIAL_PROJECTS}
            chatMessages={chatMessages}
            birthdays={INITIAL_BIRTHDAYS}
            onlineIntercessors={INITIAL_ONLINE_INTERCESSORS}
            lang={lang}
            onNavigateTab={setCurrentTab}
            onVotePoll={handleVotePoll}
            onSendChatMessage={handleSendChatMessage}
          />
        )}

        {/* TAB 3: BOLETÍN DE ORACIÓN (9 BLOQUES COMPLETOS) */}
        {currentTab === 'boletin' && (
          <BoletinView
            blocks={blocks}
            lang={lang}
            totalWeeklyPrayers={totalWeeklyPrayers}
            hasPrayedWeekly={hasPrayedWeekly}
            onIncrementWeeklyPrayers={handleIncrementWeeklyPrayers}
            onTogglePrayBlock={handleTogglePrayBlock}
            onToggleSaveBlock={handleToggleSaveBlock}
            onAddCommentToBlock={handleAddCommentToBlock}
          />
        )}

        {/* TAB 4: DIARIO DE ORACIÓN */}
        {currentTab === 'diario' && (
          <DiarioView
            entries={diaryEntries}
            lang={lang}
            blocks={blocks}
            currentUser={currentUser}
            onAddEntry={handleAddDiaryEntry}
            onDeleteEntry={handleDeleteDiaryEntry}
            onToggleMotiveAnswered={handleToggleMotiveAnswered}
            onToggleEntryAnswered={handleToggleEntryAnswered}
            onAddResponseComment={handleAddResponseComment}
          />
        )}

        {/* TAB 5: EXPEDICIONES MISIONERAS */}
        {currentTab === 'expediciones' && (
          <ExpedicionesView projects={INITIAL_PROJECTS} />
        )}

        {/* TAB 6: PROGRAMA RAMADÁN 2026 */}
        {currentTab === 'ramadan' && (
          <RamadanView />
        )}

        {/* TAB 7: PERFIL DEL USUARIO / REGISTRO & SELECCIÓN DE ROL */}
        {currentTab === 'perfil' && (
          <PerfilView
            currentUser={currentUser}
            prayedBlocksCount={prayedBlocksCount}
            savedEntriesCount={savedEntriesCount}
            onNavigateTab={setCurrentTab}
            onLoginWithGoogle={handleLoginWithGoogle}
            onQuickLoginPastor={handleQuickLoginPastor}
            onRegisterUser={handleRegisterUser}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
          />
        )}

        {/* TAB 8: PANEL PASTORAL DE ADMINISTRACIÓN */}
        {currentTab === 'admin' && (
          <AdminPanel
            users={allUsers}
            blocks={blocks}
            onApproveUser={handleApproveUser}
            onUpdateBlock={handleUpdateBlock}
            onNavigateTab={setCurrentTab}
          />
        )}
      </main>

      {/* Floating Pastoral Chat Widget (WhatsApp connection) */}
      <PastoralChatWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
}
