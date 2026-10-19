import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { UserProfile, UserRole } from './types';

// Configuración oficial de Firebase del proyecto del usuario (rvicentetapia@gmail.com)
export const firebaseConfig = {
  apiKey: "AIzaSyBeuFR_MvuAWKan95TEhKvyap51n189tcM",
  authDomain: "intranet-movilizacion-turquia.firebaseapp.com",
  databaseURL: "https://intranet-movilizacion-turquia-default-rtdb.firebaseio.com",
  projectId: "intranet-movilizacion-turquia",
  storageBucket: "intranet-movilizacion-turquia.firebasestorage.app",
  messagingSenderId: "633633525264",
  appId: "1:633633525264:web:93010e98058338f3580495",
  measurementId: "G-YGP7LN395C"
};

// Inicialización de la app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Procesar retorno de Google Auth en navegadores móviles si usó redirección
getRedirectResult(auth).catch(() => {});

export { onAuthStateChanged };
export type { User };

export const db = getFirestore(app);

export const ADMIN_EMAIL = 'rvicentetapia@gmail.com';

export function isPastorAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Asegurar perfil automático del Pastor Administrador sin formularios de registro
 */
export async function ensurePastorAdminProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'usuarios', user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data() as UserProfile;
    if (data.rol !== 'admin' || !data.aprobado) {
      await updateDoc(userRef, { rol: 'admin', aprobado: true });
      return { ...data, rol: 'admin', aprobado: true };
    }
    return data;
  }

  const pastorData: UserProfile = {
    uid: user.uid,
    nombre: user.displayName?.split(' ')[0] || 'Pastor Ricardo',
    apellido: user.displayName?.split(' ').slice(1).join(' ') || 'Vicente Tapia',
    email: ADMIN_EMAIL,
    whatsapp: '+51 938 204 456',
    pais: 'Turquía',
    iglesia: 'MMM Estambul',
    rol: 'admin',
    aprobado: true,
    fechaRegistro: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  await setDoc(userRef, {
    ...pastorData,
    foto: user.photoURL || '',
    aprobado: true,
    fechaRegistro: new Date()
  });

  return pastorData;
}

/**
 * Autenticación con Google (Soporta Popup y Fallback a Redirect para celulares)
 */
export async function loginWithGoogleFirebase(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/operation-not-supported-in-this-environment') {
      await signInWithRedirect(auth, googleProvider);
      throw new Error('Redirigiendo a inicio de sesión con Google...');
    }
    throw err;
  }
}

export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

/**
 * Verificar y registrar usuario en Firestore
 */
export async function getUserFirestoreProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'usuarios', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (e) {
    console.warn('Error obteniendo perfil de Firestore:', e);
    return null;
  }
}

/**
 * Guardar ficha de registro inicial y enviar aviso FormSubmit a rvicentetapia@gmail.com
 */
export async function registerUserProfileFirestore(
  user: User, 
  datos: {
    nombre: string;
    apellido: string;
    whatsapp: string;
    pais: string;
    iglesia: string;
    rol: UserRole;
  }
): Promise<UserProfile> {
  const cleanEmail = (user.email || '').toLowerCase().trim();
  const isAdmin = isPastorAdmin(cleanEmail);
  const isSeguidor = datos.rol === 'seguidor';
  // Si es Pastor o Seguidor, aprobado = true. Si es Intercesor, aprobado = false hasta revisión pastoral.
  const isApproved = isAdmin || isSeguidor;

  const perfil: UserProfile = {
    uid: user.uid,
    nombre: datos.nombre.trim(),
    apellido: datos.apellido.trim(),
    email: cleanEmail,
    whatsapp: datos.whatsapp.trim(),
    pais: datos.pais.trim(),
    iglesia: datos.iglesia.trim(),
    rol: isAdmin ? 'admin' : datos.rol,
    aprobado: isApproved,
    solicitud: isApproved ? undefined : 'intercesor',
    fechaRegistro: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  // Guardar en colección usuarios
  await setDoc(doc(db, 'usuarios', user.uid), {
    ...perfil,
    foto: user.photoURL || '',
    aprobado: isApproved,
    fechaRegistro: new Date()
  });

  // Notificación automática al pastor si es intercesor en espera
  if (!isApproved) {
    try {
      await fetch("https://formsubmit.co/ajax/rvicentetapia@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `🔔 Nuevo Intercesor Registrado: ${perfil.nombre} ${perfil.apellido || ''} (${perfil.pais})`,
          Nombre: perfil.nombre,
          Apellido: perfil.apellido,
          Telefono_WhatsApp: perfil.whatsapp,
          Pais: perfil.pais,
          Iglesia: perfil.iglesia,
          Correo_Google: perfil.email,
          Rol_Solicitado: perfil.rol,
          Accion: "Para autorizarlo, ingresa a la Intranet > Panel Admin o Firebase > Firestore y marca 'aprobado' como true."
        })
      });
    } catch (postErr) {
      console.warn("Aviso FormSubmit error (ignorable):", postErr);
    }
  }

  return perfil;
}

