import React, {useState} from 'react';
import axios from "axios";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SubmitButton from "../components/SubmitButton";
import PrimaryButton from "../components/PrimaryButton";

const NewProfile = props => {
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
        <div className="p-3 fs-5" style={{color: "#2C3E50"}}>
            <form onSubmit={handleSubmit} className="row"
                  style={{borderRadius: "15px"}}>
                <div className="col-3 d-flex flex-column align-items-center gap-3">
                    <img
                        src="https://avatar.iran.liara.run/public"
                        alt="User Avatar"
                        className="rounded-circle"
                        style={{width: '150px', height: '150px'}}
                    />
                    <PrimaryButton text={"Change"} className="px-4 py-1" backgroundColor={"transparent"} textColor={"#141413"}/>
                </div>

                <div className="col-6">
                    {/* Username */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            placeholder="Enter your username"
                            defaultValue="auto_generated_username"
                        />
                    </div>

                    {/* Bio / About Me */}
                    <div className="mb-3">
                        <label htmlFor="bio" className="form-label">Bio / About Me</label>
                        <textarea
                            id="bio"
                            className="form-control"
                            rows="3"
                            placeholder="Tell us about yourself..."
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value="user@example.com"
                            readOnly
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
                                    "& .MuiInputBase-input": {
                                        padding: "0.75em",
                                    },
                                    "& .MuiInputBase-root": {
                                        border: "2px solid rgba(44, 62, 80, 0.5)",
                                        borderRadius: "0.375em"
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        border: "none"
                                    }
                                }}
                                className="mb-3"
                            />
                        </div>
                    </LocalizationProvider>

                    {/* Gender */}
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

                    {/* fixme add later */}
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

                    {/* Save Button */}
                    <div className="row">
                        <div className="col text-start pe-5 me-3">
                            <PrimaryButton className="w-100 py-2" text={"Save"} backgroundColor={"#91B58B"}/>
                        </div>

                        <div className="col text-end ps-5">
                            <PrimaryButton className="w-100 py-2" text={"Cancel"} backgroundColor={"#3D3D3A"}/>
                        </div>
                    </div>
                </div>

                {/* fixme move to post creation */}
                {/*<div className="row mb-5">*/}
                {/*    <div className="col">*/}
                {/*    <AutocompleteDropdown label={"Country"} items={countries} index={2}/>*/}
                {/*    </div>*/}
                {/*    <div className="col">*/}
                {/*        <AutocompleteDropdown label={"City"} items={cities} index={0}/>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </form>
        </div>
    );
};

export default NewProfile;