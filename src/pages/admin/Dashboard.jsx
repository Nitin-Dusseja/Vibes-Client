import { useFetchData } from '6pp'
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Notifications as NotificationsIcon, Person as PersonIcon, Search } from '@mui/icons-material'
import { Box, Container, IconButton, Paper, Stack, Typography } from '@mui/material'
import moment from 'moment'
import { server } from '../../components/constants/config'
import AdminLayout from '../../components/layout/AdminLayout'
import { DoughnutChart, LineChart } from '../../components/specific/Charts'
import { SearchInput } from '../../components/styles/StyledComponents'
import { useErrors } from '../../hooks/hook'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'


const Dashboard = () => {

  const [stats, setStats] = useState({})

  useEffect(() => {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
    async function fetchData() {
      try {
        const data = await axios.get(`${server}/admin/stats`, config)
        setStats(data?.data?.stats)
      } catch (error) {
        toast.error(error)
        useErrors([
          {
            isError: error,
            error: error,
          },
        ]);
      }
    }
    fetchData()

    return () => {
      setStats({})
    }
  }, [])


  const Appbar = (<Paper
    elevation={3}
    sx={{
      padding: "1.5rem",
      margin: {
        xs: "4rem 0rem 1rem 0rem",
        md: "1rem 0rem 1rem 0rem"
      },
      borderRadius: "1rem",
    }}
  >
    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
      <AdminPanelSettingsIcon sx={{ fontSize: "2rem" }} />
      <div style={{
        border: "1px solid rgba(0,0,0,0.4)",
        padding: "0px 15px",
        borderRadius: "3rem",
        width: "12rem",
        minWidth: "auto",
        maxWidth: "auto",
        display: "flex"
      }}>
        <SearchInput placeholder='Search' />
        <IconButton>
          <Search />
        </IconButton>
      </div>
      <Box flexGrow={"1"} />
      <Typography sx={{
        display: {
          xs: "none",
          sm: "block"
        }
      }}> {moment().format("MMMM Do YYYY")} </Typography>
      <NotificationsIcon />
    </Stack>
  </Paper >)

  const Widgets = (<Stack
    direction={{
      xs: "column",
      sm: "row"
    }}
    spacing={"1rem"}
    justifyContent={"space-between"}
    alignItems={"center"}
    margin={"2rem 0rem"}
  >
    <Widget title={"User"} value={stats?.usersCount} icon={<PersonIcon />} />
    <Widget title={"Chats"} value={stats?.totalChatsCount} icon={<GroupIcon />} />
    <Widget title={"Messages"} value={stats?.messagesCount} icon={<MessageIcon />} />
  </Stack >)


  return (
    <AdminLayout>
      <Container component={"main"}>
        {Appbar}

        <Stack
          direction={{
            xs: "column",
            lg: "row"
          }}
          spacing={"2rem"}
          gap={"2rem"}
          flexWrap={"wrap"}
          justifyContent={"center"}
        >
          <Paper
            elevation={3}
            sx={{
              padding: {
                xs: "1rem",
                md: "1rem 3rem"
              },
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "100%"
            }}
          >
            <Typography margin={".5rem"} variant='h5'>Last Messages</Typography>
            <LineChart value={stats?.messagesChart || []} />
          </Paper>
          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              borderRadius: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              position: "relative",
              maxWidth: "25rem",
              height: "25rem"
            }}
          >
            <DoughnutChart labels={["Single Chats", "Group Chats"]} value={[
              stats?.totalChatsCount - stats?.groupsCount || 0,
              stats?.groupsCount || 0,
            ]} />
            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={".5rem"}
              height={"100%"}
              width={"100%"}
            >
              <GroupIcon /> <Typography>VS</Typography> <PersonIcon />
            </Stack>
          </Paper>
        </Stack>
        {Widgets}
      </Container>
    </AdminLayout>
  )
}

const Widget = ({ title, value, icon }) => <Paper
  sx={{
    padding: "2rem",
    margin: "2rem 0rem",
    borderRadius: "1rem",
    width: "20rem"
  }}
  elevation={3}
>
  <Stack alignItems={"center"} spacing={"1rem"}>
    <Typography
      sx={{
        color: "rgba(0,0,0,0.8)",
        borderRadius: "50%",
        border: "3px solid rgba(0,0,0,0.7)",
        height: "5rem",
        width: "5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >{value}</Typography>
    <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
      {icon}
      <Typography>{title}</Typography>
    </Stack>
  </Stack>
</Paper>

export default Dashboard