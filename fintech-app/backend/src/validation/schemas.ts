import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

export const userProfileSchema = z.object({
  firstName: z.string().optional(),
  age: z.number().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced']).optional(),
  dependents: z.number().optional(),
  riskTolerance: z.enum(['low', 'medium', 'high']).optional(),
  financialExperience: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  hasHealthInsurance: z.boolean().optional(),
  hasLifeInsurance: z.boolean().optional(),
  insurancePremiumMonthly: z.number().optional(),
});

export const incomeSchema = z.object({
  source: z.string().min(1, 'Source is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'annual']),
  salaryDate: z.number().optional(),
  isStable: z.boolean().optional(),
  notes: z.string().optional(),
});

export const transactionSchema = z.object({
  categoryId: z.string().uuid(),
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number().min(0, 'Amount must be positive'),
  description: z.string().optional(),
  transactionDate: z.string().datetime(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const debtSchema = z.object({
  debtType: z.string().min(1),
  creditorName: z.string().min(1),
  outstandingAmount: z.number().min(0),
  interestRate: z.number().min(0).max(100),
  emiAmount: z.number().min(0).optional(),
  emiDueDate: z.number().optional(),
  remainingTenureMonths: z.number().optional(),
  startDate: z.string().datetime(),
  maturityDate: z.string().datetime().optional(),
});

export const budgetSchema = z.object({
  categoryId: z.string().uuid(),
  monthlyLimit: z.number().min(0),
  weeklyLimit: z.number().min(0),
});

export const goalSchema = z.object({
  goalName: z.string().min(1),
  targetAmount: z.number().min(0),
  targetDate: z.string().datetime(),
  monthlyContribution: z.number().min(0),
  priority: z.number().optional(),
  flexibility: z.enum(['rigid', 'flexible']).optional(),
  inflationRate: z.number().optional(),
});
