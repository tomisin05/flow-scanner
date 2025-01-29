import { collection, addDoc, getDoc, updateDoc, doc, deleteDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from './config';
import { use } from 'react';

export const uploadRFD = async (rfdData, userId) => {
    if (!userId) {
        throw new Error('User ID is required');
      }

    try {

    const timestamp = new Date().toISOString();
    const newRFD = {
      ...rfdData,
      userId: userId,
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
export const getRFDs = async (filters = {}, userId) => {
    if (!userId) {
      throw new Error('User ID is required');
    }

   try {
    let q = query(
      collection(db, 'rfds'),
      where('userId', '==', userId),
    );
    
    // Apply filters
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

    q = query(q, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    let rfds = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));


    if (filters.tournament?.trim()) {
        const tournamentSearch = filters.tournament.trim().toLowerCase();
        rfds = rfds.filter(rfd =>
            rfd.tournament?.toLowerCase().includes(tournamentSearch)
        );
    }

    if (filters.team?.trim()) {
        const teamSearch = filters.team.trim().toLowerCase();
        rfds = rfds.filter(rfd =>
            rfd.team?.toLowerCase().includes(teamSearch)
        );
    }

    if (filters.judge?.trim()) {
        const judgeSearch = filters.judge.trim().toLowerCase();
        rfds = rfds.filter(rfd =>
            rfd.judge?.toLowerCase().includes(judgeSearch)
        );
    }

    return rfds
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
      ...updatedData,
      updatedAt: timestamp
    };
    
    const rfdRef = doc(db, 'rfds', rfdId);
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

// src/lib/firebase/rfd.js
export const deleteRFD = async (rfdId, userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const rfdRef = doc(db, 'rfds', rfdId);
    const rfdDoc = await getDoc(rfdRef);

    if (!rfdDoc.exists()) {
      throw new Error('RFD not found');
    }

    // Check if the user owns this RFD
    if (rfdDoc.data().userId !== userId) {
      throw new Error('Unauthorized to delete this RFD');
    }

    await deleteDoc(rfdRef);
    return true;
  } catch (error) {
    console.error('Error deleting RFD:', error);
    throw error;
  }
};


