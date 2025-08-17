import React, { useState, useEffect, useRef, useMemo } from 'react';
import {useClickOutside} from "../hooks/useClickOutside";

const AutocompleteDropdown = ({
                                                 label = 'Select',
                                                 items = [],
                                                 defaultValue = '',
                                                 index = 0,
                                                 className = '',
                                                 onChange,
                                                 ...inputAttr
                                             }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(defaultValue);
    const [selectedItem, setSelectedItem] = useState(defaultValue);
    const containerRef = useRef();

    useEffect(() => {
        setSearchTerm(defaultValue);
        setSelectedItem(defaultValue);
    }, [defaultValue]);

    const handleClickOutside = () => {
        setIsOpen(false);
        setSearchTerm(selectedItem);
    }

    useClickOutside(containerRef, handleClickOutside);

    const filteredItems = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return term === ''
            ? items
            : items.filter(it => it.toLowerCase().includes(term));
    }, [items, searchTerm]);

    const onItemToggle = (value) => {
        setSelectedItem(value);
        setSearchTerm(value);
        setIsOpen(false);
        onChange?.(value);
    };

    return (
        <div className="position-relative w-100" ref={containerRef}>
            <input
                type="text"
                className={`form-control ${className}`}
                placeholder={label}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={() => setIsOpen(true)}
                aria-autocomplete="list"
                aria-expanded={isOpen}
                {...inputAttr}
            />

            {isOpen && (
                <ul
                    className="list-group position-absolute w-100 mt-1"
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                >
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, i) => (
                            <li
                                key={i}
                                role="option"
                                aria-selected={item === selectedItem}
                                className={
                                    'list-group-item list-group-item-action border-0' +
                                    (item === selectedItem ? ' active' : '')
                                }
                                style={{ cursor: 'pointer' }}
                                onClick={() => onItemToggle(item)}
                            >
                                {item}
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-muted">
                            No suggestions found
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}

export default AutocompleteDropdown;