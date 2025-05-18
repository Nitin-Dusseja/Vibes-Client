import { Box, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { Link } from '../styles/StyledComponents'
import AvatarCard from '../specific/AvatarCard'
import { motion } from "framer-motion";
const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {

  return (
    <Link to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}>
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        style={{
          display: "flex",
          minHeight: "5rem",
          maxHeight: "6rem",
          padding: "10px",
          gap: "1.5rem",
          paddingLeft: "1rem",
          alignItems: "center",
          backgroundColor: sameSender ? "#1989f0" : "unset",
          color: sameSender ? "white" : "black",
          position: "relative",
        }}>

        <AvatarCard avatar={avatar} />

        <Stack>
          <Typography sx={{
            fontSize: "clamp(1rem,3vw,1.2rem)",
            fontWeight: "500",
            marginRight: "1rem",
          }}>{name}</Typography>
          {newMessageAlert && (
            <Typography variant='caption'> <small> {newMessageAlert.count} New Message </small></Typography>
          )}
        </Stack>

        {isOnline && (
          <Box sx={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#1DCD9F",
            position: "absolute",
            right: "3%",
            boxShadow: "0 0 30px 5px #1dcd9f",
            opacity: ".6"
          }}></Box>
        )}
      </motion.div>
    </Link>
  )
}

export default memo(ChatItem)