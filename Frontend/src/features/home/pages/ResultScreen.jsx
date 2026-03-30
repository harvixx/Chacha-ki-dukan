import React from 'react';
import { ArrowLeft, Share2, Star, Footprints, TimerOff, RefreshCcw, Trophy } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { updateUserSessionLocally } from '../../../app/store/slices/authSlice';
import { updateUserSession } from '../../auth/services/auth.api';
import BottomNav from '../components/BottomNav';

const ResultScreen = ({ status = 'success' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const sessionUpdated = React.useRef(false);
  
  const navStatus = location.state?.status;
  const price = location.state?.price || 0;
  const listPrice = location.state?.listPrice || 25000;
  const productName = location.state?.productName || 'Samsung Galaxy S23';
  const sellerName = location.state?.sellerName || 'Seller';
  const roundsUsed = location.state?.roundsUsed || 0;
  const maxRounds = location.state?.maxRounds || 8;
  const productId = location.state?.productId || null;
  const sellerId = location.state?.sellerId || null;
  
  // Use server-returned score data if available, else compute client-side
  const serverScore = location.state?.serverScore || null;
  
  const finalStatus = navStatus || status;
  const isSuccess = finalStatus === 'success';
  
  // Prefer server scores, fallback to client calculation
  const savedAmount = serverScore?.savedAmount ?? (isSuccess ? listPrice - price : 0);
  const savedPercent = serverScore?.savedPercent ?? (isSuccess ? ((savedAmount / listPrice) * 100).toFixed(1) : 0);
  const baseScore = serverScore?.baseScore ?? (isSuccess ? Math.round((savedAmount / listPrice) * 1000) : 0);
  const efficiencyBonus = serverScore?.efficiencyBonus ?? (isSuccess ? Math.max(0, (maxRounds - roundsUsed) * 50) : 0);
  const totalScore = serverScore?.totalScore ?? (baseScore + efficiencyBonus);

  React.useEffect(() => {
    if (!sessionUpdated.current) {
      sessionUpdated.current = true;
      const submitSession = async () => {
        try {
          const res = await updateUserSession({
            productId,
            sellerId,
            productName,
            productIcon: 'Smartphone',
            sellerName,
            dealPrice: price,
            listPrice,
            savedAmount,
            savedPercent,
            status: isSuccess ? 'success' : 'walkaway',
            score: totalScore,
            sellerThemeColor: 'blue' 
          });
          
          if (res?.data?.success) {
            dispatch(updateUserSessionLocally(res.data.user));
            queryClient.invalidateQueries(); // Drop all cache to refresh global stats
          }
        } catch (err) {
          console.error("Failed to update session stats", err);
        }
      };
      
      submitSession();
    }
  }, [productName, sellerName, price, listPrice, savedAmount, savedPercent, isSuccess, totalScore, dispatch]);

  return (
    <div className={`bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col ${!isSuccess ? 'red-vignette' : ''}`}>
      

      <main className="flex flex-col items-center justify-start flex-grow w-full max-w-lg px-4 pt-24 pb-32 mx-auto">
        
        {/* Dynamic Hero Section */}
        {isSuccess ? (
          <section className="relative py-8 mb-10 text-center rounded-full confetti-overlay">
            <div className="mb-4 text-7xl animate-bounce">🤝</div>
            <h2 className="text-[40px] font-black text-[#22c55e] success-glow font-hindi leading-tight mb-2">DEAL पक्की! 🎉</h2>
            <p className="text-base font-medium text-on-surface-variant font-hindi">उस्ताद Negotiator! {sellerName} के पसीने छूट गए।</p>
          </section>
        ) : (
          <section className="mb-10 text-center">
            <div className="mb-4 text-7xl drop-shadow-xl">🚪</div>
            <h2 className="mb-2 text-4xl font-black tracking-tight font-hindi md:text-5xl text-error">{sellerName} ने भगा दिया! ❌</h2>
            <p className="text-lg font-medium text-on-surface-variant opacity-80">Tumne zyada zidd ki. Deal cancel.</p>
          </section>
        )}

        {/* Scorecard / Receipt */}
        <section className={`w-full max-w-md bg-[#0d1220] rounded-lg p-6 flex flex-col items-center relative overflow-hidden ${isSuccess ? 'neon-border border border-[#1e3a5f]/50' : 'border border-error/30 receipt-shadow'}`}>
          
          {isSuccess ? (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
          ) : (
            <>
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-error/40"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-error/40"></div>
            </>
          )}

          <div className="w-full mb-6 text-center">
            <h3 className="mb-1 text-2xl font-bold tracking-wide text-white font-body">{productName}</h3>
            <p className="text-sm font-medium tracking-widest uppercase text-on-surface-variant font-hindi">{sellerName}</p>
          </div>

          <div className="w-full mb-6 border-t-2 border-dashed border-outline-variant/30"></div>

          {/* The Math */}
          <div className="w-full mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base text-on-surface-variant font-hindi">MRP (शुरुआती कीमत)</span>
              <span className="font-bold line-through text-on-surface-variant">₹{listPrice.toLocaleString('en-IN')}</span>
            </div>
            
            {isSuccess ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high/40">
                <span className="font-bold text-on-surface font-hindi">Final Deal (तय हुआ)</span>
                <span className="text-xl font-extrabold tracking-tight text-white">₹{price.toLocaleString('en-IN')}</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="font-medium text-on-surface-variant">Final Deal</span>
                <span className="text-xl font-black tracking-tighter text-error">FAILED</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className={isSuccess ? "text-[#22c55e] font-hindi font-bold" : "text-on-surface-variant font-hindi text-base"}>
                {isSuccess ? "Total Savings (बचत)" : "Total Savings"}
              </span>
              <span className={isSuccess ? "text-[#22c55e] font-black text-lg" : "text-on-surface font-bold"}>
                {isSuccess ? `+ ₹${savedAmount.toLocaleString('en-IN')} (${savedPercent}%)` : "₹0"}
              </span>
            </div>
          </div>

          {/* Performance Stats Grid */}
          <div className={`grid grid-cols-2 ${isSuccess ? 'gap-[1px] bg-outline-variant/20 mt-4 border-t border-outline-variant/30' : 'gap-3 w-full mb-8'}`}>
            <div className={`bg-surface-container-low p-4 flex flex-col items-center justify-center text-center ${!isSuccess && 'rounded-lg border border-outline-variant/10'}`}>
              <span className="text-[10px] uppercase tracking-widest text-outline mb-1 font-bold">Rounds Used</span>
              <div className={`flex items-center gap-1 ${isSuccess ? 'text-yellow-500 font-black text-lg' : 'text-error font-bold text-lg'}`}>
                {roundsUsed} / {maxRounds}
                {!isSuccess && <TimerOff className="w-4 h-4" />}
              </div>
            </div>
            
            <div className={`bg-surface-container-low p-4 flex flex-col items-center justify-center text-center ${!isSuccess && 'rounded-lg border border-outline-variant/10'}`}>
              <span className="text-[10px] uppercase tracking-widest text-outline mb-1 font-bold">Base Score</span>
              <span className={isSuccess ? "text-primary font-black text-lg" : "text-on-surface-variant font-bold text-lg"}>
                {isSuccess ? `${baseScore} pts` : "0 pts"}
              </span>
            </div>
            
            <div className={`bg-surface-container-low p-4 flex flex-col items-center justify-center text-center ${!isSuccess && 'rounded-lg border border-outline-variant/10'}`}>
              <span className="text-[10px] uppercase tracking-widest text-outline mb-1 font-bold">Efficiency Bonus</span>
              <span className={isSuccess ? "text-primary font-black text-lg" : "text-on-surface-variant font-bold text-lg"}>
                {isSuccess ? `+${efficiencyBonus} pts` : "+0 pts"}
              </span>
            </div>
            
            <div className={`bg-surface-container-low p-4 flex flex-col items-center justify-center text-center ${!isSuccess && 'rounded-lg border border-outline-variant/10'}`}>
              <span className="text-[10px] uppercase tracking-widest text-outline mb-1 font-bold">Saved %</span>
              <span className={isSuccess ? "text-[#22c55e] font-black text-lg" : "text-on-surface-variant font-bold text-lg"}>
                {isSuccess ? `${savedPercent}%` : "0%"}
              </span>
            </div>
          </div>

          {/* Final Score Section */}
          <div className={isSuccess ? "bg-surface-container-highest/60 p-8 w-full flex flex-col items-center justify-center text-center mt-px" : "flex flex-col items-center pt-4 w-full"}>
            <span className={isSuccess ? "text-[12px] text-primary font-black uppercase tracking-[0.2em] mb-2" : "text-[10px] uppercase tracking-widest text-outline font-black mb-2"}>
              Final Performance Score
            </span>
            <div className={isSuccess ? "text-5xl font-black text-[#60a5fa] glow-sm tracking-tighter mb-2" : "text-6xl font-black text-outline/40 tracking-tighter mb-2"}>
              {isSuccess ? totalScore.toLocaleString('en-IN') : "0"}
            </div>
            <div className={`flex gap-1 ${isSuccess ? 'text-amber-500' : 'text-outline/20'}`}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-6 h-6" fill="currentColor" />
              ))}
            </div>
            {serverScore && (
              <p className="text-[10px] text-green-400/60 mt-2 uppercase tracking-widest">✓ Verified by Server</p>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="w-full max-w-md mt-10 space-y-4">
          <button 
            onClick={() => isSuccess ? navigate('/leaderboard') : navigate('/sellers')}
            className={`w-full font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-all active:scale-95 font-hindi ${isSuccess ? 'bg-[#3b82f6] text-white shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:brightness-110' : 'bg-primary text-on-primary hover:bg-primary-dim shadow-lg shadow-primary/20'}`}
          >
            <span className="text-lg">{isSuccess ? "Leaderboard देखो" : "Dobara Try Karo (Retry)"}</span>
            {isSuccess ? <Trophy className="w-5 h-5" /> : <RefreshCcw className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => isSuccess ? navigate('/sellers') : navigate('/leaderboard')}
            className={`w-full bg-transparent border-2 font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-all active:scale-95 font-hindi ${isSuccess ? 'border-[#3b82f6]/50 text-[#3b82f6] hover:bg-[#3b82f6]/10' : 'border-primary text-primary hover:bg-primary/10'}`}
          >
            <span className="text-lg">{isSuccess ? "फिर से खेलो (Play Again)" : "Leaderboard देखो"}</span>
            {isSuccess ? <RefreshCcw className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
          </button>

          {isSuccess && (
            <div className="pt-2 text-center">
              <button className="flex items-center justify-center gap-2 text-sm font-medium transition-colors text-slate-500 font-hindi hover:text-primary">
                Doston ke sath Share karo <Share2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {!isSuccess && (
          <div className="max-w-xs px-4 mt-12 text-sm italic text-center text-on-surface-variant/50">
            "Beta, har cheez muft mein nahi milti. Agli baar thoda tameez se aana!"
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default ResultScreen;
