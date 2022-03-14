import InfoForm from "@components/infoform";
import { useEffect, FormEventHandler, useState, useReducer } from "react";
import io from "socket.io-client";

enum formState {
  LISTROOMS = "LISTROOMS",
  USERNAME = "USERNAME",
  ACTIVEROOM = "ACTIVEROOM",
}

interface State {
  rooms: string[];
  activeRoom: {
    username: string;
    messages: string[];
  } | null;
  formState: formState;
}

const reducer = (
  state: State,
  action: {
    type: string;
    room: {
      username: string;
      messages: string[];
    };
  }
): State => {
  switch (action.type) {
    case "LISTROOMS":
      return { ...state, formState: formState.LISTROOMS };

    case "USERNAME":
      return { ...state, formState: formState.USERNAME };

    case "JOIN":
      return { ...state, formState: formState.USERNAME };

    default:
      return state;
  }
};

const initialState: State = {
  rooms: [],
  activeRoom: null,
  formState: formState.LISTROOMS,
};

export default () => {
  const socket = io();
  const [messages, setMessages] = useState<String[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("state.rooms", state.rooms);
  const attachEvents = () => {
    socket.on("chat message", (data) => {
      console.log("chat message", data);
      console.log("New list ", [...messages, data]);
      setMessages([...messages, data]);
    });

    socket.on("rooms", (data) => {
      // Populate roomlist here
    });
  };

  const getFormValue = (target: HTMLFormElement, key: string): string => {
    const data: any = new FormData(target);
    const value = data.get(key);
    return value;
  };
  const onSubmitUsername: FormEventHandler = (e) => {
    // Emit username here
    e.preventDefault();
    const username = getFormValue(e.target as HTMLFormElement, "username");
    socket.emit("set username", username);
    return false;
  };

  const onSubmitNewRoom: FormEventHandler = (e) => {
    // Emit room here
    e.preventDefault();
    const room = getFormValue(e.target as HTMLFormElement, "newRoom");
    console.log("Room in submit", room);
    socket.emit("new room", room);
    return false;
  };

  const onSubmitChat: FormEventHandler = (e) => {
    e.preventDefault(); //prevents page reloading
    const data: any = new FormData(e.target as HTMLFormElement);
    const chat = data.get("chat");
    socket.emit("chat message", chat);
    return false;
  };

  const joinRoom = (room: string) => {
    console.log("room", room);
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
      {!state.activeRoom && (
        <ul key="room-list">
          {state.rooms.map((room, index) => (
            <li key={`${index}-${room}`} onClick={joinRoom.bind(this, room)}>
              {room}
            </li>
          ))}
        </ul>
      )}

      {!state.activeRoom && state.formState === formState.USERNAME && (
        <InfoForm
          name="username"
          onSubmit={onSubmitUsername}
          placeholder="Username"
        />
      )}

      {!state.activeRoom && state.formState === formState.LISTROOMS && (
        <InfoForm
          name="newRoom"
          onSubmit={onSubmitNewRoom}
          placeholder="Enter new room name"
        />
      )}

      {state.activeRoom && (
        <ul id="messages">
          {state.activeRoom.messages.map((message, index) => (
            <li key={index + "" + message.charAt(1)}>{message}</li>
          ))}
        </ul>
      )}

      {state.activeRoom && <InfoForm name="chat" onSubmit={onSubmitChat} />}
    </>
  );
};
