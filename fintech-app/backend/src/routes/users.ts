import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { userProfileSchema } from '../validation/schemas.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update user profile
router.put('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const data = userProfileSchema.parse(req.body);

    const profile = await prisma.userProfile.upsert({
      where: { userId: req.user!.id },
      update: data,
      create: {
        userId: req.user!.id,
        ...data,
      },
    });

    res.json(profile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
