// Importations correctes
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/LoginPages.jsx';
import Dashboard from './pages/daskboard/dashboardpages.jsx';
//import Register from './pages/register/registerpages'; // Décommentez si nécessaire

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Login />} />  
         {/* <Route path="/register" element={<Register />} />  */}
         <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;