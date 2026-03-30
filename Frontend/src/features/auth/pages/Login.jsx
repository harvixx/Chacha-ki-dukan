import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { Store, Mail, Lock, LogIn, Loader2, AlertCircle } from "lucide-react";

const Login = () => {
  const { handleLogin, loading, error } = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    handleLogin(form);
  };

  return (
    // NUCLEAR FIX: fixed inset-0 z-50 locks it to the exact viewport edges
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-[#050810] text-on-surface font-body selection:bg-primary/30">
      
      {/* LEFT PANEL: Fixed width, strictly inside the viewport */}
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
            Who doesn't bargain is not a real buyer!
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

          {/* Auth Toggle Tabs */}
          <nav className="flex w-full p-1 mb-8 border bg-surface-container-lowest rounded-xl border-outline-variant/10">
            <Link 
              to="/login"
              className="flex-1 py-2 text-sm font-bold text-center transition-all duration-300 border rounded-lg shadow-lg bg-surface-container-high text-on-surface border-outline-variant/20"
            >
              पहले आया हूं
            </Link>
            <Link 
              to="/register"
              className="flex-1 py-2 text-sm font-medium text-center transition-all duration-300 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/50"
            >
              नया हूं
            </Link>
          </nav>

          <form onSubmit={onSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label htmlFor="email" className="px-1 text-[10px] tracking-widest uppercase font-label text-on-surface-variant">इमेल (Email)</label>
              <div className="relative group">
                <Mail className="absolute w-4 h-4 transition-colors duration-300 -translate-y-1/2 left-3.5 top-1/2 text-outline group-focus-within:text-primary group-focus-within:scale-110" />
                <input 
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full py-3.5 pl-10 pr-4 transition-all border border-transparent rounded-lg outline-none bg-surface-container-lowest ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary focus:border-primary/30 text-on-surface placeholder:text-outline/50 text-sm" 
                  placeholder="Email daalo" 
                  type="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label htmlFor="password" className="text-[10px] tracking-widest uppercase font-label text-on-surface-variant">पासवर्ड (Password)</label>
              </div>
              <div className="relative group">
                <Lock className="absolute w-4 h-4 transition-colors duration-300 -translate-y-1/2 left-3.5 top-1/2 text-outline group-focus-within:text-primary group-focus-within:scale-110" />
                <input 
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full py-3.5 pl-10 pr-4 transition-all border border-transparent rounded-lg outline-none bg-surface-container-lowest ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary focus:border-primary/30 text-on-surface placeholder:text-outline/50 text-sm" 
                  placeholder="••••••••" 
                  type="password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 text-xs border rounded-lg text-error border-error/30 bg-error/10 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full gap-2 mt-2 py-3.5 text-base font-black transition-all rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-[#050810] font-headline active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]" 
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</>
              ) : (
                <>Andar Aao <LogIn className="w-4 h-4" /></>
              )}
            </button>
          </form>
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

export default Login;