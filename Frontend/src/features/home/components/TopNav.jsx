import React, { useState } from 'react';
import { Store, Menu, Trophy, User, LogIn, LogOut, AlertTriangle, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLogout } from '../../auth/hooks/useLogout';

const TopNav = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu]   = useState(false);
  const { logout, isLoading } = useLogout();
  const location = useLocation();
  const { isAuth, user } = useSelector((state) => state.auth);

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    setShowMobileMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/sellers',     icon: Store,  label: 'The Market' },
    { to: '/leaderboard', icon: Trophy, label: 'Ranks'      },
    ...(isAuth ? [{ to: '/profile', icon: User, label: 'Profile' }] : []),
  ];

  return (
    <>
      {/* ── TOP NAVBAR ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#050810]/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-6 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">

        {/* BRAND LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <Store className="text-[#3b82f6] drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-['Noto_Serif_Devanagari'] tracking-tighter text-2xl text-[#3b82f6] drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] font-black italic hidden sm:block text-nowrap">
            चाचा की दुकान
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="items-center hidden gap-8 md:flex">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 text-sm uppercase tracking-widest pb-1 transition-all duration-300
                ${isActive(to)
                  ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]'
                  : 'text-slate-400 hover:text-[#60a5fa] border-b-2 border-transparent'
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* Desktop auth */}
          <div className="items-center hidden sm:flex">
            {isAuth ? (
              <div className="flex items-center gap-6">
                <span className="text-xs font-bold tracking-widest uppercase text-slate-500">
                  Namaste,{' '}
                  <span className="text-white">{user?.name?.split(' ')[0]}</span>
                </span>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-2 text-sm font-bold tracking-widest text-red-500 uppercase transition-all hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  Exit
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-[#3b82f6] text-[#050810] px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-[#60a5fa] transition-colors shadow-[0_0_10px_rgba(59,130,246,0.3)]"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="transition-colors duration-200 md:hidden text-slate-400 hover:text-white active:scale-90"
          >
            {showMobileMenu
              ? <X className="w-7 h-7" />
              : <Menu className="w-7 h-7" />
            }
          </button>
        </div>
      </nav>

      {/* ── MOBILE DROPDOWN MENU ── */}
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[40] md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Dropdown panel — falls from navbar */}
          <div className="fixed top-[72px] left-0 right-0 z-[45] md:hidden bg-[#050810]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] animate-in slide-in-from-top duration-200">

            {/* Player info strip (if logged in) */}
            {isAuth && (
              <div className="mx-4 mt-4 p-3 rounded-xl bg-[#1e3a5f]/20 border border-[#1e3a5f]/50 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center text-[#3b82f6] font-black text-sm flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs truncate text-slate-500">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="flex flex-col gap-1 px-4 mt-3">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200
                    ${isActive(to)
                      ? 'bg-[#1e3a5f]/40 text-[#3b82f6]'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Icon className="flex-shrink-0 w-5 h-5" />
                  {label}
                  {/* Active dot indicator */}
                  {isActive(to) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                  )}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="mx-4 my-3 border-t border-white/5" />

            {/* Auth section */}
            <div className="px-4 pb-4">
              {isAuth ? (
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowLogoutModal(true);
                  }}
                  className="flex items-center justify-center w-full gap-2 py-3 text-sm font-bold tracking-widest text-red-500 uppercase transition-all duration-200 border rounded-xl border-red-500/20 hover:bg-red-500/10 active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  Exit / Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold uppercase tracking-widest bg-[#3b82f6] text-[#050810] hover:bg-[#60a5fa] transition-colors active:scale-95 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                >
                  <LogIn className="w-4 h-4" />
                  Login Karo
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── LOGOUT MODAL ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => !isLoading && setShowLogoutModal(false)}
          />

          <div className="relative w-full max-w-sm overflow-hidden border bg-[#0a0f1d] border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <h3 className="mb-2 text-xl font-black tracking-tight text-white uppercase">
                Logout Karein?
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-slate-400">
                Bhai, sach mein ja rahe ho? Bina bargain kiye jaoge toh nuksan tumhara hi hai!
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmLogout}
                  disabled={isLoading}
                  className="w-full py-4 text-sm font-black tracking-[0.2em] text-white uppercase transition-all bg-red-600 rounded-xl hover:bg-red-500 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? 'POOF! GAYAB...' : 'HAAN, NIKLO'}
                </button>

                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoading}
                  className="w-full py-4 text-sm font-black tracking-[0.2em] text-slate-400 uppercase transition-all rounded-xl hover:text-white hover:bg-white/5 active:scale-95"
                >
                  NAHI, MAZA AA RAHA HAI
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute p-2 transition-colors top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNav;
