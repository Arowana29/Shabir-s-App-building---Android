import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../store';
import { Category } from '../types';
import { parseSMS } from '../lib/gemini';
import { MessageSquareText, Loader2, Save } from 'lucide-react';

const CATEGORIES: Category[] = ['ආහාර', 'ප්‍රවාහන', 'බිල්පත්', 'සාප්පු සවාරි', 'වෙනත්'];

export const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const { addExpense } = useExpenses();
  
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('LKR');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState<Category>('වෙනත්');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');
  const [bankName, setBankName] = useState('');
  const [cardEnding, setCardEnding] = useState('');
  const [balance, setBalance] = useState('');
  
  const [smsText, setSmsText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleParseSMS = async () => {
    if (!smsText.trim()) return;
    
    setIsParsing(true);
    try {
      const parsed = await parseSMS(smsText);
      if (parsed) {
        setAmount(parsed.amount.toString());
        setMerchant(parsed.merchant);
        setCategory(parsed.category);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.bankName) setBankName(parsed.bankName);
        if (parsed.cardEnding) setCardEnding(parsed.cardEnding);
        if (parsed.balance !== undefined) setBalance(parsed.balance.toString());
        if (parsed.date) {
          setDate(new Date(parsed.date).toISOString().slice(0, 16));
        }
      } else {
        alert('කෙටි පණිවිඩය තේරුම් ගැනීමට නොහැකි විය.'); // Could not understand SMS
      }
    } catch (error) {
      console.error(error);
      alert('දෝෂයක් ඇතිවිය.'); // An error occurred
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    addExpense({
      amount: Number(amount),
      currency,
      merchant,
      category,
      date: new Date(date).toISOString(),
      notes,
      bankName,
      cardEnding,
      balance: balance ? Number(balance) : undefined
    });
    
    navigate('/');
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 px-1">වියදමක් එක් කරන්න</h2>

      {/* SMS Parser Card */}
      <div className="bg-[#E8EAF6] rounded-2xl p-5 border border-[#1A237E]/20">
        <div className="flex items-center mb-3 text-[#1A237E]">
          <MessageSquareText className="w-5 h-5 mr-2" />
          <h3 className="font-semibold">කෙටි පණිවිඩයෙන් (SMS)</h3>
        </div>
        <textarea
          value={smsText}
          onChange={(e) => setSmsText(e.target.value)}
          placeholder="බැංකුවෙන් ලැබුණු SMS එක මෙහි අලවන්න..."
          className="w-full p-3 rounded-xl border border-[#EEE] focus:border-[#1A237E] focus:ring-1 focus:ring-[#1A237E] text-sm bg-white shadow-inner resize-none h-24 mb-3 outline-none"
        />
        <button
          onClick={handleParseSMS}
          disabled={isParsing || !smsText.trim()}
          className="w-full bg-[#1A237E] hover:bg-[#283593] disabled:bg-[#1A237E]/50 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center"
        >
          {isParsing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              සකසමින් පවතී...
            </>
          ) : (
            'උපුටා ගන්න'
          )}
        </button>
      </div>

      {/* Manual Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm border border-[#EEE] space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">මුදල (Rs.)</label>
          <input
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#EEE] focus:border-[#1A237E] focus:ring-1 focus:ring-[#1A237E] outline-none text-lg font-semibold"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">වෙළෙන්දා / ස්ථානය</label>
          <input
            type="text"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#EEE] focus:border-[#1A237E] focus:ring-1 focus:ring-[#1A237E] outline-none"
            placeholder="උදා: Keells Super"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">වර්ගය</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full p-3 rounded-xl border border-[#EEE] focus:border-[#1A237E] focus:ring-1 focus:ring-[#1A237E] outline-none bg-white"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">දිනය හා වේලාව</label>
          <input
            type="datetime-local"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#EEE] focus:border-[#1A237E] focus:ring-1 focus:ring-[#1A237E] outline-none bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">සටහන්</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#EEE] focus:border-[#1A237E] focus:ring-1 focus:ring-[#1A237E] outline-none"
            placeholder="අමතර විස්තර..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-[#1A237E] font-bold py-4 rounded-xl transition-colors flex items-center justify-center mt-6 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
        >
          <Save className="w-5 h-5 mr-2" />
          සුරකින්න
        </button>
      </form>
    </div>
  );
};
