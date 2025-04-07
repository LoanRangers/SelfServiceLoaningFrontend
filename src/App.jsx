import './App.css'
import Home from './pages/Home'
import Drawer from './pages/Drawer'
import ItemPage from './pages/ItemPage';
import CreateItem from './pages/CreateItem';
import CreateLocation from './pages/CreateLocation';
import QR from './pages/QR';
import LoaningHistory from './pages/LoaningHistory';

import { useUser } from "./components/UserContext";

import { useState, useEffect} from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { IconButton, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {user, setUser} = useUser();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/me", { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch((error) => console.error("User fetch error:", error));
  }, []);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  

  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/gitlab";
  }

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
      setUser(null); // Remove user from state
      console.log("Logout successful!");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <div>
      <IconButton className='drawer-button' onClick={handleDrawerOpen} sx={{ color: 'white' }}>
        <MenuIcon />
      </IconButton>
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        user = {user}
      />
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1>UTU Self Loaning System</h1>
      </Link>
      <Routes>
        <Route exact path='/' element={<QR />} />
        <Route path='/loaninghistory' element={<LoaningHistory />} />
        <Route exact path="/rooms" element={<Home />} />
        <Route path="/CreateItem" element={<CreateItem />} />
        <Route path="/CreateLocation" element={<CreateLocation/>} />
        <Route path="/item/:id" element={<ItemPage />} />
      </Routes>
    </div>
  )
}

export default App