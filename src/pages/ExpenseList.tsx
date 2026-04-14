import React, { useState } from 'react';
import { useExpenses } from '../store';
import { format } from 'date-fns';
import { Trash2, Edit2, Search } from 'lucide-react';

export const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExpenses = expenses.filter(e => 
    e.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by month/year could be added here, but let's keep it simple for now
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-bold text-slate-800">සියලුම වියදම්</h2>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="සොයන්න..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white shadow-sm"
        />
      </div>

      {/* List */}
      <div className="space-y-4 px-4">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12 text-[#999]">
            <p>වියදම් කිසිවක් හමු නොවීය</p>
          </div>
        ) : (
          filteredExpenses.map(expense => (
            <div key={expense.id} className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden border border-[#EEE]">
              {/* Top Bar */}
              <div className="bg-[#1A237E] px-4 py-2 flex justify-between items-center text-white">
                <div className="flex space-x-4">
                  <button 
                    onClick={() => {
                      if (window.confirm('මෙම වියදම මකා දැමීමට අවශ්‍යද?')) {
                        deleteExpense(expense.id);
                      }
                    }}
                    className="flex items-center space-x-1 text-sm font-medium hover:text-white/80 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>DELETE</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm font-medium hover:text-white/80 transition-colors">
                    <Edit2 className="w-4 h-4" />
                    <span>EDIT</span>
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center -mt-6 shadow-sm border-4 border-[#1A237E] text-[#1A237E]">
                    <span className="text-xs font-bold">{expense.category.substring(0, 2)}</span>
                  </div>
                  <span className="text-[10px] font-medium mt-1">{expense.category}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-[#333] text-lg leading-tight uppercase">
                      {expense.merchant || expense.category}
                    </h3>
                    <p className="text-sm text-[#999] mt-2 font-medium">
                      {format(new Date(expense.date), "MMM dd, yyyy hh:mm a")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#D32F2F] text-xl">
                      - {expense.currency || 'Rs.'} {expense.amount.toLocaleString()}
                    </p>
                    {(expense.bankName || expense.cardEnding) && (
                      <p className="text-sm text-[#999] font-medium mt-1 uppercase">
                        {expense.bankName} {expense.cardEnding}
                      </p>
                    )}
                  </div>
                </div>
                
                {expense.notes && (
                  <p className="text-sm text-[#666] mt-3 bg-[#F5F5F5] p-2 rounded border border-[#EEE]">
                    {expense.notes}
                  </p>
                )}
                
                {expense.balance !== undefined && (
                  <div className="mt-4 pt-3 border-t border-[#EEE]">
                    <p className="font-bold text-[#333] text-sm">
                      {expense.bankName || 'Bank'} Card Balance: {expense.balance.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
