import { Add as AddIcon, ArrowDropDown as ArrowDropDownIcon, ArrowDropUp as ArrowDropUpIcon, Group as GroupIcon, Logout as LogoutIcon, Menu as MenuIcon, Notifications as NotificationsIcon, Search as SearchIcon } from '@mui/icons-material'
import { AppBar, Avatar, Backdrop, Badge, Box, Drawer, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import Vibes_m from '../../assets/Vibes_m.png'
import { useNavigate, } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { server } from "../constants/config";
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from "../../redux/reducers/auth";
import { setIsMobile, setIsDropDown, setIsSearch, setIsNotification, setIsNewGroup } from '../../redux/reducers/misc'
import { resetNotificationCount } from "../../redux/reducers/chat";


const SearchDialog = lazy(() => import('../specific/Search'))
const NotificationsDialog = lazy(() => import('../specific/Notifications'))
const NewGroupDialog = lazy(() => import('../specific/NewGroup'))

const Header = ({ data, chatId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { isSearch, isDropDown, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);


  const handleMobile = () => {
    dispatch(setIsMobile(true))
  }
  const openSearchDialog = () => {
    dispatch(setIsSearch(true))
  }

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const closeDropDown = () => {
    dispatch(setIsDropDown(false))
  }


  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  const navigateToGroup = () => {
    navigate('/groups')
  }

  const [otherPerson, setOtherPerson] = useState("")
  const [otherPersonAvatarSrc, setOtherPersonAvatarSrc] = useState([])

  useEffect(() => {
    const user = data?.chats?.filter((user) => {
      return user?._id === chatId
    })
    setOtherPersonAvatarSrc(user?.[0]?.avatar[0])
    setOtherPerson(user?.[0]?.name)
  }, [chatId, otherPerson])

  return (
    <>
      <Box sx={{ flexGrow: 1, height: { xs: "none", sm: "4rem" }, zIndex: "9" }}>
        <AppBar
          position='static'
          sx={{
            bgcolor: "#ffffff",
            boxShadow: "none",
            borderBottom: "1px solid rgba(0,0,0,0.4)"
          }}
        >
          <Toolbar>
            <Box
              sx={{
                display: { xs: "block", sm: "none" }
              }}>
              <IconButton color='Black' onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: "1",
                display: { xs: "block", sm: "none" }
              }}
            ></Box>
            <Typography color={"black"}
              sx={{
                display: {
                  xs: "none", sm: "flex"
                },
                alignItems: "center",
                justifyContent: "center",
                gap: ".5rem",
                userSelect: "none",
                fontSize: "2rem"
              }}
            >
              <img style={{
                height: "35px",
                width: "35px"
              }} src={Vibes_m} alt="" />
              Vibes
            </Typography>
            <Box
              sx={{
                flexGrow: "2",
                display: { xs: "flex", sm: "none" },
                gap: "1rem"
              }}>
              <Avatar src={otherPersonAvatarSrc} />

              <Typography sx={{ color: "black", display: "flex", alignItems: "center" }}>
                {otherPerson}
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: "2"
              }}
            ></Box>
            <Drawer
              sx={{
                display: { xs: "block", sm: "none" }
              }} anchor={"top"} open={isDropDown} onClose={closeDropDown} >
              <Box sx={{
                margin: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around"
              }}>
                <IconBtn
                  title={"Search"}
                  icon={<SearchIcon />}
                  onClick={openSearchDialog}
                />
                <IconBtn
                  title={"New Group"}
                  icon={<AddIcon />}
                  onClick={openNewGroup}
                />
                <IconBtn
                  title={"Manage Groups"}
                  icon={<GroupIcon />}
                  onClick={navigateToGroup}
                />
                <IconBtn
                  title={"Notifications"}
                  icon={<NotificationsIcon />}
                  onClick={openNotification}
                />
                <IconBtn
                  title={"Logout"}
                  icon={<LogoutIcon />}
                  onClick={logoutHandler}
                />
                <IconButton onClick={closeDropDown} >
                  <ArrowDropUpIcon />
                </IconButton>
              </Box>
            </Drawer>

            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}>
              <IconButton onClick={() => dispatch(setIsDropDown(true))} >
                <ArrowDropDownIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearchDialog}
              />
              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />
              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigateToGroup}

              />
              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
              />
              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box >

      {
        isSearch && <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      }
      {
        isNotification && <Suspense fallback={<Backdrop open />}>
          <NotificationsDialog />
        </Suspense>
      }
      {
        isNewGroup && <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      }
    </>
  )
}



const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="primary">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header