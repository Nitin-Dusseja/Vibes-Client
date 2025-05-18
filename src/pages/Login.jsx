import React, { useState } from 'react'
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import { CameraAlt as CameraAltIcon } from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/StyledComponents'
import { useFileHandler, useInputValidation, useStrongPassword } from '6pp'
import { usernameValidator } from '../utils/validators'
import { server } from '../components/constants/config'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { userExists } from '../redux/reducers/auth'
import toast from 'react-hot-toast'


function Login() {

  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false);
  const name = useInputValidation('')
  const username = useInputValidation('', usernameValidator)
  const bio = useInputValidation('')
  const password = useInputValidation('')

  const avatar = useFileHandler("single")

  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
    try {
      const { data } = await axios.post(`${server}/user/login`, {
        username: username.value,
        password: password.value
      }, config)
      dispatch(userExists(data.user))
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  }


  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData()
    formData.append("avatar", avatar.file)
    formData.append("name", name.value)
    formData.append("bio", bio.value)
    formData.append("username", username.value)
    formData.append("password", password.value)

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }

    try {
      const { data } = await axios.post(`${server}/user/signin`, formData, config)
      dispatch(userExists(data.user))
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }

  }

  const toggleLogin = () => {
    setIsLogin(prev => !prev)
  }

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

          {isLogin ? <>
            <Typography variant='h5'>Login</Typography>
            <form style={{
              width: "100%",
              marginTop: "1rem",
            }}
              onSubmit={handleLogin}
            >
              <TextField
                required
                fullWidth
                label="Username"
                size="small"
                margin='normal'
                variant='outlined'
                valer={username.value}
                onChange={username.changeHandler}
              />

              {username.error && (
                <Typography color='error' variant='caption'>
                  {username.error}
                </Typography>
              )}
              <TextField
                required
                fullWidth
                label="Password"
                size="small"
                type='password'
                margin='normal'
                variant='outlined'
                value={password.value}
                onChange={password.changeHandler}
              />
              {password.error && (
                <Typography color='error' variant='caption'>
                  {password.error}
                </Typography>
              )}
              <Button fullWidth variant='contained' color='primary' disabled={isLoading} type='submit'>
                Login
              </Button>
              <Typography margin='10px' textAlign='center'>OR</Typography>
              <Button fullWidth variant="outlined" onClick={toggleLogin} >Sign Up Instead</Button>
            </form>
          </>

            : <>
              <Typography variant='h5'>Sign Up</Typography>
              <form style={{
                width: "100%",
                marginTop: "1rem",
              }}
                onSubmit={handleSignUp}
              >

                <Stack position={"relative"} width={"7rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "7rem",
                      height: "7rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />
                  <IconButton sx={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.5)"
                    , ":hover": {
                      bgcolor: "rgba(0,0,0,0.7)"
                    }
                  }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput type='file' onChange={avatar.changeHandler} />
                    </>
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography color='error' variant='caption' width={"100%"} marginTop={".5rem"} textAlign={"center"} display={"block"}>
                    {avatar.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Name"
                  size="small"
                  margin='normal'
                  variant='outlined'
                  value={name.value}
                  onChange={name.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Bio"
                  size="small"
                  margin='normal'
                  variant='outlined'
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  size="small"
                  margin='normal'
                  variant='outlined'
                  value={username.value}
                  onChange={username.changeHandler}
                />

                {username.error && (
                  <Typography color='error' variant='caption'>
                    {username.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="Password"
                  size="small"
                  type='password'
                  margin='normal'
                  variant='outlined'
                  value={password.value}
                  onChange={password.changeHandler}
                />
                {password.error && (
                  <Typography color='error' variant='caption'>
                    {password.error}
                  </Typography>
                )}
                <Button fullWidth disabled={isLoading} variant='contained' color='primary' type='submit'>
                  Sign Up
                </Button>
                <Typography margin='10px' textAlign='center'>OR</Typography>
                <Button fullWidth variant="outlined" onClick={toggleLogin} >Login Instead</Button>
              </form>
            </>
          }

        </Paper>
      </Container >
    </div>
  )
}

export default Login