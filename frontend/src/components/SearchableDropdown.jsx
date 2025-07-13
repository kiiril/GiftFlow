import React, {useState, useRef, useMemo, useEffect} from 'react';
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
const SearchableDropdown = ({
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

    useEffect(() => {
        setSelectedItem(defaultValue);
    }, [defaultValue]);

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
            const exists = selectedItem.includes(item.id);
            const next = exists
                ? selectedItem.filter((v) => v !== item.id)
                : [...selectedItem, item.id];
            setSelectedItem(next);
            onChange && onChange(next);
        } else {
            setSelectedItem(item.id);
            onChange && onChange(item.id);
            setIsOpen(false);
        }
    }

    const renderLabel = () => {
        if (multiple) {
            const count = selectedItem.length;
            return count > 0 ? `${count} selected` : label;
        }
        if (!selectedItem) return label;
        const found = items.find((it) => it.id === selectedItem);
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
                                    key={item.id}
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
                                                checked={selectedItem.includes(item.id)}
                                                style={{
                                                    backgroundColor: selectedItem.includes(item.id)
                                                        ? item.color || '#0d6efd'
                                                        : 'transparent',
                                                    borderColor: selectedItem.includes(item.id)
                                                        ? 'transparent'
                                                        : '#ccc',
                                                }}
                                                id={`select-${item.id}`}
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

export default SearchableDropdown;
