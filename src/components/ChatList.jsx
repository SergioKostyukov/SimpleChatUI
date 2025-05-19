import React, { useState, useEffect } from "react";
import ChatPage from "./Chat";
import { getChats } from "../services/api";

const ChatListPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    getChats().then((res) => {
      setChats(res.data);
      if (!isMobile && res.data.length > 0) {
        setSelectedChatId(res.data[0].id);
      }
    });

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && chats.length > 0) {
        setSelectedChatId(chats[0].id);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [chats]);

  const handleBack = () => setSelectedChatId(null);

  // 📱 Мобільна версія
  if (isMobile) {
    return (
      <div className="p-4 h-[calc(100vh-64px)] bg-gradient-to-r from-slate-100 to-slate-200">
        {!selectedChatId ? (
          <aside className="bg-white rounded-2xl shadow-lg overflow-y-auto border border-slate-300 h-full">
            <h2 className="text-xl font-semibold p-4 border-b border-slate-300 bg-slate-50 rounded-t-2xl">
              💬 Список чатів
            </h2>
            <ul>
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`p-4 cursor-pointer border-b border-slate-100 transition-all duration-150 ease-in-out 
                    hover:bg-slate-100 text-slate-700`}
                >
                  {chat.name}
                </li>
              ))}
            </ul>
          </aside>
        ) : (
          <main className="bg-white rounded-2xl shadow-lg p-4 border border-slate-300 h-full flex flex-col">
            <button
              onClick={handleBack}
              className="mb-4 text-indigo-600 hover:underline text-sm self-start"
            >
              ← Назад до списку чатів
            </button>
            <ChatPage chatId={selectedChatId} />
          </main>
        )}
      </div>
    );
  }

  // 💻 Десктопна версія
  return (
    <div className="p-4 grid grid-cols-12 gap-4 h-[calc(100vh-64px)] bg-gradient-to-r from-slate-100 to-slate-200">
      <aside className="col-span-3 bg-white rounded-2xl shadow-lg overflow-y-auto border border-slate-300">
        <h2 className="text-xl font-semibold p-4 border-b border-slate-300 bg-slate-50 rounded-t-2xl">
          💬 Список чатів
        </h2>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`p-4 cursor-pointer border-b border-slate-100 transition-all duration-150 ease-in-out 
                ${selectedChatId === chat.id 
                  ? "bg-indigo-100 font-medium text-indigo-800" 
                  : "hover:bg-slate-100 text-slate-700"
                }`}
            >
              {chat.name}
            </li>
          ))}
        </ul>
      </aside>

      <main className="col-span-9 bg-white rounded-2xl shadow-lg p-4 border border-slate-300">
        {selectedChatId && <ChatPage chatId={selectedChatId} />}
      </main>
    </div>
  );
};

export default ChatListPage;
