
import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { FaSearch, FaEllipsisV, FaPaperPlane } from 'react-icons/fa';
import { UserContext } from '../context/UserContext';
import { SocketContext } from '../context/SocketContext';
import { format } from 'timeago.js';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Chats = () => {

  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const location = useLocation();
  const messagesEndRef = useRef();
  const messagesContainerRef = useRef();
  const prevMessagesLength = useRef(0);

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // Scroll to bottom only when new messages are received
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      scrollToBottom();
    }
    prevMessagesLength.current = messages.length;
  }, [messages, scrollToBottom]);

  // Disable body scrolling when component mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Fetch chats 
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.userID) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`http://localhost:8000/api/chats/getchats`, {
          userId: user.userID
        });

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response format");
        }

        const fetchedChats = response.data.map(chat => ({
          ...chat,
          receiver: {
            userID: chat.receiver?.userID,
            fullName: chat.receiver?.['Full Name'],
            username: chat.receiver?.['Full Name'],
            profile_picture: chat.receiver?.profile_picture
          }
        }));

        setChats(fetchedChats);

        // Check if there's a chat to activate from location state
        if (location.state?.activeChat) {
          const chatToActivate = fetchedChats.find(
            chat => chat.chatID === location.state.activeChat
          );

          if (chatToActivate) {
            setActiveChat(chatToActivate);
          } else {
            const newChat = {
              chatID: location.state.activeChat,
              receiver: {
                userID: location.state.receiver?.userID || 'unknown',
                fullName: location.state.receiver?.fullName || 'Unknown User',
                username: location.state.receiver?.fullName || 'Unknown User',
                profile_picture: location.state.receiver?.profile_picture || '/noavatar.jpg'
              },
              last_message: '',
              last_message_at: new Date().toISOString(),
              seenBy: [user.userID]
            };
            setActiveChat(newChat);
            setChats(prev => [...prev, newChat]);
          }
        } else if (fetchedChats.length > 0) {
          // Activate the first chat by default if none is selected
          setActiveChat(fetchedChats[0]);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [user?.userID, location.state]);

  const markAsRead = useCallback(async (chatId) => {
    if (!user) return;
    try {
      await axios.put(`http://localhost:8000/api/chats/read/${chatId}`, {
        userId: user.userID
      });

      setChats(prev =>
        prev.map(chat =>
          chat.chatID === chatId
            ? { ...chat, seenBy: [...(chat.seenBy || []), user.userID] }
            : chat
        )
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }, [user]);

  // Fetch messages when active chat changes
  useEffect(() => {
    const fetchMessages = async (chatID) => {
      if (!chatID || !user?.userID) return;

      try {
        const response = await axios.post(
          `http://localhost:8000/api/chats/${chatID}`, {
          userId: user.userID
        });

        if (response.data) {
          setMessages(response.data.messages);

          // Update receiver info if available
          if (response.data?.receiver) {
            const receiverData = response.data.receiver;
            setActiveChat(prev => ({
              ...prev,
              receiver: {
                userID: receiverData.userID || receiverData._id,
                fullName: receiverData['Full Name'] || receiverData.fullName || receiverData.username,
                username: receiverData['Full Name'] || receiverData.fullName || receiverData.username,
                profile_picture: receiverData.profile_picture || ''
              }
            }));
          }
          
          markAsRead(chatID);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    // Only fetch if activeChat exists and has a chatID
    if (activeChat?.chatID) {
      fetchMessages(activeChat.chatID);
    }
  }, [activeChat?.chatID, user?.userID, markAsRead]);

  // Socket.io real-time messaging
  useEffect(() => {
    if (!socket || !activeChat) return;

    const handleReceiveMessage = (data) => {
      if (activeChat.chatID === data.chatID) {
        setMessages(prev => [...prev, data]);
        markAsRead(activeChat.chatID);
      }

      // Update last message in chats list
      setChats(prev =>
        prev.map(chat =>
          chat.chatID === data.chatID
            ? {
              ...chat,
              last_message: data.text,
              last_message_at: data.created_at,
              seenBy: data.userId === user.userID ? [...(chat.seenBy || []), user.userID] : chat.seenBy
            }
            : chat
        )
      );
    };

    socket.on("getMessage", handleReceiveMessage);

    return () => {
      socket.off("getMessage", handleReceiveMessage);
    };
  }, [socket, activeChat, markAsRead, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    try {
      const response = await axios.post(
        `http://localhost:8000/api/messages/${activeChat.chatID}`,
        {
          text: message,
          userId: user.userID
        }
      );

      const newMessage = response.data;

      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Update the chat's last message
      setChats(prev =>
        prev.map(chat =>
          chat.chatID === activeChat.chatID
            ? {
              ...chat,
              last_message: message,
              last_message_at: new Date().toISOString(),
              seenBy: [user.userID]
            }
            : chat
        )
      );

      if (socket) {
        socket.emit("sendMessage", {
          receiverId: activeChat.receiver.userID,
          data: {
            ...newMessage,
            chatID: activeChat.chatID,
            senderName: user.userFirstName
          }
        });
      }

      setTimeout(() => {
        scrollToBottom();
      }, 0);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  //Helper Function

  const filteredChats = chats.filter(chat =>
    chat.receiver?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.receiver?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };


  if (loading) {
    return (
      <div className="min-h-screen mt-24 bg-gray-50 overflow-hidden px-16 flex items-center justify-center">
        <div className="text-xl">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-24 bg-gray-50 px-16">
      <div className="container mx-auto p-4 h-full">
        <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-8rem)]">
          {/* Sidebar */}
          <div className="w-full md:w-80 bg-white rounded-xl shadow-sm p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Chats</h2>
              <button className="text-gray-500 hover:text-gray-700">
                <FaEllipsisV />
              </button>
            </div>

            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex-1 overflow-y-hidden">
              <div className="h-full overflow-y-auto pr-2">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.chatID}
                    className={`flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors ${activeChat?.chatID === chat.chatID ? 'bg-blue-50 border border-blue-100' : ''
                      } ${!chat.seenBy?.includes(user.userID) ? 'bg-yellow-50' : ''
                      }`}
                    onClick={() => setActiveChat(chat)}
                  >
                    <div className="relative flex-shrink-0">
                      {
                        chat.receiver?.profile_picture ? (
                          <img
                            src={chat.receiver.profile_picture}
                            alt={chat.receiver.fullName || chat.receiver.username || 'Unknown'}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-lg">
                            {getInitials(chat.receiver?.fullName || chat.receiver?.username || 'U')}
                          </div>
                        )
                      }

                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className={`text-sm font-medium truncate ${!chat.seenBy?.includes(user.userID) ? 'text-blue-600 font-semibold' : 'text-gray-800'
                          }`}>
                          {chat.receiver?.fullName || chat.receiver?.username || 'Unknown User'}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {format(chat.last_message_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {chat.last_message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
            {activeChat ? (
              <>
                <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                  <div className="flex items-center">
                    <div className="relative">
                      {
                        activeChat.receiver?.profile_picture ? (
                          <img
                            src={activeChat.receiver.profile_picture}
                            alt={activeChat.receiver.fullName || activeChat.receiver.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-lg">
                            {getInitials(activeChat.receiver?.fullName || activeChat.receiver?.username || 'U')}
                          </div>
                        )
                      }

                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-800">
                        {activeChat.receiver?.fullName || activeChat.receiver?.username || 'Unknown User'}
                      </h3>

                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                      <FaEllipsisV />
                    </button>
                  </div>
                </div>

                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto bg-gray-50 p-4"
                  style={{
                    minHeight: 0,
                    maxHeight: 'calc(100vh - 8rem - 60px - 72px)',
                    overflowAnchor: 'none'
                  }}
                >
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.messageID}
                        className={`flex ${msg.userID === user.userID ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.userID !== user.userID && (
                          <div className="mr-2 flex-shrink-0">
                            {
                              activeChat.receiver?.profile_picture ? (
                                <img
                                  src={activeChat.receiver.profile_picture}
                                  alt={activeChat.receiver.fullName || activeChat.receiver.username}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-lg">
                                  {getInitials(activeChat.receiver?.fullName || activeChat.receiver?.username || 'U')}
                                </div>
                              )
                            }

                          </div>
                        )}
                        <div className={`max-w-xs md:max-w-md ${msg.userID === user.userID ? 'text-right' : 'text-left'}`}>
                          <div
                            className={`inline-block p-3 rounded-2xl ${msg.userID === user.userID
                              ? 'bg-blue-500 text-white rounded-tr-none'
                              : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                              }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          <div className={`text-xs text-gray-500 mt-1 ml-2 ${msg.userID === user.userID ? 'text-right' : 'text-left'
                            }`}>
                            {format(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="border-t p-4 bg-white sticky bottom-0">
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-900 rounded-full focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center ml-2">
                      <button
                        type="submit"
                        disabled={!message.trim()}
                        className={`ml-2 mb-2 p-2 rounded-full ${message.trim() ? 'bg-blue-900 hover:bg-blue-900' : 'bg-gray-300'
                          } text-white transition-colors`}
                      >
                        <FaPaperPlane />
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-500 text-center p-8">
                  <h3 className="text-xl font-medium mb-2">No chat selected</h3>
                  <p>Select a chat from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;