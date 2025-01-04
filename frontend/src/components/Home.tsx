import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

const Home = () => {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const generateRoomId = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  function joinRoom() {
    const roomId = room.trim() ? room.trim() : generateRoomId();
    toast.success("Joining room...");
    navigate(`/room/${roomId}`);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center w-full max-w-md mx-4">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Welcome to Chat Rooms
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Enter a Room ID to join or generate a new one
        </p>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl 
                     text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
            placeholder="Enter Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <button
            onClick={joinRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl
                     transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Join Room
          </button>

          <button
            onClick={() => {
              const newRoom = generateRoomId();
              setRoom(newRoom);
              toast.info(`Generated room ID: ${newRoom}`);
            }}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                     text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-xl
                     transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Generate New Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
