import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { incomeSchema } from '../validation/schemas.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get all income sources
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const incomes = await prisma.income.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(incomes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create income source
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = incomeSchema.parse(req.body);

    const income = await prisma.income.create({
      data: {
        userId: req.user!.id,
        ...data,
      },
    });

    res.status(201).json(income);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update income
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const data = incomeSchema.parse(req.body);

    const income = await prisma.income.update({
      where: { id: req.params.id },
      data,
    });

    res.json(income);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete income
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.income.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
