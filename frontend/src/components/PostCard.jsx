import React, {useEffect, useState} from 'react';
import {Checkbox, Rating} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TopicTag from "./TopicTag";
import {faCoins, faLocationDot, faHeart as fullHeart, faStar as fullStar} from "@fortawesome/free-solid-svg-icons";
import {faComment, faPaperPlane, faHeart as emptyHeart, faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import {useNavigate} from "react-router-dom";

const PostCard = ({post}) => {
    const [postData, setPostData] = React.useState({
            id: "",
            title: "",
            rating: 0,
            description: "",
            saved: 0,
            price: "",
            topics: [
                {
                    name: "",
                    color: ""
                }
            ],
            image_urls: []
        }
    );
    const navigate = useNavigate();

    useEffect(() => {
        setPostData(post);
    }, []);

    const savePost = (e) => {
        const {checked} = e.target;
        setPostData(
            {
                ...postData,
                saved: checked ? 1 : 0
            }
        )
        // TODO send a request to the server to save the post to favorites
    }

    return (
        <button className="btn p-0 text-start border-0 card shadow-sm" onChange={(e) => e.stopPropagation()}>
            <img src={postData.image_urls[0]} className="card-img-top" alt="Something"/>
            <div className="card-body w-100">
                <h3 className="card-title fw-bold">
                    {postData.title}
                </h3>

                <div className="d-flex align-items-center fw-light mb-3">
                    <i className="bi bi-geo-alt"></i>
                    <span>Poland, Warsaw</span>

                    <i className="bi bi-dot"></i>

                    <span className="badge rounded-pill text-bg-success">
                        ECO
                    </span>
                </div>

                <div className="card-text mb-3">
                    {postData.description.length === 0 ? "No description" : postData.description.length > 100 ? postData.description.substring(0, 150) + "..." : postData.description}
                </div>

                <div className="d-flex align-items-center mb-3">
                    <Rating
                        value={postData.rating}
                        icon={<FontAwesomeIcon icon={fullStar}/>}
                        emptyIcon={<FontAwesomeIcon icon={emptyStar}/>}
                        readOnly
                        precision={0.1}
                        size="small"
                    />
                    <span className="ms-2">({postData.rating.toFixed(1)})</span>
                </div>

                <p className="fw-bold fs-4 mb-4">${postData.price}</p>

                {/*<div className="text-break mb-3">#test#polina#love#first#broken#heart#gym#bro</div>*/}

                <div className="d-flex justify-content-between align-items-center mb-3 px-3">
                    <div className="d-flex align-items-center">
                        <input
                            type="checkbox"
                            id={`like-${postData.id}`}
                            className="d-none"
                            onChange={savePost}
                            checked={postData.saved}
                        />
                        <label htmlFor={`like-${postData.id}`} className="me-1">
                            <FontAwesomeIcon
                                icon={postData.saved ? fullHeart : emptyHeart}
                                style={{color: postData.saved ? "red" : "black"}}
                                className="fs-4"
                            />
                        </label>
                        <span>1K</span>
                    </div>

                    <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faComment} className="me-1 fs-4"/>
                        <span>2.2K</span>
                    </div>

                    <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faPaperPlane} className="fs-4 me-1"/>
                        <span>1K</span>
                    </div>
                </div>

                {/* TODO add tags */}
                {/*<div className="mb-2 px-3">*/}
                {/*    {postData.topics.map(tag => (*/}
                {/*        <span key={tag.name} className="badge bg-secondary me-2 mb-1 p-2">*/}
                {/*            {tag.name}*/}
                {/*        </span>*/}
                {/*    ))}*/}
                {/*</div>*/}
            </div>
        </button>
    );
};

export default PostCard;