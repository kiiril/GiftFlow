import React from 'react';
import {Rating, Slider, TextField} from "@mui/material";
import Select from "react-select";
import SubmitButton from "./SubmitButton";

const FilterForm = () => {
    const options = [
        {value: 'chocolate', label: 'Chocolate'},
        {value: 'strawberry', label: 'Strawberry'},
        {value: 'vanilla', label: 'Vanilla'}
    ];

    const [value, setValue] = React.useState([20, 37]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        setMinValue(newValue[0]);
        setMaxValue(newValue[1]);
    };

    const [minValue, setMinValue] = React.useState("");
    const [maxValue, setMaxValue] = React.useState("");
    const handleMinChange = (event) => {
        setMinValue(event.target.value);
        setValue([event.target.value, maxValue]);
    }
    const handleMaxChange = (event) => {
        setMaxValue(event.target.value);
        setValue([minValue, event.target.value]);
    }

    return (
        <form className="collapse m-auto w-50 border border-1 rounded mt-2" id="filters">
            <Select
                options={options}
                isMulti
                closeMenuOnSelect={false}
                placeholder={"Location"}
                className="m-3"
            />
            <div className="d-flex align-items-center m-3">
                <TextField value={minValue} onChange={handleMinChange} id="standard-basic" placeholder="Min" variant="standard"/>
                <Slider
                    getAriaLabel={() => 'Temperature range'}
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="on"
                    className="mx-4"
                />
                <TextField value={maxValue} onChange={handleMaxChange} id="standard-basic" placeholder="Max" variant="standard" />
            </div>
            <div className="d-flex align-items-center m-3">
                Rating higher than:
                <Rating/>
            </div>
            <div className="m-3">
                <SubmitButton color={"#ec644b"}>Clear</SubmitButton>
            </div>
        </form>
    );
};

export default FilterForm;