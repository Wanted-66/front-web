// src/AppContext.js
import React, { createContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState([
    { title: "금연", content: "금연 캠페인에 참여하세요" },
  ]);

  const addPost = (post) => {
    setPosts((prevPosts) => [...prevPosts, post]);
  };

  return (
    <AppContext.Provider value={{ posts, addPost }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
