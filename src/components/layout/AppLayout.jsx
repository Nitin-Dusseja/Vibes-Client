import { Drawer, Grid, Typography } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useErrors, useSocketEvents } from '../../hooks/hook'
import { getOrSaveFromStorage } from '../../lib/features'
import { useMyChatsQuery } from '../../redux/api/api'
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat"
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/reducers/misc'
import { getSocket } from '../../socket'
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../constants/events"
import ChatList from '../specific/ChatList'
import { LoaderAnimation } from '../specific/Loader'
import Profile from '../specific/Profile'
import Header from './Header'
import DeleteChatMenu from '../dialogs/DeleteChatMenu'

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();
    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);


    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = (data) => {
      if (data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data));
    }

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);
    return (
      <>
        <Header data={data} chatId={chatId} />
        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />
        <Drawer open={isMobile} onClose={handleMobileClose} >
          {
            (data?.chats.length <= 0) ? <Typography sx={{ margin: "1rem", width: "80vw" }} >No Chats</Typography> :

              <ChatList
                w="80vw"
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                onlineUsers={onlineUsers}
                newMessagesAlert={newMessagesAlert}
              />
          }
        </Drawer >

        <Grid container gap={0} spacing={0} height={"calc(100vh - 4rem)"} maxHeight={"100%"}>
          <Grid
            item
            xs={0}
            sm={4}
            md={3}
            lg={3}
            borderRight={"1px solid rgba(0,0,0,0.2)"}
            sx={{
              display: { xs: "none", sm: "block" },
              overflowY: "auto",
            }}
            height={"100%"}
          >

            {isLoading ? <LoaderAnimation /> :
              (
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  onlineUsers={onlineUsers}
                  newMessagesAlert={newMessagesAlert}
                />
              )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            md={6}
            lg={6}
            height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>
          <Grid
            item
            xs={0}
            sm={0}
            md={3}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "#1989f0",
              borderLeft: `1px solid rgba(0,0,0,0.2)`
            }}>
            <Profile user={user} />
          </Grid>
        </Grid>

      </>
    )
  }
}

export default AppLayout