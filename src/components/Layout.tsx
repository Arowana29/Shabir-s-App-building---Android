import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Plus, BarChart2, MessageSquare, User } from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-[#E8EAF6] text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-[#1A237E] text-white pt-5 pb-12 px-5 flex flex-col justify-center z-0">
        <h1 className="text-2xl font-bold tracking-wide mb-1">ගණු දෙනු (Ganu Denu)</h1>
        <p className="text-sm opacity-80">ඔබේ මුදල් කළමනාකරු</p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 relative z-10">
        <div className="max-w-md mx-auto h-full relative">
          <Outlet />
          
          {/* FAB */}
          <NavLink
            to="/add"
            className={({ isActive }) =>
              cn(
                "fixed bottom-[85px] right-6 w-14 h-14 bg-[#FFC107] text-[#1A237E] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-transform active:scale-95 z-30",
                isActive && "bg-[#FFB300] scale-95"
              )
            }
          >
            <Plus className="w-8 h-8 font-bold" />
          </NavLink>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-[#EEE] h-[65px] z-20">
        <div className="max-w-md mx-auto flex justify-around items-center h-full px-2">
          <NavLink to="/" className={({ isActive }) => cn("flex flex-col items-center p-2 transition-colors", isActive ? "text-[#1A237E]" : "text-[#999]")}>
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">පුවරුව</span>
          </NavLink>
          <NavLink to="/list" className={({ isActive }) => cn("flex flex-col items-center p-2 transition-colors", isActive ? "text-[#1A237E]" : "text-[#999]")}>
            <BarChart2 className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">විශ්ලේෂණය</span>
          </NavLink>
          <div className="flex flex-col items-center p-2 text-[#999]">
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">පණිවිඩ</span>
          </div>
          <div className="flex flex-col items-center p-2 text-[#999]">
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">ගිණුම</span>
          </div>
        </div>
      </nav>
    </div>
  );
};
