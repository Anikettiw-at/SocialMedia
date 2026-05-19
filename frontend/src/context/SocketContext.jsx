import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { UserData } from "./UserContext";

const EndPoint = "https://socialmedia-yd54.onrender.com";

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { user } = UserData();

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(EndPoint, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      query: {
        userId: user._id,
      },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUser", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.close();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const SocketData = () => useContext(SocketContext);