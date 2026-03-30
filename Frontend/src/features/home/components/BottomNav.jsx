import React from 'react';
import { Store, Gamepad2, BarChart2, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const BottomNav = ({ activeTab = 'store' }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 border-t border-blue-500/20 bg-[#050810]/90 backdrop-blur-xl shadow-[0_-8px_25px_rgba(0,0,0,0.5)] md:hidden">
      <div className="flex justify-around items-center h-20 pb-safe px-4">
        <Link 
          to="/sellers"
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'store' 
              ? 'text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' 
              : 'text-slate-500 opacity-70 hover:opacity-100 hover:text-blue-300'
          }`}
        >
          <Store className="w-6 h-6" />
          <span className="font-['Noto_Sans_Devanagari'] text-[10px] font-bold mt-1">दुकान</span>
        </Link>
        
        <Link 
          to="/play"
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'play' 
              ? 'text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' 
              : 'text-slate-500 opacity-70 hover:opacity-100 hover:text-blue-300'
          }`}
        >
          <Gamepad2 className="w-6 h-6" />
          <span className="font-['Noto_Sans_Devanagari'] text-[10px] font-bold mt-1">खेलें</span>
        </Link>
        
        <Link 
          to="/leaderboard"
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'ranks' 
              ? 'text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' 
              : 'text-slate-500 opacity-70 hover:opacity-100 hover:text-blue-300'
          }`}
        >
          <BarChart2 className="w-6 h-6" />
          <span className="font-['Noto_Sans_Devanagari'] text-[10px] font-bold mt-1">लीडरबोर्ड</span>
        </Link>
        
        <Link 
          to="/profile"
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'profile' 
              ? 'text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' 
              : 'text-slate-500 opacity-70 hover:opacity-100 hover:text-blue-300'
          }`}
        >
          <User className="w-6 h-6" fill={activeTab === 'profile' ? "currentColor" : "none"} />
          <span className="font-['Noto_Sans_Devanagari'] text-[10px] font-bold mt-1">प्रोफ़ाइल</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
