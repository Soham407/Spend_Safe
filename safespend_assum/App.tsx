import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import IconRail from './components/IconRail';
import IncomeModal from './components/IncomeModal';
import { AssumptionState, IncomeEvent, FinancialSnapshot, UserSettings } from './types';
import { LANGUAGE, DEGRADATION_THRESHOLDS, DEFAULT_SAVINGS_RATE } from './constants';
import { getPanicFraming } from './services/geminiService';
import { Plus, Clock, AlertTriangle, ShieldAlert, Sparkles, RefreshCw, ArrowUpRight, LayoutDashboard, Info, Library, UserCircle, Target, Wallet, TrendingUp, History, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incomeEvents, setIncomeEvents] = useState<IncomeEvent[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    name: "Freelancer",
    email: "user@example.com",
    defaultSavingsRate: DEFAULT_SAVINGS_RATE
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [panicText, setPanicText] = useState<string | null>(null);
  const [isLoadingPanic, setIsLoadingPanic] = useState(false);
  const [lastRealityCheck, setLastRealityCheck] = useState<number>(Date.now());
  const [showRealityCheck, setShowRealityCheck] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('safespend_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setIncomeEvents(parsed.events || []);
      setLastRealityCheck(parsed.lastCheck || Date.now());
      if (parsed.settings) setSettings(parsed.settings);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('safespend_data', JSON.stringify({
      events: incomeEvents,
      lastCheck: lastRealityCheck,
      settings: settings
    }));
  }, [incomeEvents, lastRealityCheck, settings]);

  // Degradation & Reality Check Trigger
  useEffect(() => {
    const checkStaleness = () => {
      const now = Date.now();
      const stalePending = incomeEvents.some(e => 
        e.state === AssumptionState.PENDING && (now - e.createdAt) > DEGRADATION_THRESHOLDS.MEDIUM
      );
      if (stalePending && (now - lastRealityCheck) > DEGRADATION_THRESHOLDS.MEDIUM) {
        setShowRealityCheck(true);
      }
    };
    checkStaleness();
    const interval = setInterval(checkStaleness, 60000);
    return () => clearInterval(interval);
  }, [incomeEvents, lastRealityCheck]);

  const snapshot: FinancialSnapshot = useMemo(() => {
    const now = Date.now();
    let totalIncome = 0;
    let estimatedSavings = 0;
    let safeToSpend = 0;
    let pendingCount = 0;
    let maxAge = 0;

    incomeEvents.forEach(e => {
      totalIncome += e.amount;
      const savings = e.amount * e.savingsRate;
      estimatedSavings += savings;
      safeToSpend += (e.amount - savings);
      
      if (e.state === AssumptionState.PENDING) {
        pendingCount++;
        maxAge = Math.max(maxAge, now - e.createdAt);
      }
    });

    let degradationLevel: 'low' | 'medium' | 'high' = 'low';
    if (maxAge > DEGRADATION_THRESHOLDS.HIGH) degradationLevel = 'high';
    else if (maxAge > DEGRADATION_THRESHOLDS.MEDIUM) degradationLevel = 'medium';

    return { totalIncome, estimatedSavings, safeToSpend, pendingCount, degradationLevel };
  }, [incomeEvents]);

  const counts = useMemo(() => ({
    pending: incomeEvents.filter(e => e.state === AssumptionState.PENDING).length,
    confirmed: incomeEvents.filter(e => e.state === AssumptionState.CONFIRMED).length
  }), [incomeEvents]);

  const handleAddIncome = (data: Omit<IncomeEvent, 'id' | 'state' | 'createdAt'>) => {
    const newEvent: IncomeEvent = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      state: AssumptionState.PENDING,
      createdAt: Date.now()
    };
    setIncomeEvents(prev => [newEvent, ...prev]);
  };

  const updateState = (id: string, newState: AssumptionState) => {
    setIncomeEvents(prev => prev.map(e => e.id === id ? { ...e, state: newState } : e));
  };

  const handlePanic = async () => {
    setIsLoadingPanic(true);
    const framing = await getPanicFraming(snapshot);
    setPanicText(framing);
    setIsLoadingPanic(false);
  };

  const performRealityCheck = () => {
    setLastRealityCheck(Date.now());
    setShowRealityCheck(false);
  };

  const confirmedSafeToSpend = useMemo(() => {
    return incomeEvents
      .filter(e => e.state === AssumptionState.CONFIRMED)
      .reduce((acc, e) => acc + (e.amount * (1 - e.savingsRate)), 0);
  }, [incomeEvents]);

  return (
    <div className="flex flex-col md:flex-row h-full w-full gap-0 md:gap-4 overflow-hidden relative">
      <IconRail />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} userName={settings.name} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#F0F2F5] md:glass-panel md:rounded-[32px] p-5 md:p-10 mb-[72px] md:mb-0">
        {/* Reality Check Modal Overlay */}
        {showRealityCheck && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-md p-6">
            <div className="neo-outset p-10 rounded-[40px] max-w-sm text-center space-y-6 border border-white">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Assumption Drift</h3>
                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                  Your safe-to-spend estimates are aging. Acknowledge pending transactions to maintain clarity.
                </p>
              </div>
              <button 
                onClick={performRealityCheck}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl"
              >
                Acknowledge Freshness
              </button>
            </div>
          </div>
        )}

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-8">
          <button onClick={() => setActiveTab('profile')} className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl rail-bg flex items-center justify-center shadow-lg">
               <UserCircle className="text-white" size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Profile</p>
              <span className="font-black text-slate-800 text-sm tracking-tight">{settings.name}</span>
            </div>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="w-10 h-10 neo-outset rounded-xl flex items-center justify-center">
             <Plus size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-0 md:pr-4 custom-scrollbar">
          {activeTab === 'dashboard' && (
            <div className="max-w-4xl mx-auto space-y-12 md:space-y-16 py-2 md:py-6">
              <header className="hidden md:flex justify-between items-end">
                <div className="space-y-1">
                  <h1 className="text-4xl font-black text-slate-800 tracking-tight">Overview</h1>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[12px] text-slate-400 font-bold tracking-wide uppercase">Real-time Assumption Engine</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="group flex items-center space-x-3 px-6 py-3.5 neo-outset rounded-2xl hover:bg-white transition-all active:scale-95 border border-white/50">
                  <Plus size={18} className="text-slate-600 group-hover:rotate-90 transition-transform" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Record Assumption</span>
                </button>
              </header>

              {/* Major Metric View - The Hero Section */}
              <div className="relative space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <p className="text-[10px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest">{LANGUAGE.SAFE_TO_SPEND_LABEL}</p>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                      snapshot.degradationLevel === 'low' ? 'bg-emerald-50 text-emerald-600' :
                      snapshot.degradationLevel === 'medium' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {snapshot.degradationLevel} Freshness
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-8">
                  <h2 className="text-[84px] md:text-[140px] leading-[0.9] font-black text-slate-800 tracking-tighter -ml-1 flex items-start">
                    <span className="text-4xl md:text-6xl mt-2 md:mt-4 mr-1 md:mr-2 text-slate-300">$</span>
                    {Math.floor(snapshot.safeToSpend).toLocaleString()}
                  </h2>
                  <div className="mt-4 md:mt-0 flex items-center space-x-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hard Confirmation</p>
                      <p className="text-xl md:text-2xl font-black text-emerald-600 tracking-tight">${Math.floor(confirmedSafeToSpend).toLocaleString()}</p>
                    </div>
                    <div className="w-px h-10 bg-slate-200"></div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Allocated Gap</p>
                      <p className="text-xl md:text-2xl font-black text-indigo-600 tracking-tight">${Math.floor(snapshot.safeToSpend - confirmedSafeToSpend).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Freshness Progress Bar */}
                <div className="w-full h-1.5 neo-inset rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      snapshot.degradationLevel === 'low' ? 'bg-emerald-500' :
                      snapshot.degradationLevel === 'medium' ? 'bg-amber-500' :
                      'bg-rose-500'
                    }`}
                    style={{ width: `${Math.max(10, 100 - (snapshot.pendingCount * 15))}%` }}
                  ></div>
                </div>
              </div>

              {/* Core Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Pending Actions</h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{counts.pending} Awaiting</span>
                  </div>
                  
                  <div className="space-y-4">
                    {incomeEvents.filter(e => e.state === AssumptionState.PENDING).length === 0 ? (
                      <div className="p-12 neo-inset rounded-[40px] flex flex-col items-center justify-center text-center space-y-4 border border-white/50">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                          <Target size={24} />
                        </div>
                        <p className="text-[13px] text-slate-500 font-bold italic">All current assumptions are verified.</p>
                      </div>
                    ) : (
                      incomeEvents.filter(e => e.state === AssumptionState.PENDING).slice(0, 3).map(e => (
                        <div key={e.id} className="neo-outset p-5 rounded-[32px] group hover:bg-white transition-all border border-white/40">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{new Date(e.date).toLocaleDateString()}</p>
                              <p className="text-2xl font-black text-slate-800 tracking-tighter">${e.amount.toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Est. Safe</span>
                              <p className="text-sm font-black text-slate-600">${(e.amount * (1 - e.savingsRate)).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button onClick={() => updateState(e.id, AssumptionState.CONFIRMED)} className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all">Execute</button>
                            <button onClick={() => updateState(e.id, AssumptionState.DEFERRED)} className="flex-1 py-2.5 neo-outset text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white border border-amber-100 transition-all">Defer</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Execution</h3>
                  <div className="neo-inset rounded-[40px] p-6 space-y-6 h-full min-h-[300px] border border-white/20">
                    {incomeEvents.filter(e => e.state !== AssumptionState.PENDING).length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-20">
                        <History size={32} className="opacity-20 mb-4" />
                        <p className="text-[12px] font-bold uppercase tracking-widest opacity-50">No history available</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-200/50">
                        {incomeEvents.filter(e => e.state !== AssumptionState.PENDING).slice(0, 5).map(e => (
                          <div key={e.id} className="py-4 flex items-center justify-between group">
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${e.state === AssumptionState.CONFIRMED ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                                <Wallet size={18} />
                              </div>
                              <div>
                                <p className="text-[13px] font-black text-slate-700 tracking-tight">${e.amount.toLocaleString()}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(e.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${e.state === AssumptionState.CONFIRMED ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                {e.state}
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'income' && (
            <div className="max-w-4xl mx-auto space-y-10 py-2 md:py-6">
              <header className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Ledger</h1>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-1 font-bold tracking-wide uppercase">Historical Assumption Timeline</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 px-6 py-3 neo-outset rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-700 hover:bg-white transition-all shadow-sm">
                  <Plus size={16} />
                  <span>Log Income</span>
                </button>
              </header>
              
              <div className="space-y-6">
                <div className="relative mb-8">
                  <input 
                    type="text" 
                    placeholder="Search by amount or notes..." 
                    className="w-full neo-inset rounded-2xl py-4 px-6 text-[13px] font-bold text-slate-600 outline-none focus:bg-white transition-all border border-transparent focus:border-white shadow-inner"
                  />
                </div>

                <div className="neo-inset rounded-[40px] overflow-hidden border border-white/20">
                  <table className="hidden md:table w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Effective Date</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Captured</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Assumed Rate</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Safe Exposure</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {incomeEvents.length === 0 ? (
                        <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold italic">No records captured.</td></tr>
                      ) : incomeEvents.map(e => (
                        <tr key={e.id} className="hover:bg-white/80 transition-colors group">
                          <td className="px-10 py-6 text-[12px] font-bold text-slate-600">{new Date(e.date).toLocaleDateString()}</td>
                          <td className="px-10 py-6 text-sm font-black text-slate-800 tracking-tight">${e.amount.toLocaleString()}</td>
                          <td className="px-10 py-6 text-xs text-slate-400 font-black text-center">{e.savingsRate * 100}%</td>
                          <td className="px-10 py-6 text-sm text-indigo-600 font-black tracking-tight">${(e.amount * (1 - e.savingsRate)).toLocaleString()}</td>
                          <td className="px-10 py-6 text-right">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                              e.state === AssumptionState.CONFIRMED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                              e.state === AssumptionState.DEFERRED ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                              'bg-slate-50 text-slate-300 border-slate-100'
                            }`}>
                              {e.state}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Mobile Mobile Cards */}
                  <div className="md:hidden divide-y divide-slate-200">
                    {incomeEvents.map(e => (
                      <div key={e.id} className="p-6 bg-white/40 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(e.date).toLocaleDateString()}</p>
                          <p className="text-xl font-black text-slate-800 mt-1">${e.amount.toLocaleString()}</p>
                          <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase">Safe: ${(e.amount * (1 - e.savingsRate)).toLocaleString()}</p>
                        </div>
                        <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                          e.state === AssumptionState.CONFIRMED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          e.state === AssumptionState.DEFERRED ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-slate-50 text-slate-300 border-slate-100'
                        }`}>
                          {e.state}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'panic' && (
            <div className="max-w-2xl mx-auto py-8 md:py-16 space-y-12">
              <div className="text-center space-y-6">
                <div className="inline-flex p-10 md:p-14 rounded-[40px] neo-outset text-rose-500 bg-rose-50/30 border border-white">
                  <ShieldAlert size={56} md:size={72} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter leading-tight">Hard Confirmation Frame</h2>
                  <p className="text-slate-400 text-[11px] md:text-[14px] leading-relaxed font-bold max-w-sm mx-auto uppercase tracking-widest">Excluding all unconfirmed assumptions.</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="neo-outset p-8 rounded-[40px] space-y-3 border border-white/60">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Confirmed Safety</p>
                    <p className="text-5xl font-black text-slate-800 tracking-tighter">${Math.floor(confirmedSafeToSpend).toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase">100% Reliable</p>
                  </div>
                  <div className="neo-inset p-8 rounded-[40px] space-y-3 border border-white/20 bg-slate-50/50">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Projected Gap</p>
                    <p className="text-5xl font-black text-indigo-300 tracking-tighter">${Math.floor(snapshot.safeToSpend - confirmedSafeToSpend).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase italic">Awaiting Action</p>
                  </div>
                </div>

                {/* AI Analysis Section */}
                <div className="ai-border p-10 shadow-2xl space-y-8">
                  <div className="flex items-center space-x-3 text-indigo-500">
                    <Sparkles size={20} />
                    <span className="text-[12px] font-black uppercase tracking-widest italic tracking-tight">AI Conservative Projection</span>
                  </div>
                  
                  {isLoadingPanic ? (
                    <div className="flex items-center space-x-4 text-slate-400 py-6">
                      <div className="relative">
                        <RefreshCw size={24} className="animate-spin" />
                        <div className="absolute inset-0 blur-sm animate-pulse bg-indigo-500/10 rounded-full"></div>
                      </div>
                      <span className="text-[13px] font-black uppercase tracking-widest animate-pulse">Synthesizing Safety Frame...</span>
                    </div>
                  ) : panicText ? (
                    <p className="text-slate-700 text-[16px] md:text-[18px] leading-relaxed font-bold italic antialiased tracking-tight border-l-4 border-indigo-200 pl-6 py-2">
                      "{panicText}"
                    </p>
                  ) : (
                    <div className="space-y-6">
                       <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                         Initialize the Zero-Optimism model to see how your finances hold up if none of your pending assumptions realize.
                       </p>
                       <button 
                        onClick={handlePanic}
                        className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-[12px] uppercase tracking-widest hover:bg-black transition-all shadow-2xl active:scale-[0.98]"
                      >
                        Compute Safety Snapshot
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto py-8 md:py-16 space-y-12">
              <header className="text-center space-y-6">
                <div className="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-[48px] neo-outset flex items-center justify-center text-slate-300 bg-white border border-white">
                  <UserCircle size={80} md:size={100} strokeWidth={1} />
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">Profile & Preferences</h1>
                  <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">Global Assumption Settings</p>
                </div>
              </header>

              <div className="neo-inset p-8 md:p-12 rounded-[50px] space-y-10 border border-white/20">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</label>
                    <input 
                      type="text" 
                      value={settings.name}
                      onChange={(e) => setSettings({...settings, name: e.target.value})}
                      className="w-full px-6 py-5 rounded-2xl bg-white/60 border border-transparent focus:bg-white focus:ring-2 focus:ring-slate-100 outline-none transition-all font-black text-slate-800 text-lg shadow-inner"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Baseline Savings Assumption</label>
                      <span className="text-lg font-black text-indigo-600">{settings.defaultSavingsRate * 100}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={settings.defaultSavingsRate * 100}
                      onChange={(e) => setSettings({...settings, defaultSavingsRate: parseInt(e.target.value) / 100})}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-tighter italic">
                      <span>Aggressive (0%)</span>
                      <span>Safe (30%)</span>
                      <span>Max (100%)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-200/50 space-y-5">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-slate-300" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Check-In</span>
                    </div>
                    <span className="text-[12px] font-bold text-slate-700">{new Date(lastRealityCheck).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center space-x-2">
                      <Target size={14} className="text-slate-300" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Privacy</span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-600 uppercase tracking-tighter">On-Device Encrypted</span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full py-5 bg-slate-900 text-white rounded-[32px] font-black text-[12px] uppercase tracking-widest hover:bg-black transition-all shadow-2xl active:scale-[0.98]"
                >
                  Confirm Personal Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
             <div className="max-w-4xl mx-auto space-y-10 py-4 md:py-6">
               <div className="space-y-1">
                 <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Assumption History</h1>
                 <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">Audit Trail of Financial States</p>
               </div>
               <div className="neo-inset p-16 md:p-32 rounded-[60px] text-center border border-dashed border-slate-300/60 bg-slate-50/30">
                  <History size={64} className="mx-auto text-slate-200 mb-6" strokeWidth={1} />
                  <p className="text-slate-400 font-bold italic text-sm md:text-lg">This module tracks rate changes over time.</p>
                  <p className="text-slate-300 text-[11px] font-black uppercase tracking-widest mt-4">Module Initializing in v1.1</p>
               </div>
             </div>
          )}
        </div>

        <IncomeModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddIncome}
          initialRate={settings.defaultSavingsRate}
        />
      </main>

      {/* Mobile Bottom Navigation - Elevated */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white/90 backdrop-blur-2xl border-t border-slate-200/50 px-8 flex items-center justify-between z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`relative flex flex-col items-center justify-center space-y-1 transition-all ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {activeTab === 'dashboard' && <span className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
          <LayoutDashboard size={22} strokeWidth={activeTab === 'dashboard' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Overview</span>
        </button>
        <button 
          onClick={() => setActiveTab('income')}
          className={`relative flex flex-col items-center justify-center space-y-1 transition-all ${activeTab === 'income' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          {activeTab === 'income' && <span className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
          <Library size={22} strokeWidth={activeTab === 'income' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Ledger</span>
        </button>
        <button 
          onClick={() => setActiveTab('panic')}
          className={`relative flex flex-col items-center justify-center space-y-1 transition-all ${activeTab === 'panic' ? 'text-rose-600' : 'text-slate-400'}`}
        >
          {activeTab === 'panic' && <span className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-rose-600"></span>}
          <ShieldAlert size={22} strokeWidth={activeTab === 'panic' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Panic</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`relative flex flex-col items-center justify-center space-y-1 transition-all ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          {activeTab === 'profile' && <span className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
          <UserCircle size={22} strokeWidth={activeTab === 'profile' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
