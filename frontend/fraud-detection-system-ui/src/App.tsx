import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import Chat from './pages/chatBot/Chat';
import Dashboard from './pages/dashBoard/Dashboard';
import Landing from './pages/landingPage/LandingPage';

function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/heimdall" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App()