import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import {
  Face as FaceIcon,
  AlternateEmail as EmailIcon,
  CalendarMonth as CalenderIcon
} from '@mui/icons-material'
import moment from 'moment'
import { transformImage } from '../../lib/features'


const Profile = ({ user }) => {
  return (
    <Stack spacing={"1rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: "150px",
          height: "150px",
          objectFit: "contain",
          marginBottom: "2rem",
          border: "4px solid white",
        }} />
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard heading={"Username"} text={user?.username} Icon={<EmailIcon />} />
      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon />} />
      <ProfileCard heading={"Joined"} text={moment(user?.createdAt).fromNow()} Icon={<CalenderIcon />} />

    </Stack>
  )
}

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack direction={"row"}
    spacing={"clamp(.5rem,5vw,1rem)"}
    alignItems={"center"}
    justifyContent={"center"}
    color={"white"}
    textAlign={"center"}
  >

    {Icon && Icon}

    <Stack>
      <Typography variant='body1' sx={{
        fontSize: "clamp(.5rem,5vw,1.5rem)",
        zIndex: "9",
        userSelect: "none"
      }}>{text}</Typography>
      <Typography color={"black"} variant='caption'
        sx={{
          userSelect: "none"
        }}
      >{heading}</Typography>
    </Stack>

  </Stack>
)

export default Profile