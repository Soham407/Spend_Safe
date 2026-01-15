import React from 'react';
import { LayoutDashboard, Settings, ShieldAlert, Library, History } from 'lucide-react';

const IconRail: React.FC = () => {
  return (
    <div className="hidden md:flex w-14 h-full flex-col items-center py-7 space-y-7 rail-bg rounded-[24px] shadow-2xl shrink-0">
      <div className="flex-1 flex flex-col space-y-8 items-center pt-4">
        {[LayoutDashboard, Library, ShieldAlert, History].map((Icon, idx) => (
          <div key={idx} className={`p-2.5 cursor-pointer transition-all ${idx === 0 ? 'text-white bg-white/10 rounded-xl' : 'text-slate-400 hover:text-white'}`}>
            <Icon size={18} strokeWidth={idx === 0 ? 2.5 : 1.5} />
          </div>
        ))}
      </div>

      <div className="p-2.5 text-slate-400 cursor-pointer hover:text-white transition-all mb-1">
        <Settings size={20} strokeWidth={1.5} />
      </div>
    </div>
  );
};

export default IconRail;