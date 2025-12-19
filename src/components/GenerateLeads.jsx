import React, { useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";

export default function GenerateLeads() {
  const { user } = useContext(AuthContext);

  const [platform, setPlatform] = useState("google");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const [leads, setLeads] = useState([]);
  const [loader, setLoader] = useState(false);
  const [country, setCountry] = useState(null);

  const isLoggedIn = !!user;
  const hasCredits = user?.credits > 0;

  const countries = [
    { name: "Afghanistan", iso: "AF", dial: "+93" },
    { name: "Albania", iso: "AL", dial: "+355" },
    { name: "Algeria", iso: "DZ", dial: "+213" },
    { name: "Andorra", iso: "AD", dial: "+376" },
    { name: "Angola", iso: "AO", dial: "+244" },
    { name: "Argentina", iso: "AR", dial: "+54" },
    { name: "Armenia", iso: "AM", dial: "+374" },
    { name: "Australia", iso: "AU", dial: "+61" },
    { name: "Austria", iso: "AT", dial: "+43" },
    { name: "Azerbaijan", iso: "AZ", dial: "+994" },
    { name: "Bangladesh", iso: "BD", dial: "+880" },
    { name: "Belgium", iso: "BE", dial: "+32" },
    { name: "Brazil", iso: "BR", dial: "+55" },
    { name: "Canada", iso: "CA", dial: "+1" },
    { name: "China", iso: "CN", dial: "+86" },
    { name: "Denmark", iso: "DK", dial: "+45" },
    { name: "Egypt", iso: "EG", dial: "+20" },
    { name: "France", iso: "FR", dial: "+33" },
    { name: "Germany", iso: "DE", dial: "+49" },
    { name: "India", iso: "IN", dial: "+91" },
    { name: "Indonesia", iso: "ID", dial: "+62" },
    { name: "Iran", iso: "IR", dial: "+98" },
    { name: "Iraq", iso: "IQ", dial: "+964" },
    { name: "Italy", iso: "IT", dial: "+39" },
    { name: "Japan", iso: "JP", dial: "+81" },
    { name: "Malaysia", iso: "MY", dial: "+60" },
    { name: "Mexico", iso: "MX", dial: "+52" },
    { name: "Netherlands", iso: "NL", dial: "+31" },
    { name: "New Zealand", iso: "NZ", dial: "+64" },
    { name: "Norway", iso: "NO", dial: "+47" },
    { name: "Pakistan", iso: "PK", dial: "+92" },
    { name: "Philippines", iso: "PH", dial: "+63" },
    { name: "Portugal", iso: "PT", dial: "+351" },
    { name: "Qatar", iso: "QA", dial: "+974" },
    { name: "Russia", iso: "RU", dial: "+7" },
    { name: "Saudi Arabia", iso: "SA", dial: "+966" },
    { name: "Singapore", iso: "SG", dial: "+65" },
    { name: "South Africa", iso: "ZA", dial: "+27" },
    { name: "Spain", iso: "ES", dial: "+34" },
    { name: "Sri Lanka", iso: "LK", dial: "+94" },
    { name: "Sweden", iso: "SE", dial: "+46" },
    { name: "Switzerland", iso: "CH", dial: "+41" },
    { name: "Thailand", iso: "TH", dial: "+66" },
    { name: "Turkey", iso: "TR", dial: "+90" },
    { name: "United Arab Emirates", iso: "AE", dial: "+971" },
    { name: "United Kingdom", iso: "GB", dial: "+44" },
    { name: "United States", iso: "US", dial: "+1" },
    { name: "Vietnam", iso: "VN", dial: "+84" },
    { name: "Zimbabwe", iso: "ZW", dial: "+263" },
  ];

  const APIFY_ALLOWED_ISO = [
    "AE", "AR", "AT", "AU", "BE", "BR", "CA", "CH", "CN", "CO", "CZ", "DE", "DK",
    "ES", "FI", "FR", "GB", "GR", "HK", "HU", "IE", "IL", "IN", "IT", "JP", "KR",
    "MY", "MX", "NL", "NO", "NZ", "PH", "PL", "PT", "RU", "SG", "SE", "TH", "TR",
    "TW", "US"
  ];


  const generate = async () => {
    setMsg("");

    if (!isLoggedIn)
      return setMsg("Please login or signup to generate leads.");
    if (!hasCredits)
      return setMsg("You have 0 credits. Please buy a plan.");
    if (!query.trim()) {
      setMsg("Please enter a keyword to search (e.g., 'plumber', 'real estate agent').");
      return;
    }

    setLoader(true);
    setLeads([]);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8000/generate-${platform}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, country: country }),
      });

      const data = await res.json();
      setLoader(false);

      if (!res.ok) {
        setMsg(data.detail || "Server error");
        return;
      }

      setMsg(data.message);

      // 🔥 PLATFORM-SPECIFIC MAPPING
      if (platform === "facebook") {
        const formatted = data.data.map((p) => ({
          title: p.title || "No Title",
          snippet: p.snippet || "",
          phone: p.phone || "N/A",
          country: p.country || "",
          url: p.url || "#",
          thumbnail: p.thumbnail || "",
        }));

        setLeads(formatted);
      } else if (platform === "linkedin") {
        const formatted = data.data.map((p) => ({
          title: p.title || "No Title",
          description: p.description || "",
          url: p.url || "#",
          phone: p.phone_number || "N/A",
          country: p.country || "",
          dialCode: p.dial_code || "",
        }));

        setLeads(formatted);
      } else if (platform === "twitter") {
        const formatted = data.data.map((p) => ({
          name: p.name || "No Name",
          username: p.username || "",
          phone: p.phone_numbers?.[0] || "N/A",
          profileUrl: p.user_link || "#",
          thumbnail: p.user_thumbnail || "",
          replies: p.replies || 0,
          timestamp: p.timestamp || "",
          platform: p.platform || "twitter",
        }));

        setLeads(formatted);
      } else {
        // GOOGLE = unchanged
        setLeads(data.data || []);
      }

      if (user) user.credits = data.credits_left;

    } catch {
      setLoader(false);
      setMsg("Network error");
    }
  };

  const downloadAllPDF = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/download-pdf-bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ leads }),
    });

    if (!res.ok) {
      setMsg("Failed to download PDF");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-leads.pdf";
    a.click();
  };

  // =======================
  // CARD RENDERERS
  // =======================

  const renderTwitterCard = (lead, i) => (
    <div key={i} className="p-5 bg-white shadow-md rounded-xl border">

      {/* Profile Image */}
      {lead.thumbnail && (
        <img
          src={lead.thumbnail}
          alt="profile"
          className="w-14 h-14 rounded-full mb-3"
        />
      )}

      {/* Name */}
      <h3 className="font-bold text-xl">{lead.name}</h3>

      {/* Username */}
      <p className="text-gray-600">@{lead.username}</p>

      {/* Phone */}
      <p className="text-sm mt-2">
        <strong>Phone:</strong> {lead.phone}
      </p>

      {/* Date */}
      <p className="text-xs text-gray-500 mt-1">
        {lead.timestamp}
      </p>

      {/* Profile Link */}
      <a
        href={lead.profileUrl}
        target="_blank"
        className="text-blue-600 underline mt-3 inline-block"
      >
        Open Twitter Profile
      </a>
    </div>
  );

  const renderGoogleCard = (lead, i) => (
    <div key={i} className="p-5 bg-white shadow-md rounded-xl border">
      
      {/* Title */}
      <h3 className="font-bold text-xl">{lead.title}</h3>

      {/* Address */}
      <p className="text-gray-600">
        {lead.street || ""} {lead.city || ""}
      </p>

      {/* Rating */}
      <p className="mt-2">
        ⭐ {lead.totalScore || "N/A"} • {lead.reviewsCount || 0} reviews
      </p>

      {/* Phone */}
      <p className="text-sm mt-2">
        Phone: {lead.phone || "N/A"}
      </p>

      {/* Emails */}
      {lead.emails?.length > 0 && (
        <p className="text-sm mt-1">
          Email: {lead.emails[0]}
        </p>
      )}

      {/* Category (optional) */}
      <p className="text-sm mt-1">
        Category: {lead.category || "Not Available"}
      </p>

      {/* Social Links */}
      <div className="flex flex-wrap gap-3 mt-3">
        {lead.instagrams?.[0] && (
          <a href={lead.instagrams[0]} target="_blank" className="text-pink-600 underline">
            Instagram
          </a>
        )}

        {lead.facebooks?.[0] && (
          <a href={lead.facebooks[0]} target="_blank" className="text-blue-700 underline">
            Facebook
          </a>
        )}
      </div>

      {/* Website + Maps */}
      <div className="flex gap-3 mt-3">
        {lead.website && (
          <a href={lead.website} target="_blank" className="text-indigo-600 underline">
            Website
          </a>
        )}
        <a href={lead.url} target="_blank" className="text-blue-600 underline">
          Maps
        </a>
      </div>
    </div>
  );

  const renderFacebookCard = (lead, i) => (
    <div key={i} className="p-5 bg-white shadow-md rounded-xl border">

      {/* Thumbnail */}
      {lead.thumbnail && (
        <img
          src={lead.thumbnail}
          alt="thumbnail"
          className="w-12 h-12 mb-3 rounded"
        />
      )}

      {/* Title */}
      <h3 className="font-bold text-xl text-blue-700">{lead.title}</h3>

      {/* Snippet */}
      <p className="text-gray-700 mt-2 whitespace-pre-line">
        {lead.snippet}
      </p>

      {/* Phone */}
      <p className="text-sm mt-2">
        <strong>Phone:</strong> {lead.phone}
      </p>

      {/* Country */}
      <p className="text-sm">
        <strong>Country:</strong> {lead.country}
      </p>

      {/* Link */}
      <a
        href={lead.url}
        target="_blank"
        className="text-blue-600 underline mt-3 inline-block"
      >
        Open Facebook Page
      </a>
    </div>
  );

  const renderLinkedinCard = (lead, i) => (
    <div key={i} className="p-5 bg-white shadow-md rounded-xl border">

      <h3 className="font-bold text-xl text-indigo-700">{lead.title}</h3>

      <p className="text-gray-700 mt-2 whitespace-pre-line">
        {lead.description}
      </p>

      <div className="mt-3 text-sm">
        <p><strong>Phone:</strong> {lead.phone}</p>
        <p><strong>Country:</strong> {lead.country}</p>
        <p><strong>Dial Code:</strong> {lead.dialCode}</p>
      </div>

      <a
        href={lead.url}
        target="_blank"
        className="text-blue-600 underline mt-3 inline-block"
      >
        Open LinkedIn Profile
      </a>
    </div>
  );

  const renderLeads = () => {
    if (!leads.length)
      return (
        <div className="w-full flex items-center py-6">
          <div className="text-gray-500 text-xl">No leads yet.</div>
        </div>
      );

    if (platform === "google") return leads.map(renderGoogleCard);
    if (platform === "facebook") return leads.map(renderFacebookCard);
    if (platform === "linkedin") return leads.map(renderLinkedinCard);
    if (platform === "twitter") return leads.map(renderTwitterCard);
  };

  // CHANGED: Filter countries based on platform
  const filteredCountries =
    platform === "twitter"
      ? countries.filter(c => APIFY_ALLOWED_ISO.includes(c.iso))  // Only APIFY_ALLOWED_ISO countries for Twitter
      : countries;  // All countries for Google, Facebook, LinkedIn

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-4">Generate Leads</h1>

      {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">{msg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <select
          className="p-3 border rounded-lg"
          value={platform}
          onChange={(e) => {
            setPlatform(e.target.value);
            setCountry(null); // Reset country when platform changes
          }}
        >
          <option value="google">Google Maps</option>
          <option value="facebook">Facebook</option>
          <option value="linkedin">LinkedIn</option>
          <option value="twitter">Twitter (X)</option>
        </select>

        <input
          className="p-3 border rounded-lg"
          placeholder="Keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Country Selection Dropdown */}
        {(platform === "google" || platform === "linkedin" || platform === "facebook" || platform === "twitter") && (
          <select
            className="p-3 border rounded-lg"
            value={country?.iso || ""}
            onChange={(e) =>
              setCountry(filteredCountries.find(c => c.iso === e.target.value))
            }
          >
            <option value="">Select Country</option>
            {filteredCountries.map(c => (
              <option key={c.iso} value={c.iso}>
                {/* CHANGED: Show short name for Twitter */}
                {platform === "twitter" ? `${c.iso} (${c.name})` : `${c.name} (${c.dial})`}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        onClick={generate}
        disabled={loader}
        className={`w-full py-3 rounded-lg font-semibold text-white ${
          loader ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loader ? "Generating..." : "Generate Leads"}
      </button>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderLeads()}
      </div>

      {!!leads.length && (
        <div className="text-center mt-6">
          <button
            onClick={downloadAllPDF}
            className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            Download All Leads (PDF)
          </button>
        </div>
      )}
    </div>
  );
}