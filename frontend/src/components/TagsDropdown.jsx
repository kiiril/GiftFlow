import React, {useEffect, useState} from 'react';
import axios from "axios";

const TagsDropdown = () => {
    const [inputValue, setInputValue] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        const response = await axios.get("http://localhost:8080/tags/");
        setItems(response.data);
        setFilteredSuggestions(response.data);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim() === "") {
            setFilteredSuggestions(items);
        } else {
            const filtered = items.filter((item) =>
                item.name.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        }
    };

    return (
        <div className="dropdown">
            <button
                className="btn btn-outline-dark dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
            >
                Tags
            </button>

            <ul className="dropdown-menu p-2">
                <input type="text"
                       className="form-control shadow-none mb-2"
                       placeholder="Search..."
                       value={inputValue}
                       onChange={handleChange}
                />
                {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item, index) => (
                        <li
                            key={index}
                            className="dropdown-item"
                            onClick={() => {
                                setCheckedItems({
                                    ...checkedItems,
                                    [item.name]: !checkedItems[item.name],
                                });
                            }}
                        >
                            <div className="form-check">
                                <input
                                    className="form-check-input rounded-circle"
                                    type="checkbox"
                                    id={`tags-checkbox-${index}`}
                                    checked={checkedItems[item.name]}
                                    style={{
                                        backgroundColor: checkedItems[item.name]
                                            ? item.color
                                            : 'transparent', // Assign random color for checked, transparent for unchecked
                                        borderColor: checkedItems[item.name] ? 'transparent' : '#ccc',
                                    }}
                                />
                                <label className="form-check-label">
                                    {item.name}
                                </label>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="px-2 text-muted">No results found</li>
                )}
            </ul>
        </div>
    );
};

export default TagsDropdown;