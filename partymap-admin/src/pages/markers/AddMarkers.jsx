import { useState } from "react";

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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
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
            <label className="block mb-1 font-medium">Website</label>
            <input
              type="url"
              name="website"
              className="w-full border rounded px-3 py-2"
              value={form.website}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
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
