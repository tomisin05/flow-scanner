import { createDocument, getDocument, updateDocument, queryDocuments } from './db-operations';
import { UnauthorizedError } from './errors';
import { validateTournamentData } from './validation';

export async function createTournament(tournamentData, userId) {
  try {
    validateTournamentData(tournamentData);
    
    const tournament = {
      ...tournamentData,
      flows: [],
      participants: [userId],
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return await createDocument('tournaments', tournament);
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
    
    // Check authorization
    if (!tournament.participants.includes(userId)) {
      throw new UnauthorizedError('User is not a participant in this tournament');
    }

    // Avoid duplicate flows
    if (tournament.flows.includes(flowId)) {
      return true;
    }

    const flows = [...tournament.flows, flowId];
    await updateDocument('tournaments', tournamentId, { flows });
    return true;
  } catch (error) {
    console.error('Error adding flow to tournament:', error);
    throw error;
  }
}

export async function removeFlowFromTournament(tournamentId, flowId, userId) {
  try {
    const tournament = await getDocument('tournaments', tournamentId);
    
    // Check authorization
    if (!tournament.participants.includes(userId)) {
      throw new UnauthorizedError('User is not a participant in this tournament');
    }

    const flows = tournament.flows.filter(id => id !== flowId);
    
    await updateDocument('tournaments', tournamentId, { flows });
    return true;
  } catch (error) {
    console.error('Error removing flow from tournament:', error);
    throw error;
  }
}

export async function updateTournament(tournamentId, updates, userId) {
  try {
    const tournament = await getDocument('tournaments', tournamentId);
    
    // Check authorization
    if (tournament.createdBy !== userId) {
      throw new UnauthorizedError('Only the tournament creator can update tournament details');
    }

    await updateDocument('tournaments', tournamentId, {
      ...updates,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating tournament:', error);
    throw error;
  }
}