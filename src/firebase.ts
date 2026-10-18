import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  getDocFromServer,
  increment,
  addDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { UserProfile, UserRole } from './types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore (supporting custom databaseId if configured)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot as recommended by Firebase guideline
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('Firebase Firestore: el cliente está offline o comprobando conectividad.');
    }
  }
}
testConnection();

export const ADMIN_EMAIL = 'rvicentetapia@gmail.com';

export function isPastorAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Autenticación con Google (Exclusiva)
 */
export async function loginWithGoogleFirebase(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (popupError: any) {
    // Si el popup es bloqueado por el iframe o navegador, intentar redirección
    if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/cancelled-popup-request') {
      await signInWithRedirect(auth, googleProvider);
      throw new Error('Redirigiendo a autenticación con Google...');
    }
    throw popupError;
  }
}

export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

/**
 * Sincronizar o crear usuario en Firestore (/usuarios/{userId})
 * Respetando la regla de Administrador (rvicentetapia@gmail.com)
 */
export async function syncUserFirestore(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'usuarios', user.uid);
  const snap = await getDoc(userRef);
  const cleanEmail = (user.email || '').toLowerCase().trim();
  const isAdmin = isPastorAdmin(cleanEmail);

  if (snap.exists()) {
    const data = snap.data() as UserProfile;
    // Si es el Pastor Administrador, asegurar que su rol sea admin y aprobado
    if (isAdmin && (data.rol !== 'admin' || !data.aprobado)) {
      await updateDoc(userRef, { rol: 'admin', aprobado: true });
      return { ...data, rol: 'admin', aprobado: true };
    }
    return data;
  }

  // Usuario nuevo
  const newProfile: UserProfile = {
    uid: user.uid,
    nombre: user.displayName || (isAdmin ? 'Pastor Ricardo Vicente Tapia' : 'Hermano Intercesor'),
    apellido: '',
    email: cleanEmail,
    whatsapp: '',
    pais: '',
    iglesia: '',
    rol: (isAdmin ? 'admin' : 'seguidor') as UserRole,
    aprobado: isAdmin ? true : false,
    fechaRegistro: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  await setDoc(userRef, newProfile);
  return newProfile;
}

/**
 * Actualizar perfil propio de usuario en Firestore
 */
export async function updateUserProfileFirestore(uid: string, data: Partial<UserProfile>, isAdmin = false): Promise<void> {
  const userRef = doc(db, 'usuarios', uid);
  // Las reglas de seguridad impiden que un usuario modifique su propio campo 'aprobado' a menos que sea admin
  const payload = { ...data };
  if (!isAdmin) {
    delete payload.aprobado;
  }
  await updateDoc(userRef, payload);
}

/**
 * Aprobación de rol de un intercesor por el Administrador en Firestore
 */
export async function approveUserRoleFirestore(uid: string, targetRole: UserRole, state: boolean): Promise<void> {
  const userRef = doc(db, 'usuarios', uid);
  await updateDoc(userRef, {
    rol: targetRole,
    aprobado: state
  });
}

/**
 * Escuchar en tiempo real la lista de todos los usuarios para el Admin Panel
 */
export function subscribeToAllUsersFirestore(callback: (users: UserProfile[]) => void, onError?: (err: any) => void) {
  const usersCol = collection(db, 'usuarios');
  return onSnapshot(
    usersCol,
    (snapshot) => {
      const list: UserProfile[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as UserProfile);
      });
      callback(list);
    },
    (err) => {
      console.warn('Firestore usuarios subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Contadores de oración en tiempo real (/contadores_bloques/{bloqueId})
 */
export async function incrementPrayerCounterFirestore(bloqueId: string): Promise<void> {
  try {
    const counterRef = doc(db, 'contadores_bloques', bloqueId);
    await setDoc(counterRef, { count: increment(1) }, { merge: true });
  } catch (err) {
    console.warn('Error incrementing prayer counter in Firestore:', err);
  }
}

/**
 * Comentarios en los bloques del boletín (/comentarios_bloques)
 */
export async function addBlockCommentFirestore(bloqueId: string, author: string, text: string): Promise<void> {
  const col = collection(db, 'comentarios_bloques');
  await addDoc(col, {
    bloqueId,
    author,
    text,
    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now()
  });
}
