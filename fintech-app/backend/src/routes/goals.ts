import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { goalSchema } from '../validation/schemas.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get all goals
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const goals = await prisma.financialGoal.findMany({
      where: { userId: req.user!.id },
      include: { contributions: true },
    });

    res.json(goals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create goal
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = goalSchema.parse(req.body);

    const goal = await prisma.financialGoal.create({
      data: {
        userId: req.user!.id,
        ...data,
        targetDate: new Date(data.targetDate),
      },
      include: { contributions: true },
    });

    res.status(201).json(goal);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get goal with feasibility analysis
router.get('/:id/projection', async (req: AuthRequest, res: Response) => {
  try {
    const goal = await prisma.financialGoal.findUnique({
      where: { id: req.params.id },
      include: { contributions: true },
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const monthsRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));

    const futureTargetAmount = Number(goal.targetAmount) * Math.pow(1 + Number(goal.inflationRate) / 100, monthsRemaining / 12);
    const shortfall = Math.max(0, futureTargetAmount - Number(goal.currentSavings));
    const requiredMonthlyContribution = Math.ceil(shortfall / Math.max(monthsRemaining, 1));

    const isAchievable = requiredMonthlyContribution <= Number(goal.monthlyContribution) * 1.5; // Allow 50% flexibility

    res.json({
      goal,
      monthsRemaining,
      futureTargetAmount,
      shortfall,
      requiredMonthlyContribution,
      isAchievable,
      status: isAchievable ? 'ON_TRACK' : 'NEEDS_ADJUSTMENT',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add contribution to goal
router.post('/:id/contribute', async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;

    const contribution = await prisma.goalContribution.create({
      data: {
        goalId: req.params.id,
        amount,
        contributionDate: new Date(),
      },
    });

    const goal = await prisma.financialGoal.findUnique({
      where: { id: req.params.id },
    });

    if (goal) {
      await prisma.financialGoal.update({
        where: { id: req.params.id },
        data: {
          currentSavings: Number(goal.currentSavings) + amount,
        },
      });
    }

    res.status(201).json(contribution);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
