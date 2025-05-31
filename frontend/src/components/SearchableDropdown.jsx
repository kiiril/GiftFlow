import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {useClickOutside} from "primereact/hooks";

/**
 * SearchableSelect component
 * Props:
 * - label: placeholder for dropdown button
 * - items: array of objects { value, label, color? }
 * - multiple: boolean (single vs multi-select)
 * - defaultValue: single value or array of values
 * - onChange: callback with selected value(s)
 */
const SearchableSelect = ({
                              label = 'Select',
                              items = [],
                              multiple = false,
                              defaultValue = multiple ? [] : null,
                              onChange,
                              buttonClassName = ""
                          }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(defaultValue);
    const containerRef = useRef();

    const filteredItems = useMemo(
        () =>
            items.filter((it) =>
                it.label.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [items, searchTerm]
    );

    useClickOutside(containerRef, () => {setIsOpen(false)})

    const onItemToggle = (item) => {
        if (multiple) {
            const exists = selectedItem.includes(item.value);
            const next = exists
                ? selectedItem.filter((v) => v !== item.value)
                : [...selectedItem, item.value];
            setSelectedItem(next);
            onChange && onChange(next);
        } else {
            setSelectedItem(item.value);
            onChange && onChange(item.value);
            setIsOpen(false);
        }
    }

    const renderLabel = () => {
        if (multiple) {
            const count = selectedItem.length;
            return count > 0 ? `${count} selected` : label;
        }
        if (!selectedItem) return label;
        const found = items.find((it) => it.value === selectedItem);
        return found ? found.label : label;
    }

    return (
        <div className="position-relative" ref={containerRef}>
            {/* fixme: probably hover effect is needed */}
            <button
                type="button"
                className={`btn dropdown-toggle w-100 text-start ${buttonClassName}`}
                style={{border: "2px solid rgba(44, 62, 80, 0.5)"}}
                onClick={() => setIsOpen((o) => !o)}
            >
                {renderLabel()}
            </button>
            {isOpen && (
                <div className="dropdown-menu show p-2 w-100 mt-2">
                    {/* Search input */}
                    <input
                        type="text"
                        className="form-control mb-2 shadow-none"
                        placeholder={`Search...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="list-group">
                        {/* fixme: decide about border and color on click */}
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <li
                                    key={item.value}
                                    className={`list-group-item d-flex align-items-center list-group-item-action border-0 ${!multiple && item.value === selectedItem ? 'active' : ''}`}
                                    style={{
                                        cursor: "pointer",
                                    }}
                                    onClick={() => onItemToggle(item)}
                                >
                                    {multiple ? (
                                        <div className={"form-check"}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={selectedItem.includes(item.value)}
                                                style={{
                                                    backgroundColor: selectedItem.includes(item.value)
                                                        ? item.color || '#0d6efd'
                                                        : 'transparent',
                                                    borderColor: selectedItem.includes(item.value)
                                                        ? 'transparent'
                                                        : '#ccc',
                                                }}
                                                id={`select-${item.value}`}
                                            />
                                            <label
                                                className="form-check-label ms-2 mb-0"
                                            >
                                                {item.label}
                                            </label>
                                        </div>
                                    ) : (
                                        <span className="flex-grow-1" role={"option"}>
                                            {item.label}
                                        </span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item text-muted">No matches</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchableSelect;
