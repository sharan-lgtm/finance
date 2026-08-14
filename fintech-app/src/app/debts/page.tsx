'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Debt {
  id: string;
  creditorName: string;
  outstandingAmount: number;
  interestRate: number;
  emiAmount: number;
  debtType: string;
}

interface DebtSummary {
  debts: Debt[];
  summary: {
    totalDebt: number;
    totalMonthlyEMI: number;
  };
}

export default function Debts() {
  const [debtData, setDebtData] = useState<DebtSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDebt, setSelectedDebt] = useState<string | null>(null);
  const [debtSchedule, setDebtSchedule] = useState<any>(null);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    fetchDebts();
  }, [token, router]);

  const fetchDebts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/debts', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch debts');

      const data = await res.json();
      setDebtData(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDebtSchedule = async (debtId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/debts/${debtId}/schedule`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch schedule');

      const data = await res.json();
      setDebtSchedule(data);
      setSelectedDebt(debtId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debt Management</h1>

        {/* Debt Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Debt</p>
            <p className="text-3xl font-bold text-red-600">
              ₹{(debtData?.summary.totalDebt || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Monthly EMI</p>
            <p className="text-3xl font-bold text-orange-600">
              ₹{(debtData?.summary.totalMonthlyEMI || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Number of Debts</p>
            <p className="text-3xl font-bold text-blue-600">{debtData?.debts.length || 0}</p>
          </div>
        </div>

        {/* Debts List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Your Debts</h2>
          </div>

          {debtData?.debts.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-600">
              No debts recorded. Great job! 🎉
            </div>
          ) : (
            <div className="divide-y">
              {debtData?.debts.map((debt) => (
                <div key={debt.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{debt.creditorName}</h3>
                      <p className="text-sm text-gray-600">
                        {debt.debtType.replace(/_/g, ' ').toUpperCase()}
                      </p>
                    </div>
                    <button
                      onClick={() => fetchDebtSchedule(debt.id)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      View Details →
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Outstanding</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{debt.outstandingAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Interest Rate</p>
                      <p className="text-lg font-semibold text-gray-900">{debt.interestRate}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Monthly EMI</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{debt.emiAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>Active</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: '60%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debt Details */}
        {selectedDebt && debtSchedule && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Debt Details & Payoff Schedule</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Months to Payoff</p>
                <p className="text-3xl font-bold text-blue-600">{debtSchedule.monthsToPayoff}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Projected Payoff Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(debtSchedule.payoffDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Interest Remaining</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{debtSchedule.totalInterestRemaining.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              <p className="font-semibold mb-2">💡 Tip: Early Repayment</p>
              <p>
                By paying an extra ₹5,000 monthly, you could save ₹{Math.round(debtSchedule.totalInterestRemaining * 0.3).toLocaleString()} in interest!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
