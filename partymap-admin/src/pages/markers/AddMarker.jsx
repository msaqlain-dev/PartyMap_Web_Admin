import { useState, useEffect } from "react";

export default function AddMarker() {
  const [form, setForm] = useState({
    markerType: "party",
    markerLabel: "",
    latitude: "",
    longitude: "",
    placeName: "",
    website: "",
    partyDescription: "",
    partyTime: "day",
    tickets: Array(24).fill(0),
  });

  const [partyIcon, setPartyIcon] = useState(null);
  const [placeImage, setPlaceImage] = useState(null);
  const [partyImage, setPartyImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTicketChange = (index, value) => {
    const updatedTickets = [...form.tickets];
    updatedTickets[index] = parseInt(value) || 0;
    setForm({ ...form, tickets: updatedTickets });
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "tickets") formData.append(key, value);
    });
    form.tickets.forEach((val, i) => {
      formData.append(`tickets[${i}]`, val);
    });
    if (partyIcon) formData.append("partyIcon", partyIcon);
    if (placeImage) formData.append("placeImage", placeImage);
    if (partyImage) formData.append("partyImage", partyImage);

    try {
      const res = await fetch("/api/markers", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Marker added successfully!");
        setForm({
          markerType: "party",
          markerLabel: "",
          latitude: "",
          longitude: "",
          placeName: "",
          website: "",
          partyDescription: "",
          partyTime: "day",
          tickets: Array(24).fill(0),
        });
        setPartyIcon(null);
        setPlaceImage(null);
        setPartyImage(null);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to add marker");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding marker");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Add Marker</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Marker Type</label>
            <select
              name="markerType"
              className="w-full border rounded px-3 py-2"
              value={form.markerType}
              onChange={handleChange}
            >
              <option value="party">Party</option>
              <option value="bar">Bar</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Upload Party Icon</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setPartyIcon)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Marker Label</label>
            <input
              type="text"
              name="markerLabel"
              className="w-full border rounded px-3 py-2"
              value={form.markerLabel}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Latitude</label>
            <input
              type="text"
              name="latitude"
              className="w-full border rounded px-3 py-2"
              value={form.latitude}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Longitude</label>
            <input
              type="text"
              name="longitude"
              className="w-full border rounded px-3 py-2"
              value={form.longitude}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Place Name</label>
            <input
              type="text"
              name="placeName"
              className="w-full border rounded px-3 py-2"
              value={form.placeName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Upload Place Image</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setPlaceImage)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Website</label>
            <input
              type="url"
              name="website"
              className="w-full border rounded px-3 py-2"
              value={form.website}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Party Time</label>
            <select
              name="partyTime"
              className="w-full border rounded px-3 py-2"
              value={form.partyTime}
              onChange={handleChange}
            >
              <option value="day">Day</option>
              <option value="noon">Noon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Upload Party Image</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setPartyImage)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Party Description</label>
            <textarea
              name="partyDescription"
              className="w-full border rounded px-3 py-2"
              rows="4"
              value={form.partyDescription}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Party Meter (Tickets per Hour)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {form.tickets.map((ticket, i) => {
              const hour = i % 12 === 0 ? 12 : i % 12;
              const ampm = i < 12 ? "AM" : "PM";
              return (
                <div key={i}>
                  <label className="block text-sm font-medium">
                    {hour}:00 {ampm}
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={ticket}
                    onChange={(e) => handleTicketChange(i, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Submit Marker
        </button>
      </form>
    </div>
  );
}
