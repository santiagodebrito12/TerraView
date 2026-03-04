import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import PilotDashboard from "./components/PilotDashboard/PilotDashboard";
import InspectorDashboard from "./components/InspectorDashboard/InspectorDashboard";
import Layout from "./layout/Layout";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
   <Router>

      <Routes>
       <Route path="/" element={<Dashboard />} /> {/* Ruta principal - Cliente */}
      <Route path='/Login' element={<Login/>}/>
      <Route path='/pilot' element={<PilotDashboard/>}/> {/* Ruta independiente - Piloto */}
      <Route path='/inspector' element={<InspectorDashboard/>}/> {/* Ruta independiente - Inspector */}

         {/* Ruta comodín que redirige al login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </Router>
   
   


  );
}

export default App;
