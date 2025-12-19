// components/Testimonials.jsx
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Arslan Ahmed",
      role: "Digital Marketer",
      text: "LeadGen ne mere liye Google Maps se ultra-refined leads nikali. Phone number + email + website sab kuch accurate mila!",
    },
    {
      name: "Sana Malik",
      role: "Freelancer",
      text: "LinkedIn post scraping feature OP hai! 24 hours ke andar freshly posted clients ke leads mil gaye. Conversion rate bohot high tha.",
    },
    {
      name: "Yasir Shah",
      role: "Agency Owner",
      text: "Facebook interest-based leads ne mera ad budget 60% save karwa diya. PDF download se reporting aur easy ho gayi.",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-white px-6 lg:px-16">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-indigo-700"
        >
          Loved By Professionals Everywhere
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-600 mt-4 max-w-2xl mx-auto"
        >
          Our users trust LeadGen for powerful, accurate, and enriched lead generation.
        </motion.p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            whileHover={{ scale: 1.05, y: -6 }}
            className="p-8 bg-indigo-50 rounded-3xl shadow-md hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="flex gap-1 mb-4 justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
              <Star className="w-5 h-5 text-yellow-400" />
              <Star className="w-5 h-5 text-yellow-400" />
              <Star className="w-5 h-5 text-yellow-400" />
              <Star className="w-5 h-5 text-yellow-400" />
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              "{t.text}"
            </p>

            <div className="mt-6 text-center">
              <h3 className="text-lg font-bold text-indigo-700">{t.name}</h3>
              <p className="text-gray-600 text-sm">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
