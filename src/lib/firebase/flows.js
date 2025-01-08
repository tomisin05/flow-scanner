import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc,
  updateDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import { updateUserStats } from './users';

export async function uploadFlow(file, metadata, userId) {
  try {
    // Upload file to Storage
    const storageRef = ref(storage, `flows/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Create flow document
    const flowData = {
      userId,
      fileName: file.name,
      fileUrl: downloadURL,
      uploadDate: new Date(),
      title: metadata.title || file.name,
      tournament: metadata.tournament || null,
      round: metadata.round || null,
      team: metadata.team || null,
      tags: metadata.tags || [],
      pageCount: metadata.pageCount || 1,
      fileSize: file.size,
      lastModified: new Date()
    };

    // Add flow document
    const flowRef = await addDoc(collection(db, 'flows'), flowData);

    // Update user statistics
    await updateUserStats(userId, flowData.pageCount);

    return { id: flowRef.id, ...flowData };
  } catch (error) {
    console.error('Error uploading flow:', error);
    throw error;
  }
}

export async function getUserFlows(userId) {
  const q = query(
    collection(db, 'flows'),
    where('userId', '==', userId),
    orderBy('uploadDate', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function deleteFlow(flowId, userId) {
  try {
    const flowRef = doc(db, 'flows', flowId);
    const flowSnap = await getDoc(flowRef);
    
    if (!flowSnap.exists()) {
      throw new Error('Flow not found');
    }
    
    const flowData = flowSnap.data();
    if (flowData.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Delete file from storage
    const storageRef = ref(storage, `flows/${userId}/${flowData.fileName}`);
    await deleteObject(storageRef);

    // Delete flow document
    await deleteDoc(flowRef);

    return true;
  } catch (error) {
    console.error('Error deleting flow:', error);
    throw error;
  }
}

export async function updateFlow(flowId, userId, updates) {
  const flowRef = doc(db, 'flows', flowId);
  const flowSnap = await getDoc(flowRef);
  
  if (!flowSnap.exists()) {
    throw new Error('Flow not found');
  }
  
  if (flowSnap.data().userId !== userId) {
    throw new Error('Unauthorized');
  }

  await updateDoc(flowRef, {
    ...updates,
    lastModified: new Date()
  });
}


// Add to your flows.js
export function validateFlowData(flowData) {
  if (!flowData.title) throw new Error('Title is required');
  if (!flowData.userId) throw new Error('User ID is required');
  if (!flowData.fileUrl) throw new Error('File URL is required');
  return true;
}
