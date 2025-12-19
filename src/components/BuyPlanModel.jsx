// components/BuyPlanModal.jsx
import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function BuyPlanModal({ open, onClose, plan }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");

  const [responseMsg, setResponseMsg] = useState(null); // NEW
  const [msgType, setMsgType] = useState("success"); // NEW

  if (!open || !plan) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setResponseMsg(null);

    const res = await fetch("http://localhost:8000/api/buy-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: fullName,
        contactEmail,
        phone,
        message,
        plan: plan.name,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMsgType("success");
      setResponseMsg("Thank you! We will contact you soon.");
      setTimeout(() => onClose(), 2000);
    } else {
      setMsgType("error");
      setResponseMsg(data.detail || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">

        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Buy {plan.name} Plan
        </h2>

        {/* MESSAGE BOX */}
        {responseMsg && (
          <div
            className={`p-3 rounded-xl mb-4 text-center ${
              msgType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {responseMsg}
          </div>
        )}

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Your Full Name"
            className="w-full p-3 border rounded-xl"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Your Contact Email"
            className="w-full p-3 border rounded-xl"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-3 border rounded-xl"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <textarea
            placeholder="Message (optional)"
            className="w-full p-3 border rounded-xl"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700"
          >
            {loading ? "Processing..." : "Submit Request"}
          </button>

          <button
            onClick={onClose}
            className="w-full mt-2 py-2 rounded-xl border border-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
