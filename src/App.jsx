import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import IntroOverlay from "./components/IntroOverlay";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import GenerateLeads from "./components/GenerateLeads";
import AllLeads from "./components/AllLeads";
import LeadSourceInfo from "./components/Functionality";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-900">
      <AnimatePresence>
        {showIntro && (
          <IntroOverlay key="intro" onFinish={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <Header />

      <main className="pt-20">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <LeadSourceInfo/>
                <Pricing />
                <Testimonials />
                <Footer />
              </>
            }
          />
            <Route path="/leads" element={<GenerateLeads />} />
            <Route path="/allleads" element={<AllLeads/>} />
        </Routes>
      </main>
    </div>
  );
}
