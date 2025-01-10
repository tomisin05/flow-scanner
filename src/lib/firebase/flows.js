import { uploadFileToStorage, deleteFileFromStorage } from './storage-utils';
import { createDocument, getDocument, updateDocument, deleteDocument, queryDocuments } from './db-operations';
import { updateUserStats } from './users';
import { UnauthorizedError } from './errors';
import { validateFlowMetadata, validateFlowData, validateFlowUpdates } from './validation';
import { createUserDocument } from './users';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './config';
export async function uploadFlow(file, metadata, userId) {
  try {
    validateFlowMetadata(metadata);
    // Upload file to Storage
    const storagePath = `flows/${userId}/${file.name}`;
    const downloadURL = await uploadFileToStorage(file, storagePath);

    // Create flow document
    const flowData = {
        userId,
        fileName: file.name,
        fileUrl: downloadURL,
        title: metadata.title || file.name,
        tournament: {
          name: metadata.tournament || null,
          date: metadata.tournamentDate || null,
        },
        round: metadata.round || null,
        team: metadata.team || null,
        tags: Array.isArray(metadata.tags) ? metadata.tags : [], // Ensure tags is an array
        judge: metadata.judge || null,
        division: metadata.division || null,
        pageCount: metadata.pageCount || 1,
        fileSize: file.size,
        createdAt: new Date(),
        updatedAt: new Date(),
        searchableText: createSearchableText(metadata), // For text search
        status: 'active'
      };

    // Add flow document
    const result = await createDocument('flows', flowData);

    // First check if user exists
    const userExists = await checkUserExists(userId);
    
    if (!userExists) {
      // Create user document if it doesn't exist
      await createUserDocument(userId);
    }

    // Update user statistics
    await updateUserStats(userId, flowData.pageCount);

    return result;
  } catch (error) {
    console.error('Error uploading flow:', error);
    throw error;
  }
}
  
  // Helper function to create searchable text
  function createSearchableText(metadata) {
    return [
      metadata.title,
      metadata.tournament,
      metadata.round,
      metadata.team,
      metadata.judge,
      metadata.division,
      ...(metadata.tags || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }
  

async function checkUserExists(userId) {
    try {
      await getDocument('users', userId);
      return true;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return false;
      }
      throw error;
    }
  }

export async function getUserFlows(userId, filters = {}) {
  try {
    const conditions = [
      { field: 'userId', operator: '==', value: userId },
      { field: 'status', operator: '==', value: 'active' } // Only get active flows
    ];

    // Add filter conditions
    if (filters) {
        if (filters.tournament?.trim()) {
          conditions.push({ field: 'tournament', operator: '==', value: filters.tournament });
        }
        if (filters.round?.trim()) {
          conditions.push({ field: 'round', operator: '==', value: filters.round });
        }
        if (filters.team?.trim()) {
          conditions.push({ field: 'team', operator: '==', value: filters.team });
        }
        if (filters.judge?.trim()) {
          conditions.push({ field: 'judge', operator: '==', value: filters.judge });
        }
        if (filters.division?.trim()) {
          conditions.push({ field: 'division', operator: '==', value: filters.division });
        }
        if (filters.tags && filters.tags.length > 0) {
          conditions.push({ field: 'tags', operator: 'array-contains-any', value: filters.tags });
        }
        if (filters.startDate) {
          conditions.push({ field: 'createdAt',  operator: '>=', value: new Date(filters.startDate) });
        }
        if (filters.endDate) {
          conditions.push({ 
            field: 'createdAt', operator: '<=',  value: new Date(filters.endDate + 'T23:59:59')});
        }
      }
    const sortOptions = { field: 'createdAt', direction: 'desc' };
        
    return await queryDocuments('flows', conditions, sortOptions);
  } catch (error) {
    console.error('Error getting user flows:', error);
    throw error;
  }
}

export async function deleteFlow(flowId, userId) {
  try {
    // Get the flow document first
    const flow = await getDocument('flows', flowId);
    
    if (flow.userId !== userId) {
      throw new UnauthorizedError('User is not authorized to delete this flow');
    }

    // Delete from storage
    await deleteFileFromStorage(`flows/${userId}/${flow.fileName}`);
    
    // Delete the document
    await deleteDocument('flows', flowId);

    return true;
  } catch (error) {
    console.error('Error deleting flow:', error);
    throw error;
  }
}

export async function updateFlow(flowId, userId, updates) {
  try {
    const flow = await getDocument('flows', flowId);
    
    if (flow.userId !== userId) {
      throw new UnauthorizedError('User is not authorized to modify this flow');
    }

    validateFlowUpdates(updates);
    await updateDocument('flows', flowId, updates);

    return true;
  } catch (error) {
    console.error('Error updating flow:', error);
    throw error;
  }
}

// src/lib/firebase/flows.js

export async function getFilteredFlows(userId, filters) {
  try {
    let q = query(
      collection(db, 'flows'),
      where('userId', '==', userId)
    );

    // Add filters based on provided criteria
    if (filters.tournament) {
      q = query(q, where('tournament', '==', filters.tournament));
    }

    if (filters.round) {
      q = query(q, where('round', '==', filters.round));
    }

    if (filters.team) {
      q = query(q, where('team', '==', filters.team));
    }

    if (filters.division) {
      q = query(q, where('division', '==', filters.division));
    }

    if (filters.tags && filters.tags.length > 0) {
      // Note: You can only use one array-contains clause per query
      q = query(q, where('tags', 'array-contains-any', filters.tags));
    }

    // Date range filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      q = query(q, where('createdAt', '>=', startDate));
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of the day
      q = query(q, where('createdAt', '<=', endDate));
    }

    // Always sort by createdAt in descending order
    q = query(q, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting filtered flows:', error);
    throw error;
  }
}
 