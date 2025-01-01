import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>(["Hi there"]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5050");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "roomName",
          },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        setMessages((prev) => [...prev, data.payload.message]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  function sendMessage() {
    if (!socket || !message.trim()) return;

    socket.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: message.trim(),
        },
      })
    );

    setMessage("");
  }

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="flex-[95%] bg-red-400 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 bg-white m-2 rounded-md shadow-md">
            {msg}
          </div>
        ))}
      </div>
      <div className="bg-green-400 flex items-center p-2">
        <input
          className="flex-grow p-3 rounded-l-md border-none outline-none text-black"
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-3 rounded-r-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
