// contexts/LoginContext.jsx
import React, { createContext, useState } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, userId, setIsLoggedIn, setUserId }}
    >
      {children}
    </LoginContext.Provider>
  );
};
