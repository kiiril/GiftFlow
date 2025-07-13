import React, {useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as fullHeart, faStar as fullStar, faTrash} from "@fortawesome/free-solid-svg-icons";
import {faComment, faHeart as emptyHeart, faPaperPlane, faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import {Rating} from "@mui/material";
import PrimaryButton from "./PrimaryButton";
import {API_BASE_URL} from "../constants";
import axios from "axios";

const MyPostCard = ({post, onPostDeleted}) => {
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
            tags: [],
            isSaved: false
        }
    );

    useEffect(() => {
        setPostData(post);
    }, []);

    const handleDeletePost = async () => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/posts/${postData.id}`);

            if (response.status === 204) {
                // Optionally, you can handle the UI update after deletion
                console.log("Post deleted successfully");
                if (onPostDeleted) {
                    onPostDeleted(postData.id)
                }
            } else {
                console.error("Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }

    const handlePublishPost = async () => {
        try {
            // fixme: implement endpoint
            const response = await axios.post(`${API_BASE_URL}/posts/${postData.id}/publish`);

            if (response.data.success) {
                // Optionally, you can handle the UI update after publishing
                console.log("Post published successfully");
            } else {
                console.error("Failed to publish post");
            }
        } catch (error) {
            console.error("Error publishing post:", error);
        }
    }

    return (
        <div key={postData.id} className="card mb-3 shadow-sm">
            <div className="row g-0 flex-row">
                <div className="col-5">
                    <div className="carousel slide" id={postData.id}>
                        <div className="carousel-indicators">
                            {postData.image_urls.map((_, index) => (
                                <button
                                    type="button"
                                    data-bs-target={`#${postData.id}`}
                                    data-bs-slide-to={index}
                                    className={index === 0 ? "active" : ""}
                                    aria-label={`Slide ${index + 1}`}
                                    key={index}
                                    style={{borderRadius: "100%", width: "1rem", height: "1rem"}}
                                ></button>
                            ))}
                        </div>

                        <div className="carousel-inner">
                            {postData.image_urls.map((url, index) =>
                                <div className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                    <img
                                        src={API_BASE_URL + url}
                                        alt="post"
                                        className="img-fluid"
                                    />
                                </div>
                            )}
                        </div>
                        <button className="carousel-control-prev" type="button"
                                data-bs-target={`#${postData.id}`}
                                data-bs-slide="prev">
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button"
                                data-bs-target={`#${postData.id}`}
                                data-bs-slide="next">
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                <div className="col-7">
                    <div className="card-body d-flex flex-column h-100">
                        <div className="d-flex align-items-start">
                            <div className="flex-grow-1 me-3">
                                <h3 className="card-title fw-bold mb-2 title-clamp">{postData.title}</h3>
                                <div className="d-flex flex-wrap align-items-center meta mb-3">
                                    {/* 1) Location block */}
                                    <div className="d-flex fw-light align-items-center meta__loc me-2">
                                        <i className="bi bi-geo-alt me-1"></i>
                                        <span>{postData.location}</span>
                                    </div>

                                    {/* 2) Badges block */}
                                    <div className="d-flex align-items-center meta__tags">
                                        {postData.tags.map((tag) => (
                                            <span
                                                className="badge rounded-pill me-1"
                                                style={{backgroundColor: tag.color}}
                                            >
                                                    {tag.label}
                                                </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <FontAwesomeIcon
                                icon={faTrash}
                                size={"2xl"}
                                style={{cursor: "pointer"}}
                                onClick={handleDeletePost}
                            />
                        </div>

                        <div className="mb-3">
                            <div className="description-clamp">
                                {postData.description || "No description"}
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-5 mb-4">
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon
                                    icon={postData.saved ? fullHeart : emptyHeart}
                                    style={{color: postData.saved ? "red" : "#2C3E50"}}
                                    className="fs-4 me-1"
                                />
                                <span>{postData.like_count}</span>
                            </div>

                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faComment} className="me-1 fs-4"/>
                                <span>{postData.comment_count}</span>
                            </div>

                            <div className="d-flex align-items-center ">
                                <FontAwesomeIcon icon={faPaperPlane} className="fs-4 me-1"/>
                                <span>{postData.share_count}</span>
                            </div>

                            <div className="d-flex align-items-center gap-2 ms-auto">
                                <Rating
                                    value={postData.rating}
                                    icon={<FontAwesomeIcon icon={fullStar}/>}
                                    emptyIcon={<FontAwesomeIcon icon={emptyStar}/>}
                                    readOnly
                                    precision={0.1}
                                    size="small"
                                />
                                <span>({postData.rating.toFixed(1)})</span>
                            </div>
                        </div>

                        <div className="fw-bold fs-3 text-end">${postData.price}</div>

                        <div className="d-flex mt-auto justify-content-end">
                            <PrimaryButton
                                backgroundColor={"#91B58B"}
                                text={"Publish"}
                                className="fs-5 fw-bold px-5 py-2"
                                onClick={handlePublishPost}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyPostCard;