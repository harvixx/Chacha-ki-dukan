import React, { useEffect } from 'react';
import { ArrowLeft, Trophy, Crown, Medal, Loader2, Sparkles, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../../../api/axios.api';
import BottomNav from '../components/BottomNav';
import TopNav from '../components/TopNav';

const Leaderboard = () => {
  const navigate = useNavigate();

  // FORCE KILL WHITE GAP AT HTML/BODY LEVEL
  useEffect(() => {
    document.documentElement.style.backgroundColor = '#050810';
    document.body.style.backgroundColor = '#050810';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const rawLeaderboard = data?.leaderboard || [];
  const playerRank = data?.playerRank || null;

  // Pad the leaderboard to ALWAYS have at least 10 slots for a full UI look
  const leaderboard = [...rawLeaderboard];
  while (leaderboard.length < 10) {
    leaderboard.push({ _id: `empty-${leaderboard.length}`, isEmpty: true });
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Reorder for Podium: [Rank 2, Rank 1, Rank 3]
  const podiumOrder = [top3[1], top3[0], top3[2]];

  const getInitials = (name) => {
    if (!name || name === 'Unknown') return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDisplayName = (entry) => {
    if (entry.isEmpty) return 'Waiting...';
    if (entry.playerName) return entry.playerName;
    if (entry.userId?.name) return entry.userId.name;
    if (entry.userId?.email) return entry.userId.email.split('@')[0];
    return 'Player';
  };

  const getSellerColor = (name) => {
    const map = {
      'Chacha': 'bg-blue-500/20 text-blue-400',
      'Sharma Ji': 'bg-amber-500/20 text-amber-400',
      'Meena Aunty': 'bg-pink-500/20 text-pink-400',
      'Rajesh Bhai': 'bg-orange-500/20 text-orange-400',
    };
    return map[name] || 'bg-slate-500/20 text-slate-300';
  };

  return (
    <div className="bg-[#050810] text-white font-body min-h-[100dvh] pb-24 selection:bg-blue-500/30">
      
      {/* TopNav */}
      <TopNav />

      {/* Google-esque Gradient Mesh Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-amber-500/5 rounded-full blur-[100px]"></div>
      </div>

      

      <main className="relative z-10 max-w-3xl px-4 pt-8 mx-auto">

        {/* Page Title */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 transition-colors rounded-full text-slate-300 hover:bg-white/10 active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <Trophy className="w-5 h-5 text-amber-400" />
            HALL OF FAME
          </h1>
        </div>

        {/* Header Title */}
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-black tracking-tighter md:text-5xl">
            Top Bargainers
          </h2>
          <p className="text-sm text-slate-400 md:text-base">
            Jinhone Chacha aur Sharma Ji ke paseene chuda diye.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 mb-4 text-blue-500 animate-spin" />
            <p className="font-medium text-slate-400">Fetching legends...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center border bg-red-500/10 border-red-500/20 rounded-2xl">
            <p className="font-bold text-red-400">Network Error</p>
            <p className="text-sm text-red-400/80">Could not load the leaderboard.</p>
          </div>
        ) : (
          <>
            {/* THE PODIUM (Always renders 3 slots) */}
            <div className="flex items-end justify-center gap-2 mb-12 md:gap-4">
              {podiumOrder.map((entry, index) => {
                // index 0 = Rank 2, index 1 = Rank 1, index 2 = Rank 3
                const isRank1 = index === 1;
                const isRank2 = index === 0;
                const isRank3 = index === 2;
                
                const height = isRank1 ? 'h-52 md:h-64' : isRank2 ? 'h-40 md:h-48' : 'h-36 md:h-44';
                const colors = isRank1 
                  ? 'bg-gradient-to-t from-yellow-500/20 to-yellow-500/5 border-yellow-500/40 text-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.15)]' 
                  : isRank2 
                  ? 'bg-gradient-to-t from-slate-400/20 to-slate-400/5 border-slate-400/40 text-slate-300' 
                  : 'bg-gradient-to-t from-orange-600/20 to-orange-600/5 border-orange-600/40 text-orange-500';
                
                const Icon = isRank1 ? Crown : Medal;
                
                if (entry.isEmpty) {
                  return (
                    <div key={entry._id} className={`flex-1 max-w-[120px] md:max-w-[140px] flex flex-col items-center justify-end ${height} rounded-t-3xl border-2 border-dashed border-white/10 bg-white/[0.02] p-4`}>
                       <UserPlus className="w-6 h-6 mb-2 text-white/20" />
                       <span className="text-[10px] md:text-xs text-center text-white/30 font-medium">Spot Open</span>
                    </div>
                  );
                }

                const name = getDisplayName(entry);
                return (
                  <div key={entry._id} className={`flex-1 max-w-[120px] md:max-w-[150px] flex flex-col items-center relative ${height} rounded-t-3xl border-t border-x ${colors} p-3 md:p-4 transition-all hover:brightness-110`}>
                    
                    {/* Rank Badge */}
                    <div className="absolute -top-5 bg-[#050810] rounded-full p-1.5 shadow-xl">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-current/10 border border-current`}>
                        <Icon className="w-4 h-4" fill="currentColor" />
                      </div>
                    </div>

                    <div className="flex flex-col items-center w-full mt-6">
                      {/* Avatar */}
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-current bg-[#050810] flex items-center justify-center font-black text-lg md:text-xl mb-3`}>
                        {getInitials(name)}
                      </div>
                      
                      {/* Details */}
                      <span className="w-full text-xs font-bold text-center text-white md:text-sm line-clamp-1">{name}</span>
                      <span className="mt-1 text-sm font-black tracking-tight text-current md:text-lg">{(entry.totalScore || 0).toLocaleString()}</span>
                      <span className="text-[9px] text-white/50 uppercase mt-1 hidden md:block">{(entry.savedPercent?.toFixed(0) || 0)}% OFF</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* THE REST OF THE LIST (Rank 4 to 10) */}
            <div className="space-y-3">
              <h3 className="px-2 mb-4 text-xs font-bold tracking-widest uppercase text-slate-500">Top 10 Challengers</h3>
              
              {rest.map((entry, index) => {
                const rank = index + 4;
                
                if (entry.isEmpty) {
                  return (
                    <div key={entry._id} className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                      <span className="w-6 font-black text-center text-white/20">#{rank}</span>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5">
                        <UserPlus className="w-4 h-4 text-white/20" />
                      </div>
                      <span className="text-sm italic text-white/30">Awaiting challenger...</span>
                    </div>
                  );
                }

                const name = getDisplayName(entry);
                const seller = entry.sellerId?.name || 'Unknown';
                const sellerTheme = getSellerColor(seller);

                return (
                  <div key={entry._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors group">
                    <div className="flex items-center gap-4">
                      <span className="w-6 font-black text-center transition-colors text-slate-500 group-hover:text-white">#{rank}</span>
                      
                      <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-blue-400 border rounded-full bg-blue-500/20 border-blue-500/30">
                        {getInitials(name)}
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white md:text-base">{name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-medium text-emerald-400">₹{(entry.savedAmount || 0).toLocaleString()} Saved</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-bold ${sellerTheme}`}>{seller}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-base font-black text-blue-400 md:text-lg">{(entry.totalScore || 0).toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">PTS</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Floating Bottom Action (If player rank exists) */}
      {playerRank && (
        <div className="fixed bottom-[4.5rem] md:bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[400px] z-40">
          <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Your Current Rank</p>
                <p className="text-lg font-black text-white">#{playerRank}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/sellers')}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            >
              Play Now
            </button>
          </div>
        </div>
      )}

      {/* Standard Bottom Nav */}
      <BottomNav activeTab="ranks" />
    </div>
  );
};

export default Leaderboard;