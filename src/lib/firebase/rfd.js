import { collection, addDoc, updateDoc, doc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';

export const uploadRFD = async (rfdData) => {
  try {

    const timestamp = new Date().toISOString();
    const newRFD = {
      ...rfdData,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    // Create RFD document
    const rfdRef = await addDoc(collection(db, 'rfds'), newRFD);

    // // Update the tournament document to include reference to this RFD
    // const tournamentRef = doc(db, 'tournaments', rfdData.tournamentId);
    // await updateDoc(tournamentRef, {
    //   rfds: arrayUnion(rfdRef.id),
    //   updatedAt: new Date().toISOString()
    // });

    return {
        id: rfdRef.id,
        ...newRFD
    }
  } catch (error) {
    console.error('Error uploading RFD:', error);
    throw error;
  }
};

// Read RFDs with filters
export const getRFDs = async (filters) => {
  try {
    let q = collection(db, 'rfds');
    
    // Apply filters
    if (filters.tournament) {
      q = query(q, where('tournamentId', '==', filters.tournament));
    }
    if (filters.team) {
      q = query(q, where('team', '==', filters.team));
    }
    if (filters.judge) {
      q = query(q, where('judge', '==', filters.judge));
    }
    if (filters.result) {
      q = query(q, where('result', '==', filters.result));
    }
    if (filters.round) {
      q = query(q, where('round', '==', filters.round));
    }
    if (filters.dateFrom) {
      q = query(q, where('createdAt', '>=', filters.dateFrom));
    }
    if (filters.dateTo) {
      q = query(q, where('createdAt', '<=', filters.dateTo));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching RFDs:', error);
    throw error;
  }
};


// Update RFD
export const updateRFD = async (rfdId, updatedData) => {
  try {
    // const rfdRef = doc(db, 'rfds', rfdId);
    // await updateDoc(rfdRef, {
    //   ...updatedData,
    //   updatedAt: new Date().toISOString()
    // });
    // return rfdId;

    const timestamp = new Date().toISOString();
    const updatedRFD = {
      ...rfdData,
      updatedAt: timestamp
    };
    
    const rfdRef = doc(db, 'rfds', id);
    await updateDoc(rfdRef, updatedRFD);
    
    // Return the complete updated RFD object
    return {
      id,
      ...updatedRFD
    };
  } catch (error) {
    console.error('Error updating RFD:', error);
    throw error;
  }
};

// Delete RFD
export const deleteRFD = async (rfdId) => {
  try {
    await deleteDoc(doc(db, 'rfds', rfdId));
    return true;
  } catch (error) {
    console.error('Error deleting RFD:', error);
    throw error;
  }
};

