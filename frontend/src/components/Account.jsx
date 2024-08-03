import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons/faPen";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import SubmitButton from "./SubmitButton";

const Account = () => {
    return (
        <form className="p-4">
            <div className="col-5 mb-4">
                <label htmlFor="name">Your name</label>
                <div className="input-group">
                    <input type="text" className="form-control border-end-0" id="name" placeholder="Name"/>
                    <span className="input-group-text bg-white border-start-0">
                        <FontAwesomeIcon icon={faPen}/>
                    </span>
                </div>
            </div>
            <div className="col-5 mb-4">
                <label htmlFor="surname">Your surname</label>
                <div className="input-group">
                    <input type="text" className="form-control border-end-0" id="surname" placeholder="Surname"/>
                    <span className="input-group-text bg-white border-start-0">
                        <FontAwesomeIcon icon={faPen}/>
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <div className="form-check-inline">
                    <input className="form-check-input me-2" type="radio" name="gender" id="male"/>
                    <label className="form-check-label" htmlFor="male">
                        Male
                    </label>
                </div>
                <div className="form-check-inline">
                    <input className="form-check-input me-2" type="radio" name="gender" id="female"/>
                    <label className="form-check-label" htmlFor="female">
                        Female
                    </label>
                </div>
                <div className="form-check-inline">
                    <input className="form-check-input me-2" type="radio" name="gender" id="notToSay"/>
                    <label className="form-check-label" htmlFor="notToSay">
                        Prefer not to say
                    </label>
                </div>
            </div>

            <div className="mb-5">
                <label htmlFor="date">Your birthday</label>
                <div id="date">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker/>
                    </LocalizationProvider>
                </div>
            </div>
            <div className="d-flex justify-content-between col-6">
                <SubmitButton textColor="black" backgroundColor={"#AAF0D1"} className="me-5">Save</SubmitButton>
                <SubmitButton textColor="black" backgroundColor={"#E6E6E6"}>Cancel</SubmitButton>
            </div>
        </form>
    );
};

export default Account;