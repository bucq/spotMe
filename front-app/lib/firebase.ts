import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCzqSiIbgwVJwzglgMkucQ0aDGFLAddJw8",
  authDomain: "spotme-30dff.firebaseapp.com",
  projectId: "spotme-30dff",
  storageBucket: "spotme-30dff.firebasestorage.app",
  messagingSenderId: "926709473225",
  appId: "1:926709473225:web:66b60d374ce38b3d759218",
  measurementId: "G-0X1DR44K0K"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
const auth = getAuth(app);

// Authentication functions
export const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }

    return { user: userCredential.user, error: null };
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return { user: null, error: 'このメールアドレスは既に使用されています' };
    }
    return { user: null, error: error.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: 'ログイン情報が正しくありません' };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export { auth };
export type { User };