/**
 * Actualizar datos del perfil
 */
export async function updateProfileInFirestore(uid: string, datos: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'usuarios', uid);
  const payload = { ...datos };
  delete (payload as any).uid;
  // Solo admin puede modificar 'aprobado' directamente
  await updateDoc(userRef, payload);
}

/**
 * Escuchar cambios en el documento del usuario en tiempo real (para la sala de espera y perfil)
 */
export function listenUserProfileFirestore(uid: string, onUpdate: (profile: UserProfile) => void) {
  const userRef = doc(db, 'usuarios', uid);
  return onSnapshot(userRef, (snap) => {
    if (snap.exists()) {
      onUpdate(snap.data() as UserProfile);
    }
  });
}

/**
 * Escuchar todos los usuarios (para el AdminPanel pastoral)
 */
export function subscribeToAllUsersFirestore(callback: (users: UserProfile[]) => void) {
  const usersCol = collection(db, 'usuarios');
  return onSnapshot(usersCol, (snapshot) => {
    const list: UserProfile[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as UserProfile);
    });
    callback(list);
  }, (err) => {
    console.warn("Aviso usuarios Firestore:", err);
  });
}

/**
 * Aprobación pastoral de un intercesor
 */
export async function approveUserRoleFirestore(uid: string, targetRole: UserRole, state: boolean): Promise<void> {
  const userRef = doc(db, 'usuarios', uid);
  await updateDoc(userRef, {
    rol: targetRole,
    aprobado: state
  });
}

/**
 * Contadores de oración en tiempo real (/contadores_bloques/{bloqueId})
 */
export async function toggleOrarBloqueFirestore(bloqueId: string, titulo: string, uid: string, currentlyPrayed: boolean): Promise<void> {
  try {
    const userRef = doc(db, 'usuarios', uid);
    const countRef = doc(db, 'contadores_bloques', bloqueId);
    const item = { id: bloqueId, titulo };

    if (currentlyPrayed) {
      await updateDoc(userRef, {
        bloquesOrados: arrayRemove(item),
        misOracionesCount: increment(-1)
      });
      await setDoc(countRef, { total: increment(-1) }, { merge: true });
    } else {
      await updateDoc(userRef, {
        bloquesOrados: arrayUnion(item),
        misOracionesCount: increment(1)
      });
      await setDoc(countRef, { total: increment(1), titulo }, { merge: true });
    }
  } catch (err) {
    console.warn("Aviso Firestore contador bloque:", err);
  }
}

/**
 * Enviar comentario a un bloque en Firestore
 */
export async function addBlockCommentFirestore(
  bloqueId: string, 
  uid: string, 
  autorNombre: string, 
  autorIglesia: string, 
  texto: string
): Promise<void> {
  await addDoc(collection(db, "comentarios_bloques"), {
    bloqueId,
    uid,
    autorNombre,
    autorIglesia,
    texto,
    fecha: new Date(),
    fechaTexto: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  });
}

/**
 * Escuchar comentarios de un bloque en tiempo real (/comentarios_bloques)
 */
export function listenBlockCommentsFirestore(bloqueId: string, callback: (comments: any[]) => void) {
  const q = query(
    collection(db, "comentarios_bloques"),
    where("bloqueId", "==", bloqueId)
  );
  return onSnapshot(q, (snapshot) => {
    const list: any[] = [];
    snapshot.forEach((d) => {
      list.push(d.data());
    });
    callback(list);
  }, (err) => {
    console.warn("Aviso comentarios bloque Firestore:", err);
  });
}
