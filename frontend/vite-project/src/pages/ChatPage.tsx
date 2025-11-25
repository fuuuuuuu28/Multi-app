import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useChatStore } from "../stores/useChatStore";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";

const ChatPage = () => {
  const {
    users,
    fetchUsers,
    selectedUser,
    setSelectedUser,
    messages,
    fetchMessage,
    sendMessages,
    clearSeletedUser,
  } = useChatStore();
  const { user } = useUser();
  const currentUser = user;

  const [message, setMessage] = useState("");
  // const [currentTime, setCurrentTime] = useState(Date.now());

  // Cập nhật thời gian mỗi 1 phút
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTime(Date.now()); // Trigger re-render
  //   }, 60 * 1000); // 60 giây = 1 phút

  //   // Cleanup khi component unmount
  //   return () => clearInterval(interval);
  // }, []);

  // console.log("first", users[0].lastMessage.content)

  useEffect(() => {
    fetchUsers();
    // console.log("first", users)
  }, [fetchUsers]);

  useEffect(() => {
    // console.log("asd",selectedUser)
    if (selectedUser?.clerkId) {
      fetchMessage(selectedUser?.clerkId);
    }
  }, [selectedUser]);

  const handleSend = () => {
    if (!user?.id || !selectedUser?.clerkId) {
      return;
    }
    sendMessages(user.id, selectedUser.clerkId, message);
    setMessage("");
  };

  const handlePress = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      handleSend();
    }
  };
  // console.log("user: ", users);
  return (
      <div className="w-[90%] h-[90%] mt-14 mx-auto bg-chat-background rounded-2xl flex overflow-hidden">
        {/* Left side */}
        <div className={`w-full md:w-1/3 text-white flex flex-col ${selectedUser ? "hidden md:flex" : "flex"}`}>
          {/* User's Info */}
          <div className="border-b border-zinc-400 flex items-center gap-2 px-6 py-2">
            <img
              src={user?.imageUrl}
              alt="user"
              className="w-14 h-14 rounded-full border-2 border-purple-500"
            />
            <div>
              <h1 className="text-2xl font-semibold">{user?.fullName}</h1>
              <span className="text-xs font-bold text-green-500">Online</span>
            </div>
          </div>
          <div className="overflow-auto">
            {users?.map((user, index) => (
              <div
                key={index}
                onClick={() => {setSelectedUser(user)}}
                className="flex items-center justify-between gap-2 px-4 py-3 border-b border-zinc-700 hover:bg-zinc-800 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.image}
                    alt="user"
                    className="w-12 h-12 rounded-full border-2 border-purple-500"
                  />
                  <div>
                    <h3 className=" font-medium">{user.fullName}</h3>
                    <p className="text-xs text-zinc-400 truncate w-32">
                      {user.lastMessage
                        ? user.lastMessage.senderId == currentUser?.id
                          ? `Bạn: ${user.lastMessage.content}`
                          : user.lastMessage.content
                        : ""}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-gray-500">
                  {user.lastMessage?.createdAt
                    ? formatDistanceToNow(
                        new Date(user.lastMessage.createdAt),
                        {
                          addSuffix: true,
                          locale: vi,
                        }
                      )
                    : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className={`flex flex-1 flex-col ${selectedUser ? "flex" : "hidden md:flex"} bg-zinc-900 text-white`}>
          {/* Friend Profile */}
          {selectedUser ? (
            <div className="flex items-center px-4 border-b border-zinc-700">
              <div onClick={() => clearSeletedUser()}>
                <ArrowLeft className="size-8"/>
              </div>
              <div className="flex items-center gap-2 h-[70px] px-4 py-2">
                <img
                  src={selectedUser?.image}
                  alt="user"
                  className="w-10 h-10 rounded-full border-2 border-purple-500"
                />
                <div>
                  <h1 className="text-xl">{selectedUser?.fullName}</h1>
                  <span className="text-xs font-bold text-green-500">
                    Online
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-3xl font-bold">
                Choose ur best friends to chat
              </h1>
            </div>
          )}
          {/* Chat Container */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {/* Fetch message */}
            {messages.map((message) =>
              message.senderId === user?.id ? (
                <div key={message._id} className="flex justify-end">
                  <div className="bg-purple-600 p-3 rounded-xl max-w-xs">
                    <p>{message.content}</p>
                  </div>
                </div>
              ) : (
                <div key={message._id} className="flex gap-2">
                  <img
                    src={selectedUser?.image}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="bg-zinc-800 p-3 rounded-xl max-w-xs">
                    <p>{message.content}</p>
                  </div>
                </div>
              )
            )}
            <span className="text-[10px] text-zinc-200 block mt-1 text-right">
              {selectedUser?.lastMessage?.createdAt
                ? formatDistanceToNow(new Date(selectedUser.lastMessage.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })
                : ""}
            </span>
          </div>

          {/* Messages Input */}
          <div className="h-16 border-t border-zinc-700 flex items-center px-4 gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handlePress}
              placeholder="Type your messages..."
              className="flex-1 bg-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
  );
};

export default ChatPage;
