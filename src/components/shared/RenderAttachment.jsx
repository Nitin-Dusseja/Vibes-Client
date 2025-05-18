import React from 'react'
import { transformImage } from '../../lib/features'
import { FileOpen as FileOpenIcon } from '@mui/icons-material'

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" width="200" controls />
    case "image":
      return <img src={transformImage(url, 150)} width={"150"} height={"150"} alt='Attachment' style={{
        objectFit: "contain"
      }} />
    case "audio":
      return <audio src={url} preload="none" controls />


    default:
      return <FileOpenIcon />;
  }
}

export default RenderAttachment