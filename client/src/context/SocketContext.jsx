import { createContext, useContext, useRef, useEffect } from "react";
import { useAppStore } from "../store";
import { HOST } from "../utils/constants";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });

            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                }
            };
        }

        // Cleanup: Reset socket.current to null when userInfo is not available
        socket.current = null;
    }, [userInfo]);

    useEffect(() => {
        if (socket.current) {
            const handleReceiveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage,addContactsInDMContacts } = useAppStore.getState();
    
                if (
                    selectedChatType !== undefined &&
                    (selectedChatData._id === message.sender._id ||
                        selectedChatData._id === message.recipient._id)
                ) {
                    console.log("Received message:", message);
                    addMessage(message);
                }
                addContactsInDMContacts(message)
            };
    
            const handleReceiveChannelMessage=(message)=>{
                const { selectedChatData, selectedChatType, addMessage,addChannelInChannelList } = useAppStore.getState();
                if(selectedChatType!==undefined&&selectedChatData._id===message.channelId){
                    addMessage(message)
                }
                addChannelInChannelList(message)
            }

            socket.current.on("receiveMessage", handleReceiveMessage);
            socket.current.on("receive-channel-message",handleReceiveChannelMessage)
            return () => {
                if (socket.current) {
                    socket.current.off("receiveMessage", handleReceiveMessage);
                }
            };
        }
    }, [userInfo]); // Only re-run the effect if userInfo changes
    
    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
