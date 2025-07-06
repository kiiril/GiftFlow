import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import TopicTag from "../components/TopicTag";
import {Checkbox, Rating} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faHeart as fullHeart, faLocationDot, faStar as fullStar} from "@fortawesome/free-solid-svg-icons";
import {faComment, faHeart as emptyHeart, faPaperPlane, faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import {API_BASE_URL} from "../constants";

const Post = () => {
    const [postData, setPostData] = React.useState({
            id: "",
            user_id: null,
            title: "",
            description: "",
            image_urls: [],
            price: 0,
            posted_at: null,
            rating: 0,
            like_count: 0,
            share_count: 0,
            location: "",
            tags: [{
                name: "",
                color: ""
            }],
            publisher_info: {
                username: "",
                avatar_url: ""
            }
        }
    );
    const [expanded, setExpanded] = useState(false);
    const [comments, setComments] = React.useState([])

    const params = useParams();

    const fetchPosts = async () => {
        const response = await axios.get(`http://localhost:8080/posts/${params.id}`);
        setPostData(response.data);
    }

    const fetchComments = async () => {
        const response = await axios.get(`http://localhost:8080/posts/${params.id}/comments/`);
        setComments(response.data);
    }

    useEffect(() => {
        fetchPosts();
        fetchComments();
    }, []);

    const [commentValue, setCommentValue] = useState("")

    const createComment = () => {
        axios.post(`http://localhost:8080/posts/${params.id}/comments/`, {
            content: commentValue
        }).then(() => {
            fetchComments();
            setCommentValue("");
        })
    }

    const savePostToFavourites = async () => {
        try {
            const endpoint = postData.isSaved
                ? `http://localhost:8080/posts/${postData.id}/unsave`
                : `http://localhost:8080/posts/${postData.id}/save`;

            const response = await axios.post(endpoint);
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
        <div className="card border-0" style={{margin: "8rem"}}>
            <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
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

                        <button className="carousel-control-prev" type="button" data-bs-target={`#${postData.id}`}
                                data-bs-slide="prev">
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target={`#${postData.id}`}
                                data-bs-slide="next">
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg-6">
                    <div className="card-body d-flex flex-column h-100">
                        <div className="d-flex align-items-start">
                            <div className="flex-grow-1 me-3">
                                <h3 className="card-title fw-bold">
                                    {postData.title}
                                </h3>

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

                            <div className="d-flex align-items-center flex-shrink-0">
                                <img src={API_BASE_URL + postData.publisher_info.avatar_url} alt="User Avatar"
                                     className="rounded-circle me-2"
                                     style={{width: '50px', height: '50px'}}/>
                                <div>
                                    <h6 className="mb-0">{postData.publisher_info.username}</h6>
                                </div>
                            </div>
                        </div>

                        {/*<div className="card-text mb-3" style={{textAlign: "justify"}}>*/}
                        {/*    {postData.description.length === 0 ? "No description" : postData.description}*/}
                        {/*</div>*/}

                        <div className="card-text mb-3" style={{textAlign: "justify"}}>
                            {postData.description.length === 0 ? (
                                "No description"
                            ) : postData.description.length > 250 ? (
                                <>
                                    <p
                                        className="mb-1"
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: expanded ? 'none' : 3,
                                            WebkitBoxOrient: 'vertical'
                                        }}
                                    >
                                        {postData.description}
                                    </p>
                                    {/* fixme: change color */}
                                    <button
                                        className="btn btn-link fw-light p-0"
                                        onClick={() => setExpanded(!expanded)}
                                    >
                                        {expanded ? 'Show less' : 'Read more'}
                                    </button>
                                </>
                            ) : (
                                <p className="mb-0">{postData.description}</p>
                            )}
                        </div>


                        <div className="d-flex align-items-center gap-5 mb-4">
                            <div className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    id={`like-${postData.id}`}
                                    className="d-none"
                                    onChange={savePostToFavourites}
                                    checked={postData.isSaved}
                                />
                                <label htmlFor={`like-${postData.id}`} className="me-1">
                                    <FontAwesomeIcon
                                        icon={postData.isSaved ? fullHeart : emptyHeart}
                                        style={{color: postData.isSaved ? "red" : "black"}}
                                        className="fs-4"
                                    />
                                </label>
                                <span>{postData.like_count}</span>
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
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12 col-md-6 col-lg-6 offset-md-6">
                    <h5 className="fw-bold mb-3">{comments.length} comments</h5>

                    {comments.map(comment => (
                        <div className="d-flex align-items-start mb-3 ps-3">
                            <img src={API_BASE_URL + comment.user_info.avatar_url} alt="User Avatar" className="rounded-circle me-2"
                                 style={{width: '40px', height: '40px'}}
                            />

                            <div>
                                <p className="mb-1">
                                    <span className="fw-bold me-2">{comment.user_info.username}</span>
                                    <span>{comment.content}</span>
                                </p>

                                <div className="d-flex align-items-center text-muted">
                                    <small className="me-3">2mo</small>
                                    <small>Reply</small>
                                </div>

                                {/*/!* Expand Replies Button *!/*/}
                                {/*{comment.child_comments && comment.child_comments.length > 0 && (*/}
                                {/*    <button*/}
                                {/*        className="btn btn-link p-0 text-decoration-none mt-1"*/}
                                {/*        style={{ fontSize: "0.9rem" }}*/}
                                {/*    >*/}
                                {/*        View {comment.child_comments.length} Replies*/}
                                {/*    </button>*/}
                                {/*)}*/}
                            </div>
                        </div>
                    ))}

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (commentValue.trim()) {
                            createComment();
                        }
                    }}>
                        <div className="input-group rounded-pill bg-white px-2 py-1 shadow">
                            <input
                                type="text"
                                className="form-control border-0 rounded-pill shadow-none me-1"
                                placeholder="Type here"
                                style={{caretColor: 'red'}}
                                value={commentValue}
                                onChange={(e) => setCommentValue(e.target.value)}
                            />
                            {commentValue.trim() &&
                                <button
                                    className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center"
                                    type="submit"
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Post;