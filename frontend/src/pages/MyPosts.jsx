import React, {useEffect, useState} from "react";
import axios from "axios";
import {Rating} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as fullHeart, faStar as fullStar} from "@fortawesome/free-solid-svg-icons";
import {faComment, faHeart as emptyHeart, faPaperPlane, faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";

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
                {posts.map((post) => (
                    <div key={post.id} className="card mb-3 shadow-sm">
                        <div className="row g-0 flex-row">
                            <div className="col-5">
                                <div className="carousel slide" id={post.id}>
                                    <div className="carousel-indicators">
                                        {post.image_urls.map((_, index) => (
                                            <button
                                                type="button"
                                                data-bs-target={`#${post.id}`}
                                                data-bs-slide-to={index}
                                                className={index === 0 ? "active" : ""}
                                                aria-label={`Slide ${index + 1}`}
                                                key={index}
                                                style={{borderRadius: "100%", width: "1rem", height: "1rem"}}
                                            ></button>
                                        ))}
                                    </div>

                                    <div className="carousel-inner">
                                        {post.image_urls.map((url, index) =>
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
                                            data-bs-target={`#${post.id}`}
                                            data-bs-slide="prev">
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button"
                                            data-bs-target={`#${post.id}`}
                                            data-bs-slide="next">
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>
                            </div>

                            <div className="col-7">
                                <div className="card-body d-flex flex-column h-100">
                                    <div>
                                        <h3 className="card-title fw-bold mb-2 title-clamp">{post.title}</h3>
                                        {post.location && (
                                            <div className="d-flex align-items-center fw-light mb-3">
                                                <i className="bi bi-geo-alt"></i>
                                                <span>{post.location}</span>

                                                {post.tags.map(tag => (
                                                    tag.name
                                                        ?
                                                        <div>
                                                            <i className="bi bi-dot"></i>
                                                            <span
                                                                className="badge rounded-pill"
                                                                style={{backgroundColor: tag.color}}
                                                            >
                                                                {tag.name}
                                                            </span>
                                                        </div>
                                                        :
                                                        null
                                                ))}
                                            </div>
                                        )}
                                        {post.description && (
                                            <div style={{height: '4.5rem'}} className="mb-3">
                                                <div className="description-clamp">
                                                    {post.description || "No description"}
                                                </div>
                                            </div>
                                        )}
                                        <div className="d-flex align-items-center mb-3">
                                            <Rating
                                                value={post.rating}
                                                icon={<FontAwesomeIcon icon={fullStar}/>}
                                                emptyIcon={<FontAwesomeIcon icon={emptyStar}/>}
                                                readOnly
                                                precision={0.1}
                                                size="small"
                                            />
                                            <span className="ms-2">({post.rating.toFixed(1)})</span>
                                        </div>

                                        <p className="fw-bold fs-4 mb-5">${post.price}</p>

                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between align-items-center w-75">
                                                <div className="d-flex align-items-center">
                                                    <FontAwesomeIcon
                                                        icon={post.saved ? fullHeart : emptyHeart}
                                                        style={{color: post.saved ? "red" : "black"}}
                                                        className="fs-4 me-1"
                                                    />
                                                    <span>{post.like_count}</span>
                                                </div>

                                                {/* todo: make as a button that refers to comments section on the post */}
                                                <div className="d-flex align-items-center">
                                                    <FontAwesomeIcon icon={faComment} className="me-1 fs-4"/>
                                                    <span>{post.comment_count}</span>
                                                </div>

                                                <div className="d-flex align-items-center">
                                                    <FontAwesomeIcon icon={faPaperPlane} className="fs-4 me-1"/>
                                                    <span>{post.share_count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto d-flex justify-content-end gap-2">
                                        <button
                                            className="btn btn-success"
                                            disabled={post.published}
                                            onClick={() => publishPost(post.id)}
                                        >
                                            {post.published ? "Published" : "Publish"}
                                        </button>
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() => deletePost(post.id)}
                                        >
                                        Delete
                                        </button>
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
