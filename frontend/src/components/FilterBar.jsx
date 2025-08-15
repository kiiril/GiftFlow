import React, {useEffect} from 'react';
import SortButton from "./SortButton";
import LocationDropdown from "./LocationDropdown";
import SearchableDropdown from "./SearchableDropdown";
import {API_BASE_URL} from "../constants";
import axios from "axios";
import PriceDropdown from "./PriceDropdown";
import SecondaryButton from "./SecondaryButton";

const FilterBar = ({ onFilterChange, filters }) => {
    const [tags, setTags] = React.useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/tags`).then(res => {
            setTags(res.data);
        });
    }, []);

    const handleTagChange = (ids) => {
        onFilterChange({ tags: ids });
    };

    const handleLocationChange = (ids) => {
        onFilterChange({ locations: ids });
    };

    const handlePriceChange = (priceFilter) => {
        onFilterChange({ price: priceFilter });
    };

    const handleClearAllFilters = () => {
        onFilterChange({
            tags: [],
            locations: [],
            price: {}
        });
    };

    const hasActiveFilters = () => {
        return (filters.tags && filters.tags.length > 0) ||
               (filters.locations && filters.locations.length > 0) ||
               (filters.price && (filters.price.min !== undefined || filters.price.max !== undefined));
    };

    return (
        <div className="container mb-5 px-0">
            <div className="row gx-3 align-items-center">
                <div className="col-12 col-md-3">
                    <SearchableDropdown
                        label={"Select Tags"}
                        multiple={true}
                        items={tags}
                        defaultValue={filters.tags || []}
                        onChange={handleTagChange}
                    />
                </div>
                <div className={"col-12 col-md-3"}>
                    <PriceDropdown
                        defaultValue={filters.price || {}}
                        onChange={handlePriceChange}
                    />
                </div>
                <div className="col-12 col-md-3">
                    <LocationDropdown
                        defaultValue={filters.locations || []}
                        onChange={handleLocationChange}
                    />
                </div>
                {hasActiveFilters() && (
                    <div className={"col-12 col-md-2"}>
                        <SecondaryButton
                            text={"Clear"}
                            onHoverTextColor={"#FFFFFF"}
                            onHoverBackgroundColor={"#2C3E50"}
                            onClick={handleClearAllFilters}
                            className={"rounded-1"}
                        />
                    </div>
                )}
            </div>
        </div>
    )
};

export default FilterBar;