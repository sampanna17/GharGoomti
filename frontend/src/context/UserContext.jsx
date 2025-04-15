import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const refreshUserData = () => {
    try {
      const userData = Cookies.get("user_data");
      if (userData) {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (e) {
      console.error("Error parsing user_data from cookie:", e);
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // Refresh on initial load
  useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };