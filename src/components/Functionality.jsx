import React from "react";
import { motion } from "framer-motion";
import {
  FaGoogle,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInfoCircle,
} from "react-icons/fa";

/* Animation Variants */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function LeadSourceFeatures() {
  return (
    <section className="w-full py-20 bg-white overflow-hidden" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          variants={cardVariants}
          className="text-center mb-14"
        >
          <span className="inline-block mb-3 px-4 py-1 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-full">
            Features
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Powerful Multi-Platform Lead Sources
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Generate verified leads from multiple platforms using
            publicly available data. Animations replay every time
            this section enters the viewport.
          </p>
        </motion.div>

        {/* CARDS CONTAINER */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Google */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 text-red-600 mb-4">
              <FaGoogle size={22} />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Google Maps Leads
            </h3>
            <p className="text-sm text-gray-600">
              Business leads including name, address, phone number, emails,
              ratings, reviews, website and social links (if public).
            </p>
          </motion.div>

          {/* Facebook */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
              <FaFacebookF size={22} />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Facebook Leads
            </h3>
            <p className="text-sm text-gray-600">
              Public Facebook pages and profiles with page details,
              phone number and profile link (if available).
            </p>
          </motion.div>

          {/* LinkedIn */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
              <FaLinkedinIn size={22} />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              LinkedIn Leads
            </h3>
            <p className="text-sm text-gray-600">
              Professional profiles including name, description,
              country and phone number (only if public).
            </p>
          </motion.div>

          {/* Twitter */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-sky-50 text-sky-600 mb-4">
              <FaTwitter size={22} />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Twitter (X) Leads
            </h3>
            <p className="text-sm text-gray-600">
              Public Twitter profiles and 
            username, phone number, profile link.
            </p>
          </motion.div>
        </motion.div>

        {/* DISCLAIMER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mt-12 max-w-3xl mx-auto flex gap-3 bg-yellow-50 border border-yellow-200 p-5 rounded-xl"
        >
          <FaInfoCircle className="text-yellow-600 mt-1" />
          <p className="text-sm text-gray-700">
            <strong>Important:</strong> Not every lead contains phone numbers,
            emails or social links. Only publicly available information is shown.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
