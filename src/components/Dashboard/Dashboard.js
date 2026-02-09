import React from 'react'
import Layout from '../../layout/Layout'
import {useSelector}  from 'react-redux';

import './Dashboard.css'
import Inspections from '../Inspections/Inspections';
import Analytics from '../Analytics/Analytics';
import Gallery from '../Gallery/Gallery';
import Settings from '../Settings/Settings';
import Comparative from '../Comparative/Comparative';
import Timeline from '../Timeline/Timeline';
import MapBox from '../Mapbox/Mapbox';

const Dashboard = () => {
    const feature = useSelector((state) => state.appState.feature);  
   
    
    return (
   
   <Layout>
      
    <div className="contenedor-principal">
 
    {feature === "assets" && <MapBox/>}
    {feature === "inspections" && <Inspections/>}
    {feature === "analytics" && <Analytics/>}
    {feature === "gallery" && <Gallery/>}
    {feature === "settings" && <Settings/>}
    {feature === "comparative" && <Comparative/>}
    {feature === "timeline" && <Timeline/>}
    </div>
 
  
    </Layout>
  )
}

export default Dashboard
