// AllLeads.jsx (Corrected)
import React, { useEffect, useState, useMemo } from "react";

export default function AllLeads() {
  const [leads, setLeads] = useState(null);
  const [msg, setMsg] = useState("");
  const [activeTab, setActiveTab] = useState("google");
  // New State for filtering Pitch Status: 'all', 'yes', 'no'
  const [pitchFilter, setPitchFilter] = useState("all"); 

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMsg("Please login to view your saved leads.");
      setLeads([]);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/my-leads", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({ detail: "Failed to fetch" }));
        setMsg(d.detail);
        setLeads([]);
        return;
      }

      const data = await res.json();
      setLeads(data);
    } catch {
      setMsg("Network error.");
      setLeads([]);
    }
  };

  // New function to update pitch status
  const updatePitchStatus = async (leadId, currentStatus) => {
    const token = localStorage.getItem("token");
    // Toggle status: 'Yes' -> 'No', 'No' -> 'Yes'
    const newStatus = currentStatus === 'Yes' ? 'No' : 'Yes'; 

    try {
      const res = await fetch("http://localhost:8000/update-pitch-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lead_id: leadId, status: newStatus }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({ detail: "Failed to update status" }));
        setMsg(`Failed to update pitch status: ${d.detail}`);
        return;
      }

      // Update local state for immediate UI reflection
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          // Use 'No' as default if pitch_status is missing/null (for older leads)
          lead.id === leadId ? { ...lead, pitch_status: newStatus } : lead
        )
      );

    } catch (error) {
      setMsg("Network error while updating pitch status.");
    }
  };


  const downloadPlatformPDF = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8000/download-platform-leads?platform=${activeTab}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      setMsg("Failed to download platform PDF");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}-leads.pdf`;
    a.click();
  };


  // Unified modern card wrapper
  const CardWrapper = ({ children, isPitched }) => (
    <div
      className={`bg-white shadow-lg rounded-2xl border p-6 h-full flex flex-col justify-between transition-all duration-300 
      ${
        isPitched
          ? "border-green-400 hover:shadow-green-200/50 hover:shadow-xl" // Pitched style
          : "border-gray-200 hover:shadow-2xl hover:-translate-y-1" // Not pitched style
      } cursor-pointer`}
    >
      {children}
    </div>
  );

  // Status button component for reuse
  const PitchStatusButton = ({ lead }) => {
    // Lead status defaults to 'No' if the field is missing (for backwards compatibility)
    const status = lead.pitch_status || 'No';
    const isPitched = status === 'Yes';
    
    return (
      <button
        onClick={() => updatePitchStatus(lead.id, status)}
        className={`mt-4 py-2 px-4 rounded-lg text-sm font-bold transition-colors w-full
          ${
            isPitched
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
      >
        Pitch Done? ({status})
      </button>
    );
  };


// Google Card
const renderGoogleCard = (d, l) => (
  <CardWrapper isPitched={l.pitch_status === 'Yes'}>
    <div>
      {/* Title */}
      <h3 className="font-bold text-xl text-gray-900 mb-2">
        {d.title}
      </h3>

      {/* City */}
      <p className="text-sm text-gray-500 mb-3">
        {d.city || "City not available"}
      </p>

      {/* Rating */}
      <p className="text-sm font-medium text-yellow-600 mb-2">
        ⭐ {d.totalScore || "N/A"} — {d.reviewsCount || 0} reviews
      </p>

      {/* Phone */}
      <p className="text-sm mb-4 text-gray-700">
        <strong className="text-gray-800">Phone:</strong> {d.phone || "Not Available"}
      </p>

      {/* Email */}
      {d.emails?.length > 0 && (
        <p className="text-sm mb-4 text-gray-700">
          <strong className="text-gray-800">Email:</strong> {d.emails[0]}
        </p>
      )}

      {/* Social links */}
      <div className="flex flex-wrap gap-3 mt-2">
        {d.instagrams?.[0] && (
          <a href={d.instagrams[0]} target="_blank" className="text-pink-600 font-semibold hover:underline">
            Instagram
          </a>
        )}
        {d.facebooks?.[0] && (
          <a href={d.facebooks[0]} target="_blank" className="text-blue-700 font-semibold hover:underline">
            Facebook
          </a>
        )}
      </div>
    </div>

    {/* Bottom links */}
    <div className="flex flex-col gap-3 mt-auto pt-4 border-t">
      <div className="flex gap-4">
        {d.website && (
          <a href={d.website} target="_blank" className="text-indigo-600 font-semibold hover:underline">
            Website
          </a>
        )}
        <a
          href={d.url}
          target="_blank"
          className="text-blue-600 font-semibold hover:underline"
        >
          Maps
        </a>
      </div>

      <PitchStatusButton lead={l} />
    </div>
  </CardWrapper>
);


const renderFacebookCard = (d, l) => {
  return (
    <CardWrapper isPitched={l.pitch_status === 'Yes'}>
      <div>

        {/* Thumbnail */}
        {d.thumbnail && (
          <img
            src={d.thumbnail}
            alt="thumbnail"
            className="w-12 h-12 mb-3 rounded object-cover border"
          />
        )}

        {/* Title */}
        <h3 className="font-bold text-xl text-blue-700 mb-2">
          {d.title || "Facebook Page"}
        </h3>

        {/* Snippet */}
        <p className="text-gray-700 text-sm mb-4 whitespace-pre-line">
          {d.snippet || ""}
        </p>

        {/* Phone */}
        <p className="text-sm text-gray-800 mb-1">
          <strong>Phone:</strong> {d.phone || "N/A"}
        </p>

        {/* Country */}
        <p className="text-sm text-gray-800 mb-4">
          <strong>Country:</strong> {d.country || "N/A"}
        </p>

      </div>

      <div className="flex flex-col gap-3 mt-auto pt-4 border-t">
        <a
          href={d.url}
          target="_blank"
          className="text-blue-600 font-bold hover:underline block"
        >
          Open Facebook Page
        </a>

        <PitchStatusButton lead={l} />
      </div>
    </CardWrapper>
  );
};

