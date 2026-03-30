import React, { useRef } from 'react';
import { MapPin, Trophy, ArrowRight, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSellers, getLeaderboard } from '../../../api/axios.api';
import TopNav from '../components/TopNav';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion';

// ── Theme config ──────────────────────────────────────────
const THEMES = {
  blue: { border: 'border-blue-500/25', glow: 'hover:shadow-[0_20px_60px_rgba(59,130,246,0.25)]', badge: 'bg-blue-500', text: 'text-blue-400', tag: 'bg-blue-500/10 border-blue-500/20 text-blue-300', btn: 'bg-blue-600 hover:bg-blue-500', ring: 'ring-blue-500/50', line: 'via-blue-500/60', stat: 'text-blue-400' },
  emerald: { border: 'border-emerald-500/25', glow: 'hover:shadow-[0_20px_60px_rgba(16,185,129,0.25)]', badge: 'bg-emerald-500', text: 'text-emerald-400', tag: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300', btn: 'bg-emerald-600 hover:bg-emerald-500', ring: 'ring-emerald-500/50', line: 'via-emerald-500/60', stat: 'text-emerald-400' },
  pink: { border: 'border-pink-500/25', glow: 'hover:shadow-[0_20px_60px_rgba(236,72,153,0.25)]', badge: 'bg-pink-500', text: 'text-pink-400', tag: 'bg-pink-500/10 border-pink-500/20 text-pink-300', btn: 'bg-pink-600 hover:bg-pink-500', ring: 'ring-pink-500/50', line: 'via-pink-500/60', stat: 'text-pink-400' },
  orange: { border: 'border-orange-500/25', glow: 'hover:shadow-[0_20px_60px_rgba(249,115,22,0.25)]', badge: 'bg-orange-500', text: 'text-orange-400', tag: 'bg-orange-500/10 border-orange-500/20 text-orange-300', btn: 'bg-orange-600 hover:bg-orange-500', ring: 'ring-orange-500/50', line: 'via-orange-500/60', stat: 'text-orange-400' },
};

const getColor = (c) => c === 'emerald' ? 'emerald' : c === 'pink' ? 'pink' : c === 'amber' ? 'orange' : 'blue';
const getTheme = (c) => THEMES[c] || THEMES.blue;
const MEDALS = ['🥇', '🥈', '🥉'];
const LB_COLORS = ['text-amber-400', 'text-slate-400', 'text-orange-500'];

// ── Floating particle ─────────────────────────────────────
const Particle = ({ x, y, size, color, duration, delay }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color }}
    animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ── Seller Card ───────────────────────────────────────────
