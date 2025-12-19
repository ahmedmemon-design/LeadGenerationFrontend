import React, { useState, useContext } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "./AuthContext";
import AuthModal from "./AuthModal";
import VerifyModal from "./VerifyModal";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signup");

  const [verifyEmail, setVerifyEmail] = useState(null);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Features", to: "/#features" },
    {label: "Generate Leads", to: "/leads"},
    {label: "AllLeads", to: "/allleads"}
  ];

  // ⭐ DYNAMIC: Credits from logged in user
  const batchesRemaining = user?.credits ?? 0; 

  return (
    <>
      {/* HEADER */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-0 right-0 z-40"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="backdrop-blur bg-white/60 border border-white/30 rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between">
            
            {/* Logo */}
                        <a href="/">

            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <User size={18} />
              </div>
              <div>
                <h1 className="text-lg font-bold">LeadGen</h1>
                <p className="text-xs text-gray-500">Lead Suite</p>
              </div>
            </div>
              </a>

            {/* NEW: Batch Info (Desktop) */}
            {user && (
              <div className="hidden md:flex">
                <div className="px-4 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl text-sm font-medium text-indigo-700">
                  {batchesRemaining} credits left (20 leads each)
                </div>
              </div>
            )}

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6">
              {navItems.map((item, i) => (
                <a href={item.to} key={i} className="text-sm font-medium">
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right Buttons */}
            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setShowAuth(true);
                    }}
                    className="hidden md:block bg-indigo-600 text-white px-4 py-1.5 rounded-lg"
                  >
                    Sign Up
                  </button>

                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setShowAuth(true);
                    }}
                    className="hidden md:block border border-gray-300 px-4 py-1.5 rounded-lg"
                  >
                    Login
                  </button>
                </>
              ) : (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-2"
                  >
                    <User size={18} />
                    {user?.email?.split("@")[0]}
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40 py-2">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button onClick={() => setOpen(!open)} className="md:hidden">
                {open ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="fixed right-0 top-0 w-72 h-full bg-white shadow-xl z-50 p-6 md:hidden"
          >
            {/* NEW: Batch info in mobile */}
            {user && (
              <div className="mb-6 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl text-sm font-semibold text-indigo-700">
                {batchesRemaining} batches left (20 per batch)
              </div>
            )}

            <ul className="mt-4 flex flex-col gap-6">
              {navItems.map((n, i) => (
                <a key={i} href={n.to} onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              ))}
            </ul>

            {!user ? (
              <>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setShowAuth(true);
                    setOpen(false);
                  }}
                  className="w-full mt-8 bg-indigo-600 text-white py-2 rounded-lg"
                >
                  Sign Up
                </button>

                <button
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuth(true);
                    setOpen(false);
                  }}
                  className="w-full mt-3 border border-gray-300 py-2 rounded-lg"
                >
                  Login
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full mt-8 bg-red-500 text-white py-2 rounded-lg"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUTH MODAL */}
      <AuthModal
        mode={authMode}
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={(email) => {
          setVerifyEmail(email);
          setShowAuth(false);
        }}
      />

      {/* VERIFY MODAL */}
      <VerifyModal
        email={verifyEmail}
        open={!!verifyEmail}
        onClose={() => setVerifyEmail(null)}
      />
    </>
  );
}
