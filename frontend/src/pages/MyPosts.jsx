import React from "react";
import ScrollFeed from "../components/ScrollFeed";
import MyPostCard from "../components/MyPostCard";
import {API_BASE_URL} from "../constants";

const MyPosts = () => {

    return (
        <ScrollFeed
            fetchPostsUrl={`${API_BASE_URL}/posts/me`}
            renderPost={(post, onPostDeleted) => <MyPostCard post={post} onPostDeleted={onPostDeleted} />}
            isSingleColumn={true}
        />
    );
};

export default MyPosts;
