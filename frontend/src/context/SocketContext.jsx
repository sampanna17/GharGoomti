import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserContext } from "./UserContext";

 const SocketContext = createContext();

 const SocketContextProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:8888"));

  }, []);

  useEffect(() => {
    user && socket?.emit("newUser", user.userID);
  }, [user, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export {SocketContext, SocketContextProvider };
