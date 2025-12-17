import React from 'react'
import Header from '../components/Header/Header'
import Sidebar from '../components/SideBar/Sidebar'
import './Layout.css';

const Layout = ({children}) => {
  return (
    <div>
        <Header/>
        <div className='contenedor-centro'>
        <Sidebar/>
        {children}
        </div>
     
    </div>
  )
}

export default Layout