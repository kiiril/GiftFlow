import React from 'react';
import {Checkbox, Rating} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TopicTag from "./TopicTag";
import {faCoins, faLocationDot, faHeart as fullHeart} from "@fortawesome/free-solid-svg-icons";
import {faComment, faEye, faPaperPlane, faHeart as emptyHeart} from "@fortawesome/free-regular-svg-icons";

const PostCard = () => {

    const [savePost, setSavePost] = React.useState(false);
    const [stars, setStars] = React.useState(5);

    return (
        <div className="card flex-wrap m-0 p-0" style={{height: "auto"}}>
            <div className="row g-0">
                <div className="col-12 col-md-6">
                    <img
                        src="/images/img.png"
                        alt="post"
                        className="img-fluid h-100 w-100"
                        style={{objectFit: "cover", height: "100%"}}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <div className="card-body p-2 h-100 d-flex flex-column mx-2">
                        <div className="d-flex flex-row-reverse align-items-between flex-wrap mb-2">
                            <TopicTag color={"lightblue"}>For him</TopicTag>
                            <TopicTag color={"lightblue"}>For him</TopicTag>
                            <TopicTag color={"lightblue"}>For him</TopicTag>
                        </div>
                        <h4 className="text-center my-2">Title</h4>
                        <p className="mb-2">Description: there is some short description limited by words. Pipi poo poo papa jfwoffwekfmennwvfn3kp[ fe kwkfne w nfke</p>
                        <div className="d-flex align-items-center mb-2">
                            <Rating value={stars} onChange={e => setStars(e.target.value)}/>
                            <span className="ms-1">(5.0)</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <FontAwesomeIcon icon={faLocationDot} className="me-1"/>
                            <span>Poland, Warsaw</span>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                            <FontAwesomeIcon icon={faCoins} className="me-1"/>
                            <span>100-200$</span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between my-auto mx-5">
                            <div>
                                <Checkbox
                                    icon={<FontAwesomeIcon icon={emptyHeart} size={"2xl"} style={{color: "red"}}/>}
                                    checkedIcon={<FontAwesomeIcon icon={fullHeart} size={"2xl"} style={{color: "red"}}/>}
                                    onChange={() => setSavePost(!savePost)}
                                />
                            </div>
                            <div className="me-2">
                                <FontAwesomeIcon icon={faComment} size={"2xl"}/>
                            </div>
                            {/*<div className="d-flex align-items-center">*/}
                            {/*    <FontAwesomeIcon icon={faEye} size={"2xl"} className="me-1"/>*/}
                            {/*    <span className="fs-5">200</span>*/}
                            {/*</div>*/}
                            <FontAwesomeIcon icon={faPaperPlane} size={"2xl"}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;