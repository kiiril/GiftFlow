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
            className="btn btn-outline-dark d-flex align-items-center"
            onClick={toggleSortOrder}
        >
            <span className="me-2">Rating</span>
            {sortState === "asc" && <FontAwesomeIcon icon={faCaretUp} />}
            {sortState === "desc" && <FontAwesomeIcon icon={faCaretDown} />}
        </button>
    );
};

export default SortButton;