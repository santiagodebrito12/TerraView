import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import Layout from "./layout/Layout";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
   <Router>
   
      <Routes>
       <Route path="/" element={<Dashboard />} /> {/* Ruta principal */}
      <Route path='/Login' element={<Login/>}/>
       
         {/* Ruta comodín que redirige al login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
 
    </Router>
   
   


  );
}

export default App;
