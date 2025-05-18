import { Box, Stack, Avatar, AvatarGroup } from '@mui/material'
import React from 'react'
import { transformImage } from '../../lib/features'

const AvatarCard = ({ avatar = [], max = 4, h = 3.3, w = 3.3 }) => {
  return (
    <Stack direction={"row"} spacing={"0.5"}>
      <AvatarGroup border={"none"} max={max}
        sx={{
          position: "relative",
          '& .MuiAvatar-root': {
            border: "none"
          },
        }}
      >
        <Box
          width={"3.3rem"}
          height={"3.3rem"}
          paddingTop={"0%"}
        >
          {avatar?.map((i, index) => (
            <Avatar
              key={Math.random() * 100}
              src={transformImage(i)}
              alt={`Avatar ${index}`}
              sx={{
                border: 'none',
                width: `${w}rem`,
                height: `${h}rem`,
                position: "absolute",
                zIndex: "1",
                left: {
                  xs: `${0.5 + index}rem`,
                  sm: `${index}rem`,
                }
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack >
  )
}

export default AvatarCard