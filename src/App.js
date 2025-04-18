 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import Login from './pages/login/LoginPages.jsx'
 import Register from './pages/register/registerpages'; 
 import Dashboard from "./scenes/dashboard";
 import { ColorModeContext, useMode } from "./theme";
 import { CssBaseline, ThemeProvider } from "@mui/material";
 import Topbar from "./scenes/global/Topbar";
 import Sidebar from "./scenes/global/Sidebar";
 import { useState } from "react";
 import Team from "./scenes/team";
 import Invoices from "./scenes/invoices";
 import Contacts from "./scenes/contacts";
 import Form from "./scenes/form";
 import { Outlet } from 'react-router-dom';
 import Calendar from "./scenes/calendar";
 

 function App() {
  const [theme, colorMode] = useMode();
  const [isSider, setIsSider] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={
              <div className="app" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
                <Sidebar isSider={isSider} />
                <main className="content" style={{ 
                  flexGrow: 1,
                  transition: 'margin-left 0.3 ease',
                  width: "50%",
                }}>
                  <Topbar setIsSider={setIsSider}/>
                  <Outlet />
                </main>
              </div>
            }>
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/form" element={<Form />} />
              <Route path="/calendar" element={<Calendar />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
export default App;