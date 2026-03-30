import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { Store, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  const { status } = useVerifyEmail();

  return (
    <div className="bg-[#050810] text-on-surface font-body selection:bg-primary/30 min-h-screen overflow-x-hidden">
      <main className="flex min-h-screen w-full">
        {/* LEFT PANEL: The Neon Gali Perspective (60%) */}
        <section className="hidden lg:flex lg:w-[60%] relative overflow-hidden bg-[#050810] flex-col justify-end p-12">
          {/* Background Image with Tonal Layering */}
          <div className="absolute inset-0 z-0">
            <img 
              alt="Atmospheric night view of a narrow Delhi market alley" 
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKL34l4bJTbTZO2ncrNMW8-5kCHnQYa_Q2ZNqoDQGp70a0UISHSzmcQJOIjjykqZZ33DvvNR4UMIf51yhnLHFuMoT6FK3d463cA68LIVtRZSR97zN3qCq-FUsaANDNK80JRVLpKQ9XrXeCyO0DHMC8zUfvgxrHfGkAry54RTjddL3k0oIFoCxRwxbqIQI899lFj-n_kDMURYm1-E_TfpE1t9F66BtrN1y7FOyvRbnGrRMb2aQQULwjjSZpSBKBU_RIZ9kgHFe_a6k"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#050810]/40 to-transparent"></div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[40%] left-[30%] w-64 h-80 bg-orange-500/10 blur-[100px] rounded-full"></div>
          </div>

          <div className="dust-layer"></div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-block px-4 py-1 mb-6 bg-surface-container-high/40 backdrop-blur-md border border-outline-variant/20 text-primary font-label text-sm tracking-widest uppercase">
              Delhi Noir Collection
            </div>
            <h2 className="font-headline text-5xl md:text-6xl text-on-surface leading-tight font-black mb-6 drop-shadow-xl">
              "जो मोल-भाव नहीं करता, वो असली खरीदार नहीं!"
            </h2>
            <p className="text-on-surface-variant font-body text-xl italic opacity-80 border-l-2 border-primary pl-6">
              He who doesn't bargain is not a real buyer!
            </p>
          </div>

          <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-outline-variant/20 to-transparent"></div>
        </section>

        {/* RIGHT PANEL: Verification Processing Canvas (40%) */}
        <section className="w-full lg:w-[40%] bg-[#0d1220] flex flex-col p-8 md:p-16 overflow-y-auto relative z-10">
          
          <header className="mb-12 flex flex-col items-center lg:items-start">
            <div className="flex items-center gap-3 group cursor-pointer mb-2">
              <Store className="w-10 h-10 text-primary drop-shadow-[0_0_8px_rgba(133,173,255,0.6)]" />
              <h1 className="text-3xl font-headline font-black text-primary tracking-tighter neon-glow-chacha">चाचा की दुकान</h1>
            </div>
            <p className="text-on-surface-variant text-sm font-label opacity-60">The Official Negotiation Hub of Old Delhi</p>
          </header>

          <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="bg-surface-container-lowest p-8 border border-outline-variant/20 rounded-2xl shadow-xl flex flex-col items-center text-center relative overflow-hidden transition-all duration-500">
              
              {status === "loading" && (
                <>
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                  </div>
                  <h2 className="text-2xl font-black font-headline mb-3 text-on-surface">
                    Ruk Jao, Verify Kar Rahe Hain...
                  </h2>
                  <p className="text-sm text-on-surface-variant opacity-80 font-medium">
                    Chaabi ghum hi rahi hai, thoda patience rakho ustaad!
                  </p>
                </>
              )}

              {status === "success" && (
                <>
                  <div className="absolute inset-0 bg-[#22c55e]/5 pointer-events-none"></div>
                  <div className="w-24 h-24 bg-[#22c55e]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                    <CheckCircle2 className="w-14 h-14 text-[#22c55e]" />
                  </div>
                  <h2 className="text-3xl font-black font-headline mb-3 text-[#22c55e] drop-shadow-lg">
                    Verified 🎉
                  </h2>
                  <p className="text-sm text-on-surface-variant font-medium mb-8">
                    Badhai Ho! Aapka account verify ho gaya hai. Dukaan me chalte hain...
                  </p>
                  
                  <Link 
                    to="/login"
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-400 text-[#050810] font-black font-headline text-lg rounded-lg transition-transform active:scale-95 hover:brightness-110 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,119,6,0.5)]"
                  >
                    Login Karo
                  </Link>
                </>
              )}

              {status === "error" && (
                <>
                  <div className="absolute inset-0 bg-error/5 pointer-events-none"></div>
                  <div className="w-24 h-24 bg-error/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                    <XCircle className="w-14 h-14 text-error" />
                  </div>
                  <h2 className="text-3xl font-black font-headline mb-3 text-error drop-shadow-lg">
                    Verification Failed ❌
                  </h2>
                  <p className="text-sm text-error/80 font-medium mb-8">
                    Lagta hai yeh chabi kharab hai (Invalid or expired link).
                  </p>
                  
                  <Link 
                    to="/register"
                    className="w-full py-4 bg-surface-container-high border border-outline-variant/30 text-error hover:bg-error hover:text-white font-black font-headline text-lg rounded-lg transition-all active:scale-95 flex items-center justify-center"
                  >
                    Phirse Register Karo
                  </Link>
                </>
              )}

            </div>
          </div>

          <footer className="mt-auto pt-10 text-center lg:text-left">
            <p className="text-[10px] text-on-surface-variant opacity-40 uppercase tracking-widest">
              © 2024 चाचा की दुकान. No Refunds on Bad Bargains.
            </p>
          </footer>

          <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none"></div>
        </section>
      </main>
    </div>
  );
};

export default VerifyEmail;