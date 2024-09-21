import React, {useEffect} from 'react';
import {Checkbox, Rating} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TopicTag from "./TopicTag";
import {faCoins, faLocationDot, faHeart as fullHeart} from "@fortawesome/free-solid-svg-icons";
import {faComment, faPaperPlane, faHeart as emptyHeart} from "@fortawesome/free-regular-svg-icons";
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
        <div className="card flex-wrap m-0 p-0" style={{height: "auto"}}>
            <div className="row g-0">
                <div className="col-12 col-md-6">
                    <div className="carousel slide" id={postData.id}>
                        <div className="carousel-inner">
                            {postData.image_urls.map((url, index) =>
                                <div className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                    <img
                                        src={url}
                                        alt="post"
                                        className="img-fluid h-100 w-100"
                                        style={{objectFit: "contain", aspectRatio: "1/1"}}
                                    />
                                </div>
                            )}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target={`#${postData.id}`}
                                data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target={`#${postData.id}`}
                                data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="card-body p-2 h-100 d-flex flex-column mx-2">
                        <div className="d-flex flex-row-reverse align-items-between flex-wrap mb-2">
                            {postData.topics.map(topic =>
                                <TopicTag color={topic.color}>{topic.name}</TopicTag>
                            )}
                        </div>
                        <h4 className="text-center my-2">{postData.title}</h4>
                        <p className="mb-2">{postData.description}</p>
                        <div className="d-flex align-items-center mb-2">
                        <Rating value={postData.rating} readOnly={true}/>
                            <span className="ms-1">(5.0)</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <FontAwesomeIcon icon={faLocationDot} className="me-1"/>
                            <span>Poland, Warsaw</span>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                            <FontAwesomeIcon icon={faCoins} className="me-1"/>
                            <span>{postData.price}$</span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between my-auto mx-5">
                            <div>
                                <Checkbox
                                    icon={<FontAwesomeIcon icon={emptyHeart} size={"2xl"} style={{color: "red"}}/>}
                                    checkedIcon={<FontAwesomeIcon icon={fullHeart} size={"2xl"} style={{color: "red"}}/>}
                                    checked={postData.saved === 1}
                                    onChange={savePost}
                                />
                            </div>
                            <div className="me-2">
                                <FontAwesomeIcon icon={faComment} size={"2xl"}/>
                            </div>
                            <FontAwesomeIcon icon={faPaperPlane} size={"2xl"}/>
                        </div>
                        {/* FIXME change structure below */}
                        <button className="btn btn-primary" onClick={() => navigate(`posts/${post.id}`)}>Go to post</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;