import { Box, Typography } from '@mui/material'
import moment from 'moment'
import React, { memo } from 'react'
import { fileFormat } from '../../lib/features'
import RenderAttachment from './RenderAttachment'
import { motion } from "framer-motion";
const MessageComponent = ({ message, user }) => {

  const { sender, content, attachments = [], createdAt } = message
  const timeAgo = moment(createdAt).fromNow();
  const sameSender = sender?._id === user?._id;

  return (
    <motion.div
      initial={{ opacity: 0, x: sameSender ? "100%" : "-100%", }}
      whileInView={{ opacity: 1, x: 0 }}
      className={sameSender ? 'message-tail' : 'message-tail-other'}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        textAlign: sameSender ? "end" : "start",
        backgroundColor: sameSender ? "rgba(0,0,0,0.1)" : "#1989f0",
        color: sameSender ? "black" : "white",
        borderRadius: sameSender ? "7px 0px 7px 7px" : "0px 7px 7px 7px",
        padding: "0.3rem 0.5rem",
        maxWidth: "50%",
        position: "relative",
      }}
    >

      {!sameSender && <Typography variant='caption' position={"absolute"} top={"-15%"} color='black' lineHeight={"0"} fontWeight={"600"}>{ }</Typography>}

      {content && <Typography fontWeight={"200"} lineHeight={"20px"} ><span className='message-box'>{content}</span></Typography>}

      {
        attachments.length > 0 && attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url)

          return (
            <Box key={index} sx={{
              margin: ".5rem",
            }}>
              <a href={url} target='_blank' download style={{ color: "black" }}>
                {RenderAttachment(file, url)}
              </a>
            </Box>
          )
        })
      }


      <Typography variant='caption' position={"absolute"} width={"fit-contents"} minWidth={"7rem"} color='text.secondary' bottom={"-12px"} lineHeight={"10px"} fontSize={"10px"}
        sx={{
          left: sameSender ? "none" : "0%",
          right: sameSender ? "0%" : "none",
        }}
      >{timeAgo}</Typography>

    </motion.div>
  )
}

export default memo(MessageComponent)