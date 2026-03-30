import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Info, Handshake, Send } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useChat } from '../../../app/hooks/useChat';
import { useToast } from '../components/Toast';

const GameScreen = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const sellerIdFromUrl = searchParams.get('sellerId');
  const productIdFromUrl = searchParams.get('productId');

  const { user } = useSelector((state) => state.auth);
  const userId = user?.id || user?._id || null;
  const playerName = user?.name || user?.email || 'Player';

  const {
    messages, currentOffer, chachaTyping,
    gameState, isGameOver, errorStatus,
    dealResult, walkAwayResult,
    sendMessage, acceptDeal, walkAway,
  } = useChat(userId, sellerIdFromUrl, productIdFromUrl);

  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  // Fallbacks
  const listPrice = gameState?.listPrice || 25000;
  const productName = gameState?.productName || 'Product';
  const sellerName = 'Seller';
  const moodScore = gameState?.moodScore || 3;
  const currentRound = gameState?.currentRound || 0;
  const maxRounds = gameState?.maxRounds || 8;
  
  const saved = listPrice - (currentOffer || 0);
  const savedPct = listPrice > 0 ? ((saved / listPrice) * 100).toFixed(1) : '0.0';
  const isLowRounds = currentRound >= maxRounds - 2 && currentRound > 0;

  // Mood config
  const MOOD_LABELS = ['Furious', 'Annoyed', 'Neutral', 'Warm', 'Happy'];
  const MOOD_COLORS = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const moodIdx = Math.min(Math.max(Math.round(moodScore) - 1, 0), 4);
  const moodColor = MOOD_COLORS[moodIdx];
  const moodLabel = MOOD_LABELS[moodIdx];

  // Auto scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, chachaTyping]);

  // Error Handling
  useEffect(() => {
    if (errorStatus) toast.error(errorStatus);
  }, [errorStatus, toast]);

  // Navigation Logic (Success)
  useEffect(() => {
    if (dealResult?.scoreData) {
      navigate('/result', {
        state: {
          status: 'success',
          price: dealResult.scoreData.dealPrice,
          listPrice,
          productName,
          sellerName,
          roundsUsed: currentRound,
          maxRounds,
          serverScore: dealResult.scoreData,
          productId: productIdFromUrl,
          sellerId: sellerIdFromUrl,
        },
      });
    }
  }, [dealResult, navigate, listPrice, productName, sellerName, currentRound, maxRounds, productIdFromUrl, sellerIdFromUrl]);

  // Navigation Logic (Walk Away)
  useEffect(() => {
    if (walkAwayResult) {
      navigate('/result', {
        state: {
          status: 'failed',
          price: currentOffer,
          listPrice,
          productName,
          sellerName,
          roundsUsed: currentRound,
          maxRounds,
          productId: productIdFromUrl,
          sellerId: sellerIdFromUrl,
        },
      });
    }
  }, [walkAwayResult, navigate, currentOffer, listPrice, productName, sellerName, currentRound, maxRounds, productIdFromUrl, sellerIdFromUrl]);

  // Actions
  const handleSend = useCallback(() => {
    if (inputText.trim() && !chachaTyping) {
      sendMessage(inputText);
      setInputText('');
    }
  }, [inputText, chachaTyping, sendMessage]);

  const handleTactic = (t) => {
    if (!chachaTyping) sendMessage(t);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const TACTICS = [
    { label: 'Main ja raha hoon!', color: 'border-red-500/30 text-red-300 bg-red-500/5' },
    { label: 'Cash dunga abhi!', color: 'border-green-500/30 text-green-300 bg-green-500/5' },
    { label: 'Purana customer hoon', color: 'border-amber-500/30 text-amber-300 bg-amber-500/5' },
  ];

  return (
    <div className="fixed inset-0 flex flex-col bg-[#050810] text-white overflow-hidden">
      
      {/* ── TOP BAR ── */}
      <header className="flex-shrink-0 flex justify-between items-center px-4 h-16 bg-[#050810] border-b border-white/[0.06] z-10">
        <button
          onClick={() => walkAway(sellerName)}
          className="flex items-center gap-1.5 text-[10px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider hover:bg-red-500/20 active:scale-95 transition-all"
        >
          <X className="w-3.5 h-3.5" />
          छोड़ें
        </button>

        <div className="flex flex-col items-center text-center">
          <h1 className="text-sm font-black text-white leading-tight truncate max-w-[140px]">
            {productName}
          </h1>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isLowRounds ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
            Round {currentRound} / {maxRounds}
          </span>
        </div>

        <button className="p-2">
           <Info className="w-4 h-4 text-slate-600 hover:text-slate-400" />
        </button>
      </header>

      {/* ── SELLER + PRICE BAR ── */}
      <section className="flex-shrink-0 bg-[#0a0d18] border-b border-white/[0.06] shadow-xl">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#112240] border border-blue-500/20 flex items-center justify-center text-2xl shadow-inner">
                🧑‍💼
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${moodColor} border-[3px] border-[#0a0d18] shadow-sm`} />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase">SELLER</span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                  moodIdx >= 3 ? 'bg-green-500/10 text-green-400' :
                  moodIdx >= 2 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {moodLabel}
                </span>
              </div>
              <div className="flex gap-1.5 items-center">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
                    i <= moodIdx ? `${moodColor} w-4` : 'bg-white/10 w-2'
                  }`} />
                ))}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black tracking-tighter text-blue-400 tabular-nums">
              ₹{currentOffer?.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <span className="text-[10px] font-bold text-green-500/90 uppercase">Saved ₹{saved.toLocaleString('en-IN')}</span>
              {saved > 0 && <span className="text-[10px] font-medium text-slate-500">({savedPct}%)</span>}
            </div>
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="w-full h-1.5 overflow-hidden rounded-full bg-white/5 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${isLowRounds ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${(currentRound / maxRounds) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* ── CHAT ── */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth bg-[#050810]">
        {messages.length === 0 && !chachaTyping && (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-white/5">🏪</div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">
              Dukan khul rahi hai...<br/>Bargaining shuru karein!
            </p>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isSeller = msg.role === 'assistant';
          return (
            <div key={idx} className={`flex flex-col ${isSeller ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <span className="text-[9px] font-black uppercase tracking-widest mb-1.5 px-1 text-slate-600">
                {isSeller ? sellerName : 'You'}
              </span>
              <div className={`max-w-[85%] px-4 py-3 text-[15px] shadow-sm ${
                isSeller
                  ? 'bg-[#0d1829] border border-white/5 rounded-2xl rounded-tl-none text-slate-200'
                  : 'bg-blue-600 rounded-2xl rounded-tr-none text-white font-medium'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}

        {chachaTyping && (
          <div className="flex flex-col items-start animate-pulse">
            <span className="text-[9px] font-black uppercase tracking-widest mb-1.5 text-slate-600">Typing...</span>
            <div className="bg-[#0d1829] rounded-2xl rounded-tl-none px-4 py-4 flex gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} className="h-4" />
      </main>

      {/* ── FOOTER ── */}
      <footer className="flex-shrink-0 bg-[#0a0d18] border-t border-white/[0.06] p-4 pb-safe-area-inset-bottom">
        <div className="flex gap-2 pb-1 mb-4 overflow-x-auto no-scrollbar">
          {TACTICS.map((t, i) => (
            <button
              key={i}
              onClick={() => handleTactic(t.label)}
              disabled={chachaTyping}
              className={`flex-shrink-0 px-4 py-2 text-[10px] font-black border rounded-xl uppercase tracking-wider transition-all hover:brightness-110 active:scale-95 disabled:opacity-30 ${t.color}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-stretch h-12 gap-2">
          <div className="relative flex-1">
            <input
              className="w-full h-full px-4 py-2 text-[15px] bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500/50 placeholder:text-slate-600 text-white transition-all disabled:opacity-50"
              placeholder="Message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={chachaTyping}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={chachaTyping || !inputText.trim()}
            className="flex items-center justify-center w-12 transition-all bg-blue-600 rounded-xl hover:bg-blue-500 active:scale-95 disabled:bg-white/5 disabled:text-slate-700"
          >
            <Send className="w-5 h-5" />
          </button>

          <button
            onClick={() => acceptDeal(playerName, sellerName)}
            disabled={chachaTyping}
            className="flex flex-col items-center justify-center px-5 transition-all bg-green-600 shadow-lg hover:bg-green-500 rounded-xl active:scale-95 disabled:opacity-30 shadow-green-900/20"
          >
            <Handshake className="w-5 h-5 mb-0.5" />
            <span className="text-[8px] font-black uppercase">Deal</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default GameScreen;