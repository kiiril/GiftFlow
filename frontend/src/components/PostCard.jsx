import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-regular-svg-icons/faStar";
import {faHeart as emptyHeart} from "@fortawesome/free-regular-svg-icons/faHeart";
import {faHeart as fullHeart} from "@fortawesome/free-solid-svg-icons/faHeart"

const PostCard = () => {
    return (
        <div className="card flex-row flex-wrap m-0 p-0" style={{maxWidth: "700px", height: "350px"}}>
            <div className="card-header border-0 col-7 h-100">
                <img
                    src="/images/img.png"
                    alt="post"
                    className="img-fluid h-100 w-100"
                />
            </div>
            <div className="card-body px-3 py-3 col-5 h-100">
                <p>Topic: something</p>
                <p>
                    Rating:
                    <FontAwesomeIcon icon={faStar} className="text-warning"/>
                    <FontAwesomeIcon icon={faStar} className="text-warning"/>
                    <FontAwesomeIcon icon={faStar} className="text-warning"/>
                    <FontAwesomeIcon icon={faStar} className="text-warning"/>
                    <FontAwesomeIcon icon={faStar} className="text-warning"/>
                    (4.2)
                </p>
                <p>Number of views: 47</p>
                <p>Location: Krakow</p>
                <p>Price: 20-40$</p>
                <div className="d-flex justify-content-between">
                    <div>
                        <FontAwesomeIcon icon={emptyHeart} color="red" size="lg"/>
                    </div>
                    <a href="#" className="btn btn-sm btn-outline-secondary">
                        Details
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PostCard;