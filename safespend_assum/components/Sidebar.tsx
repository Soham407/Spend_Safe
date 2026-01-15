
import React from 'react';
import { LayoutDashboard, ShieldAlert, User, ChevronDown, Library, Clock, History, Circle, UserCircle } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  counts?: {
    pending: number;
    confirmed: number;
  };
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, counts = { pending: 0, confirmed: 0 }, userName = "Freelancer" }) => {
  return (
    <div className="hidden md:flex w-72 h-full glass-panel rounded-[32px] p-7 flex flex-col overflow-y-auto shrink-0">
      {/* User Context - Clickable for Profile */}
      <button 
        onClick={() => setActiveTab('profile')}
        className={`flex items-center space-x-3 mb-10 p-2 rounded-2xl transition-all text-left ${activeTab === 'profile' ? 'bg-white shadow-sm' : 'hover:bg-white/40'}`}
      >
        <div className="w-11 h-11 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border border-white/40 shadow-sm">
          <UserCircle size={24} className="text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-800 truncate">{userName}</h3>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
          <p className="text-[10px] text-slate-400 truncate tracking-tight">Financial Profile</p>
        </div>
      </button>

      <div className="space-y-7">
        {/* Core Views */}
        <section>
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2 text-balance">Safe-to-Spend Views</h4>
          <div className="space-y-1">
            <SidebarItem 
              id="dashboard" 
              icon={LayoutDashboard} 
              label="Overview" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              id="income" 
              icon={Library} 
              label="Assumption Ledger" 
              active={activeTab === 'income'} 
              onClick={() => setActiveTab('income')} 
            />
          </div>
        </section>

        {/* Financial Health */}
        <section>
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Risk Management</h4>
          <div className="space-y-1">
            <SidebarItem 
              id="panic" 
              icon={ShieldAlert} 
              label="Panic Snapshot" 
              active={activeTab === 'panic'} 
              onClick={() => setActiveTab('panic')} 
            />
            <StatusItem 
              label="Pending Assumptions" 
              count={counts.pending} 
              active={activeTab === 'income'} 
              onClick={() => setActiveTab('income')} 
            />
          </div>
        </section>

        {/* Historical Context */}
        <section>
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">History (Nice-to-Have)</h4>
          <div className="space-y-1">
            <SidebarItem 
              id="history" 
              icon={History} 
              label="Historical Assumptions" 
              active={activeTab === 'history'} 
              onClick={() => setActiveTab('history')} 
            />
          </div>
        </section>
      </div>

      <div className="mt-auto pt-10">
        <p className="text-[9px] text-slate-400 font-bold leading-relaxed px-2">
          estimates are strictly based on user-defined rates.
        </p>
      </div>
    </div>
  );
};

const SidebarItem = ({ id, icon: Icon, label, active, onClick, count }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
      active ? 'active-item text-slate-900' : 'text-slate-500 hover:text-slate-800'
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon size={16} strokeWidth={active ? 2.5 : 1.5} className={active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'} />
      <span className={`text-[12px] ${active ? 'font-bold tracking-tight' : 'font-medium'}`}>{label}</span>
    </div>
    {count !== undefined && (
      <span className={`text-[10px] w-5 h-5 flex items-center justify-center rounded-full ${active ? 'bg-slate-200 text-slate-800 font-bold' : 'text-slate-300 font-medium'}`}>
        {count}
      </span>
    )}
  </button>
);

const StatusItem = ({ label, count, onClick, active }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-3 py-2 text-slate-500 hover:text-slate-800 group rounded-xl transition-all ${active ? 'bg-white/40 shadow-sm text-slate-900' : ''}`}>
    <div className="flex items-center space-x-3">
      <Circle size={10} className={`${active ? 'fill-slate-900 text-slate-900' : 'text-slate-300 group-hover:text-slate-500'} transition-all`} />
      <span className={`text-[12px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </div>
    {count !== undefined && <span className="text-[10px] text-slate-300 font-bold">{count}</span>}
  </button>
);

export default Sidebar;
