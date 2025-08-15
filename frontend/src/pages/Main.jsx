import React from 'react';
import ScrollFeed from "../components/ScrollFeed";
import Landing from "../components/Landing";
import PostCard from "../components/PostCard";
import {API_BASE_URL} from "../constants";

const Main = () => {
    return (
        <>
            <Landing/>
            <div id="scroll-feed-section">
                <h1 className="ms-5 ps-4">Let's specify your desires:</h1>
                <ScrollFeed
                    fetchPostsUrl={`${API_BASE_URL}/posts`}
                    renderPost={(post) => (
                        <div key={post.id} className="col-12 col-md-6 col-lg-4">
                            <PostCard post={post} />
                        </div>
                    )}
                />
            </div>
        </>
    );
};

export default Main;