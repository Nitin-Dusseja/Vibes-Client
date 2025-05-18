import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/')
  }
  return (
    <div style={{
      height: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }} ><h1>
        404 Page <br /> Not Found
      </h1>
      <button onClick={handleGoBack}>Go Back to Home</button>
    </div>
  )
}

export default NotFound