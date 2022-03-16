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
    name?: string;
  } | null;
  formState: formState;
}

const reducer = (
  state: State,
  action: {
    type: string;
    room?: {
      username?: string;
      messages?: string[];
      name?: string;
    };
    rooms?: any[];
  }
): State => {
  switch (action.type) {
    case "LISTROOMS":
      return { ...state, formState: formState.LISTROOMS };

    case "USERNAME":
      return { ...state, formState: formState.USERNAME };

    case "JOIN":
      return {
        ...state,
        activeRoom: action.room ? (action.room as any) : state.activeRoom,
        formState: formState.ACTIVEROOM,
      };

    case "UPDATE_ROOM_LIST":
      return {
        ...state,
        rooms: action.rooms ? [...action.rooms] : [...state.rooms],
      };

    case "CHAT":
      return {
        ...state,
        activeRoom: action.room
          ? { ...state.activeRoom, ...(action.room as any) }
          : { ...state.activeRoom },
        formState: formState.ACTIVEROOM,
      };
    default:
      return state;
  }
};

const initialState: State = {
  rooms: [],
  activeRoom: null,
  formState: formState.USERNAME,
};
const socket = io();

export default () => {
  // const [socket, setSocket] = useState<any>();
  // const [messages, setMessages] = useState<String[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);

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
    dispatch({
      type: "LISTROOMS",
    });

    return false;
  };

  const onSubmitNewRoom: FormEventHandler = (e) => {
    // Emit room here
    e.preventDefault();
    const room = getFormValue(e.target as HTMLFormElement, "newRoom");

    socket.emit("new room", room);
    return false;
  };

  const onSubmitChat: FormEventHandler = (e) => {
    e.preventDefault(); //prevents page reloading
    const data: any = new FormData(e.target as HTMLFormElement);
    const chat = data.get("chat");

    console.log("chat :", chat, state, state.activeRoom?.name);
    socket.emit("chat message", { room: state.activeRoom?.name, msg: chat });
    return false;
  };

  const joinRoom = (room: string) => {
    socket.emit("join room", room);
  };

  const onChatMessageRecieved = (msg: any) => {
    console.log("msg :", msg);

    const messages = state.activeRoom?.messages
      ? [...state.activeRoom?.messages, msg]
      : [];

    dispatch({
      type: "CHAT",
      room: {
        ...state.activeRoom,
        messages,
      },
    });
  };

  const attachEvents = () => {
    socket.on("rooms", (data: any) => {
      // Populate roomlist here

      dispatch({
        type: "UPDATE_ROOM_LIST",
        rooms: Object.keys(data),
      });
    });

    socket.on("joined room", (room: any) => {
      console.log("joined room", room);

      dispatch({
        type: "JOIN",
        room: {
          username: "Something",
          messages: [],
          name: room,
        },
      });
    });
  };

  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      socket.on("connect", () => {});

      socket.on("hello", (data) => {});

      socket.on("a user connected", (msg) => {
        //
      });

      socket.on("disconnect", () => {});
      attachEvents();
    });
    // setSocket(socket);
  }, []); // Added [] as useEffect filter so it will be executed only once, when component is mounted

  useEffect(() => {
    socket.on("chat message", onChatMessageRecieved);
  }, [state.activeRoom?.messages]);

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

      {state.activeRoom && (
        <InfoForm
          name="chat"
          onSubmit={onSubmitChat}
          placeholder="Enter Chat here"
        />
      )}
    </>
  );
};
