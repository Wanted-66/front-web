import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
   const [currentUser, setCurrentUser] = useState(null); // currentUser 상태 추가

  const addPost = (post) => {
    setPosts((prevPosts) => [...prevPosts, post]);
  };

  return (
    <AppContext.Provider
      value={{ posts, addPost, currentUser, setCurrentUser }}
    >
      {children}
    </AppContext.Provider>
  );
};
