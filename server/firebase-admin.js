import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
});

export const db = getFirestore(app);
export const storage = getStorage(app);
