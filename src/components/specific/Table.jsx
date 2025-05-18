import { DataGrid } from '@mui/x-data-grid'
import { Container, Paper, Typography } from '@mui/material'
import React from 'react'

const Table = ({ rows, columns, heading, rowsHeight = 52 }) => {
  return (
    <Container sx={{
      height: "100vh"
    }}>

      <Paper
        elevation={3}
        sx={{
          Padding: "1rem 4rem",
          borderRadius: "1rem",
          margin: "auto",
          width: "100%",
          overflow: "hidden",
          height: "100%",
          boxShadow: "none"
        }}
      >
        <Typography
          textAlign={"center"}
          variant='h4'
          sx={{
            margin: "2rem",
            textTransform: "uppercase"
          }}
        >{heading}</Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          rowsHeight={rowsHeight}
          style={{
            height: "80%"
          }}
          sx={{
            border: "none",
            ".table-header": {
              bgcolor: "rgba(25,137,240,0.9)",
              color: "white",
            },
            ".table-header::-webkit-scrollbar": {
              width: "1px"
            }
          }}
        />
      </Paper>
    </Container>
  )
}

export default Table