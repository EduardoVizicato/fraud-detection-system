import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import "./App.css";
import Landing from "./pages/landingPage/LandingPage";
import Dashboard from "./pages/dashBoard/Dashboard";
import RequireAuth from "./pages/auth/validation/requireAuth";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import MarketingLayout from "./pages/routes/MarketingLayout";
import OverviewHeimdall from "./pages/overview/heimdall/OverviewHeimdall";
import OverviewDashboard from "./pages/overview/dashboard/OverviewDashboard";
import AppLayout from "./pages/routes/AppLayout";
import OverviewWhatWeDo from "./pages/overview/aboutUs/OverviewWhatWeDo";
import Chat from "./pages/chatBot/Chat";


const RootLayout = () => <Outlet />;

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
        <BrowserRouter>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/overview/heimdall" element={<OverviewHeimdall />} />
          <Route path="/overview/dashboard" element={<OverviewDashboard />} />
          <Route path="/overview/o-que-fazemos" element={<OverviewWhatWeDo />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<RequireAuth />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
