import { useVerify } from "../hooks/useVerify";
import { useNavigate } from "react-router-dom";
import { Store, Mail, RefreshCcw, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const Verify = () => {
  const { handleResend, loading, success, error } = useVerify();
  const navigate = useNavigate();

  return (
    // NUCLEAR FIX: Locks to the exact edges of the browser, NO SCROLLING
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-[#050810] text-on-surface font-body selection:bg-primary/30">
      
      {/* LEFT PANEL: Fixed width */}
      <section className="hidden lg:flex lg:w-[55%] relative h-full flex-col justify-end p-12">
        {/* Background Image with Tonal Layering */}
        <div className="absolute inset-0 z-0">
          <img 
            alt="Atmospheric night view of a narrow Delhi market alley" 
            className="object-cover w-full h-full opacity-60 mix-blend-luminosity" 
            src="https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050810]/40 to-transparent"></div>
        </div>

        <div className="absolute w-full h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2">
          <div className="absolute top-[40%] left-[30%] w-64 h-80 bg-orange-500/10 blur-[100px] rounded-full animate-pulse"></div>
        </div>

        <div className="dust-layer"></div>

        <div className="relative z-10 max-w-2xl pb-8">
          <div className="inline-block px-4 py-1 mb-4 text-sm tracking-widest uppercase border rounded-sm bg-surface-container-high/40 backdrop-blur-md border-outline-variant/20 text-primary font-label">
            Delhi Noir Collection
          </div>
          <h2 className="mb-4 text-4xl font-black leading-tight font-headline md:text-5xl text-on-surface drop-shadow-xl">
            "जो मोल-भाव नहीं करता, वो असली खरीदार नहीं!"
          </h2>
          <p className="pl-4 text-lg italic border-l-2 text-on-surface-variant font-body opacity-80 border-primary">
            He who doesn't bargain is not a real buyer!
          </p>
        </div>

        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-outline-variant/20 to-transparent"></div>
      </section>

      {/* RIGHT PANEL: Takes remaining width, internal scroll hidden */}
      <section className="w-full lg:w-[45%] bg-[#0d1220] h-full flex flex-col p-6 lg:p-10 relative z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto scrollbar-hide">
        
        <div className="flex flex-col justify-center flex-1 w-full max-w-[400px] mx-auto">
          
          <header className="flex flex-col items-center mb-8 lg:items-start">
            <div className="flex items-center gap-3 mb-1 transition-transform duration-300 cursor-pointer group hover:scale-105">
              <Store className="w-8 h-8 text-primary drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
              <h1 className="text-2xl font-black tracking-tighter font-headline text-primary neon-glow-chacha">
                चाचा की दुकान
              </h1>
            </div>
            <p className="text-xs text-on-surface-variant font-label opacity-60">
              The Official Negotiation Hub of Old Delhi
            </p>
          </header>

          <div className="relative flex flex-col items-center p-8 overflow-hidden text-center border shadow-xl bg-surface-container-lowest border-outline-variant/20 rounded-2xl">
            
            <div className="flex items-center justify-center w-16 h-16 mb-5 rounded-full bg-primary/10">
              <Mail className="w-8 h-8 text-primary" />
            </div>

            <h2 className="mb-2 text-xl font-black font-headline text-on-surface">
              Email Verify Karo
            </h2>
            
            <p className="mb-6 text-xs font-medium leading-relaxed text-on-surface-variant opacity-80">
              Aapke email par ek verification link bheja gaya hai. Zara inbox check karo!
            </p>

            {/* Success State */}
            {success && (
              <div className="w-full mb-4 flex items-center justify-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-xs p-3 rounded-lg font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center w-full gap-2 p-3 mb-4 text-xs font-bold border rounded-lg bg-error/10 border-error/30 text-error animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-[#050810] font-black font-headline text-base rounded-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] mb-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Bhej Rahe Hain...</>
              ) : (
                <>Link Wapas Bhejo <RefreshCcw className="w-4 h-4" /></>
              )}
            </button>

            <div className="relative flex flex-col w-full gap-2 pt-5 mt-5 border-t border-outline-variant/20">
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                Galat Email de diya? 
              </p>
              <button
                onClick={() => navigate("/register")}
                className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Change Email 
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        <footer className="z-20 pt-8 mt-auto text-center lg:text-left">
          <p className="text-[9px] text-on-surface-variant opacity-40 uppercase tracking-widest font-bold">
            © 2026 चाचा की दुकान. No Refunds on Bad Bargains.
          </p>
        </footer>

        <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none bg-primary/10 blur-3xl"></div>
      </section>
    </div>
  );
};

export default Verify;