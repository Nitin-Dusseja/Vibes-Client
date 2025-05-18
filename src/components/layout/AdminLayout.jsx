import { Close as CloseIcon, Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Groups as GroupsIcon, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon, Message as MessageIcon } from '@mui/icons-material'
import { Box, Drawer, Grid, IconButton, Stack, styled, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link as LinkedComponent, Navigate, useLocation } from 'react-router-dom'
import { adminLogout } from '../../redux/thunks/admin';
import { useDispatch, useSelector } from 'react-redux';

const Link = styled(LinkedComponent)`
text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  transition: .4s;
  border: 1px solid rgba(0,0,0,0.2);
  min-width: fit-content;
  &:hover{
  background-color:rgba(25,137,240,0.2);
  color: black
  }
`;

const admintabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />
  },
  {
    name: "Users",
    path: "/admin/users-management",
    icon: <ManageAccountsIcon />
  },
  {
    name: "Chats",
    path: "/admin/chats-management",
    icon: <GroupsIcon />
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />
  },
]

const SideBar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout());
  };


  return (
    <Stack width={w} direction={"column"} p={"1.5rem"} spacing={"1.5rem"} >
      <Typography variant='h5' textTransform={"uppercase"}>Admin</Typography>
      <Stack spacing={"1rem"}>
        {admintabs.map((tab) => (
          <Link key={tab.path} to={tab.path}
            sx={
              location.pathname === tab.path && {
                backgroundColor: "#1989f0",
                color: "white",
                boxShadow: 6,
              }
            }
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              {tab.icon}
              <Typography variant='h6'>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}
        <Link
          onClick={logoutHandler}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ExitToAppIcon />
            <Typography variant='h6'>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack >
  )
}
const AdminLayout = ({ children }) => {

  const { isAdmin } = useSelector((state) => state.auth);

  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  const handleMobile = () => setIsMobile(prev => !prev)
  const handleClose = () => setIsMobile(false)

  if (!isAdmin) return <Navigate to='/admin' />

  return (
    <Grid container minWidth={"100vw"} minHeight={"100vh"}>
      <Box sx={{
        display: { xs: "black", md: "none" },
        position: "fixed",
        left: "1rem",
        top: "1rem",
        zIndex: "99"
      }}>
        <IconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Grid
        xs={0}
        sm={3}
        md={3}
        lg={3}
        padding={"1rem"} sx={{ display: { xs: "none", md: "block" } }} border={"1px solid rgba(0,0,0,0.4)"} > <SideBar /></Grid>
      <Grid
        xs={12}
        sm={12}
        md={9}
        lg={9}
      > {children} </Grid>
      <Drawer sx={{ display: { xs: "block", md: "none" } }} open={isMobile} onClose={handleClose}>
        <SideBar w={"100%"} />
      </Drawer>
    </Grid>

  )
}

export default AdminLayout