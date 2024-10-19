import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import TopicTag from "../components/TopicTag";
import {Checkbox, Rating} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faHeart as fullHeart, faLocationDot, faStar as fullStar} from "@fortawesome/free-solid-svg-icons";
import {faComment, faHeart as emptyHeart, faPaperPlane, faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";

const Post = () => {
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
    const params = useParams();

    const fetchPost = async () => {
        const response = await axios.get(`http://localhost:8080/posts/${params.id}`);
        setPostData(response.data);
        console.log(response.data);
    }

    useEffect(() => {
        fetchPost();
    }, []);

    const [commentValue, setCommentValue] = useState("")

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
                                        src={url}
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
                    <div className="card-body pt-0">
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1 me-3">
                                <h3 className="card-title fw-bold">
                                    {postData.title}
                                </h3>

                                <div className="d-flex align-items-center fw-light mb-3">
                                    <i className="bi bi-geo-alt"></i>
                                    <span>Poland, Warsaw</span>

                                    <i className="bi bi-dot"></i>

                                    <span className="badge rounded-pill text-bg-success me-5">
                                        ECO
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <img src="https://avatar.iran.liara.run/public" alt="User Avatar"
                                     className="rounded-circle me-2"
                                     style={{width: '50px', height: '50px'}}/>
                                <div>
                                    <h6 className="mb-0">John Doe</h6>
                                </div>
                            </div>
                        </div>

                        <div className="card-text mb-3" style={{textAlign: "justify"}}>
                            {postData.description.length === 0 ? "No description" : postData.description}
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
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
                        </div>
                        <p className="fw-bold fs-3 text-end">${postData.price}.00</p>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12 col-md-6 col-lg-6"></div>

                <div className="col-12 col-md-6 col-lg-6">
                    <h5 className="fw-bold mb-3">10 comments</h5>

                    <div className="d-flex align-items-start mb-3 ps-3">
                        <img src="https://via.placeholder.com/40" alt="User Avatar" className="rounded-circle me-2"
                             style={{width: '40px', height: '40px'}}/>

                        <div>
                            <p className="mb-1">
                                <span className="fw-bold me-2">Carla Besessen</span>
                                <span>This is the comment text written by the user. It can span multiple lines if needed.</span>
                            </p>


                            <div className="d-flex align-items-center text-muted">
                                <small className="me-3">2mo</small>
                                <small>Reply</small>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex align-items-start mb-3 ps-3">
                        <img src="https://via.placeholder.com/40" alt="User Avatar" className="rounded-circle me-2"
                             style={{width: '40px', height: '40px'}}/>

                        <div>
                            <p className="mb-1">
                                <span className="fw-bold me-2">Carla Besessen</span>
                                <small className="text-muted">2mo</small>
                            </p>


                            <div className="d-flex align-items-center">
                                <span>This is the comment text written by the user. It can span multiple lines if needed.</span>
                            </div>

                            <small className="text-muted">Reply</small>
                        </div>
                    </div>

                    {/* fixme: input is nice, button is not*/}
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control shadow-none rounded-pill py-2"
                            placeholder="Search here..."
                            aria-describedby="send"
                            onChange={(e) => setCommentValue(e.target.value)}
                            />
                            {commentValue.trim() &&
                                <button
                                    className="btn btn-dark position-absolute top-50 translate-middle-y end-0 me-1 rounded-circle"
                                    type="button"
                                    id="send"
                                >
                                <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;