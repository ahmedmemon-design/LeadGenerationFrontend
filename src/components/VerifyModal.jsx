import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyModal({ email, open, onClose }) {
  const [code, setCode] = useState("");
  const [resends, setResends] = useState(0);
  const [message, setMessage] = useState("");       // success/error message
  const [type, setType] = useState("");             // "success" | "error"

  if (!open) return null;

  const verify = async () => {
    setMessage("");

    const res = await fetch("http://localhost:8000/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (res.ok) {
      setType("success");
      setMessage("Email verified! You can login now.");
      localStorage.setItem("token", data.access_token)
      setTimeout(() => onClose(), 1500);
      window.location.reload();
    } else {
      setType("error");
      setMessage(data.detail || "Verification failed.");
    }
  };


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-md"
        >
          <h2 className="text-xl font-semibold mb-3">Verify Your Email</h2>

          <p className="text-gray-600 mb-4 text-sm">
            A verification code has been sent to:
            <br />
            <span className="font-semibold">{email}</span>
          </p>

          {/* Message Box */}
          {message && (
            <div
              className={`p-3 rounded-lg mb-3 text-sm ${
                type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <input
            type="text"
            placeholder="Enter 6-digit code"
            className="w-full p-3 border rounded-lg mb-4 tracking-widest text-center"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            onClick={verify}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg"
          >
            Verify
          </button>

          <button onClick={onClose} className="w-full mt-3 text-gray-600 py-2">
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
