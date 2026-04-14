import React, { useMemo } from 'react';
import { useExpenses } from '../store';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#1A237E', '#FFC107', '#D32F2F', '#388E3C', '#8b5cf6'];

export const Dashboard: React.FC = () => {
  const { expenses } = useExpenses();

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    
    return expenses.filter(e => isWithinInterval(new Date(e.date), { start, end }));
  }, [expenses]);

  const totalCurrentMonth = useMemo(() => {
    return currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthExpenses]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    currentMonthExpenses.forEach(e => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [currentMonthExpenses]);

  const recentTransactions = useMemo(() => {
    return [...expenses].slice(0, 5);
  }, [expenses]);

  return (
    <div className="pb-6">
      {/* Balance Card */}
      <div className="bg-[#FFC107] text-[#1A237E] rounded-2xl p-5 shadow-[0_8px_16px_rgba(0,0,0,0.1)] mx-4 -mt-8 relative z-10">
        <div className="text-xs uppercase font-semibold tracking-widest mb-1">මුළු ශේෂය (Current Balance)</div>
        <div className="text-3xl font-extrabold">Rs. {totalCurrentMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
      </div>

      {/* Summary Grid */}
      <div className="px-5 mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[#1A237E] font-bold text-base">මාසික සාරාංශය (Monthly)</h3>
          <span className="text-xs text-[#FF8F00] cursor-pointer">විස්තර බලන්න</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#F5F5F5] p-3 rounded-xl border-l-4 border-[#1A237E]">
            <div className="text-[11px] text-[#666]">වියදම් (Expenses)</div>
            <div className="text-base font-bold text-[#333]">Rs. {totalCurrentMonth.toLocaleString()}</div>
          </div>
          <div className="bg-[#F5F5F5] p-3 rounded-xl border-l-4 border-[#388E3C]">
            <div className="text-[11px] text-[#666]">ආදායම් (Income)</div>
            <div className="text-base font-bold text-[#333]">Rs. 0</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {categoryData.length > 0 && (
        <div className="px-5 mt-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EEE]">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `Rs. ${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="px-5 mt-6">
        <h3 className="text-[#1A237E] font-bold text-base mb-2">මෑත ගණුදෙනු (Recent Transactions)</h3>
        
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-[#EEE]">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-[#999] text-sm">
              ගනුදෙනු නොමැත
            </div>
          ) : (
            recentTransactions.map(expense => (
              <div key={expense.id} className="flex items-center py-3 px-2 border-b border-[#EEE] last:border-0">
                <div className="w-10 h-10 bg-[#E8EAF6] rounded-xl flex items-center justify-center mr-3 text-[#1A237E] font-bold text-sm">
                  {expense.category.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#333] flex items-center">
                    {expense.merchant || expense.category}
                    {expense.bankName && <span className="text-[9px] bg-[#E0E0E0] text-[#666] px-1.5 py-0.5 rounded ml-2">SMS</span>}
                  </div>
                  <div className="text-[11px] text-[#999]">
                    {format(new Date(expense.date), 'MMM dd, hh:mm a')} {expense.bankName && `| ${expense.bankName}`}
                  </div>
                </div>
                <div className="text-sm font-bold text-[#D32F2F]">
                  - {expense.amount.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
