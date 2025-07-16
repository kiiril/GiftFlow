import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import {API_BASE_URL} from "../constants";

const TagsContext = createContext({ tags: [], map: new Map() });

export function TagsProvider({ children }) {
    const [tags, setTags] = useState([]);
    const [map,  setMap]  = useState(new Map());

    // fetch once, then every 10 min
    useEffect(() => {
        let ignore = false;
        const fetchTags = () =>
            axios.get(API_BASE_URL + "/tags").then(res => {
                if (!ignore) {
                    setTags(res.data);
                    setMap(new Map(res.data.map(t => [t.id, t])));
                }
            });

        fetchTags();
        const id = setInterval(fetchTags, 60 * 10 * 60 * 1000);
        return () => { ignore = true; clearInterval(id); };
    }, []);

    return (
        <TagsContext.Provider value={{ tags, map }}>
            {children}
        </TagsContext.Provider>
    );
}

export const useTags   = () => useContext(TagsContext).tags;
export const useTagMap = () => useContext(TagsContext).map;
