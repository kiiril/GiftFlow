import React from "react";
import ScrollFeed from "../components/ScrollFeed";
import MyPostCard from "../components/MyPostCard";

const MyPosts = () => {

    return (
        <ScrollFeed
            fetchPostsUrl={"http://localhost:8080/posts/me"}
            renderPost={(post, onPostDeleted) => <MyPostCard post={post} onPostDeleted={onPostDeleted} />}
            isSingleColumn={true}
        />
    );
};

export default MyPosts;
