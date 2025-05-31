import React, {useEffect} from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import axios from "axios";

const LocationDropdown = () => {
    // const MUI_X_PRODUCTS = [
    //     {
    //         id: 'Europe',
    //         label: 'Europe',
    //         children: [
    //             {
    //                 id: 'Poland',
    //                 label: 'Poland',
    //                 children: [
    //                     { id: 'Warsaw', label: 'Warsaw' },
    //                     { id: 'Krakow', label: 'Krakow' },
    //                 ]
    //             },
    //             {
    //                 id: 'Germany',
    //                 label: 'Germany',
    //                 children: [
    //                     { id: 'Berlin', label: 'Berlin' },
    //                     { id: 'Munich', label: 'Munich' },
    //                 ]
    //             },
    //             {
    //                 id: 'Slovenia',
    //                 label: 'Slovenia',
    //                 children: [
    //                     { id: 'Koper', label: 'Koper' },
    //                     { id: 'Ljubljana', label: 'Ljubljana' },
    //                 ]
    //             },
    //         ],
    //     },
    //     {
    //         id: 'Asia',
    //         label: 'Asia',
    //         children: [
    //             {
    //                 id: 'Japan',
    //                 label: 'Japan',
    //                 children: [
    //                     { id: 'Tokyo', label: 'Tokyo' },
    //                     { id: 'Osaka', label: 'Osaka' },
    //                 ]
    //             },
    //             {
    //                 id: 'China',
    //                 label: 'China',
    //                 children: [
    //                     { id: 'Shanghai', label: 'Shanghai' },
    //                     { id: 'Beijing', label: 'Beijing' },
    //                 ]
    //             },
    //         ],
    //     },
    //     {
    //         id: 'Africa',
    //         label: 'Africa',
    //         children: [{ id: 'UAE', label: 'UAE' }],
    //     },
    // ];

    const [items, setItems] = React.useState([]);

    const fetchLocations = async () => {
        const response = await axios.get("http://localhost:8080/locations/");
        setItems(response.data);
    }

    useEffect(() => {
        fetchLocations();
    }, []);

    function getItemDescendantsIds(item) {
        const ids = [];
        item.children?.forEach((child) => {
            ids.push(child.id);
            ids.push(...getItemDescendantsIds(child));
        });

        return ids;
    }

    const [selectedItems, setSelectedItems] = React.useState([]);
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

        setSelectedItems(newSelectedItemsWithChildren);

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
                Location
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