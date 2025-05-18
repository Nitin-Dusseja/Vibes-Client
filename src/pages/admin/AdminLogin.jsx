import { useInputValidation } from '6pp'
import { Button, Container, Paper, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { adminLogin, getAdmin } from '../../redux/thunks/admin';

const AdminLogin = () => {
  const { isAdmin } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const secretKey = useInputValidation("");

  const handleAdminLogin = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (isAdmin) return <Navigate to={'/admin/dashboard'} />

  return (
    <div style={{
    }}>
      <Container component={"main"} maxWidth="xs" sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Paper
          elevation={7}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant='h5'>Admin Login</Typography>
          <form style={{
            width: "100%",
            marginTop: "1rem",
          }}
            onSubmit={handleAdminLogin}
          >
            <TextField
              required
              fullWidth
              label="secretKey"
              size="small"
              type='password'
              margin='normal'
              variant='outlined'
              value={secretKey.value}
              onChange={secretKey.changeHandler}
            />
            {secretKey.error && (
              <Typography color='error' variant='caption'>
                {secretKey.error}
              </Typography>
            )}
            <Button fullWidth variant='contained' color='primary' type='submit'>
              Login
            </Button>
          </form>
        </Paper>
      </Container >
    </div>
  )
}

export default AdminLogin