import React from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthTopNav = () => {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#050810] shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-4">
        <button className="text-blue-500 cursor-pointer hover:bg-white/5 transition-colors p-2 rounded">
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/">
          <h1 className="text-2xl font-black text-blue-500 font-['Noto_Serif','Noto_Sans_Devanagari'] tracking-tight drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">चाचा की दुकान</h1>
        </Link>
      </div>

      <div className="hidden md:block flex-1 max-w-2xl mx-8 px-4 py-1 bg-surface-container-lowest rounded border border-outline-variant/20 ticker-wrap">
        <div className="ticker-content text-sm font-label text-on-surface-variant italic">
          🔥 Rahul ne ₹3,200 bachaye! | Priya #1 on leaderboard! | Sharma Ji ne aaj kisi ko nahi choda! | Naya Maal Aaya Hai: iPhone 15 Pro Max! | Rajesh Bhai ka Karol Bagh stock khatam ho raha hai...
        </div>
      </div>

      <div className="flex items-center gap-3 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/10">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-on-surface leading-none">खिलाड़ी नंबर १</p>
          <p className="text-[10px] text-blue-400">₹45,200 XP</p>
        </div>
        <img 
          alt="Profile" 
          className="w-8 h-8 rounded-full border-2 border-blue-500" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOvT1gUvDBo9RnjKzjx9IUzBzjX7VQQ8oojsYqWUJcO_nrsAgq1vLnSH9ThQXDOiduOoJKuCyf62v70HgGtNjPyi3M23_bTKyzwPOoFWP0weqQ68P-9eS1T9vowyKq08lcyWBUJ_voxnYidyI88OBHBwCbiZVBtmcK4IsZYyOHJp3SAhuUt0XpvhGpfinlv_dVeapLdsEmaorI40mG2RlQsF8uQevXRVPU9nsUko_x7q_RgYvkFz2L8id3T8wmpXcZjI4ZIb4sYxc"
        />
      </div>
    </header>
  );
};

export default AuthTopNav;
