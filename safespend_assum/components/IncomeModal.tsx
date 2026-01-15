
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DEFAULT_SAVINGS_RATE } from '../constants';
import { AssumptionState, IncomeEvent } from '../types';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<IncomeEvent, 'id' | 'state' | 'createdAt'>) => void;
  initialRate?: number;
}

const IncomeModal: React.FC<IncomeModalProps> = ({ isOpen, onClose, onSubmit, initialRate = DEFAULT_SAVINGS_RATE }) => {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(initialRate * 100);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Update rate if global default changes while modal is closed
  useEffect(() => {
    if (!isOpen) {
      setRate(initialRate * 100);
    }
  }, [initialRate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    onSubmit({
      amount: val,
      savingsRate: rate / 100,
      date,
      notes
    });
    setAmount('');
    setRate(initialRate * 100);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 md:p-4">
      <div className="bg-white rounded-t-[32px] md:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200/50">
        <div className="p-5 md:p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight uppercase">Record Income</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 md:space-y-8">
          <div>
            <label className="block text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Gross Amount ($)</label>
            <input
              type="number"
              required
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-black text-lg md:text-xl text-slate-800"
              placeholder="0.00"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
              Assumed Savings Rate ({rate}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={rate}
              onChange={(e) => setRate(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[8px] md:text-[9px] text-slate-400 mt-3 uppercase font-black tracking-tighter">
              <span>Optimistic (0%)</span>
              <span>Conservative (100%)</span>
            </div>
            <p className="mt-4 text-[10px] md:text-[11px] text-slate-500 italic font-medium leading-relaxed">
              This is a manual assumption. The system does not validate sufficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Effective Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-bold text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Context / Source</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium text-slate-600"
              rows={2}
              placeholder="e.g. Q3 Retainer..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 md:py-5 rounded-2xl md:rounded-3xl shadow-xl transition-all active:scale-[0.98] text-[11px] md:text-[12px] uppercase tracking-widest"
          >
            Log Assumption
          </button>
          
          <div className="md:hidden h-4"></div>
        </form>
      </div>
    </div>
  );
};

export default IncomeModal;
