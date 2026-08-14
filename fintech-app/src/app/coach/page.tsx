'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface HealthScore {
  score: number;
  status: string;
  breakdown: {
    emergencyFund: number;
    debtToIncome: number;
    goalProgress: number;
    insurance: number;
  };
}

export default function Coach() {
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    fetchHealthScore();
  }, [token, router]);

  const fetchHealthScore = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/analytics/health-score', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      setHealthScore(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading...</div>;
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    if (score >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Financial Coach 🤖</h1>

        {healthScore && (
          <>
            {/* Health Score Card */}
            <div className={`rounded-lg shadow-lg p-12 text-center mb-8 ${
              healthScore.score >= 75
                ? 'bg-green-50 border-l-4 border-green-600'
                : healthScore.score >= 50
                ? 'bg-blue-50 border-l-4 border-blue-600'
                : healthScore.score >= 25
                ? 'bg-orange-50 border-l-4 border-orange-600'
                : 'bg-red-50 border-l-4 border-red-600'
            }`}>
              <p className="text-sm font-semibold text-gray-600 mb-4">FINANCIAL HEALTH SCORE</p>
              <p className={`text-7xl font-bold ${getScoreColor(healthScore.score)} mb-4`}>
                {healthScore.score}
              </p>
              <p className={`text-2xl font-semibold ${getScoreColor(healthScore.score)}`}>
                {healthScore.status}
              </p>
              <p className="text-gray-700 mt-4 text-lg">
                {healthScore.status === 'Excellent'
                  ? 'You are in great financial health! Keep maintaining these habits.'
                  : healthScore.status === 'Good'
                  ? 'Your finances are on the right track. Let\'s make some improvements.'
                  : healthScore.status === 'Fair'
                  ? 'There is room for improvement. Focus on the recommendations below.'
                  : 'Your finances need immediate attention. Follow the action plan below.'}
              </p>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">EMERGENCY FUND</h3>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${Math.min(healthScore.breakdown.emergencyFund, 100) * 2.83} 283`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round(healthScore.breakdown.emergencyFund)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 text-center">Target: 3-6 months expenses</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">DEBT RATIO</h3>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="8"
                      strokeDasharray={`${Math.min(100 - healthScore.breakdown.debtToIncome, 100) * 2.83} 283`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round(healthScore.breakdown.debtToIncome)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 text-center">Should be less than 30%</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">GOAL PROGRESS</h3>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray={`${Math.min(healthScore.breakdown.goalProgress, 100) * 2.83} 283`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round(healthScore.breakdown.goalProgress)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 text-center">On track with goals</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">INSURANCE</h3>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="8"
                      strokeDasharray={`${Math.min(healthScore.breakdown.insurance, 100) * 2.83} 283`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round(healthScore.breakdown.insurance)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 text-center">Health + Life coverage</p>
              </div>
            </div>

            {/* Weekly Coaching Tips */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 This Week's Coaching Tips</h2>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                  <h4 className="font-semibold text-gray-900 mb-2">👉 Action 1: Emergency Fund</h4>
                  <p className="text-gray-700">
                    Your emergency fund is below 50% of target. Start by moving ₹5,000 per month 
                    until you have 3 months of expenses saved. This protects you from unexpected costs.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded">
                  <h4 className="font-semibold text-gray-900 mb-2">💡 Insight: Debt Repayment</h4>
                  <p className="text-gray-700">
                    Your EMI is consuming {Math.round(healthScore.breakdown.debtToIncome)}% of your income. 
                    Try paying an extra ₹2,000-3,000 towards your highest-interest debt each month 
                    to accelerate payoff.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-600 rounded">
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Goal Check: Are Your Goals Realistic?</h4>
                  <p className="text-gray-700">
                    Review your goals to ensure they're achievable with your current savings rate. 
                    You can adjust the target date or amount to make them more realistic.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border-l-4 border-purple-600 rounded">
                  <h4 className="font-semibold text-gray-900 mb-2">🛡️ Insurance Reminder</h4>
                  <p className="text-gray-700">
                    Make sure you have adequate health and life insurance. Medical emergencies 
                    and unexpected events can derail your financial plans.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
