import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from "./header/Header.tsx"
import Footer from './footer/Footer.tsx'

const Layout: React.FC = () => {
  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default Layout