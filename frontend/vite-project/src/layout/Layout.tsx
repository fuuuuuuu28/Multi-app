import { useEffect, useState } from "react";
import ChatPage from "../pages/ChatPage";
import TodoPage from "../pages/TodoPage";
import { Link } from "react-router-dom";
import SignButton from "../auth/SignButton";
import { useUser } from "@clerk/clerk-react";
import {
  Bot,
  ClipboardList,
  Menu,
  MessageCircleMore,
  XIcon,
} from "lucide-react";
import Chatbot from "../pages/Chatbot";

const Layout = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState(
    () => sessionStorage.getItem("activeTab") || "chat"
  );
  const [sideBarOpen, setSideBarOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const tabs = [
    {
      id: "",
      content: "Chat",
      icon: <MessageCircleMore className="size-5" />,
    },
    {
      id: "todo",
      content: "Todo",
      icon: <ClipboardList className="size-5" />,
    },
    {
      id: "chatbot",
      content: "Chat Bot",
      icon: <Bot className="size-5" />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "todo":
        return <TodoPage />;
      case "chatbot":
        return <Chatbot/>
      default:
        return <ChatPage />;
    }
  };

  return (
    <div className="min-w-screen h-screen bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center ">
      <button
        className="fixed top-4 left-4 z-40 bg-white rounded-lg p-2 shadow-lg"
        onClick={() => setSideBarOpen(!sideBarOpen)}
      >
        <Menu />
      </button>
      <div
        className={`w-60 flex flex-col items-center justify-between fixed inset-y-0 z-50 left-0 bg-white/10 backdrop-blur-lg border-r border-white/20 transform transition-transform duration-300 ease-in-out ${
          sideBarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full py-4 bg-white/30 rounded-xl">
          <div className="flex items-center justify-around">
            <div className="bg-white/80 flex items-center justify-center size-10 rounded-xl shadow-2xl">
              <span className="text-xl">🚀</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">My App</h1>
              <span className="text-sm text-white/70">Dashboard</span>
            </div>
            <XIcon
              className="size-8 p-2 bg-white rounded-lg shadow-lg cursor-pointer"
              onClick={() => setSideBarOpen(!sideBarOpen)}
            />
          </div>
        </div>

        <div className=" w-full">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <Link
                key={tab.id}
                to={`/${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full min-h-[60px] flex items-center gap-3 px-4 py-3 rounded-xl 
                  font-medium transition-all duration-300

                  ${
                    isActive
                      ? "bg-white/30 text-white shadow-lg scale-[1.03]"
                      : "bg-white/10 text-white/90 hover:bg-white/20 hover:scale-[1.01]"
                  }
                `}
              >
                {tab.icon}
                <span>{tab.content}</span>
                {isActive && (
                  <span className="ml-auto h-2 w-2 bg-white rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>
        <div></div>

        <div className="mt-6">
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <SignButton />
            </div>
            <div className="truncate">
              <p className="text-white text-lg font-medium truncate">
                {user?.fullName}
              </p>
              <p className="text-white/70 text-sm truncate">
                {user?.emailAddresses[0].emailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 h-full overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default Layout;
