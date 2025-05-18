import { Box } from '@mui/material'
import React from 'react'
import AppLayout from '../components/layout/AppLayout'

function Home() {

  return (
    <div style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative"
    }}>
      <div style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative"
      }}>
        <span style={{
          fontSize: "2rem",
          textAlign: "center"
        }}>Select a Friend to Chat</span>
        <small style={{
          marginLeft: "7rem",
          textAlign: "center"
        }}>Or Your alone</small>
      </div>
      <Box
        sx={{
          position: "absolute",
          fontSize: "1vw",
          bottom: "1rem",
          right: "30%",
          left: "30%",
          display: { xs: "none", sm: "block" }
        }}
      >F11 FullScreen for Better Experience</Box>
    </div >
  )
}

export default AppLayout()(Home)