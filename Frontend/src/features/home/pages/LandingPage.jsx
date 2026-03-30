import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { ChevronsDown, Quote, Star, Share2, Bell, Store, LogOut } from 'lucide-react';
import { useLandingData } from '../hooks/useLandingData';
import { getAssetUrl } from '../../../api/axios.api';

// ─────────────────────────────────────────────────────────────
// THEME CONFIGURATION
// ─────────────────────────────────────────────────────────────
const THEME_CONFIG = {
  blue: {
    cardBg: 'bg-[#050810]',
    gradientFrom: 'from-[#050810]',
    border: 'border-primary/20 hover:border-primary',
    shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.1)]',
    labelColor: 'text-primary',
    badgeBg: 'bg-primary',
    avatarBg: 'bg-primary/20',
    avatarText: 'text-primary',
  },
  emerald: {
    cardBg: 'bg-[#0f0800]',
    gradientFrom: 'from-[#0f0800]',
    border: 'border-amber-500/20 hover:border-amber-500',
    shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]',
    labelColor: 'text-amber-500',
    badgeBg: 'bg-amber-500',
    avatarBg: 'bg-amber-500/20',
    avatarText: 'text-amber-500',
  },
  pink: {
    cardBg: 'bg-[#0f0508]',
    gradientFrom: 'from-[#0f0508]',
    border: 'border-pink-500/20 hover:border-pink-500',
    shadow: 'shadow-[0_0_20px_rgba(236,72,153,0.1)]',
    labelColor: 'text-pink-500',
    badgeBg: 'bg-pink-500',
    avatarBg: 'bg-pink-500/20',
    avatarText: 'text-pink-500',
  },
  amber: {
    cardBg: 'bg-[#0a0800]',
    gradientFrom: 'from-[#0a0800]',
    border: 'border-amber-600/20 hover:border-amber-600',
    shadow: 'shadow-[0_0_20px_rgba(217,119,6,0.1)]',
    labelColor: 'text-amber-600',
    badgeBg: 'bg-amber-600',
    avatarBg: 'bg-amber-600/20',
    avatarText: 'text-amber-600',
  },
};

const SPECIALTY_MAP = {
  'Electronics': 'Electronics King',
  'Computer Hardware': 'IT Specialist',
  'Clothing': 'Style Queen',
  'Mobile Accessories': 'Accessories Baron',
};

const QUOTE_MAP = {
  'Friendly': "I don't sell gadgets, I sell dreams. And dreams don't have discounts.",
  'Sarcastic': "Betaji, original product has original price. Negotiation is for amateurs.",
  'Dramatic': "If you can't spot the flaw, you're paying for the shine. Simple logic.",
  'No-nonsense': "Speed costs money. How fast do you want to go, bhai?",
  'Bossy': "My price is my price. You take it or you leave it. Simple.",
  'Stubborn': "Main ek rupaya bhi nahi chodta. This is non-negotiable.",
  'Clever': "I have been doing this for 30 years, beta. I know every trick.",
};

const getSellerQuote = (seller) => {
  const tags = seller.personalityTags || [];
  for (const tag of tags) {
    if (QUOTE_MAP[tag]) return QUOTE_MAP[tag];
  }
  return "Best deals, best maal. Aao, baat karte hain.";
};

const getSellerStats = (difficulty) => ({
  success: `${98 - (difficulty - 1) * 7}%`,
  level: 99 - (difficulty - 1) * 12,
});

const getDifficultyBadge = (difficulty) => {
  if (difficulty === 1) return { label: 'LEGENDARY', pulse: true };
  if (difficulty >= 4) return { label: 'BOSS', pulse: false };
  return null;
};

const getPlayerQuote = (entry) => {
  const saved = (entry.savedAmount || 0).toLocaleString('en-IN');
  const seller = entry.sellerId?.name || 'the Seller';
  const pct = entry.savedPercent?.toFixed(0) || 0;
  return `"${seller} se ₹${saved} bachana? I never thought it was possible — lekin yeh game ne mujhe sab sikha diya. ${pct}% discount real mein milta hai!"`;
};

const getStarCount = (savedPercent) =>
  Math.max(3, Math.min(5, Math.round(((savedPercent || 0) / 100) * 2 + 3)));

const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ─────────────────────────────────────────────────────────────
// SKELETON COMPONENTS
// ─────────────────────────────────────────────────────────────

const SellerCardSkeleton = () => (
  <div className="min-w-[320px] bg-surface-container-low p-1 rounded-lg snap-center border border-white/5 animate-pulse">
    <div className="rounded-lg h-96 bg-surface-container-high" />
    <div className="p-6 space-y-4">
      <div className="w-4/5 h-4 rounded bg-surface-container-high" />
      <div className="w-3/5 h-4 rounded bg-surface-container-high" />
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="w-1/4 h-3 rounded bg-surface-container-high" />
        <div className="w-1/4 h-3 rounded bg-surface-container-high" />
      </div>
    </div>
  </div>
);

