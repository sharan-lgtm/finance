import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { debtSchema } from '../validation/schemas.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get all debts
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const debts = await prisma.debt.findMany({
      where: { userId: req.user!.id, status: 'active' },
      include: { payments: true },
    });

    const summary = debts.reduce((acc: any, debt: any) => {
      acc.totalDebt += Number(debt.outstandingAmount);
      acc.totalMonthlyEMI += Number(debt.emiAmount || 0);
      return acc;
    }, { totalDebt: 0, totalMonthlyEMI: 0 });

    res.json({ debts, summary });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create debt
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = debtSchema.parse(req.body);

    const debt = await prisma.debt.create({
      data: {
        userId: req.user!.id,
        ...data,
        startDate: new Date(data.startDate),
        maturityDate: data.maturityDate ? new Date(data.maturityDate) : null,
      },
      include: { payments: true },
    });

    res.status(201).json(debt);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get debt details with schedule
router.get('/:id/schedule', async (req: AuthRequest, res: Response) => {
  try {
    const debt = await prisma.debt.findUnique({
      where: { id: req.params.id },
      include: { payments: true },
    });

    if (!debt) {
      return res.status(404).json({ error: 'Debt not found' });
    }

    // Calculate payoff date
    const monthlyInterest = Number(debt.outstandingAmount) * (Number(debt.interestRate) / 100 / 12);
    const monthlyPrincipal = Number(debt.emiAmount || 0) - monthlyInterest;
    const monthsToPayoff = Math.ceil(Number(debt.outstandingAmount) / (monthlyPrincipal || 1));

    // Interest saved if paid early
    const totalInterestRemaining = monthlyInterest * monthsToPayoff;

    res.json({
      debt,
      monthsToPayoff: Math.max(0, monthsToPayoff),
      payoffDate: new Date(new Date().setMonth(new Date().getMonth() + monthsToPayoff)),
      totalInterestRemaining,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Record debt payment
router.post('/:id/pay', async (req: AuthRequest, res: Response) => {
  try {
    const { paymentAmount } = req.body;

    const debt = await prisma.debt.findUnique({ where: { id: req.params.id } });
    if (!debt) {
      return res.status(404).json({ error: 'Debt not found' });
    }

    const monthlyInterest = Number(debt.outstandingAmount) * (Number(debt.interestRate) / 100 / 12);
    const principalPaid = Math.max(0, paymentAmount - monthlyInterest);

    const payment = await prisma.debtPayment.create({
      data: {
        debtId: req.params.id,
        paymentAmount,
        principalPaid,
        interestPaid: monthlyInterest,
        paymentDate: new Date(),
      },
    });

    const newOutstanding = Number(debt.outstandingAmount) - principalPaid;
    await prisma.debt.update({
      where: { id: req.params.id },
      data: {
        outstandingAmount: Math.max(0, newOutstanding),
        status: newOutstanding <= 0 ? 'closed' : 'active',
      },
    });

    res.status(201).json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get debt payoff analysis (avalanche vs snowball)
router.get('/analysis/payoff', async (req: AuthRequest, res: Response) => {
  try {
    const debts = await prisma.debt.findMany({
      where: { userId: req.user!.id, status: 'active' },
    });

    // Avalanche (highest interest first)
    const avalanche = debts.sort((a: any, b: any) => Number(b.interestRate) - Number(a.interestRate));

    // Snowball (smallest amount first)
    const snowball = debts.sort((a: any, b: any) => Number(a.outstandingAmount) - Number(b.outstandingAmount));

    res.json({
      avalanche: avalanche.map((d: any) => ({
        id: d.id,
        name: d.creditorName,
        rate: Number(d.interestRate),
      })),
      snowball: snowball.map((d: any) => ({
        id: d.id,
        name: d.creditorName,
        outstanding: Number(d.outstandingAmount),
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
