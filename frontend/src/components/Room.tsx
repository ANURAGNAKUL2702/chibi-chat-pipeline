import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Send } from "lucide-react";
import { toast } from "sonner";

interface Message {
  message: string;
  name: string;
}

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      message: "Hi there",
      name: "Anonymous",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!roomId) return <div>Invalid room</div>;

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5050");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        setMessages((prev) => [...prev, data.payload]);
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
  }, [roomId]);

  useEffect(() => {
    // Scroll to the latest message whenever messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!socket || !message.trim()) return;

    socket.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: message.trim(),
          name: name?.trim() || "Anonymous",
        },
      })
    );

    setMessage("");
  }

  const shareRoom = async () => {
    const url = `${window.location.origin}/room/${roomId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Room link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy room link");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-800/70 backdrop-blur-lg shadow-md border-b border-gray-700">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Room: {roomId}</h1>
              <p className="text-sm text-gray-400">
                {name?.trim() || "Anonymous"}
              </p>
            </div>
          </div>
          <button
            onClick={shareRoom}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.name === name ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-xl px-4 py-3 ${
                msg.name === name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700/90 text-gray-200"
              }`}
            >
              <div className="text-sm opacity-75 mb-1">{msg.name}</div>
              <div className="break-words">{msg.message}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-700 bg-gray-800 p-4">
        <div className="mb-4">
          <label className="text-sm text-gray-400">Set your name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name || ""}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Room;
