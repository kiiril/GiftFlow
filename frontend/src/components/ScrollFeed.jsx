import React, {useEffect} from 'react';
import FilterBar from "./FilterBar";
import axios from "axios";

const ScrollFeed = ({fetchPostsUrl, renderPost, isSingleColumn = false}) => {
    const [posts, setPosts] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [hasMore, setHasMore] = React.useState(true);
    const [filters, setFilters] = React.useState({ tags: [] });
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

        const params = {
            limit: limit,
            page: page,
        };

        if (filters.tags && filters.tags.length > 0) {
            params.tags = filters.tags.join(',');
        }

        if (filters.locations && filters.locations.length > 0) {
            params.locations = filters.locations.join(';');
        }

        if (filters.price) {
            if (filters.price.min !== undefined) {
                params.minPrice = filters.price.min;
            }
            if (filters.price.max !== undefined) {
                params.maxPrice = filters.price.max;
            }
        }

        const response = await axios.get(fetchPostsUrl, { params });
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

    const handleFilterChange = (newFilterValues) => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
        setFilters(prevFilters => ({...prevFilters, ...newFilterValues}));
    };

    useEffect( ()=> {
        fetchPosts();
    }, [page]);


    return (
        <div className="container">
            <FilterBar onFilterChange={handleFilterChange} filters={filters}/>
            <div
                className={isSingleColumn ? "d-flex flex-column gap-3" : "row g-3"}
                style={isSingleColumn ? { maxHeight: "80vh", overflowY: "auto" } : {}}
                key={posts.length}
            >
                {posts.map((post) => renderPost(post, handlePostDeleted))}
            </div>
            <div ref={lastElement} />
            {/* just for indication of the last post, will be removed */}
        </div>
    );
};

export default ScrollFeed;