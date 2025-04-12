import { useState } from "react";
import axios from "axios";

function AddressAutocomplete({ label, value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);

  const handleInput = async (e) => {
    const query = e.target.value;
    onChange(query);
    if (query.length < 3) return;

    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
        limit: 5,
      },
    });

    setSuggestions(res.data);
  };

  const handleSelect = (place) => {
    onChange(place.display_name);
    setSuggestions([]);
  };

  return (
    <div className="position-relative mb-3">
      <label className="form-label">{label}</label>
      <input
        className="form-control"
        value={value}
        onChange={handleInput}
        placeholder="Start typing address..."
      />
      {suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100 z-3">
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(place)}
              style={{ cursor: "pointer" }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default AddressAutocomplete;