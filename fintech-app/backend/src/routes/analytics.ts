import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get dashboard overview
router.get('/dashboard', async (req: AuthRequest, res: Response) => {
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
        transactionDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const goals = await prisma.financialGoal.findMany({
      where: { userId: req.user!.id, status: 'active' },
    });

    const assets = await prisma.asset.findMany({
      where: { userId: req.user!.id },
    });

    const liabilities = await prisma.liability.findMany({
      where: { userId: req.user!.id },
    });

    const totalIncome = incomes.reduce((sum: number, inc: any) => sum + Number(inc.amount), 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
    const totalEMI = debts.reduce((sum: number, d: any) => sum + (Number(d.emiAmount) || 0), 0);
    const totalAssets = assets.reduce((sum: number, a: any) => sum + Number(a.value), 0);
    const totalLiabilities = liabilities.reduce((sum: number, l: any) => sum + Number(l.outstandingBalance), 0);

    const netWorth = totalAssets - totalLiabilities;

    res.json({
      user,
      totalIncome,
      totalExpenses,
      totalEMI,
      netWorth,
      totalAssets,
      totalLiabilities,
      savings: totalIncome - totalExpenses - totalEMI,
      goalsCount: goals.length,
      debtsCount: debts.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get spending analysis
router.get('/spending', async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user!.id,
        type: 'expense',
      },
      include: { category: true },
    });

    const byCategory = transactions.reduce((acc: any, t: any) => {
      const catName = t.category.name;
      acc[catName] = (acc[catName] || 0) + Number(t.amount);
      return acc;
    }, {});

    const byDate = transactions.reduce((acc: any, t: any) => {
      const date = new Date(t.transactionDate).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + Number(t.amount);
      return acc;
    }, {});

    res.json({ byCategory, byDate, total: transactions.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get financial health score
router.get('/health-score', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.userProfile.findUnique({
      where: { userId: req.user!.id },
    });

    const incomes = await prisma.income.findMany({
      where: { userId: req.user!.id },
    });

    const debts = await prisma.debt.findMany({
      where: { userId: req.user!.id },
    });

    const goals = await prisma.financialGoal.findMany({
      where: { userId: req.user!.id },
    });

    const assets = await prisma.asset.findMany({
      where: { userId: req.user!.id },
    });

    let score = 100;

    // Emergency fund (20 points)
    const emergencyFundTarget = incomes.reduce((sum: any, inc: any) => sum + Number(inc.amount), 0) * 3;
    const emergencyFund = assets.filter(a => a.assetType === 'savings_account').reduce((sum: any, a: any) => sum + Number(a.value), 0);
    const emergencyRatio = emergencyFund / emergencyFundTarget;
    if (emergencyRatio < 0.25) score -= 20;
    else if (emergencyRatio < 0.5) score -= 15;
    else if (emergencyRatio < 0.75) score -= 10;

    // Debt ratio (25 points)
    const totalIncome = incomes.reduce((sum: any, inc: any) => sum + Number(inc.amount), 0);
    const totalEMI = debts.reduce((sum: any, d: any) => sum + (Number(d.emiAmount) || 0), 0);
    const debtToIncome = totalEMI / totalIncome;
    if (debtToIncome > 0.5) score -= 25;
    else if (debtToIncome > 0.4) score -= 20;
    else if (debtToIncome > 0.3) score -= 15;

    // Goal progress (15 points)
    const goalsOnTrack = goals.filter(g => Number(g.currentSavings) >= Number(g.targetAmount) * 0.25).length;
    const goalRatio = goalsOnTrack / Math.max(goals.length, 1);
    if (goalRatio < 0.5) score -= 15;
    else if (goalRatio < 0.75) score -= 10;

    // Insurance (10 points)
    if (!user?.hasHealthInsurance) score -= 5;
    if (!user?.hasLifeInsurance && user?.dependents) score -= 5;

    res.json({
      score: Math.max(0, score),
      status: score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : score >= 25 ? 'Fair' : 'Poor',
      breakdown: {
        emergencyFund: emergencyRatio * 100,
        debtToIncome: debtToIncome * 100,
        goalProgress: goalRatio * 100,
        insurance: user?.hasHealthInsurance && user?.hasLifeInsurance ? 100 : 50,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
