import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../../api/axios.api';
import BottomNav from '../components/BottomNav';

const ProductSelection = () => {
  const { sellerId } = useParams();

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#050810';
    document.body.style.backgroundColor = '#050810';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', sellerId],
    queryFn: () => getProducts(sellerId),
    enabled: !!sellerId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const seller = products[0]?.sellerId || {};
  const sellerName = seller.name || 'Seller';

  return (
    <div className="min-h-screen pb-24 bg-[#050810] text-on-surface font-body selection:bg-primary/30">

      {/* TopAppBar */}
      <nav className="flex items-center w-full px-6 py-4 z-50 bg-[#050810] bg-gradient-to-b from-blue-500/10 to-transparent shadow-[0_4px_20px_rgba(59,130,246,0.15)] sticky top-0">
        <div className="flex items-center gap-3">
          <Link to="/sellers" className="inline-block text-blue-500 transition-transform cursor-pointer active:scale-95">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-1 text-[10px] font-bold tracking-tight uppercase">
            <span className="text-slate-500">दुकान</span>
            <span className="text-slate-500">/</span>
            <span className="text-blue-500">{sellerName} की दुकान</span>
          </div>
        </div>
      </nav>

      {/* Shop Banner — no avatar */}
      <header className="relative w-full h-[130px] overflow-hidden mb-6">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url('${seller.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAKF0en95KimaAoeokIScAE3iGHJ_O_tl99nW4vwVzR3KS8KsQN-Chhp_tbxmSrlOzugIvammAdRFLxi2a5e1EQsTR2Yem_ltoQSe7su75A4Id-rH0GjmIVeJfRpMCK5PYzEu8toSb0YVAZUlZEW3VmeoHqBLAV2B0x_9imI-TLONFUUkI_qnALdFb8q4vwchm4JtXTCTKvkegNf6Jm8stwZCC25JdC5cZHdcogUOlCMStWAu4Kco957Z9RO5obKrt3NPa0LxQj-mo"}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050810] to-transparent" />
        <div className="relative flex items-end h-full px-6 pb-4">
          <div>
            <h1 className="text-2xl font-black leading-none text-blue-500 hindi-text">{sellerName} की दुकान</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">{seller.location || 'Delhi'}</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl px-4 mx-auto space-y-5">
        <section>
          <h2 className="mb-1 text-2xl font-black hindi-text text-on-surface">क्या लेना है आज?</h2>
          <p className="text-sm text-slate-400">Product select karo aur negotiate shuru karo.</p>
        </section>

        {isLoading ? (
          <div className="py-12 text-center text-primary animate-pulse">Loading products...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-500">Products load nahi hue!</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => {
              const diffColor =
                product.difficulty === 'Easy' ? 'green' :
                product.difficulty === 'Hard' || product.difficulty === 'Very Hard' ? 'red' : 'blue';

              return (
                <div
                  key={product._id}
                  className="flex flex-col overflow-hidden transition-all duration-200 border-l-4 border-blue-500 shadow-lg rounded-xl bg-surface-container-low hover:bg-surface-container-high"
                >
                  {/* Product image */}
                  <div className="flex items-center justify-center w-full p-3 h-28 bg-surface-container-lowest">
                    <img
                      alt={product.name}
                      className="object-contain max-w-full max-h-full"
                      src={product.imageUrl}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 px-3 pt-2 pb-1 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-bold leading-tight text-on-surface line-clamp-2">{product.name}</h3>
                      <span className={`shrink-0 text-[8px] font-black bg-${diffColor}-500/20 text-${diffColor}-400 px-1.5 py-0.5 rounded border border-${diffColor}-500/30 uppercase`}>
                        {product.difficulty}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-black text-blue-400">₹{product.listPrice?.toLocaleString('en-IN')}</span>
                      <span className="text-[9px] text-slate-500 line-through">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-2">{product.specs}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 border-t border-blue-500/10 bg-blue-500/5">
                    {[
                      { label: 'Plays', val: product.plays || 0, color: 'text-on-surface' },
                      { label: 'Best', val: `${(product.bestDeal || 0).toFixed(1)}%`, color: 'text-green-400' },
                      { label: 'Avg', val: `${(product.avgDeal || 0).toFixed(1)}%`, color: 'text-on-surface' },
                    ].map((s) => (
                      <div key={s.label} className="py-1.5 text-center">
                        <p className="text-[9px] uppercase text-slate-500">{s.label}</p>
                        <p className={`text-xs font-bold ${s.color}`}>{s.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/play?sellerId=${sellerId}&productId=${product._id}`}
                    className="w-full bg-primary text-black font-bold py-2.5 text-sm transition-transform active:scale-[0.98] hover:brightness-110 text-center inline-block"
                  >
                    यही चाहिए!
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default ProductSelection;