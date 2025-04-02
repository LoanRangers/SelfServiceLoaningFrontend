import './App.css'
import Home from './pages/Home'
import Drawer from './pages/Drawer'
import ItemPage from './pages/ItemPage';
import CreateItem from './pages/CreateItem';
import CreateLocation from './pages/CreateLocation';

import { useState } from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { IconButton, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const [LoggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true)
  }

  const handleLogout = () => {
    setLoggedIn(false)
  }

  return (
    <div>
      <IconButton className='drawer-button' onClick={handleDrawerOpen} sx={{ color: 'white' }}>
        <MenuIcon />
      </IconButton>
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        LoggedIn={LoggedIn}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        user = {"User Name"}
      />
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1>UTU Self Loaning System</h1>
      </Link>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemPage LoggedIn={LoggedIn} handleLogin={handleLogin}/>} />
        <Route path="/CreateItem" element={<CreateItem />} />
        <Route path="/CreateLocation" element={<CreateLocation/>} />
      </Routes>
    </div>
  )
}

export default App