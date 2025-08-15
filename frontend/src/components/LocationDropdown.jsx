import React, {useEffect} from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import axios from "axios";
import {API_BASE_URL} from "../constants";

const LocationDropdown = ({ onChange, defaultValue = [] }) => {
    const [items, setItems] = React.useState([]);

    const fetchLocations = async () => {
        const response = await axios.get(`${API_BASE_URL}/locations/tree`);
        setItems(response.data);
    }

    useEffect(() => {
        fetchLocations();
    }, []);

    const parentMap = React.useMemo(() => {
        const map = new Map();
        function traverse(items, parent = null) {
            for (const item of items) {
                map.set(item.id, parent);
                if (item.children) {
                    traverse(item.children, item);
                }
            }
        }
        traverse(items);
        return map;
    }, [items]);

    function getItemDescendantsIds(item) {
        const ids = [];
        item.children?.forEach((child) => {
            ids.push(child.id);
            ids.push(...getItemDescendantsIds(child));
        });

        return ids;
    }

    const [selectedItems, setSelectedItems] = React.useState(defaultValue);
    const toggledItemRef = React.useRef({});
    const apiRef = useTreeViewApiRef();

    const handleItemSelectionToggle = (event, itemId, isSelected) => {
        toggledItemRef.current[itemId] = isSelected;
    };

    const handleSelectedItemsChange = (event, newSelectedItems) => {
        setSelectedItems(newSelectedItems);

        // Select / unselect the children of the toggled item
        const itemsToSelect = [];
        const itemsToUnSelect = {};
        Object.entries(toggledItemRef.current).forEach(([itemId, isSelected]) => {
            const item = apiRef.current.getItem(itemId);
            if (isSelected) {
                itemsToSelect.push(...getItemDescendantsIds(item));
            } else {
                getItemDescendantsIds(item).forEach((descendantId) => {
                    itemsToUnSelect[descendantId] = true;
                });
            }
        });

        const newSelectedItemsWithChildren = Array.from(
            new Set(
                [...newSelectedItems, ...itemsToSelect].filter(
                    (itemId) => !itemsToUnSelect[itemId],
                ),
            ),
        );

        const leafItems = newSelectedItemsWithChildren.filter(itemId => {
            const item = apiRef.current.getItem(itemId);
            return !item.children || item.children.length === 0;
        });

        const locationsWithCountry = leafItems.map(cityId => {
            const cityItem = apiRef.current.getItem(cityId);
            const parentItem = parentMap.get(cityId);
            if (parentItem) {
                return `${parentItem.label}, ${cityItem.label}`;
            }
            return cityItem.label;
        });

        setSelectedItems(newSelectedItemsWithChildren);
        onChange?.(locationsWithCountry);

        toggledItemRef.current = {};
    };

    return (
        <div className="dropdown">
            <button
                className="btn dropdown-toggle text-start w-100"
                style={{border: "2px solid rgba(44, 62, 80, 0.5)"}}
                type="button"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
            >
                Select Locations
            </button>
            <div className="dropdown-menu p-2" style={{width: "15em", maxHeight: "30em", overflowY: "auto"}}>
                <input type="text"
                       className="form-control shadow-none mb-2"
                       placeholder="Search..."
                />
                <RichTreeView
                    multiSelect
                    checkboxSelection
                    apiRef={apiRef}
                    items={items}
                    selectedItems={selectedItems}
                    onSelectedItemsChange={handleSelectedItemsChange}
                    onItemSelectionToggle={handleItemSelectionToggle}
                />
            </div>
        </div>
    );
};

export default LocationDropdown;