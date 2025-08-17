import React, {useState, useEffect} from 'react';
import SecondaryButton from "./SecondaryButton";

const PriceDropdown = ({ defaultValue = {}, onChange }) => {
    const [fromInput, setFromInput] = useState(defaultValue.min || "");
    const [toInput, setToInput] = useState(defaultValue.max || "");

    useEffect(() => {
        setFromInput(defaultValue.min || "");
        setToInput(defaultValue.max || "");
    }, [defaultValue]);

    const handleNumberInputChange = (e, setValue) => {
        const newValue = e.target.value;
        if (/^\d*$/.test(newValue)) {
            setValue(newValue);
        }
    }

    const handleApplyFilter = () => {
        const priceFilter = {};
        if (fromInput !== "") {
            priceFilter.min = parseInt(fromInput);
        }
        if (toInput !== "") {
            priceFilter.max = parseInt(toInput);
        }

        if (onChange && (priceFilter.min !== undefined || priceFilter.max !== undefined)) {
            onChange(priceFilter);
        } else if (onChange && fromInput === "" && toInput === "") {
            onChange({});
        }
    }

    const getButtonText = () => {
        if (fromInput === "" && toInput === "") {
            return "Price Range";
        }
        if (fromInput !== "" && toInput !== "") {
            return `$${fromInput} - $${toInput}`;
        }
        if (fromInput !== "") {
            return `From $${fromInput}`;
        }
        if (toInput !== "") {
            return `Up to $${toInput}`;
        }
        return "Price Range";
    }

    return (
        <div className="position-relative">
            <button
                className="btn dropdown-toggle text-start w-100"
                style={{border: "2px solid rgba(44, 62, 80, 0.5)"}}
                type="button"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
            >
                {getButtonText()}
            </button>

            <ul className="dropdown-menu mt-2">
                <div className="p-2">
                    <div className="row mb-3" style={{minWidth: "15rem"}}>
                        <div className="col">
                            <label className="form-label">
                                From
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={fromInput}
                                onChange={(e) => handleNumberInputChange(e, setFromInput)}
                                placeholder="from"
                            />
                        </div>
                        <div className="col">
                            <label className="form-label">
                                To
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={toInput}
                                onChange={(e) => handleNumberInputChange(e, setToInput)}
                                placeholder="to"
                            />
                        </div>
                    </div>

                    <SecondaryButton
                        text={"Apply"}
                        onHoverTextColor={"#FFFFFF"}
                        onHoverBackgroundColor={"#2C3E50"}
                        className={"py-1 w-100"}
                        onClick={handleApplyFilter}
                    />
                </div>

            </ul>
        </div>
    );
};

export default PriceDropdown;