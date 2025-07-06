import React, {useEffect} from 'react';
import FilterBar from "./FilterBar";
import PostCard from "./PostCard";
import axios from "axios";

const ScrollFeed = ({fetchPostsUrl, renderPost, isSingleColumn = false}) => {
    const [posts, setPosts] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [hasMore, setHasMore] = React.useState(true);
    const lastElement = React.useRef(); // last element in the feed
    const observer = React.useRef(); // observer for infinite scrolling

    useEffect(() => {
        if (!hasMore) return;

        if (observer.current) observer.current.disconnect();
        const callback = (entries, observer) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1);
            }
        }
        observer.current = new IntersectionObserver(callback);
        observer.current.observe(lastElement.current);
    }, [posts, hasMore]);

    const fetchPosts = async () => {
        if (!hasMore) return;

        const response = await axios.get(fetchPostsUrl, {
            params: {
                limit: limit,
                page: page
            }
        });
        const newPosts = response.data;

        // If fewer posts than the limit are returned, we've reached the end
        if (newPosts.length < limit) {
            setHasMore(false);
        }

        setPosts(prevPosts => [...prevPosts, ...newPosts]);
    }

    const handlePostDeleted = (postId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };

    useEffect( ()=> {
        fetchPosts();
    }, [page]);


    return (
        <div className="container">
            <FilterBar/>
            <div
                className={isSingleColumn ? "d-flex flex-column gap-3" : "row g-3"}
                style={isSingleColumn ? { maxHeight: "80vh", overflowY: "auto" } : {}}
                key={posts.length}
            >
                {posts.map((post) => renderPost(post, handlePostDeleted))}
            </div>
            <div ref={lastElement} style={{height: "20px", backgroundColor: "red"}}/>
            {/* just for indication of the last post, will be removed */}
        </div>
    );
};

export default ScrollFeed;