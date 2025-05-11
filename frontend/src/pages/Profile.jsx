import React, {useState} from 'react';
import axios from "axios";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SubmitButton from "../components/SubmitButton";
import PrimaryButton from "../components/PrimaryButton";

const Profile = props => {
    const [inputs, setInputs] = useState({
        name: "",
        surname: "",
        gender: "",
        dateOfBirthday: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.put(`http://localhost:8080/users/${inputs.id}`, inputs);
        console.log(response);
    }

    const handleChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className="py-5 fs-5" style={{color: "#2C3E50", paddingLeft: "15rem", paddingRight: "15rem"}}>
            <form onSubmit={handleSubmit} style={{borderRadius: "15px"}}>
                <div className="row mb-4">
                    <div className="col-3 d-flex flex-column align-items-center gap-3">
                        <img
                            src="https://avatar.iran.liara.run/public"
                            alt="User Avatar"
                            className="rounded-circle"
                            style={{width: '150px', height: '150px'}}
                        />
                        <PrimaryButton text={"Change"} className="px-4" backgroundColor={"transparent"}
                                       textColor={"#141413"}/>
                    </div>

                    <div className="col-9">
                        <div className="mb-4">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control py-2"
                                placeholder="Enter your username"
                                defaultValue="auto_generated_username"
                            />
                        </div>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div>
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
                                        width: "100%",
                                        "& .MuiInputBase-input": {
                                            padding: "0.5rem 0.75rem",
                                        },
                                        "& .MuiInputBase-root": {
                                            border: "2px solid rgba(44, 62, 80, 0.5)"
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: "none"
                                        }
                                    }}
                                />
                            </div>
                        </LocalizationProvider>
                    </div>
                </div>

                <div className="row">
                    {/* fixme: don't use margins like that... temporary */}
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control py-2"
                            value="user@example.com"
                            readOnly
                        />
                    </div>

                    <label className="form-label">Gender</label>
                    <div className="d-flex w-100 justify-content-between mb-4">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="gender" id="radioMale"/>
                            <label className="form-check-label" htmlFor="radioMale">Male</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="gender" id="radioFemale"/>
                            <label className="form-check-label" htmlFor="radioFemale">Female</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="gender" id="radioOther"/>
                            <label className="form-check-label" htmlFor="radioOther">Prefer not to say</label>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="bio" className="form-label">Bio / About Me</label>
                        <textarea
                            id="bio"
                            className="form-control"
                            rows="3"
                            placeholder="Tell us about yourself..."
                        ></textarea>
                    </div>

                    {/* fixme: add later */}
                    {/*/!* Wishlist *!/*/}
                    {/*<div className="mb-3">*/}
                    {/*    <label htmlFor="wishlist" className="form-label">Wishlist</label>*/}
                    {/*    <textarea*/}
                    {/*        id="wishlist"*/}
                    {/*        className="form-control"*/}
                    {/*        rows="3"*/}
                    {/*        placeholder="List your gift wishes here..."*/}
                    {/*    ></textarea>*/}
                    {/*</div>*/}

                    <div className="d-flex justify-content-between gap-5">
                        <PrimaryButton className="py-2 w-100" text={"Save"} backgroundColor={"#91B58B"}/>
                        <PrimaryButton className="py-2 w-100" text={"Cancel"} backgroundColor={"#3D3D3A"}/>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;