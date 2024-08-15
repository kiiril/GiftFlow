import React, {useContext, useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons/faPen";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import SubmitButton from "./SubmitButton";
import dayjs from "dayjs";
import axios from "axios";
import {AuthContext} from "../contexts/AuthProvider";

const Account = () => {
    const {setUserCookies, getUserCookies} = useContext(AuthContext);

    const [inputs, setInputs] = useState({
        name: "",
        surname: "",
        gender: "",
        dateOfBirthday: ""
    });

    useEffect(() => {
        setInputs(getUserCookies());
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.put(`http://localhost:8080/users/${inputs.id}`, inputs);
        console.log(response);
        setUserCookies(inputs);
    }

    const handleChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
    }

    return (
        <form className="p-4" onSubmit={handleSubmit}>
            <div className="col-5 mb-4">
                <label htmlFor="name">Your name</label>
                <div className="input-group">
                    <input type="text" className="form-control border-end-0" value={inputs.name} onChange={handleChange} name="name" id="name" placeholder="Name"/>
                    <span className="input-group-text bg-white border-start-0">
                        <FontAwesomeIcon icon={faPen}/>
                    </span>
                </div>
            </div>
            <div className="col-5 mb-4">
                <label htmlFor="surname">Your surname</label>
                <div className="input-group">
                    <input type="text" className="form-control border-end-0" value={inputs.surname} onChange={handleChange} name="surname" id="surname" placeholder="Surname"/>
                    <span className="input-group-text bg-white border-start-0">
                        <FontAwesomeIcon icon={faPen}/>
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <div className="form-check-inline">
                    <input className="form-check-input me-2" type="radio" name="gender" value="male" onChange={handleChange} checked={inputs.gender === "male"} id="male"/>
                    <label className="form-check-label" htmlFor="male">
                        Male
                    </label>
                </div>
                <div className="form-check-inline">
                    <input className="form-check-input me-2" type="radio" name="gender" value="female" onChange={handleChange} checked={inputs.gender === "female"} id="female"/>
                    <label className="form-check-label" htmlFor="female">
                        Female
                    </label>
                </div>
                <div className="form-check-inline">
                    <input className="form-check-input me-2" type="radio" name="gender" value="undefined" onChange={handleChange} checked={inputs.gender === "undefined"} id="notToSay"/>
                    <label className="form-check-label" htmlFor="notToSay">
                        Prefer not to say
                    </label>
                </div>
            </div>

            <div className="mb-5">
                <label htmlFor="date">Your birthday</label>
                <div id="date">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            name="birthday"
                            format="DD/MM/YYYY"
                            value={inputs.dateOfBirthday === "" ? null : dayjs(inputs.dateOfBirthday, "YYYY-MM-DD")}
                            onChange={(value) => setInputs({...inputs, dateOfBirthday: value ? dayjs(value).format("YYYY-MM-DD") : ""})}
                        />
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