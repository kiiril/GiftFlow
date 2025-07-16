import React, {useEffect} from 'react';
import PriceDropdown from "./PriceDropdown";
import SortButton from "./SortButton";
import LocationDropdown from "./LocationDropdown";
import SearchableDropdown from "./SearchableDropdown";
import {API_BASE_URL} from "../constants";
import axios from "axios";

const FilterBar = () => {
    const [tags, setTags] = React.useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/tags`).then(res => {
            setTags(res.data);
        });
    }, []);

    return (
        <div className="container mb-5">
            <div className="row gx-3 gy-2 w-75">
                <div className="col-12 col-md-3">
                    <SearchableDropdown
                        label={"Tags"}
                        multiple={true}
                        items={tags}
                        defaultValue={[]}
                    />
                </div>
                <div className="col-12 col-md-3">
                    <PriceDropdown title={"Price"}/>
                </div>
                <div className="col-12 col-md-2">
                    <SortButton/>
                </div>
                <div className="col-12 col-md-3">
                    <LocationDropdown/>
                </div>
            </div>
        </div>
    )
};

export default FilterBar;