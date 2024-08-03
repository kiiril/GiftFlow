import React from 'react';
import {Checkbox, Rating} from "@mui/material";
import {Favorite, FavoriteBorder} from "@mui/icons-material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TopicTag from "./TopicTag";
import {faCoins, faLocationDot, faEye} from "@fortawesome/free-solid-svg-icons";


const PostCard = () => {

    const [savePost, setSavePost] = React.useState(false);

    return (
        <div className="card flex-row flex-wrap m-0 p-0" style={{height: "400px"}}>
            <div className="card-header border-0 col-7 h-100">
                <img
                    src="/images/img.png"
                    alt="post"
                    className="img-fluid h-100 w-100"
                />
            </div>
            <div className="card-body p-2 col-5 h-100">
                <div className="d-flex flex-row-reverse align-items-between flex-wrap mb-4">
                    <TopicTag color={"lightblue"}>For him</TopicTag>
                    <TopicTag color={"lightblue"}>For him</TopicTag>
                    <TopicTag color={"lightblue"}>For him</TopicTag>
                </div>
                <h5 className="text-center mb-3">Title</h5>
                <p>Description: there is some short description limited by words. Pipi poo poo papa</p>
                <div className="d-flex align-items-center mb-2">
                    <Rating value={5}/>
                    (5.0)
                </div>
                <div className="mb-2">
                    <FontAwesomeIcon icon={faLocationDot} className="ms-1 me-1"/>
                    Poland, Warsaw
                </div>
                <div className="mb-5">
                    <FontAwesomeIcon icon={faCoins} className="ms-1 me-1"/>
                    100-200$
                </div>
                <div className="d-flex align-items-center">
                    <div className="me-5">
                        <Checkbox
                            icon={<FavoriteBorder style={{color: "red"}}/>}
                            checkedIcon={<Favorite style={{color: "red"}}/>}
                            size="large"
                            onChange={() => setSavePost(!savePost)}
                        />
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faEye} className="me-1"/>
                        200
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;