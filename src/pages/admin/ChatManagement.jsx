import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/specific/Table'
import { Avatar, Stack } from '@mui/material'
import { transformImage } from '../../lib/features'
import AvatarCard from '../../components/specific/AvatarCard'
import toast from 'react-hot-toast'
import { useErrors } from '../../hooks/hook'
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
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <AvatarCard h={3} w={3} avatar={params.row.avatar} />
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300
  },
  {
    field: "totalMembers",
    headerName: "total Members",
    headerClassName: "table-header",
    width: 120
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => <AvatarCard max={100} avatar={params.row.members} />
  },
  {
    field: "totalMessage",
    headerName: "Total Message",
    headerClassName: "table-header",
    width: 120
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} >
      <Avatar alt={params.row.creator.avatar} src={params.row.creator.avatar} />
      <span>{params.row.creator.name}</span>
    </Stack>
  },
]

const ChatManagement = () => {

  const [rows, setRows] = useState([])

  useEffect(() => {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
    async function fetchData() {
      const data = await axios.get(`${server}/admin/chats`, config)
      setRows(
        data?.data?.chats?.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((i) => transformImage(i, 50)),
          members: i.members.map((i) => transformImage(i.avatar, 50)),
          creator: {
            name: i.creator.name,
            avatar: transformImage(i.creator.avatar, 50),
          },
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
      <Table heading={"All Chats"} columns={columns} rows={rows} />
    </AdminLayout>
  )
}


export default ChatManagement