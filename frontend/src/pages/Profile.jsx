import React from 'react';
import ProfileTab from "../components/ProfileTab";
import Account from "../components/Account";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import MyCalendar from "../components/MyCalendar";
import ProfileTabBody from "../components/ProfileTabBody";
import CreateEventPopup from "../components/CreateEventPopup";
import EditEventPopup from "../components/EditEventPopup";


const Profile = () => {
    return (
        <div>
            {/* fixme delete block below */}
            <nav className="navbar navbar-expand-lg bg-success">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Navbar</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                   aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search"
                                   aria-label="Search"/>
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>

            <div className="d-flex mx-8">
                <ul className="nav nav-pills flex-column col-3 h-100" id="v-pills-tab" role="tablist"
                    aria-orientation="vertical">
                    <ProfileTab
                        icon={faUser}
                        title={"Profile"}
                        description={"Edit your personal details"}
                        active={true}
                    />
                    <ProfileTab
                        icon={faUser}
                        title={"Posts"}
                        description={"View and edit your posts"}
                    />
                    <ProfileTab
                        icon={faUser}
                        title={"Statistics"}
                        description={"View statistics"}
                    />
                    <ProfileTab
                        icon={faUser}
                        title={"Settings"}
                        description={"Settings"}
                    />
                </ul>


                <div className="tab-content col-8" id="v-pills-tabContent">
                    <ProfileTabBody
                        title={"Profile"}
                    >
                        <Account/>
                    </ProfileTabBody>

                    <ProfileTabBody
                        title={"Posts"}
                    >
                        <MyCalendar/>
                        <CreateEventPopup/>
                        <EditEventPopup/>
                    </ProfileTabBody>

                    <ProfileTabBody
                        title={"Statistics"}
                    >
                       Here is some statistics
                    </ProfileTabBody>
                    <ProfileTabBody
                        title={"Settings"}
                    >
                        Here is some settings
                    </ProfileTabBody>
                </div>
            </div>
        </div>
    );
};

export default Profile;