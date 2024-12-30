import React, { useState } from "react";

const AutocompleteDropdown = ({label, items, index}) => {
    const [inputValue, setInputValue] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim() === "") {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        } else {
            const filtered = items.filter((item) =>
                item.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        }
    };

    const handleSelect = (suggestion) => {
        setInputValue(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div className="position-relative">
            <input
                className="form-control mb-1"
                type="text"
                value={inputValue}
                onChange={handleChange}
                onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
                placeholder={label}
            />
            {showSuggestions && (
                <ul
                    className={`list-group position-absolute z-${index} w-100`}
                >
                    {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(suggestion)}
                                className="list-group-item list-group-item-action"
                                style={{
                                    cursor: "pointer",
                                }}
                            >
                                {suggestion}
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item">No suggestions found</li>
                    )}
                </ul>
            )}
        </div>
    );
}

export default AutocompleteDropdown;