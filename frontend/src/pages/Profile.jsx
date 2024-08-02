import React from 'react';
import ProfileTab from "../components/ProfileTab";


const Profile = () => {
    return (
        <div className="d-flex align-items-start vh-100">
            <div className="nav flex-column nav-pills border-end col-4 h-100" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <div className="d-flex justify-content-center border-bottom mx-5">
                    <ProfileTab label={"account"} active={true}>Account details</ProfileTab>
                </div>
                <div className="d-flex justify-content-center border-bottom mx-5">
                    <ProfileTab label={"posts"}>Your posts</ProfileTab>
                </div>
                <div className="d-flex justify-content-center border-bottom mx-5">
                    <ProfileTab label={"statistics"}>Statistics</ProfileTab>
                </div>
                <div className="d-flex justify-content-center mx-5">
                    <ProfileTab label={"settings"}>Settings</ProfileTab>
                </div>
            </div>
            <div className="tab-content col-8" id="v-pills-tabContent">
                <div className="tab-pane fade show active" id="v-pills-account" role="tabpanel"
                     aria-labelledby="v-pills-account-tab" tabIndex="0">
                    Some info about the user
                </div>
                <div className="tab-pane fade" id="v-pills-posts" role="tabpanel"
                     aria-labelledby="v-pills-posts-tab" tabIndex="0">...
                </div>
                <div className="tab-pane fade" id="v-pills-statistics" role="tabpanel"
                     aria-labelledby="v-pills-statistics-tab" tabIndex="0">...
                </div>
                <div className="tab-pane fade" id="v-pills-settings" role="tabpanel"
                     aria-labelledby="v-pills-settings-tab" tabIndex="0">...
                </div>
            </div>
        </div>
    );
};

export default Profile;