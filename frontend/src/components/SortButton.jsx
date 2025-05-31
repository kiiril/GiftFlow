import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";

const SortButton = () => {
    const [sortState, setSortState] = useState(null); // null = no sort, "asc" = ascending, "desc" = descending

    const toggleSortOrder = () => {
        if (sortState === null) {
            setSortState("desc");
        } else if (sortState === "desc") {
            setSortState("asc");
        } else {
            setSortState(null);
        }
    };

    return (
        <button
            className="btn d-flex align-items-center w-100"
            style={{border: "2px solid rgba(44, 62, 80, 0.5)"}}
            onClick={toggleSortOrder}
        >
            <span className="me-2">Rating</span>
            {sortState === "asc" && <FontAwesomeIcon icon={faCaretUp} />}
            {sortState === "desc" && <FontAwesomeIcon icon={faCaretDown} />}
        </button>
    );
};

export default SortButton;