// ── Seller Card ───────────────────────────────────────────
const SellerCard = ({ seller, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const color = getColor(seller.themeColor);
  const t = getTheme(color);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: 8 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
      whileHover={{ y: -10, transition: { duration: 0.3, ease: 'easeOut' } }}
      className={`group relative flex flex-col bg-[#0a0d18] rounded-2xl overflow-hidden border ${t.border} ${t.glow} transition-shadow duration-500`}
    >
      {/* Top glow line */}
      <div className={`h-px w-full bg-gradient-to-r from-transparent ${t.line} to-transparent`} />

      {/* ── BANNER (FIXED: SQUARE ASPECT FOR CLEAR FACES) ── */}
      <div className="relative flex-shrink-0 w-full overflow-hidden bg-[#050810] aspect-square max-h-[420px]">
        {/* ^ Aspect-square kiya taaki portrait images ka chehra center mein aaye, max-h se desktop pe zyada lamba nahi hoga */}

        <motion.img
          src={seller.imageUrl}
          alt={seller.name}
          // object-cover width poori lega, object-center chehre ko beech mein rakhega
          className="absolute inset-0 object-cover object-center w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />

        {/* Dark gradient overlay - identity clear karne ke liye */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0a0d18] via-transparent to-transparent opacity-80" />

        {/* Identity area ko thoda upar push kiya taaki chehra na dhake */}
        <div className="absolute z-30 flex items-end gap-3 bottom-3 left-3">


          <div className="pb-0.5">
            <span className={`${t.badge} text-white text-[16px]  px-1.5 py-0.5 rounded-sm tracking-widest`}>
              {seller.category}
            </span>
            <h3 className="text-[40px] font-black font-['Teko'] text-white leading-[0.9] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-tight">
              {seller.name}
            </h3>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex flex-col flex-1 gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span>{seller.location}</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {seller.personalityTags?.map((tag) => (
              <span key={tag} className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border ${t.tag}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.05]" />

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/[0.02] rounded-xl p-2.5 text-center border border-white/[0.04] flex flex-col items-center gap-1">
            <p className="text-[8px] text-slate-500 uppercase font-black">कठिनाई</p>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-2 h-2 ${s <= seller.difficulty ? t.text : 'text-white/5'}`} fill={s <= seller.difficulty ? 'currentColor' : 'none'} />
              ))}
            </div>
          </div>

          <div className="bg-white/[0.02] rounded-xl p-2.5 text-center border border-white/[0.04] flex flex-col items-center gap-1">
            <p className="text-[8px] text-slate-500 uppercase font-black">Games</p>
            <p className={`text-xs font-black ${t.stat}`}>{(seller.playersCount || 0)}</p>
          </div>

          <div className="bg-white/[0.02] rounded-xl p-2.5 text-center border border-white/[0.04] flex flex-col items-center gap-1">
            <p className="text-[8px] text-slate-500 uppercase font-black">Best Deal</p>
            <p className="text-xs font-black text-green-400">{(seller.bestDealAmount || 0).toFixed(1)}%</p>
          </div>
        </div>

        <div className="pt-2 mt-auto">
          <Link
            to={`/products/${seller._id}`}
            className={`w-full flex items-center justify-center gap-2 py-3 ${t.btn} text-white font-black uppercase tracking-[0.15em] rounded-xl text-xs transition-all shadow-lg active:scale-95`}
          >
            <span>दुकान में घुसो</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
// ── Main Page ─────────────────────────────────────────────
const SellersPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroO = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const { data: sellers = [], isLoading, error } = useQuery({ 
    queryKey: ['sellers'], 
    queryFn: getSellers,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
  const { data: lbData } = useQuery({ 
    queryKey: ['leaderboard-preview'], 
    queryFn: getLeaderboard,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
  const topEntries = (lbData?.leaderboard || []).slice(0, 3);

  const getDisplayName = (e) => {
    if (e.playerName) return e.playerName;
    if (e.userId?.name) return e.userId.name;
    if (e.userId?.email) return e.userId.email.split('@')[0];
    return 'Player';
  };

  // Particles config
  const particles = [
    { x: 10, y: 20, size: 4, color: 'rgba(59,130,246,0.5)', duration: 4, delay: 0 },
    { x: 85, y: 15, size: 3, color: 'rgba(236,72,153,0.4)', duration: 5, delay: 1 },
    { x: 60, y: 40, size: 5, color: 'rgba(245,158,11,0.4)', duration: 3.5, delay: 0.5 },
    { x: 25, y: 60, size: 3, color: 'rgba(16,185,129,0.4)', duration: 4.5, delay: 1.5 },
    { x: 75, y: 70, size: 4, color: 'rgba(59,130,246,0.3)', duration: 5, delay: 2 },
    { x: 45, y: 85, size: 3, color: 'rgba(249,115,22,0.4)', duration: 4, delay: 0.8 },
  ];

  return (
    <div className="min-h-screen bg-[#050810] text-white overflow-x-hidden">
      <TopNav />

      {/* ── HERO ──────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[60vh] flex items-center overflow-hidden px-4 pt-32 pb-16 md:px-8">

        {/* Ambient particles */}
        {particles.map((p, i) => <Particle key={i} {...p} />)}

        {/* Big glow orbs */}
        <div className="absolute rounded-full pointer-events-none top-20 left-1/4 w-96 h-96 bg-blue-600/5 blur-3xl" />
        <div className="absolute bottom-0 w-64 h-64 rounded-full pointer-events-none right-1/4 bg-purple-600/5 blur-3xl" />

        {/* Animated grid lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-l border-white/20"
              style={{ left: `${(i + 1) * 12.5}%` }}
            />
          ))}
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroO }}
          className="relative z-10 w-full mx-auto max-w-7xl"
        >
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 border rounded-full bg-blue-500/10 border-blue-500/20 backdrop-blur-sm">
              <motion.span
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">
                Live Market — {sellers.length || 4} Sellers Online
              </span>
            </span>
          </motion.div>

          {/* Main heading — letter by letter */}
          <div className="mb-6 overflow-hidden">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl font-black tracking-tighter leading-[1.0] md:text-7xl lg:text-8xl"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400">
                कौन सी दुकान
              </span>
              <motion.span
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600"
              >
                में जाओगे आज?
              </motion.span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="max-w-xl text-lg leading-relaxed text-slate-400"
          >
            Har seller alag hai — alag psychology, alag tactics, alag price.{' '}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="font-bold text-blue-400"
            >
              Sabko beat karo.
            </motion.span>
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-3 mt-10"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-white/10 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-2 bg-blue-400 rounded-full" />
            </motion.div>
            <span className="text-xs font-bold tracking-widest uppercase text-slate-600">
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>
      </section>

      <main className="px-4 pb-24 mx-auto max-w-7xl md:px-8">

        {/* ── SELLER CARDS ──────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 mb-20 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="h-[440px] rounded-2xl bg-white/[0.03] border border-white/5"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-5xl"
            >
              😵
            </motion.span>
            <p className="text-lg font-black text-red-400">Dukaan band hai abhi!</p>
            <p className="text-sm text-slate-500">Network error. Dobara try karo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mb-24 lg:grid-cols-2">
            {sellers.map((seller, i) => (
              <SellerCard key={seller._id} seller={seller} index={i} />
            ))}
          </div>
        )}

        {/* ── LEADERBOARD ───────────────────────────────── */}
        <LBSection topEntries={topEntries} getDisplayName={getDisplayName} />
      </main>
    </div>
  );
};

// ── Leaderboard Section ───────────────────────────────────
const LBSection = ({ topEntries, getDisplayName }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-[#0a0d18] border border-white/[0.06] p-6 md:p-8"
    >
      {/* Ambient glow */}
      <div className="absolute h-40 -translate-x-1/2 rounded-full pointer-events-none -top-20 left-1/2 w-80 bg-amber-500/5 blur-3xl" />

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      {/* BG trophy */}
      <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none">
        <Trophy className="w-64 h-64 text-amber-400" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={inView ? { rotate: [0, 10, -5, 0], scale: [1, 1.1, 1] } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <Trophy className="w-5 h-5 text-amber-400" fill="currentColor" />
          </motion.div>
          <div>
            <h3 className="text-lg font-black text-white">Aaj ke Top Negotiators</h3>
            <p className="text-xs text-slate-500 mt-0.5">Sabse khatarnak bargaining karne wale log</p>
          </div>
        </motion.div>

        <Link
          to="/leaderboard"
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 border border-blue-500/20 rounded-lg px-3 py-2 hover:bg-blue-500/10 transition-all"
        >
          Poora Dekho <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {['Rank', 'Player', 'Seller', 'Score', 'Savings'].map((h, i) => (
                <th key={h} className={`pb-3 px-3 text-[10px] font-black uppercase tracking-widest text-slate-600 ${i === 4 ? 'text-right' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {topEntries.length > 0 ? topEntries.map((entry, idx) => (
              <motion.tr
                key={entry._id}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                className="transition-colors"
              >
                <td className="px-3 py-4">
                  <span className={`text-xl font-black ${LB_COLORS[idx]}`}>{MEDALS[idx]}</span>
                </td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1e3a5f] border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xs flex-shrink-0">
                      {getDisplayName(entry).charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-sm text-white truncate max-w-[100px]">
                      {getDisplayName(entry)}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <span className="text-xs text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded-lg">
                    {entry.sellerId?.name || 'Unknown'}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-1">
                    <Zap className="flex-shrink-0 w-3 h-3 text-amber-400" />
                    <span className="text-sm font-black text-amber-400">
                      {(entry.totalScore || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4 text-right">
                  <span className="text-sm font-black text-green-400">
                    +₹{(entry.savedAmount || 0).toLocaleString('en-IN')}
                  </span>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <span className="text-4xl">🏪</span>
                    <p className="text-sm font-bold text-slate-500">Abhi tak koi deal nahi hui.</p>
                    <p className="text-xs text-slate-600">Pehle player bano!</p>
                  </motion.div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
};

export default SellersPage;
