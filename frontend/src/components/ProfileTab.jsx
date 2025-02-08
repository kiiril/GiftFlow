import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ProfileTab = ({icon, title, description, active, children}) => {
    const className = `nav-link account-tab d-flex align-items-center rounded rounded-4 bg-white text-black fs-5 my-3`;
    return (
        <li className="nav-item">
            <a
                className={className}
                id={`v-pills-${title}-tab`}
                data-bs-target={`#v-pills-${title}`}
                aria-controls={`v-pills-${title}`}
                type="button"
                role="tab"
                data-bs-toggle="pill"
                aria-selected="true"
                style={{border: "2px solid rgb(195, 198, 209)",  boxShadow: "0 0.25em 0 rgb(195, 198, 209)"}}
            >
                <span className="me-3 d-flex align-items-center">
                    <FontAwesomeIcon icon={icon} className="fs-4" style={{ color: "rgb(100, 100, 120)"}}/>
                </span>

                <div>
                    <div className="fw-bold">{title}</div>
                    <div className="text-muted" style={{fontSize: "0.7em"}}>{description}</div>
                </div>
            </a>
        </li>
    );
};

export default ProfileTab;