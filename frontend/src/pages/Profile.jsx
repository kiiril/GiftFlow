import React, {useEffect, useState} from 'react';
import axios from "axios";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SecondaryButton from "../components/SecondaryButton";
import {API_BASE_URL, UPLOADS_BASE_URL} from "../constants";

const Profile = () => {
    const [userData, setUserData] = useState({});
    const [originalUserData, setOriginalUserData] = useState({});
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/users/me`, {}).then(response => {
            const user = response.data;
            if (user.date_of_birthday) {
                user.date_of_birthday = dayjs(user.date_of_birthday).format("YYYY-MM-DD");
            }
            setUserData(user);
            setOriginalUserData(user);
        });
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        const avatarFile = document.getElementById("avatarUpload").files[0];
        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        formData.append("username", userData.username);
        formData.append("date_of_birthday", userData.date_of_birthday);
        formData.append("location", userData.location);
        formData.append("gender", userData.gender);
        formData.append("bio", userData.bio);

        try {
            const response = await axios.put(`${API_BASE_URL}/users/me`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setOriginalUserData(response.data);
            setUserData(response.data);
            setIsChanged(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }

    const handleChange = (e) => {
        console.log("hit")
        console.log(e.target.name, e.target.value);
        console.log("userData", userData);
        const updatedData = {
            ...userData,
            [e.target.name]: e.target.value
        };
        setUserData(updatedData);
        setIsChanged(JSON.stringify(updatedData) !== JSON.stringify(originalUserData));
    }

    const handleDateChange = (value) => {
        const updatedData = {
            ...userData,
            date_of_birthday: value ? dayjs(value).format("YYYY-MM-DD") : null
        };
        setUserData(updatedData);
        setIsChanged(JSON.stringify(updatedData) !== JSON.stringify(originalUserData));
    };

    const handleAvatarChange = () => {
        const avatarFile = document.getElementById("avatarUpload").files[0];
        if (avatarFile) {
            setIsChanged(true);
        }
    }

    const handleCancel = () => {
        setUserData(originalUserData);
        setIsChanged(false);
    };

    return (
        <div className="container" style={{padding: "4rem 15rem"}}>
            <form>
                <div className="row mb-4 gx-5">
                    <div className="col-auto d-flex flex-column align-items-center gap-3">
                        <img
                            src={UPLOADS_BASE_URL + userData.avatar_url}
                            alt="User Avatar"
                            className="rounded-circle"
                            style={{ width: "150px", height: "150px" }}
                        />
                        <>
                            <input
                                type="file"
                                id="avatarUpload"
                                style={{display: "none"}}
                                accept="image/png, image/jpeg, image/jpg, image/svg"
                                onChange={handleAvatarChange}
                            />
                            <SecondaryButton
                                text={"Change"}
                                onHoverTextColor={"#FFFFFF"}
                                onHoverBackgroundColor={"#2C3E50"}
                                className={"py-1"}
                                onClick={() => document.getElementById("avatarUpload").click()}
                            />
                        </>
                    </div>

                    <div className="col">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label fw-bold">Username</label>
                            <input
                                type="text"
                                id="username"
                                name={"username"}
                                className="form-control py-2"
                                placeholder="Enter your username"
                                value={userData.username || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div>
                                <label htmlFor="birthday" className="form-label fw-bold">
                                    Date of Birth
                                </label>

                                <DatePicker
                                    id="birthday"
                                    name="birthday"
                                    format="DD/MM/YYYY"
                                    value={userData.date_of_birthday ? dayjs(userData.date_of_birthday, "YYYY-MM-DD") : null}
                                    onChange={handleDateChange}
                                    maxDate={dayjs()}
                                    sx={{
                                        width: "100%",
                                        "& .MuiInputBase-input": {
                                            padding: "0.5rem 0.75rem",
                                        },
                                        "& .MuiInputBase-root": {
                                            border: "2px solid rgba(44, 62, 80, 0.5)",
                                            "&:focus-within": {
                                                borderColor: "#2C3E50",
                                                color: "#2C3E50"
                                            },
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
                        <label htmlFor="email" className="form-label fw-bold">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control py-2"
                            value={userData.email || ""}
                            readOnly
                        />
                    </div>

                    <label className="form-label fw-bold">Gender</label>
                    <div className="d-flex w-100 justify-content-between mb-4">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="gender" id="radioMale" value={"Male"} checked={userData.gender === "Male"} onChange={handleChange}/>
                            <label className="form-check-label" htmlFor="radioMale">Male</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="gender" id="radioFemale" value={"Female"} checked={userData.gender === "Female"} onChange={handleChange}/>
                            <label className="form-check-label" htmlFor="radioFemale">Female</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="gender" id="radioOther" value={"Other"} checked={userData.gender === "Other"} onChange={handleChange}/>
                            <label className="form-check-label" htmlFor="radioOther">Prefer not to say</label>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="bio" className="form-label fw-bold">About Me</label>
                        <textarea
                            id="bio"
                            className="form-control"
                            rows="3"
                            placeholder="Tell us about yourself..."
                            name="bio"
                            value={userData.bio || ""}
                            onChange={handleChange}
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

                    {
                        isChanged && (
                            <div className="d-flex justify-content-between gap-3">
                                <SecondaryButton text={"Update"} onHoverTextColor={"#FFFFFF"}
                                                 onHoverBackgroundColor={"#91B58B"} className="flex-grow-1" onClick={handleUpdate}/>
                                <SecondaryButton text={"Cancel"} onHoverBackgroundColor={"#F0EEE6"} className="flex-grow-1"
                                                 onClick={handleCancel}/>
                            </div>
                        )
                    }
                </div>
            </form>
        </div>
    );
};

export default Profile;