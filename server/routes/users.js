import { Router } from 'express';
import { db } from '../firebase-admin.js';

const router = Router();

// Create or update user
router.post('/', async (req, res) => {
  try {
    const { uid, email, name } = req.body;
    const userRef = db.collection('users').doc(uid);
    
    await userRef.set({
      email,
      name,
      stats: {
        sheetsScanned: 0,
        treesPreserved: 0,
        co2Prevented: 0
      }
    }, { merge: true });
    
    res.status(201).json({ id: uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;