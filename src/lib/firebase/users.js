import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './config';

export async function createUserDocument(user) {
  const userRef = doc(db, 'users', user.uid);
  
  // Check if user document already exists
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) { 
    const userData = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date(),
      totalFlows: 0,
      treesSpared: 0,
      tournaments: []
    };
    
    await setDoc(userRef, userData);
  }
}

export async function updateUserStats(userId, pageCount) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    totalFlows: increment(1),
    treesSpared: increment(pageCount * 0.0001) // Approximate paper saved
  });
}

export async function getUserProfile(userId) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }
  return null;
}
