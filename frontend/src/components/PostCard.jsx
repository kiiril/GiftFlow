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
            user_id: null,
            title: "",
            description: "",
            image_urls: [],
            price: 0,
            posted_at: null,
            views: 0,
            rating: 0,
            like_count: 0,
            comment_count: 0,
            share_count: 0,
            location: "",
            tags: []
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
        <button
            className="btn p-0 text-start border-0 card shadow-sm h-100"
            onChange={(e) => e.stopPropagation()}
        >
            <img src={postData.image_urls[0]} className="card-img-top" alt="Something"/>
            <div className="card-body w-100 d-flex flex-column">
                <div style={{height: '3.6rem'}} className="mb-3">
                    <h3 className="card-title fw-bold title-clamp m-0">
                        {postData.title}
                    </h3>
                </div>


                <div className="d-flex align-items-center fw-light mb-3">
                    <i className="bi bi-geo-alt"></i>
                    <span>{postData.location}</span>

                    {postData.tags.map(tag => (
                        tag.name
                            ?
                            <div>
                                <i className="bi bi-dot"></i>
                                <span className="badge rounded-pill" style={{backgroundColor: tag.color}}>
                                    {tag.name}
                                </span>
                            </div>
                            :
                            null
                    ))}
                </div>

                <div style={{height: '4.5rem'}} className="mb-3">
                    <div className="description-clamp">
                        {postData.description || "No description"}
                    </div>
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

                <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center px-3">
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
                            <span>{postData.like_count}</span>
                        </div>

                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faComment} className="me-1 fs-4"/>
                            <span>{postData.comment_count}</span>
                        </div>

                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faPaperPlane} className="fs-4 me-1"/>
                            <span>{postData.share_count}</span>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
};

export default PostCard;