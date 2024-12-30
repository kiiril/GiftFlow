import React from 'react';
import SubmitButton from "./SubmitButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";

const CreateEventPopup = () => {
    return (
        <div className="position-relative">
            <FontAwesomeIcon
                icon={faTimes}
                className="position-absolute top-0 end-0 m-2 btn btn-light"
            />
            <form className="p-3 border border-black rounded">
                <div className="mb-4">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input className="form-control"
                           name="title"
                           type="text"
                           placeholder="Title"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="comment" className="form-label">Comment</label>
                    <textarea className="form-control"
                              name="comment"
                              placeholder="Comment..."
                              rows={3}
                    />
                </div>

                <div style={{paddingLeft: "14rem", paddingRight: "14rem"}}>
                    <SubmitButton>
                        Create
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
};

export default CreateEventPopup;