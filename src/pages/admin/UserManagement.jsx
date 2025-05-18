import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/specific/Table'
import { Avatar } from '@mui/material'
import { transformImage } from '../../lib/features'
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
    renderCell: (params) => <Avatar sx={{ margin: "5%" }} alt={params.row.name} src={params.row.avatar} />
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200
  },
]

const UserManagement = () => {
  const [rows, setRows] = useState([])

  useEffect(() => {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
    async function fetchData() {
      const data = await axios.get(`${server}/admin/users`, config)
      setRows(
        data?.data?.users?.map((i) => ({
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50),
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
      <Table heading={"All User"} columns={columns} rows={rows} />
    </AdminLayout>
  )
}

export default UserManagement