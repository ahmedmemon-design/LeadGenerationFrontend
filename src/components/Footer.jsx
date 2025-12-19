import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-indigo-700 text-white py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto text-center"
      >
        {/* Brand */}
        <h3 className="text-2xl font-extrabold tracking-wide">
          LeadGen
        </h3>

        <p className="text-indigo-200 mt-3 text-sm">
          Smart & scalable lead generation platform
        </p>

        {/* Divider */}
        <div className="h-px w-24 bg-indigo-400 mx-auto my-6 opacity-60" />

        {/* Copyright */}
        <p className="text-xs text-indigo-200">
          © {new Date().getFullYear()} LeadGen. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
