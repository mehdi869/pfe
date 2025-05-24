 import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ThemeCustomizationContext, useMode } from "./styles/theme";
import { useState } from "react"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import AdminRoute from "./components/AdminRoute";
import LoadingScreen from "./components/LoadingScreen"
import NotFound from "./components/NotFound"
// {Moussa}:Satuts Chart of malik , route path is /status , visualization of the status of the users
import {StatusChart} from "../src/scenes/chart/StatusChart.jsx";
// {Moussa}: Bar Chart of mehdi , route path is /barchart , visualization of the question type stats
import BarChart from "./scenes/barChart";
import {NpsChart} from "../src/scenes/chart/NpsChart.jsx"
import { AgeChart } from "./scenes/chart/AgeChart.jsx"
import {SurveyChart} from "./scenes/chart/SurveyChart.jsx"
import LandingPage from "./pages/lading/lading.jsx";
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
import Profile from "./scenes/profile";
import Map from "./scenes/Map/map.jsx"
import {StatusChart} from "./scenes/chart/StatusChart" 
import './style.css'
import QuestionChart from "./scenes/chart/QuestionChart.jsx"; // Import QuestionChart
import { TopbarProvider, useTopbar, TOPBAR_HEIGHT } from "./context/TopbarContext"; // Import TopbarProvider and useTopbar

// Layout component that includes Sidebar and Topbar
function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isTopbarExternallyControlled } = useTopbar();

  return (
    <div className="app" style={{ display: "flex", height: "100vh" }}>
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <main
        className="content"
        style={{
          flexGrow: 1,
          overflow: "auto",
          position: "relative", // Important for absolute positioned Topbar
          paddingTop: isTopbarExternallyControlled ? TOPBAR_HEIGHT : "0px",
          transition: "padding-top 0.5s ease-in-out",
        }}
      >
        <Topbar setIsSider={setIsSidebarCollapsed} isSiderCollapsed={isSidebarCollapsed} />
        <Outlet />
      </main>
    </div>
  );
}

 function App() {
  const [theme, colorMode] = useMode()
  const [isSider, setIsSider] = useState(true)

  return (
    <AuthProvider>
      <ThemeCustomizationContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <TopbarProvider> {/* Wrap routes with TopbarProvider */}
              <Routes>
                <Route element={<PublicRoute />}>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<LandingPage />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}> {/* Use the AppLayout */}
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/contacts" element={<Contacts />} />
                    {/* <Route path="/question_chart" element={<Question_Chart />} /> */}
                    <Route path="/form" element={<Form />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/barChart" element={<StatusChart />} />
                    <Route path="/nps" element={<NpsChart />} />
                    <Route path="/age" element={<AgeChart />} />
                    <Route path="/status" element={<StatusChart />} />
                    <Route element={<AdminRoute />}>
                      <Route path="/admin-panel" element={<Admin />} />
                    </Route>
                </Route>
              </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TopbarProvider>
          </Router>
        </ThemeProvider>
      </ThemeCustomizationContext.Provider>
    </AuthProvider>
  );
}

export default App;