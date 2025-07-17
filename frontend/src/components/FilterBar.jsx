import React, {useEffect} from 'react';
import SortButton from "./SortButton";
import LocationDropdown from "./LocationDropdown";
import SearchableDropdown from "./SearchableDropdown";
import {API_BASE_URL} from "../constants";
import axios from "axios";

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

    return (
        <div className="container mb-5">
            <div className="row gx-3 gy-2 w-75">
                <div className="col-12 col-md-3">
                    <SearchableDropdown
                        label={"Tags"}
                        multiple={true}
                        items={tags}
                        defaultValue={filters.tags || []}
                        onChange={handleTagChange}
                    />
                </div>
                <div className="col-12 col-md-2">
                    <SortButton/>
                </div>
                <div className="col-12 col-md-3">
                    <LocationDropdown
                        defaultValue={filters.locations || []}
                        onChange={handleLocationChange}
                    />
                </div>
            </div>
        </div>
    )
};

export default FilterBar;