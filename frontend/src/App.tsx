import { useState, useEffect, useRef } from "react";

import "./App.css";

function App() {
  const [socket, setSocket] = useState();
  const inputRef = useRef();

  function sendMessage() {
    if (!socket) {
      return;
    }
    const msg = inputRef.current.value;
    //@ts-ignore
    socket.send(msg);
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5050");
    //@ts-ignore
    setSocket(ws);
    ws.onmessage = (message) => {
      alert(message.data);
    };
  }, []);
  return (
    <>
      <div>
        <input ref={inputRef} type="text" placeholder="Message.." />
        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  );
}

export default App;
