import { useInfiniteScrollTop } from '6pp'
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material'
import { IconButton, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setIsFileMenu } from "../redux/reducers/misc";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../components/constants/events"
import FileMenu from '../components/dialogs/FileMenu'
import AppLayout from '../components/layout/AppLayout'
import MessageComponent from '../components/shared/MessageComponent'
import { InputBox } from '../components/styles/StyledComponents'
import { useErrors, useSocketEvents } from "../hooks/hook"
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api'
import { removeNewMessagesAlert } from "../redux/reducers/chat"
import { getSocket } from '../socket'
import { LoaderAnimation, Typing } from '../components/specific/Loader'

function Chat({ chatId, user }) {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [1000]);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };


  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Emitting the message to the server
    socket.emit("NEW_MESSAGE", { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = (data) => {
    if (data.chatId !== chatId) return;
    setMessages((prev) => [...prev, data.message]);
  }



  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );


  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  useSocketEvents(socket, eventHandler);


  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];
  return chatDetails.isLoading ? (
    <LoaderAnimation />
  ) : (
    <>
      <Stack ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        height={"90%"}
        backgroundColor={"white"}
        marginTop={"1px"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto"
        }}
      >
        {
          allMessages.map((i) => (
            <MessageComponent key={i._id} message={i} user={user} />
          ))}


        {userTyping && <Typing />}
        <div ref={bottomRef} />

      </Stack>

      <form style={{
        height: "10%",
        minHeight: "10%",
        width: "100%",
      }}
        onSubmit={submitHandler}
      >
        <Stack direction={"row"} height={"100%"} alignItems={"center"} justifyContent={"space-around"} padding={"0.5rem"} position={"relative"} borderTop={"1px solid rgba(0,0,0,0.1)"}>
          <IconButton sx={{
            position: "absolute",
            left: "1.5rem",
            top: "20%",
            bottom: "20%",
            right: "90%",
            rotate: "30deg"
          }} onClick={handleFileOpen}>
            <AttachFileIcon />
          </IconButton>
          <InputBox style={{ flex: ".9", border: "1px solid rgba(0,0,0,0.3)", minHeight: "2rem", maxHeight: "2.5rem", fontSize: "1rem" }} placeholder='Type a Message' value={message} onChange={messageOnChange} />
          <IconButton type='submit' sx={{ flex: ".04", backgroundColor: "#1989f0", minHeight: "2.5rem", rotate: "-45deg", color: "white", ":hover": { bgcolor: "rgba(25,137,240,0.7)" } }}>
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </>
  )
}



export default AppLayout()(Chat)