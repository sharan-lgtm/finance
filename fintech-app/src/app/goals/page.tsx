'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Goal {
  id: string;
  goalName: string;
  targetAmount: number;
  currentSavings: number;
  targetDate: string;
  monthlyContribution: number;
  status: string;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    fetchGoals();
  }, [token, router]);

  const fetchGoals = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/goals', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch goals');

      const data = await res.json();
      setGoals(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
            + Add Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Goals Yet</h2>
            <p className="text-gray-600 mb-6">
              Create your first goal - marriage, home, education, or anything else!
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progress = (goal.currentSavings / goal.targetAmount) * 100;
              const daysRemaining = Math.ceil(
                (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div key={goal.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{goal.goalName}</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">
                          ₹{goal.currentSavings.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-indigo-600 h-3 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{Math.round(progress)}% complete</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-600">Target Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Days Left</p>
                        <p className="font-semibold text-gray-900">{daysRemaining} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Monthly Saving</p>
                        <p className="font-semibold text-gray-900">₹{goal.monthlyContribution.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Status</p>
                        <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded">
                          {goal.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
