import React, { useEffect, useRef } from 'react';
import { 
  ArrowLeft, Settings, 
  History, Smartphone, 
  Laptop, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { fetchUser } from '../../../app/store/slices/authSlice';
import TopNav from '../../home/components/TopNav';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, loading } = useSelector((state) => state.auth);
  const fetchAttempted = useRef(false);

  useEffect(() => {
    if (!loading && !user && !fetchAttempted.current) {
      dispatch(fetchUser());
      fetchAttempted.current = true;
    }
  }, [dispatch, user, loading]);

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#000000';
    document.body.style.backgroundColor = '#000000';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  if (loading && !user) {
    return (
      <div className="bg-[#000000] min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 mb-4 text-blue-500 animate-spin" />
        <p className="text-sm tracking-widest uppercase text-slate-500 font-headline animate-pulse font-hindi">डेटा लोड हो रहा है...</p>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="bg-[#000000] min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="mb-4 text-xl text-white font-hindi">सेशन समाप्त हो गया है!</h2>
        <button 
          onClick={() => navigate('/login')} 
          className="px-8 py-3 font-bold text-white transition-transform bg-blue-600 rounded-xl active:scale-95"
        >
          Login Again
        </button>
      </div>
    );
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'GU';

  return (
    <div className="font-body selection:bg-primary selection:text-white text-on-surface bg-[#000000] min-h-screen w-full overflow-x-hidden pb-16">
      {/* Top Navigation */}
      <TopNav />
      
      {/* Mobile AppBar */}
      <header className="md:hidden fixed top-0 w-full z-40 bg-[#050810]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between w-full h-16 px-6">
          <button onClick={() => navigate(-1)} className="text-blue-500 transition-transform active:scale-95">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg tracking-tight font-headline text-on-surface font-hindi">मेरा प्रोफ़ाइल</h1>
          <button className="text-blue-500 transition-transform active:scale-95">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-6 px-4 pt-24 mx-auto max-w-7xl lg:grid-cols-12">
        
        {/* LEFT COLUMN: User Card & Stats */}
        <div className="space-y-6 lg:col-span-4">
          <section className="relative p-6 overflow-hidden border shadow-2xl bg-white/5 rounded-2xl border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-24 h-24 p-1 rounded-full shadow-lg bg-gradient-to-br from-amber-400 to-blue-600">
                <div className="flex items-center justify-center w-full h-full border-2 rounded-full bg-[#0a0f1d] border-black">
                  <span className="text-2xl font-black tracking-widest text-white">{initials}</span>
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white font-hindi">{user?.name}</h2>
                <p className="text-sm italic text-slate-400">{user?.email}</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {[
              { label: 'Games', val: user?.stats?.gamesCount || '0', color: 'text-blue-400' },
              { label: 'Saved', val: `₹${((user?.stats?.totalSaved || 0)/1000).toFixed(1)}K`, color: 'text-green-500' },
              { label: 'Best %', val: `${user?.stats?.bestSavingPercent || 0}%`, color: 'text-amber-500' },
              { label: 'Win Rate', val: `${user?.stats?.winRate || 0}%`, color: 'text-purple-400' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 text-center border shadow-inner rounded-2xl bg-white/5 border-white/5">
                <span className={`text-xl font-black ${stat.color}`}>{stat.val}</span>
                <span className="text-[10px] uppercase text-slate-500 font-black tracking-tighter">{stat.label}</span>
              </div>
            ))}
          </section>
        </div>

        {/* RIGHT COLUMN: Negotiation History */}
        <div className="space-y-6 lg:col-span-8">
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-bold text-white font-hindi">
              <History className="w-6 h-6 text-blue-500" />
              हाल के खेल
            </h3>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-white/10">
              {user?.negotiationHistory?.length > 0 ? (
                [...user.negotiationHistory].reverse().map((game, idx) => {
                  let IconComp = <Smartphone />;
                  if (game.productIcon === 'Laptop') IconComp = <Laptop />;

                  const isSuccess = game.status === 'success';
                  const timeFormatted = new Date(game.timeAgo || Date.now()).toLocaleDateString('en-IN', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  });

                  return (
                    <HistoryItem 
                      key={idx}
                      icon={IconComp} 
                      title={game.productName} 
                      time={timeFormatted}
                      xp={`+${game.xpEarned || 0}`} 
                      price={isSuccess ? `₹${game.dealPrice?.toLocaleString('en-IN')}` : "Walked Away"} 
                      saved={isSuccess ? `₹${game.savedAmount?.toLocaleString('en-IN')} (${game.savedPercent})` : "0%"} 
                      iconBg={isSuccess ? "bg-blue-500" : "bg-red-500"} 
                    />
                  );
                })
              ) : (
                <div className="py-4 pl-12 text-sm italic text-slate-500 font-hindi">
                  कोई इतिहास नहीं मिला! जाओ अपनी पहली डील क्रैक करो।
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const HistoryItem = ({ icon, title, time, xp, price, saved, iconBg }) => (
  <div className="relative pl-12 group">
    <div className={`absolute left-0 z-10 flex items-center justify-center w-10 h-10 ${iconBg} border-4 rounded-full top-1 border-black transition-transform group-hover:scale-110 shadow-lg`}>
      {React.cloneElement(icon, { className: "w-5 h-5 text-white" })}
    </div>
    <div className="p-5 space-y-3 transition-colors border bg-white/5 rounded-2xl border-white/5 hover:border-blue-500/30">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-lg font-bold text-white font-hindi">{title}</h4>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{time}</p>
        </div>
        <span className="text-sm font-black text-green-500">{xp} <span className="text-[10px]">XP</span></span>
      </div>
      <div className="flex gap-6 pt-2 border-t border-white/5">
        <div className="flex-1">
          <p className="text-[9px] uppercase text-slate-500 font-black tracking-tighter mb-1">Deal Price</p>
          <p className="font-bold text-white text-md">{price}</p>
        </div>
        <div className="flex-1 pl-6 border-l border-white/10">
          <p className="text-[9px] uppercase text-slate-500 font-black tracking-tighter mb-1">Savings</p>
          <p className="font-bold text-green-400 text-md">{saved}</p>
        </div>
      </div>
    </div>
  </div>
);

export default ProfilePage;