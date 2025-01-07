import { Router } from 'express';
import { db, storage } from '../firebase-admin.js';

const router = Router();

// Create a new flow
router.post('/', async (req, res) => {
  try {
    const { userId, title, imageUrl, tags, metadata } = req.body;
    const flowRef = db.collection('flows').doc();
    await flowRef.set({
      userId,
      title,
      imageUrl,
      tags,
      metadata,
      createdAt: new Date()
    });
    res.status(201).json({ id: flowRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get flows for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const flowsSnapshot = await db.collection('flows')
      .where('userId', '==', req.params.userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const flows = flowsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(flows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;