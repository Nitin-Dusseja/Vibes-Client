import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/specific/Table'
import { dashboarddata } from '../../components/constants/sampleData'
import { fileFormat, transformImage } from '../../lib/features'
import { Avatar, Box, Stack } from '@mui/material'
import moment from 'moment'
import RenderAttachment from '../../components/shared/RenderAttachment'
import axios from 'axios'
import { server } from '../../components/constants/config'



const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row

      return attachments?.length > 0 ? (attachments.map(i => {

        const url = i.url;
        const file = fileFormat(url)

        return <Box>
          <a
            href={url}
            target="_blank"
            download
            style={{
              color: "black"
            }}
          >
            {RenderAttachment(file, url)}
          </a>
        </Box>
      })) : "No Attachments"
    }
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400
  },
  {
    field: "sender",
    headerName: "Send By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} >
      <Avatar sx={{ margin: "5%" }} alt={params.row.sender.name} src={params.row.sender.avatar} />
      <span>{params.row.sender.name}</span>
    </Stack>
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250
  },
]


const MessageManagement = () => {

  const [rows, setRows] = useState([])


  useEffect(() => {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
    async function fetchData() {
      const data = await axios.get(`${server}/admin/messages`, config)
      setRows(
        data?.data?.messages?.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transformImage(i.sender.avatar, 50),
          },
          createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        }))
      );
    }
    fetchData();

    return () => {
      setRows([])
    }
  }, [])

  return (
    <AdminLayout>
      <Table heading={"All Messages"} columns={columns} rows={rows} rowsHeight={200} />
    </AdminLayout>
  )
}

export default MessageManagement