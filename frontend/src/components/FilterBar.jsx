import React from 'react';
import PriceDropdown from "./PriceDropdown";
import SortButton from "./SortButton";
import LocationDropdown from "./LocationDropdown";
import SearchableDropdown from "./SearchableDropdown";

const FilterBar = () => {
    return (
        <div className="container mb-5">
            <div className="row gx-3 gy-2 w-75">
                <div className="col-12 col-md-3">
                    <SearchableDropdown
                        label={"Tags"}
                        multiple={true}
                        items={[
                            {label: "ECO", value: "eco", color: "green"},
                            {label: "Him", value: "him", color: "blue"},
                            {label: "Her", value: "her", color: "pink"},
                        ]}
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