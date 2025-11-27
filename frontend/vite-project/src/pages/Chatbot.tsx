import React, { useEffect, useRef, useState } from "react";
import { useGeminiStore } from "../stores/useGeminiStore";
import { Loader } from "lucide-react";

const Chatbot = () => {
  const { texts, saveText, fetchText, callGeminiApi, isLoading } =
    useGeminiStore();

  const [input, setInput] = useState("");
  // const [messages, setMessages] = useState([
  //   { role: "model", text: "Xin chào! Tôi có thể giúp gì cho bạn? " },
  // ]);
  const chatHistoryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchText();
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [texts]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };

    // 1. Lưu user message
    await saveText("user", input);
    setInput("");

    // Xử lý câu hỏi gemini bên backend

    await callGeminiApi([...texts, userMessage]);
    // console.log("res: ", reply);
  };

  const handlePress = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="w-[90%] h-[90%] mt-14 mx-auto bg-white rounded-2xl flex flex-col shadow-xl overflow-hidden border border-zinc-300">
      <div
        ref={chatHistoryRef}
        className="flex-1 overflow-auto p-6 space-y-4 bg-zinc-200"
      >
        {texts.length == 0 ? (
          <div className="text-4xl text-zinc-400 font-black text-center">
            Tôi là Gemini chat bot hỗ trợ bạn. Bạn có gì cần hỏi không?
          </div>
        ) : (
          <>
            {texts.map((t, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 rounded-xl shadow 
            ${
              t.role === "user"
                ? "ml-auto bg-blue-500 text-white rounded-br-none"
                : "mr-auto bg-white text-zinc-800 border rounded-bl-none"
            }
          `}
              >
                {t.text}
              </div>
            ))}

            {/* Bubble "Thinking..." khi Gemini đang trả lời */}
            {isLoading.call && (
              <div className="max-w-[80%] mr-auto bg-white text-zinc-800 border rounded-xl rounded-bl-none px-4 py-2 shadow flex items-center gap-2">
                <Loader className="size-4 animate-spin text-zinc-500" />
                <span>Thinking...</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-4 bg-white border-t flex items-center gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handlePress}
          placeholder="Nhập tin nhắn..."
          className="
            flex-1 bg-zinc-100 rounded-xl px-4 py-3 
            border border-zinc-300 focus:border-blue-500
            focus:outline-none focus:ring-1 focus:ring-blue-400
            text-zinc-800
          "
        />
        <button
          onClick={sendMessage}
          className="
            bg-blue-600 hover:bg-blue-700 
            text-white px-5 py-3 rounded-xl 
            shadow-md active:scale-95 transition-all
          "
        >
          {isLoading.call ? <Loader className="size-5 animate-spin" /> : "Gửi"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
