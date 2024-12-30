import React, {useContext, useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons/faPen";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import SubmitButton from "./SubmitButton";
import dayjs from "dayjs";
import axios from "axios";
import {AuthContext} from "../contexts/AuthProvider";
import AutocompleteDropdown from "./AutocompleteDropdown";

const countries = ["Belarus", "Bahrain"]
const cities = ["Minsk", "Pinsk", "Mogilev"]

const Account = () => {
    const {setUserCookies, getUserCookies} = useContext(AuthContext);

    const [inputs, setInputs] = useState({
        name: "",
        surname: "",
        gender: "",
        dateOfBirthday: ""
    });

    useEffect(() => {
        // FIXME not necessary behaviour
        const cookies = getUserCookies();
        if (cookies)
            setInputs(cookies);
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
        <div className="p-3">
            <form onSubmit={handleSubmit}>
                <div className="row mb-4">
                    <div className="col">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input className="form-control"
                               name="firstName"
                               value={inputs.firstName}
                               onChange={handleChange}
                               type="text"
                               placeholder="John"
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input className="form-control"
                               name="lastName"
                               value={inputs.lastName}
                               onChange={handleChange}
                               type="text"
                               placeholder="Doe"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="form-label">Your email</label>
                    <input className="form-control"
                           name="email"
                           value={inputs.email}
                           onChange={handleChange}
                           type="email"
                           placeholder="example@gmail.com"
                    />
                </div>

                {/* Gender */}
                <div className="d-flex w-100 justify-content-between pe-5 mb-4">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="gender" id="radioMale"/>
                        <label className="form-check-label" htmlFor="radioMale">
                            Male
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="gender" id="radioFemale"/>
                        <label className="form-check-label" htmlFor="radioFemale">
                            Female
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="gender" id="radioOther"/>
                        <label className="form-check-label" htmlFor="radioOther">
                            Prefer not to say
                        </label>
                    </div>
                </div>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="mb-4">
                        <label htmlFor="birthday" className="d-block form-label">
                            Date of Birth
                        </label>
                        <DatePicker
                            id="birthday"
                            name="birthday"
                            format="DD/MM/YYYY"
                            value={inputs.dateOfBirthday === "" ? null : dayjs(inputs.dateOfBirthday, "YYYY-MM-DD")}
                            onChange={(value) => setInputs({
                                ...inputs,
                                dateOfBirthday: value ? dayjs(value).format("YYYY-MM-DD") : ""
                            })}
                            sx={{
                                "& .MuiInputBase-input": {
                                    padding: "0.75em"
                                }
                            }}
                            className="mb-4"
                        />
                    </div>
                </LocalizationProvider>

                {/* fixme move to post creation */}
                {/*<div className="row mb-5">*/}
                {/*    <div className="col">*/}
                {/*    <AutocompleteDropdown label={"Country"} items={countries} index={2}/>*/}
                {/*    </div>*/}
                {/*    <div className="col">*/}
                {/*        <AutocompleteDropdown label={"City"} items={cities} index={0}/>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="row">
                    <div className="col">
                        <SubmitButton>
                            Save
                        </SubmitButton>
                    </div>

                    <div className="col">
                        <SubmitButton>
                            Cancel
                        </SubmitButton>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Account;