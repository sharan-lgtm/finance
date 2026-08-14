import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { transactionSchema } from '../validation/schemas.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get transactions
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, categoryId } = req.query;

    const where: any = { userId: req.user!.id };

    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate.gte = new Date(startDate as string);
      if (endDate) where.transactionDate.lte = new Date(endDate as string);
    }

    if (categoryId) where.categoryId = categoryId;

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { transactionDate: 'desc' },
    });

    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create transaction
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = transactionSchema.parse(req.body);

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user!.id,
        ...data,
        transactionDate: new Date(data.transactionDate),
      },
      include: { category: true },
    });

    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update transaction
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const data = transactionSchema.parse(req.body);

    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: {
        ...data,
        transactionDate: new Date(data.transactionDate),
      },
      include: { category: true },
    });

    res.json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete transaction
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.transaction.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get monthly summary
router.get('/summary/monthly', async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user!.id },
      include: { category: true },
    });

    const summary = transactions.reduce((acc: any, t: any) => {
      const month = new Date(t.transactionDate).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0, transfer: 0 };
      }
      acc[month][t.type] += Number(t.amount);
      return acc;
    }, {});

    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
