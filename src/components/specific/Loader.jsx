import React from 'react'
import './Loading.css'
import Vibes_m from '../../assets/Vibes.svg'
import { motion } from "framer-motion";


const Loader = () => {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "black"
    }}>
      <img style={{
        height: "150px",
        width: "150px"
      }} src={Vibes_m} alt="" />
      <div className="loadership_WGGAL"><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

const Typing = () => {
  return <motion.div
    initial={{ opacity: 0, x: "-100%", }}
    whileInView={{ opacity: 1, x: 0 }}
    className='message-tail-other'
    style={{
      alignSelf: "flex-start",
      justifySelf: "flex-end",
      textAlign: "start",
      backgroundColor: "#1989f0",
      color: "white",
      borderRadius: "0px 7px 7px 7px",
      padding: "0.2rem 1rem",
      minWidth: "53px",
      minHeight: "30px",
      maxWidth: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}
  >
    <div class="loadership_OTABD">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </motion.div >
}



const LoaderAnimation = () => {
  return (
    <div style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "black"
    }}>
      <div className="loadership_WGGAL"><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}




export { Loader, Typing, LoaderAnimation }