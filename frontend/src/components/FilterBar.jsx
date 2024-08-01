import React from 'react';
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import FilterForm from "./FilterForm";


const FilterBar = () => {

    const options = [
        {value: 'chocolate', label: 'Chocolate'},
        {value: 'strawberry', label: 'Strawberry'},
        {value: 'vanilla', label: 'Vanilla'}
    ];

    const animatedComponents = makeAnimated();

    return (
        // TODO: add colors styling for select
        <div>
            <div className="d-flex justify-content-between align-items-center w-50">
                <Select
                    options={options}
                    isMulti
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    className="w-100 mx-2"
                />
                <button className="btn d-flex align-items-center border-0 p-1 me-2" type="button"
                        data-bs-toggle="collapse" data-bs-target="#filters" aria-expanded="false"
                        aria-controls="filters">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                         className="bi bi-filter"
                         viewBox="0 0 16 16">
                        <path
                            d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                    </svg>
                    Filter
                </button>
            </div>
            <FilterForm/>
        </div>
    );
};

export default FilterBar;