const ReviewCardSkeleton = () => (
  <div className="relative p-8 overflow-hidden rounded-sm bg-surface-container-low animate-pulse">
    <div className="absolute w-16 h-16 rounded-lg top-4 right-4 bg-surface-container-high opacity-30" />
    <div className="flex gap-1 mb-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-5 h-5 rounded bg-surface-container-high" />
      ))}
    </div>
    <div className="mb-8 space-y-2">
      <div className="w-full h-5 rounded bg-surface-container-high" />
      <div className="w-5/6 h-5 rounded bg-surface-container-high" />
      <div className="w-3/4 h-5 rounded bg-surface-container-high" />
    </div>
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-high" />
      <div className="space-y-2">
        <div className="w-24 h-3 rounded bg-surface-container-high" />
        <div className="w-16 h-3 rounded bg-surface-container-high" />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// SMART IMAGE COMPONENT
// ─────────────────────────────────────────────────────────────
const SellerImage = ({ src, alt, sellerName }) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <>
      {(!src || imageFailed) && (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center opacity-30 bg-[#050810]">
          <Store className="w-20 h-20 mb-4 text-white" />
          <span className="text-sm font-bold tracking-widest text-white uppercase font-headline">
            {sellerName}
          </span>
        </div>
      )}

      {src && !imageFailed && (
        <img
          src={getAssetUrl(src)}
          alt={alt}
          className="absolute inset-0 z-10 object-cover w-full h-full transition-opacity duration-500 opacity-60 group-hover:opacity-80"
          onError={() => setImageFailed(true)}
        />
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const LandingPage = () => {
  const { sellers, sellersLoading, isAuth, topPlayers, lbLoading } = useLandingData();

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-primary/30">
      <TopNav />

      {/* ── Hero Section ──────────────────────────────────────────── */}
      <header className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('https://images.jdmagicbox.com/quickquotes/images_main/customized-india-gate-wallpaper-2226924596-rir157i9.jpg')]">

        <div className="absolute inset-0 z-0 bg-[#050810]/85"></div>

        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-50 pointer-events-none mix-blend-screen">
          <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-500/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-amber-500/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-20 px-4 mt-16 space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="font-stretch-normal text-7xl md:text-9xl font-black text-[#d7b014] neon-flicker tracking-tighter drop-shadow-[0_0_20px_rgba(215,176,20,0.8)]">
              चाचा की दुकान
            </h1>
            <p className="text-xl italic font-bold tracking-tight font-headline md:text-3xl text-white/90">
              "Chalo aapke liye special rate laga dete hain ❤️"
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 pt-6 md:flex-row">
            <Link
              to="/sellers"
              className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-headline text-2xl px-12 py-5 rounded-sm transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] active:scale-95 group inline-block"
            >
              दुकान में घुसो <span className="inline-block transition-transform group-hover:translate-x-1">🚪</span>
            </Link>
            <Link
              to="/leaderboard"
              className="inline-block px-12 py-5 text-2xl transition-all border rounded-sm bg-surface-container-high hover:bg-surface-container-highest border-outline-variant/30 text-primary font-headline active:scale-95 backdrop-blur-sm"
            >
              Leaderboard Dekho 🏆
            </Link>
          </div>
        </div>
        <div className="absolute z-20 -translate-x-1/2 bottom-10 left-1/2 animate-bounce">
          <ChevronsDown className="w-10 h-10 text-white/50" />
        </div>
      </header>

      {/* ── Live Score Ticker ────────────────────────────────────── */}
      <div className="w-full bg-[#050810] border-y border-white/10 py-3 overflow-hidden whitespace-nowrap">
        <div className="flex animate-[scroll_30s_linear_infinite] gap-12 items-center">
          <div className="flex items-center gap-2"><span className="font-bold text-primary">CHACHA</span> <span className="text-on-surface-variant">SOLD 12x iPhonwa</span> <span className="text-green-400">▲ +12%</span></div>
          <div className="flex items-center gap-2"><span className="font-bold text-amber-500">SHARMA JI</span> <span className="text-on-surface-variant">REJECTED 5 Bidders</span> <span className="text-red-400">▼ -4%</span></div>
          <div className="flex items-center gap-2"><span className="font-bold text-pink-500">MEENA AUNTY</span> <span className="text-on-surface-variant">BARGAINED GOLD</span> <span className="text-green-400">▲ +25%</span></div>
          <div className="flex items-center gap-2"><span className="font-bold text-amber-600">RAJESH BHAI</span> <span className="text-on-surface-variant">OUT OF STOCK</span> <span className="text-slate-500">STATIC</span></div>
          <div className="flex items-center gap-2"><span className="font-bold text-primary">CHACHA</span> <span className="text-on-surface-variant">SOLD 12x iPhonwa</span> <span className="text-green-400">▲ +12%</span></div>
          <div className="flex items-center gap-2"><span className="font-bold text-amber-500">SHARMA JI</span> <span className="text-on-surface-variant">REJECTED 5 Bidders</span> <span className="text-red-400">▼ -4%</span></div>
          <div className="flex items-center gap-2"><span className="font-bold text-pink-500">MEENA AUNTY</span> <span className="text-on-surface-variant">BARGAINED GOLD</span> <span className="text-green-400">▲ +25%</span></div>
          <div className="flex items-center gap-2"><span className="font-bold text-amber-600">RAJESH BHAI</span> <span className="text-on-surface-variant">OUT OF STOCK</span> <span className="text-slate-500">STATIC</span></div>
        </div>
      </div>

      {/* ── Market Kings (Sellers Section) ───────────────────────── */}
      <section className="px-6 py-24 mx-auto overflow-hidden max-w-7xl">
        <div className="mb-16">
          <h2 className="mb-4 text-5xl font-black font-headline text-on-surface">The Market Kings</h2>
          <div className="w-24 h-1 bg-primary"></div>
        </div>

        <div className="flex gap-8 pb-12 overflow-x-auto scroll-hide snap-x snap-mandatory">
          {sellersLoading && (
            <>
              <SellerCardSkeleton />
              <SellerCardSkeleton />
              <SellerCardSkeleton />
              <SellerCardSkeleton />
            </>
          )}

          {!sellersLoading && !isAuth && (
            <div className="flex flex-col items-center justify-center w-full gap-4 py-16 text-center">
              <div className="text-5xl">🔒</div>
              <p className="text-xl font-bold font-headline text-on-surface">
                Sign in to meet the Sellers
              </p>
              <p className="max-w-sm text-on-surface-variant">
                Create a free account to unlock all four market legends and start negotiating.
              </p>
              <Link
                to="/register"
                className="px-8 py-3 mt-2 font-bold transition-all rounded-sm bg-primary text-on-primary-fixed active:scale-95"
              >
                Join the Market →
              </Link>
            </div>
          )}

          {!sellersLoading && sellers.map((seller) => {
            const theme = THEME_CONFIG[seller.themeColor] || THEME_CONFIG.blue;
            const specialty = SPECIALTY_MAP[seller.category] || seller.category;
            const quote = getSellerQuote(seller);
            const stats = getSellerStats(seller.difficulty);
            const badge = getDifficultyBadge(seller.difficulty);

            return (
              <div
                key={seller._id}
                className={`min-w-[320px] bg-surface-container-low p-1 rounded-lg snap-center hover:scale-[1.02] transition-transform duration-500 border ${theme.border} ${theme.shadow} group`}
              >
                <div className={`h-96 relative overflow-hidden ${theme.cardBg} flex items-center justify-center`}>

                  {/* Using Smart Image Component */}
                  <SellerImage src={seller.imageUrl} alt={seller.name} sellerName={seller.name} />

                  <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t ${theme.gradientFrom} to-transparent z-20`}>
                    <span className={`${theme.labelColor} font-label text-xs tracking-[0.2em] uppercase`}>
                      {specialty}
                    </span>
                    <h3 className="mt-1 text-3xl font-bold font-headline text-on-surface">{seller.name}</h3>
                  </div>

                  {badge && (
                    <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold text-black rounded-sm ${theme.badgeBg} ${badge.pulse ? 'animate-pulse' : ''} z-20`}>
                      {badge.label}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-sm text-on-surface-variant">"{quote}"</p>
                  <div className="flex items-center justify-between pt-4 text-xs border-t font-label text-slate-500 border-white/5">
                    <span>Success: {stats.success}</span>
                    <span>Level: {stats.level}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Khiladiyon Ki Baatein (Leaderboard → Testimonials) ───── */}
      <section className="py-24 bg-surface-container-lowest border-y border-white/5">
        <div className="px-6 mx-auto max-w-7xl">
          <h2 className="mb-16 text-4xl italic font-bold text-center font-headline">Khiladiyon Ki Baatein</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {lbLoading && (
              <>
                <ReviewCardSkeleton />
                <ReviewCardSkeleton />
                <ReviewCardSkeleton />
              </>
            )}

            {!lbLoading && topPlayers.length === 0 && (
              <>
                {[
                  {
                    quote: '"Chacha ne itna lamba khicha ki mein 10,000 extra deke aaya. He\'s a beast!"',
                    initials: 'AK',
                    name: 'Aditya Kumar',
                    role: 'Professional Bargainer',
                    avatarBg: 'bg-primary/20',
                    avatarText: 'text-primary',
                    stars: 5,
                  },
                  {
                    quote: '"Meena Aunty is scary. Ek bar unhone eye contact kiya aur maine bina soche pay kar diya."',
                    initials: 'SR',
                    name: 'Sneha Rao',
                    role: 'Street Shopper',
                    avatarBg: 'bg-pink-500/20',
                    avatarText: 'text-pink-500',
                    stars: 4,
                  },
                  {
                    quote: '"Sharma Ji\'s logic is unbeatable. He actually convinced me that a 5-year old laptop is \'Vintage Gold\'."',
                    initials: 'VS',
                    name: 'Vicky Singh',
                    role: 'Tech Enthusiast',
                    avatarBg: 'bg-amber-500/20',
                    avatarText: 'text-amber-500',
                    stars: 5,
                  },
                ].map((item, i) => (
                  <div key={i} className="relative p-8 overflow-hidden rounded-sm bg-surface-container-low group">
                    <div className="absolute top-0 right-0 p-4 transition-opacity opacity-10 group-hover:opacity-20">
                      <Quote className="w-24 h-24" />
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(item.stars)].map((_, s) => (
                        <Star key={s} className="w-4 h-4 text-amber-400" fill="currentColor" />
                      ))}
                    </div>
                    <p className="mb-8 text-xl italic leading-relaxed font-headline text-on-surface">{item.quote}</p>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-10 h-10 font-bold rounded-full ${item.avatarBg} ${item.avatarText}`}>{item.initials}</div>
                      <div>
                        <p className="text-sm font-bold font-label text-on-surface">{item.name}</p>
                        <p className="text-xs font-label text-slate-500">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {!lbLoading && topPlayers.map((entry, idx) => {
              const name = entry.playerName || entry.userId?.name || entry.userId?.email?.split('@')[0] || 'Player';
              const seller = entry.sellerId?.name || 'Seller';
              const stars = getStarCount(entry.savedPercent);
              const quote = getPlayerQuote(entry);
              const saved = (entry.savedAmount || 0).toLocaleString('en-IN');
              const initials = getInitials(name);

              const avatarThemes = [
                { bg: 'bg-primary/20', text: 'text-primary' },
                { bg: 'bg-pink-500/20', text: 'text-pink-500' },
                { bg: 'bg-amber-500/20', text: 'text-amber-500' },
              ];
              const av = avatarThemes[idx % 3];

              return (
                <div key={entry._id} className="relative p-8 overflow-hidden rounded-sm bg-surface-container-low group">
                  <div className="absolute top-0 right-0 p-4 transition-opacity opacity-10 group-hover:opacity-20">
                    <Quote className="w-24 h-24" />
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s < stars ? 'text-amber-400' : 'text-on-surface-variant/20'}`}
                        fill={s < stars ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>

                  <p className="mb-8 text-xl italic leading-relaxed font-headline text-on-surface">
                    {quote}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 font-bold rounded-full flex-shrink-0 ${av.bg} ${av.text}`}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold font-label text-on-surface">{name}</p>
                      <p className="text-xs font-semibold font-label text-emerald-400">
                        ₹{saved} saved · {seller} ka customer
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final CTA Section ────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden text-center">
        <div className="absolute inset-0 origin-right -skew-y-3 bg-primary/5"></div>
        <div className="relative z-10 space-y-10">
          <h2 className="font-headline text-8xl md:text-[12rem] font-black text-on-surface/5 absolute -top-10 left-0 right-0 select-none">READY?</h2>
          <h3 className="text-6xl font-black tracking-tighter font-headline md:text-8xl text-on-surface">तैयार हो?</h3>
          <p className="max-w-xl px-6 mx-auto text-slate-400 font-body">Market is open. Chacha is waiting. Don't let your wallet cry later.</p>
          <div>
            <Link
              to="/sellers"
              className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-headline text-3xl px-16 py-6 rounded-sm transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] active:scale-95 inline-block"
            >
              दुकान में घुसो 🚪
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-[#050810] w-full py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center px-10 gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-slate-400 font-bold font-['Noto_Serif_Devanagari'] text-xl">चाचा की दुकान</span>
          <span className="text-slate-500 font-['Inter'] text-[0.6875rem] uppercase tracking-[0.2em]">© 2026 THE NEON GALI. NO REFUNDS.</span>
        </div>
        <div className="flex gap-8">
          <Link className="text-slate-600 hover:text-white transition-colors font-['Inter'] text-[0.6875rem] uppercase tracking-[0.2em]" to="/sellers">The Market</Link>
          <Link className="text-slate-600 hover:text-white transition-colors font-['Inter'] text-[0.6875rem] uppercase tracking-[0.2em]" to="/leaderboard">Leaderboard</Link>
          <Link className="text-slate-600 hover:text-white transition-colors font-['Inter'] text-[0.6875rem] uppercase tracking-[0.2em]" to="/profile">Profile</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;