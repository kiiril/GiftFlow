import React, {useEffect} from 'react';
import FilterBar from "./FilterBar";
import PostCard from "./PostCard";
import axios from "axios";

const ScrollFeed = () => {
    const [posts, setPosts] = React.useState([]);

    const fetchPosts = async () => {
        const response = await axios.get("http://localhost:8080/posts");
        console.log(response.data)
        setPosts(response.data);
    }

    useEffect( ()=>{
        fetchPosts();
    }, []);


    return (
        <div className="mx-auto w-75">
            <FilterBar/>
            {posts.map(post =>
                <PostCard key={post.id} post={post}/>
            )}
        </div>
    );
};

export default ScrollFeed;