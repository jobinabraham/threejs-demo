import { useEffect, FormEventHandler, useState } from "react";
import io from "socket.io-client";

export default () => {
  const socket = io();
  const [messages, setMessages] = useState<String[]>([]);

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault(); //prevents page reloading
    const data: any = new FormData(e.target as HTMLFormElement);
    const chat = data.get("chat");
    socket.emit("chat message", chat);
  };

  const attachEvents = () => {
    socket.on("chat message", (data) => {
      console.log("chat message", data);
      console.log("New list ", [...messages, data]);
      setMessages([...messages, data]);
    });
  };

  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      socket.on("connect", () => {
        console.log("connect");
      });

      socket.on("hello", (data) => {
        console.log("kello", data);
      });

      socket.on("a user connected", () => {
        console.log("a user connected");
      });

      socket.on("disconnect", () => {
        console.log("disconnect");
      });
      attachEvents();
    });
  }, [attachEvents]); // Added [] as useEffect filter so it will be executed only once, when component is mounted

  return (
    <>
      <ul id="messages">
        {messages.map((message, index) => (
          <li key={index + "" + message.charAt(1)}>{message}</li>
        ))}
      </ul>
      <form onSubmit={onSubmit}>
        <input autoComplete="off" name="chat" />
        <button type="submit">Send</button>
      </form>
    </>
  );
};
