import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function AuthModal({ mode, open, onClose, onSuccess }) {
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // {type, text}

  const showMessage = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  if (!open) return null;

  // ============================
  // SIGNUP
  // ============================
  const handleSignup = async () => {
    setLoading(true);
    
    const res = await fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      showMessage("success", "Signup successful! Verification required.");
      onSuccess(email); // open verify modal
    } else {
      showMessage("error", data.detail || "Signup failed");
    }
    
    setLoading(false);
  };

  // ============================
  // LOGIN
  // ============================
  const handleLogin = async () => {
    setLoading(true);
    
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      window.location.reload()
      setTimeout(() => onClose(), 800);
    } else {
      showMessage("error", data.detail || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative"
      >
        {/* Toast Message */}
        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`absolute top-3 left-0 right-0 w-[90%] mx-auto p-3 text-white rounded-lg text-center ${
                msg.type === "error" ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 mt-8">
          {mode === "signup" ? "Create Account" : "Login"}
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            className="border p-3 rounded-lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="border p-3 rounded-lg"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            onClick={mode === "signup" ? handleSignup : handleLogin}
            className="bg-indigo-600 text-white py-3 rounded-lg font-medium"
          >
            {loading ? (
              <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin inline-block" />
            ) : mode === "signup" ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
