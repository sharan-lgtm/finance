import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { budgetSchema } from '../validation/schemas.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get budget overview
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.user!.id },
      include: { category: true },
    });

    res.json(budgets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Set category budget
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = budgetSchema.parse(req.body);

    const budget = await prisma.budget.create({
      data: {
        userId: req.user!.id,
        ...data,
        periodStart: new Date(),
        periodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
      include: { category: true },
    });

    res.status(201).json(budget);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get safe-to-spend calculation
router.get('/safe-to-spend', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.userProfile.findUnique({
      where: { userId: req.user!.id },
    });

    const incomes = await prisma.income.findMany({
      where: { userId: req.user!.id },
    });

    const debts = await prisma.debt.findMany({
      where: { userId: req.user!.id, status: 'active' },
    });

    const transactions = await prisma.transaction.findMany({
      where: { 
        userId: req.user!.id,
        type: 'expense',
        transactionDate: {
          gte: new Date(new Date().setDate(1)),
        },
      },
    });

    const totalMonthlyIncome = incomes.reduce((sum: number, inc: any) => {
      if (inc.frequency === 'monthly') return sum + Number(inc.amount);
      if (inc.frequency === 'annual') return sum + Number(inc.amount) / 12;
      return sum;
    }, 0);

    const totalMonthlyEMI = debts.reduce((sum: number, d: any) => sum + (Number(d.emiAmount) || 0), 0);
    const totalMonthlyExpenses = transactions.reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const daysLeftInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
    const dailySafeToSpend = Math.max(0, (totalMonthlyIncome - totalMonthlyEMI - totalMonthlyExpenses) / daysLeftInMonth);

    res.json({
      totalMonthlyIncome,
      totalMonthlyEMI,
      totalMonthlyExpenses,
      dailySafeToSpend,
      weeklySafeToSpend: dailySafeToSpend * 7,
      daysLeftInMonth,
      riskLevel: dailySafeToSpend < 500 ? 'CRITICAL' : dailySafeToSpend < 1000 ? 'HIGH' : 'OK',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
