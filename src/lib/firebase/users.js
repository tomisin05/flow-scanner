import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { getDocument, updateDocument } from './db-operations';
import { validateUserData, validateProfileUpdates } from './validation';

export async function createUserDocument(user) {
  validateUserData(user);
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const userData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
        updatedAt: new Date(),
        totalFlows: 0,
        treesSpared: 0,
        tournaments: []
      };
      
      await setDoc(userRef, userData);
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

export async function updateUserStats(userId, pageCount) {
  try {
    const user = await getDocument('users', userId);
    await updateDocument('users', userId, {
      totalFlows: (user.totalFlows || 0) + 1,
      treesSpared: (user.treesSpared || 0) + (pageCount * 0.0001) // Approximate paper saved
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}

export async function getUserProfile(userId) {
  try {
    return await getDocument('users', userId);
  } catch (error) {
    if (error.message.includes('Document not found')) {
      return null;
    }
    console.error('Error getting user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId, updates) {
  try {
    validateProfileUpdates(updates);
    await updateDocument('users', userId, updates);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}