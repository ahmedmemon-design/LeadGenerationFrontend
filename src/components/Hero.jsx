import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="h-[900px] flex items-center bg-gradient-to-br from-white to-indigo-50 overflow-hidden sm:h-[750px]"
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Generate Leads with
            <span className="text-indigo-600 block">Precision & Style</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-md">
            A modern lead generation system built for speed, clarity, and conversions.
            Smooth UI, powerful tools — everything you need.
          </p>

          <div className="flex gap-4 mt-4">
            <a
              href="#features"
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition flex items-center gap-2"
            >
              Explore Features <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#contact"
              className="px-6 py-3 rounded-xl border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition"
            >
              Contact
            </a>
          </div>
        </motion.div>

      <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
  className="relative"
>
  <div className="w-full h-80 md:h-96 rounded-3xl overflow-hidden border border-indigo-300 shadow-xl backdrop-blur">
    <img
      src="image.png"
      alt="LeadGen Hero Illustration"
      className="w-full h-full object-cover"
    />
  </div>
</motion.div>

      </div>
    </section>
  );
}