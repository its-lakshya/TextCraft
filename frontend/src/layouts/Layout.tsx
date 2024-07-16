import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from "./header/Header.tsx"
import Footer from './footer/Footer.tsx'

const Layout: React.FC = () => {
  return (
    <div className='bg-gray-900 w-full h-screen text-gray-50'>
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Layout