// LinkedIn Card (Updated for NEW Profile JSON)
const renderLinkedinCard = (l, i) => {
  return (
    <CardWrapper isPitched={l.pitch_status === "Yes"}>
      <div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900">
          {l.title || "LinkedIn Profile"}
        </h3>

        {/* Description */}
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line mt-2 mb-4">
          {l.description || ""}
        </p>

        {/* Phone Info */}
        <div className="text-sm text-gray-700 space-y-1 mb-4">
          <p><strong>Phone:</strong> {l.phone || l.phone_number || "N/A"}</p>
          <p><strong>Country:</strong> {l.country || "N/A"}</p>
          <p><strong>Dial Code:</strong> {l.dialCode || l.dial_code || "N/A"}</p>
        </div>

      </div>

      {/* Footer buttons */}
      <div className="flex flex-col gap-3 mt-auto pt-4 border-t">

        <a
          href={l.url}
          target="_blank"
          className="text-blue-600 font-bold hover:underline block"
        >
          Open LinkedIn Profile
        </a>

        <PitchStatusButton lead={l} />
      </div>
    </CardWrapper>
  );
};

// Twitter Card
const renderTwitterCard = (l) => {
  const d = l.lead_data;

  return (
    <CardWrapper isPitched={l.pitch_status === "Yes"}>
      <div>

        {/* Profile Image */}
        {d.user_thumbnail && (
          <img
            src={d.user_thumbnail}
            alt="twitter profile"
            className="w-14 h-14 rounded-full mb-3 border"
          />
        )}

        {/* Name */}
        <h3 className="font-bold text-lg text-gray-900">
          {d.name || "Twitter Profile"}
        </h3>

        {/* Username */}
        <p className="text-sm text-gray-500 mb-3">
          @{d.username}
        </p>

        {/* Phone */}
        <p className="text-sm text-gray-800 mb-2">
          <strong>Phone:</strong>{" "}
          {d.phone_numbers?.[0] || "N/A"}
        </p>

        {/* Date */}
        <p className="text-xs text-gray-500">
          {d.timestamp}
        </p>

      </div>

      <div className="flex flex-col gap-3 mt-auto pt-4 border-t">

        <a
          href={d.user_link}
          target="_blank"
          className="text-blue-600 font-bold hover:underline"
        >
          Open Twitter Profile
        </a>

        <PitchStatusButton lead={l} />
      </div>
    </CardWrapper>
  );
};



  const renderCard = (l) => {
    const d = l.lead_data;
    if (l.platform === "google") return renderGoogleCard(d, l);
    if (l.platform === "facebook") return renderFacebookCard(d, l);
    if (l.platform === "linkedin") return renderLinkedinCard(d, l);
    if (l.platform === "twitter") return renderTwitterCard(l);
    return null;
  };

  // 1. Hook Call MUST be placed here, before any conditional return.
  // Filter leads based on activeTab and pitchFilter
  const filteredLeads = useMemo(() => {
    // Check if leads is null and return an empty array if so, to prevent error on first render
    if (!leads) return []; 

    return leads.filter((l) => {
      const platformMatch = l.platform === activeTab;
      // Default 'No' for leads without the new field
      const pitchStatus = l.pitch_status || 'No'; 

      if (!platformMatch) return false;

      if (pitchFilter === 'all') return true;
      if (pitchFilter === 'yes') return pitchStatus === 'Yes';
      if (pitchFilter === 'no') return pitchStatus === 'No';
      return false;
    });
  }, [leads, activeTab, pitchFilter]);


  // 2. Conditional return for loading state comes after all Hook Calls
  if (leads === null) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto mt-12 p-8 bg-gray-50 rounded-xl shadow-inner">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">All Saved Leads</h1>

      {msg && <div className="bg-yellow-50 text-yellow-700 p-3 rounded mb-6 font-medium">{msg}</div>}

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b pb-4">
        {["google", "facebook", "linkedin", "twitter"].map((p) => (
          <button
            key={p}
            onClick={() => {
              setActiveTab(p);
              setPitchFilter("all"); // Reset pitch filter on tab change
            }}
            className={`px-6 py-2 rounded-lg border font-semibold transition-all duration-300 text-sm
              ${activeTab === p ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Pitch Filter */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-gray-700 font-medium">Filter by Pitch Status:</span>
        {[
          { key: "all", label: "All Leads" },
          { key: "yes", label: "Pitched (Yes)" },
          { key: "no", label: "Not Pitched (No)" },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setPitchFilter(filter.key)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors
              ${pitchFilter === filter.key ? "bg-gray-800 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredLeads.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-lg">
          No {activeTab} leads found 
          {/* Show current filter in message */}
          {pitchFilter === 'all' ? '' : ` with status '${pitchFilter === 'yes' ? 'Pitched' : 'Not Pitched'}'`}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredLeads.map((l) => (
            <div key={l.id}>
              {renderCard(l)}
              <p className="text-xs text-gray-500 mt-2 text-right pr-1">
                Saved: {new Date(l.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

    <div className="flex justify-end mb-6 mt-8">
      <button
        onClick={downloadPlatformPDF}
        className="px-6 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 font-semibold"
      >
        Download {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Leads (PDF)
      </button>
    </div>
    </div>
  );
}