import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,  
  orderBy 
} from 'firebase/firestore';
import { db } from './config';

export async function createTournament(tournamentData) {
  try {
    const tournament = {
      name: tournamentData.name,
      date: new Date(tournamentData.date),
      location: tournamentData.location,
      description: tournamentData.description || '',
      createdBy: tournamentData.userId,
      createdAt: new Date(),
      flows: [],
      participants: [tournamentData.userId]
    };

    const tournamentRef = await addDoc(collection(db, 'tournaments'), tournament);
    return { id: tournamentRef.id, ...tournament };
  } catch (error) {
    console.error('Error creating tournament:', error);
    throw error;
  }
}

export async function getUserTournaments(userId) {
  const q = query(
    collection(db, 'tournaments'),
    where('participants', 'array-contains', userId),
    orderBy('date', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function addFlowToTournament(tournamentId, flowId) {
  const tournamentRef = doc(db, 'tournaments', tournamentId);
  const tournamentSnap = await getDoc(tournamentRef);
  
  if (!tournamentSnap.exists()) {
    throw new Error('Tournament not found');
  }

  const tournament = tournamentSnap.data();
  if (!tournament.flows.includes(flowId)) {
    tournament.flows.push(flowId);
    await tournamentRef.update({ flows: tournament.flows });
  }
}
