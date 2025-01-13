import { createDocument, getDocument, updateDocument, queryDocuments, deleteDocument } from './db-operations';
import { UnauthorizedError } from './errors';
import { validateTournamentData } from './validation';
import { doc, getDoc, deleteDoc, updateDoc  } from 'firebase/firestore';
import { db } from './config';
import { Timestamp } from 'firebase/firestore';


export async function createTournament(tournamentData, userId) {
  try {
    const dateObj = new Date(tournamentData.date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date format');
    }
    validateTournamentData(tournamentData);
    
    const tournament = {
      ...tournamentData,
      date: Timestamp.fromDate(dateObj),
      flows: [],
      participants: [userId],
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const localDate = tournament.date.toDate().toLocaleString(); // Converts to local timezone
console.log('Tournament Date:', localDate);
    
    // return await createDocument('tournaments', tournament);
    const docRef = await addDoc(collection(db, 'tournaments'), tournament);
    return {
      id: docRef.id,
      ...tournament
    };
  } catch (error) {
    console.error('Error creating tournament:', error);
    throw error;
  }
}

export async function getUserTournaments(userId) {
  try {
    const conditions = [
      { field: 'participants', operator: 'array-contains', value: userId }
    ];
    const sortOptions = { field: 'startDate', direction: 'desc' };
    
    return await queryDocuments('tournaments', conditions, sortOptions);
  } catch (error) {
    console.error('Error getting user tournaments:', error);
    throw error;
  }
}

export async function addFlowToTournament(tournamentId, flowId, userId) {
    try {
      const tournament = await getDocument('tournaments', tournamentId);
      
      // Check if flow already exists
      if (!tournament.flows) {
        tournament.flows = [];
      }
      
      if (tournament.flows.includes(flowId)) {
        return true;
      }
  
      // Add flow ID to array
      const flows = [...tournament.flows, flowId];
      
      // Update tournament document with new flows array
      await updateDocument('tournaments', tournamentId, { 
        flows,
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Error adding flow to tournament:', error);
      throw error;
    }
  }
  
  export async function removeFlowFromTournament(tournamentId, flowId, userId) {
    try {
      const tournament = await getDocument('tournaments', tournamentId);
      
      if (!tournament.flows) {
        return true;
      }
  
      // Remove flow ID from array
      const flows = tournament.flows.filter(id => id !== flowId);
      
      // Update tournament document
      await updateDocument('tournaments', tournamentId, { 
        flows,
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Error removing flow from tournament:', error);
      throw error;
    }
  }

export async function updateTournament(tournamentId, updates, userId) {
  try {
    const tournamentRef = doc(db, 'tournaments', tournamentId);
    const tournamentSnap = await getDoc(tournamentRef);

    // Check if tournament exists
    if (!tournamentSnap.exists()) {
      throw new Error('Tournament not found');
    }

    const tournamentData = tournamentSnap.data();


// Convert Firestore Timestamp to a specific timezone
const tournamentDate = tournamentData.date.toDate(); // Get the Date object
const options = {
  timeZone: 'Atlantic/Reykjavik',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
};

const formattedDate = new Intl.DateTimeFormat('en-US', options).format(tournamentDate);
console.log('Tournament Date in NY:', formattedDate);
    // Check authorization
    if (tournamentData.createdBy !== userId) {
      throw new UnauthorizedError('Only the tournament creator can update tournament details');
    }
    console.log('updates', updates)

     // Convert the date string to a Timestamp
    //  const updatedData = {
    //     ...updates,
    //     date: new Date(updates.date),
    //     updatedAt: Timestamp.now()
    //   };

      const updatedData = {
        ...updates,
        date: updates.date instanceof Timestamp 
          ? updates.date
          : Timestamp.fromDate(new Date(updates.date)),
        updatedAt: Timestamp.now()
      };
      console.log("Updated Data:", updatedData);
  
      await updateDoc(tournamentRef, updatedData);
  
    return {
        id: tournamentId,
        ...tournamentData,
        ...updatedData
    }
  } catch (error) {
    console.error('Error updating tournament:', error);
    throw error;
  }
}

export const deleteTournament = async (tournamentId, userId) => {
    try {
      const tournamentRef = doc(db, 'tournaments', tournamentId);
      const tournamentSnap = await getDoc(tournamentRef);
  
      if (!tournamentSnap.exists()) {
        throw new Error('Tournament not found');
      }
  
      // Check if user is the creator
      if (tournamentSnap.data().createdBy !== userId) {
        throw new Error('Unauthorized to delete this tournament');
      }
  
      await deleteDoc(tournamentRef);
    } catch (error) {
      console.error('Error deleting tournament:', error);
      throw error;
    }
  };


// export async function deleteTournament(tournamentId, userId) {
//     try {
//       // Get the flow document first to check authorization and get file URL
//       const tournament = await getDocument('tournament', tournamentId);
      
//       // Check if user owns the flow
//       if (tournament.createdBy !== userId) {
//         throw new UnauthorizedError('Only the owner can delete this flow');
//       }
  
//       // Delete the flow document
//       await deleteDocument('tournament', tournamentId);
//       return true;
//     } catch (error) {
//       console.error('Error deleting flow:', error);
//       throw error;
//     }
//   }
