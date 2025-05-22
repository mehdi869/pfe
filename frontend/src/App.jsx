import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { ColorModeContext, useMode } from "./styles/theme"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import AdminRoute from "./components/AdminRoute"
import LoadingScreen from "./components/LoadingScreen"
import NotFound from "./components/NotFound"
import  BarChart  from "./scenes/barChart";
import {NpsChart} from "../src/scenes/chart/NpsChart.jsx"
import { AgeChart } from "./scenes/chart/AgeChart.jsx"

// Import your components and pages
import LandingPage from "./pages/lading/lading.jsx"
import Login from "./pages/login/LoginPages.jsx"
import Register from "./pages/register/registerpages"
import Dashboard from "./scenes/dashboard"
import Topbar from "./scenes/global/Topbar"
import Sidebar from "./scenes/global/Sidebar"
import Admin from "./scenes/admin-panel"
import Invoices from "./scenes/invoices"
import Contacts from "./scenes/contacts"
import Form from "./scenes/form"
import Calendar from "./scenes/calendar"
import Map from "./scenes/Map/map.jsx"
import {StatusChart} from "./scenes/chart/StatusChart" 
import './style.css'

function App() {
  const [theme, colorMode] = useMode()
  const [isSider, setIsSider] = useState(true)

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Public route: login/register only if NOT authenticated */}
              <Route element={<PublicRoute />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<LandingPage />} />
              </Route>

              {/* Protected route: main app if authenticated */}
              <Route element={<ProtectedRoute />}>
                <Route
                  element={
                    <div className="app" style={{ display: "flex", height: "100vh" }}>
                      <Sidebar isSider={isSider} />
                      <main className="content" style={{ flexGrow: 1, overflow: "auto" }}>
                        <Topbar setIsSider={setIsSider} />
                        <Outlet />
                      </main>
                    </div>
                  }
                >
                  <Route path="/Dashboard" element={<Dashboard />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/map" element={<Map />} />
                  <Route path="/barChart" element={<StatusChart />} />
                  <Route path='/nps' element = {<NpsChart/>}></Route>
                  <Route path='/age' element = {<AgeChart/>}></Route>
                  <Route path="/status" element={<StatusChart />} />
                  {/* Admin-only route */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin-panel" element={<Admin/>} />
                </Route>
                </Route>
              </Route>

              {/* 404 Not Found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  )
}

export default App