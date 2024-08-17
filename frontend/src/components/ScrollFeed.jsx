import React, {useEffect} from 'react';
import FilterBar from "./FilterBar";
import PostCard from "./PostCard";
import axios from "axios";

const ScrollFeed = () => {
    const [posts, setPosts] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(1);
    const lastElement = React.useRef(); // last element in the feed
    const observer = React.useRef(); // observer for infinite scrolling

    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        const callback = (entries, observer) => {
            if (entries[0].isIntersecting) {
                setPage(page + 1);
            }
        }
        observer.current = new IntersectionObserver(callback);
        observer.current.observe(lastElement.current);
    }, [posts]);

    const fetchPosts = async () => {
        const response = await axios.get("http://localhost:8080/posts", {
            params: {
                limit: limit,
                page: page
            }
        });
        console.log(response.data)
        setPosts([...posts, ...response.data]);
        // setTotalCount(response.headers["x-total-count"]);
    }

    useEffect( ()=> {
        fetchPosts();
    }, [page]);


    return (
        <div className="mx-auto w-75">
            <FilterBar/>
            {posts.map(post =>
                <PostCard key={post.id} post={post}/>
            )}
            <div ref={lastElement} style={{height: "20px", backgroundColor: "red"}}/>
            {/* just for indication of the last post, will be removed */}
        </div>
    );
};

export default ScrollFeed;