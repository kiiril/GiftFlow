import React, {useState} from 'react';

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
        <div className="dropdown">
            <button
                className="btn btn-outline-dark dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
            >
                {title}
            </button>

            <ul className="dropdown-menu">
                <div className="p-2" style={{minWidth: "15rem"}}>
                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label">From</label>
                            <input
                                type="text"
                                className="form-control"
                                value={fromInput}
                                onChange={(e) => handleNumberInputChange(e, setFromInput)}
                                placeholder="from"
                            />
                        </div>
                        <div className="col">
                            <label className="form-label">To</label>
                            <input
                                type="text"
                                className="form-control"
                                value={toInput}
                                onChange={(e) => handleNumberInputChange(e, setToInput)}
                                placeholder="to"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <button className="btn btn-outline-success w-100">Apply</button>
                        </div>
                    </div>
                </div>

            </ul>
        </div>
    );
};

export default PriceDropdown;