import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute'
import { Loader } from './components/specific/Loader'
import axios from 'axios'
import { server } from './components/constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { userExists, userNotExists } from './redux/reducers/auth'
import { Toaster } from 'react-hot-toast'
import { SocketProvider } from './socket'

const Home = lazy(() => import('../src/pages/Home'))
const Login = lazy(() => import('../src/pages/Login'))
const Chat = lazy(() => import('../src/pages/Chat'))
const Groups = lazy(() => import('../src/pages/Groups'))
const NotFound = lazy(() => import('../src/pages/NotFound'))

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const ChatManagement = lazy(() => import('./pages/admin/ChatManagement'))
const MessageManagement = lazy(() => import('./pages/admin/MessageManagement'))


function App() {

  const { user, loader } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    axios.get(`${server}/user/profile`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()))
  }, [dispatch])

  return loader ? <Loader /> : (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={
            <SocketProvider>
              <ProtectRoute user={user} />
            </SocketProvider>
          }>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
          <Route path="/login" element={<ProtectRoute user={!user} redirect='/'><Login /></ProtectRoute>} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users-management" element={<UserManagement />} />
          <Route path="/admin/chats-management" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessageManagement />} />


          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense >
      <Toaster position="bottom-center" />
    </BrowserRouter >
  )
}

export default App