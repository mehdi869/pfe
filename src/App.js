import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/LoginPages.jsx';
import Register from './pages/register/registerpages'; 
import Dashboard from "./scenes/dashboard";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Sidebar2 from "./scenes/global/Sidebar2"; // Import your new user sidebar
import { useState } from "react";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Form from "./scenes/form";
import Age_group from "./scenes/age_group";
import Status_servey from "./scenes/status_servey";
import Survey_type from "./scenes/survey_type";
import Question_type from "./scenes/question_type";
import Nps_score from "./scenes/nps_score";
import City from "./scenes/city";
import { Outlet } from 'react-router-dom';

function App() {
  const [theme, colorMode] = useMode();
  const [isSider, setIsSider] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'user'

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Login setUserRole={setUserRole}} /> />
            <Route path="/register" element={<Register />} />
            
            <Route element={
              <div className="app" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
                {/* Conditional sidebar rendering */}
                {userRole === 'admin' ? (
                  <Sidebar isSider={isSider} />
                ) : (
                  <Sidebar2 isSider={isSider} /> // User sidebar
                )}
                
                <main className="content" style={{ 
                  flexGrow: 1,
                  transition: 'margin-left 0.3s ease',
                  width: "50%",
                }}>
                  <Topbar setIsSider={setIsSider}/>
                  <Outlet />
                </main>
              </div>
            }>
              {/* Common routes for all users */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/status_servey" element={<Status_servey />} />
              <Route path="/survey_type" element={<Survey_type />} />
              <Route path="/question_type" element={<Question_type />} />
              <Route path="/nps_score" element={<Nps_score />} />
              <Route path="/city" element={<City />} />
              <Route path="/age_group" element={<Age_group />} />
              
              {/* Admin-only routes */}
              {userRole === 'admin' && (
                <>
                  <Route path="/team" element={<Team />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/form" element={<Form />} />
                </>
              )}
              
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;