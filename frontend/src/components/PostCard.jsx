import React, {useEffect} from 'react';
import {Rating} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as fullHeart, faStar as fullStar} from "@fortawesome/free-solid-svg-icons";
import {faComment, faPaperPlane, faHeart as emptyHeart, faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import {useNavigate} from "react-router-dom";
import {API_BASE_URL} from "../constants";
import axios from "axios";
import {useTagMap} from "../contexts/TagsProvider";

const PostCard = ({post}) => {
    const tagMap = useTagMap();

    const navigate = useNavigate();

    const [postData, setPostData] = React.useState(() => {
            const images = post.images.map(img => ({
                id: img.id,
                src: API_BASE_URL + img.path,
            }));
            return { ...post, images };
        }
    );

    const savePostToFavourites = async () => {
        try {
            const endpoint = postData.isSaved
                ? `http://localhost:8080/posts/${postData.id}/unsave`
                : `http://localhost:8080/posts/${postData.id}/save`;


            const response = await axios.post(endpoint).catch((err => {
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            }));

            if (response.data.success) {
                setPostData((prevData) => ({
                    ...prevData,
                    isSaved: !prevData.isSaved,
                    like_count: prevData.isSaved ? prevData.like_count - 1 : prevData.like_count + 1
                }));
            }
        } catch (error) {
            console.error("Error saving/unsaving post:", error);
        }
    };

    return (
        <button
            className="btn p-0 text-start border-0 card shadow-sm h-100"
            onClick={(e) => navigate(`/posts/${postData.id}`)}
        >
            <img src={postData.images[0]?.src} className="card-img-top" alt="Something"/>
            <div className="card-body w-100 d-flex flex-column">
                <div style={{height: '3.6rem'}} className="mb-3">
                    <h3 className="card-title fw-bold title-clamp m-0">
                        {postData.title}
                    </h3>
                </div>

                <div className="d-flex align-items-center meta mb-3">
                    <div className="d-flex fw-light align-items-center meta__loc me-2">
                        <i className="bi bi-geo-alt me-1"></i>
                        <span>{postData.location}</span>
                    </div>
                    {
                        postData.tagIds && (
                            <div className="d-flex align-items-center meta__tags">
                                {postData.tagIds.map((id) => {
                                    const tag = tagMap.get(id);
                                    if (!tag) return null;
                                    return (
                                        <span
                                            className="badge rounded-pill me-1"
                                            style={{backgroundColor: tag.color}}
                                        >
                                            {tag.label}
                                        </span>
                                    );
                                })}
                            </div>
                        )
                    }
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

                <p className="fw-bold fs-4 mb-4">{postData.currency}{postData.price}</p>

                <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center px-3">
                        <div className="d-flex align-items-center">
                            <input
                                type="checkbox"
                                id={`like-${postData.id}`}
                                className="d-none"
                                readOnly
                                checked={postData.isSaved}
                            />
                            <label className="me-1" style={{cursor: 'pointer'}} onClick={(e) => {
                                e.stopPropagation();
                                savePostToFavourites();
                            }}>
                                <FontAwesomeIcon
                                    icon={postData.isSaved ? fullHeart : emptyHeart}
                                    style={{color: postData.isSaved ? "red" : "black"}}
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