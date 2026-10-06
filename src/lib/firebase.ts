import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  deleteDoc,
  getDocFromServer
} from 'firebase/firestore';
import { UserProfile } from '../types';
import appletConfig from '../../firebase-applet-config.json';

// Use provisioned credentials from firebase-applet-config.json
const firebaseConfig = {
  apiKey: appletConfig.apiKey || (import.meta as any).env?.VITE_FIREBASE_API_KEY,
  authDomain: appletConfig.authDomain || (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: appletConfig.projectId || (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: appletConfig.storageBucket || (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: appletConfig.messagingSenderId || (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: appletConfig.appId || (import.meta as any).env?.VITE_FIREBASE_APP_ID
};

let app: any = null;
let auth: any = null;
let db: any = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  // Attach directly to the provisioned Firestore database instance
  db = appletConfig.firestoreDatabaseId
    ? getFirestore(app, appletConfig.firestoreDatabaseId)
    : getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization notice:', error);
}

// Validate connection to Firestore on initial boot as required by system standards
export async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Connected to Firebase Firestore database successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice. Please check network connection.');
    }
  }
}

// Run connection verification asynchronously
testConnection();

export { app, auth, db };

// Local Storage Cache Layer for instant offline rendering & seamless fallback
const STORAGE_PREFIX = 'edugenius_';

export const localStore = {
  get: <T>(key: string, defaultVal: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {}
  }
};

// Asynchronous Firestore Sync Layer for real cloud persistence
export const firestoreSync = {
  // Sync user profile to Firestore
  saveUser: async (profile: UserProfile): Promise<void> => {
    if (!db || !profile.uid) return;
    try {
      await setDoc(doc(db, 'users', profile.uid), {
        ...profile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore saveUser synced to localStore:', err);
    }
  },

  // Save quiz result
  saveQuizResult: async (userId: string, quizResult: any): Promise<void> => {
    if (!db || !userId || !quizResult.id) return;
    try {
      await setDoc(doc(db, 'users', userId, 'quizResults', quizResult.id), quizResult, { merge: true });
    } catch (err) {
      console.warn('Firestore saveQuizResult synced to localStore:', err);
    }
  },

  // Save homework scan
  saveScan: async (userId: string, scan: any): Promise<void> => {
    if (!db || !userId || !scan.id) return;
    try {
      await setDoc(doc(db, 'users', userId, 'homeworkScans', scan.id), scan, { merge: true });
    } catch (err) {
      console.warn('Firestore saveScan synced to localStore:', err);
    }
  },

  // Save mistake record
  saveMistake: async (userId: string, mistake: any): Promise<void> => {
    if (!db || !userId || !mistake.id) return;
    try {
      await setDoc(doc(db, 'users', userId, 'mistakes', mistake.id), mistake, { merge: true });
    } catch (err) {
      console.warn('Firestore saveMistake synced to localStore:', err);
    }
  },

  // Save leaderboard entry
  saveLeaderboardEntry: async (entry: any): Promise<void> => {
    if (!db || !entry.id) return;
    try {
      await setDoc(doc(db, 'leaderboard', entry.id), {
        ...entry,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore saveLeaderboardEntry synced to localStore:', err);
    }
  }
};
