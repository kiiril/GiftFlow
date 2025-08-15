import React from "react";
import ScrollFeed from "../components/ScrollFeed";
import MyPostCard from "../components/MyPostCard";
import {API_BASE_URL} from "../constants";

const MyPosts = () => {
    return (
        <div className="container mb-5">
            {/* Header Section */}
            <div className="my-4">
                <h1 className="mb-3" style={{ color: "#2C3E50" }}>
                    Your Posts
                </h1>
                <p className="fs-5 text-muted">
                    Manage all your gift posts in one place. View, edit, publish, or delete your listings.
                    Make sure to publish your posts to make them visible to other users in the main feed.
                </p>
            </div>

            <ScrollFeed
                fetchPostsUrl={`${API_BASE_URL}/posts/me`}
                renderPost={(post, onPostDeleted) => <MyPostCard post={post} onPostDeleted={onPostDeleted} />}
                isSingleColumn={true}
            />
        </div>
    );
};

export default MyPosts;
