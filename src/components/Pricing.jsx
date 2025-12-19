import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { AuthContext } from "./AuthContext";
import BuyPlanModal from "../components/BuyPlanModel";

export default function Pricing() {
  const { user } = useContext(AuthContext);

  const [openPlanModal, setOpenPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [authMsg, setAuthMsg] = useState(null);

  const plans = [
    {
      name: "Basic",
      price: "$20",
      leads: "300 Leads",
      highlight: false,
      features: [
        "300 total enriched leads",
        "Google Maps, LinkedIn, Facebook, Twitter",
        "Full data enrichment",
        "Leads stored in dashboard",
        "Export leads as PDF",
      ],
    },
    {
      name: "Standard",
      price: "$50",
      leads: "1000 Leads",
      highlight: true,
      features: [
        "1000 total enriched leads",
        "Google Maps, LinkedIn, Facebook, Twitter",
        "Full data enrichment",
        "Leads stored in dashboard",
        "Export leads as PDF",
      ],
    },
    {
      name: "Premium",
      price: "$100",
      leads: "2200 Leads",
      highlight: false,
      features: [
        "2200 total enriched leads",
        "Google Maps, LinkedIn, Facebook, Twitter",
        "Full data enrichment",
        "Leads stored in dashboard",
        "Unlimited PDF exports",
      ],
    },

    /* 🔥 CUSTOM PLAN */
    {
      name: "Custom",
      price: "Custom Pricing",
      leads: "Flexible Leads",
      highlight: false,
      custom: true,
      features: [
        "Custom number of leads",
        "Flexible credits allocation",
        "Dedicated support",
        "Tailored to your business needs",
      ],
    },
  ];

  const handleBuyClick = (plan) => {
    if (!user) {
      setAuthMsg("Please login first to buy a plan.");
      setTimeout(() => setAuthMsg(null), 3000);
      return;
    }
    setSelectedPlan(plan);
    setOpenPlanModal(true);
  };

  return (
    <>
      <section id="pricing" className="py-24 bg-white px-6 lg:px-16">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-indigo-700"
          >
            Transparent Pricing — Pay Only for What You Need
          </motion.h2>

          {authMsg && (
            <p className="text-red-600 font-semibold mt-10 text-2xl">
              {authMsg}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className={`p-8 rounded-3xl border cursor-pointer transition-all
                ${
                  p.highlight
                    ? "bg-indigo-600 text-white border-indigo-700 shadow-xl"
                    : p.custom
                    ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-xl"
                    : "bg-indigo-50 text-gray-900 hover:shadow-xl"
                }
              `}
            >
              {/* ICON */}
              {p.custom && (
                <Sparkles className="w-8 h-8 mb-4 text-yellow-300" />
              )}

              <h3 className="text-2xl font-bold">{p.name}</h3>

              <p className="mt-4 text-4xl font-extrabold">
                {p.price}
              </p>

              <p className="mt-2 font-medium opacity-90">
                {p.leads}
              </p>

              <ul className="mt-6 space-y-3">
                {p.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuyClick(p)}
                className={`mt-8 w-full py-3 rounded-xl font-semibold transition-all
                  ${
                    p.highlight
                      ? "bg-white text-indigo-700 hover:bg-gray-200"
                      : "bg-white/90 text-indigo-700 hover:bg-white"
                  }
                `}
              >
                {p.custom ? "Request Custom Plan" : "Request Plan"}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BUY / CUSTOM PLAN MODAL */}
      <BuyPlanModal
        open={openPlanModal}
        onClose={() => setOpenPlanModal(false)}
        plan={selectedPlan}
      />
    </>
  );
}
