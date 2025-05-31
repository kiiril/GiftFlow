import React, {useState} from 'react';
import SecondaryButton from "./SecondaryButton";

const PriceDropdown = ({title}) => {
    const [fromInput, setFromInput] = useState("");
    const [toInput, setToInput] = useState("");

    const handleNumberInputChange = (e, setValue) => {
        const newValue = e.target.value;
        if (/^\d*$/.test(newValue)) {
            setValue(newValue);
        }
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
                {title}
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
                        text={"Change"}
                        onHoverTextColor={"#FFFFFF"}
                        onHoverBackgroundColor={"#2C3E50"}
                        className={"py-1 w-100"}
                    />
                </div>

            </ul>
        </div>
    );
};

export default PriceDropdown;