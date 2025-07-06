import React, {useContext, useState} from 'react';
import PrimaryButton from "./PrimaryButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowRightFromBracket,
    faGear, faHeart,
    faRectangleList,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import {faCalendarDays} from "@fortawesome/free-regular-svg-icons"
import {AuthContext} from "../contexts/AuthProvider";
import {API_BASE_URL} from "../constants";

const Header = () => {
    const {user} = useContext(AuthContext);

    return (
        <header
            className="d-flex align-items-center justify-content-between border border-1 w-100 px-4"
            style={{height: "70px"}}
        >
            <div className="fs-1 fw-bold ms-3"
                 style={{fontFamily: `"Rock 3D", serif`, color: "#2C3E50"}}>
                GiftFlow
            </div>

            <nav className="navbar position-absolute start-50 translate-middle-x">
                <ul className="nav">
                    <li className="nav-item">
                        <a className="nav-link nav-link-custom px-4 py-2 mx-3">About</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link nav-link-custom px-4 py-2 mx-3">Discover</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link nav-link-custom px-4 py-2 mx-3">Support</a>
                    </li>
                </ul>
            </nav>

            {
                user ? (
                    <div className="d-flex align-items-center gap-4">
                        <PrimaryButton text={"Create"} className="fs-5 fw-bold px-4 py-1" backgroundColor={"#2C3E50"}/>

                        <div className="dropdown">
                            <button
                                className="btn p-0 border-0"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <img
                                    src={API_BASE_URL + user.avatar_url}
                                    alt="User Avatar"
                                    className="rounded-circle"
                                    style={{width: '40px', height: '40px', cursor: 'pointer'}}
                                />
                            </button>
                            <ul
                                className="dropdown-menu dropdown-menu-end dropdown-menu-custom mt-2"
                            >
                                <li>
                                    <a className="dropdown-item dropdown-item-custom" href="/profile">
                                        <FontAwesomeIcon icon={faUser} className="fa-fw me-1"/> Profile
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item dropdown-item-custom" href="#">
                                        <FontAwesomeIcon icon={faRectangleList} className="fa-fw me-1"/> Posts
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item dropdown-item-custom" href="#">
                                        <FontAwesomeIcon icon={faHeart} className="fa-fw me-1"/> Favorites
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item dropdown-item-custom" href="#">
                                        <FontAwesomeIcon icon={faCalendarDays} className="fa-fw me-1"/> Calendar
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item dropdown-item-custom" href="#">
                                        <FontAwesomeIcon icon={faGear} className="fa-fw me-1"/> Settings
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item dropdown-item-custom" href="#">
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="fa-fw me-1"/> Log out
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <PrimaryButton text={"Login"} />
                )
            }
        </header>
    );
};

export default Header;