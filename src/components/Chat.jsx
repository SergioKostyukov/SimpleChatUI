import React, { useState, useEffect } from "react";
import { getMessages, sendMessageToChat } from "../services/api";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { id } = useParams();  // Отримуємо id з URL
  const chatId = id;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);

    if (chatId) {
      getMessages(chatId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessageToChat(chatId, userId, message);
    const res = await getMessages(chatId);
    setMessages(res.data);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Повідомлення</h2>

      <div className="flex-1 border rounded-xl p-4 overflow-y-auto bg-slate-50 shadow-inner">
        {messages.map((msg, index) => {
          const isOwn = msg.sender === parseInt(userId);

          return (
            <div
              key={index}
              className={`mb-3 flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                <div
                  className={`text-sm font-semibold mb-1 ${
                    isOwn ? "text-indigo-700" : "text-indigo-500"
                  }`}
                >
                  {msg.sender_name}
                </div>
                <div
                  className={`px-4 py-2 rounded-xl shadow-sm ${
                    isOwn
                      ? "bg-indigo-500 text-white"
                      : "bg-white border border-slate-200 text-slate-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 mt-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Напишіть повідомлення..."
          className="flex-1 p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow transition"
        >
          Надіслати
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
