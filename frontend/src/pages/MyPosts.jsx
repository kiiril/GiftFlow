import React, {useEffect, useState} from "react";
import axios from "axios";
import {Rating} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as fullHeart, faStar as fullStar, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {faComment, faHeart as emptyHeart, faPaperPlane, faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

const MyPosts = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        // todo: fetch posts created by the user
        // if (!hasMore) return;

        const response = await axios.get("http://localhost:8080/posts/", {
            // params: {
            //     limit: limit,
            //     page: page
            // }
        });
        const newPosts = response.data;

        // If fewer posts than the limit are returned, we've reached the end
        // if (newPosts.length < limit) {
        //     setHasMore(false);
        // }

        setPosts(prevPosts => [...prevPosts, ...newPosts]);
    }

    const publishPost = (id) => {
        setPosts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, published: true } : p))
        );
        // TODO: make call to publish post
    };

    const deletePost = (id) => {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        // TODO: make call to delete post
    };

    useEffect( ()=> {
        fetchPosts();
    }, []);

    return (
        <div className="container my-4">
            <div
                className="d-flex flex-column gap-3"
                style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
                {posts.map((postData) => (
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
                                                    src={url}
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
                                                    {tag.name}
                                                </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <FontAwesomeIcon icon={faTrash} size={"2xl"} />
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
                                        <PrimaryButton backgroundColor={"#91B58B"} text={"Publish"} className="fs-5 fw-bold px-5 py-2"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="text-center text-muted py-5">No drafts yet.</div>
                )}
            </div>
        </div>
    );
};

export default MyPosts;
