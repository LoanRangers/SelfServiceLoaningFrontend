import './App.css'
import Home from './pages/Home'
import Drawer from './pages/Drawer'
import ItemPage from './pages/ItemPage';
import CreateItem from './pages/CreateItem';
import CreateLocation from './pages/CreateLocation';
import QR from './pages/QR';
import LoaningHistory from './pages/LoaningHistory';
import AuditLog from './pages/AuditLog';
import GenerateQR from './pages/GenerateQR';

import { useUser } from "./components/UserContext";

import { Fragment, forwardRef, useState, useEffect} from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { IconButton, } from '@mui/material';
import { Button, Modal, Box, Typography, Slide } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const {user, setUser} = useUser();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + ':' + import.meta.env.VITE_BACKEND_PORT + '/auth/me', { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch((error) => console.error("User fetch error:", error));
  }, []);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    bgcolor: 'background.black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    zIndex: 9999
  };

  const handleCameraOpen = () => {
    setCameraOpen(true);
  }

  const handleCameraClose = () => {
    setCameraOpen(false);
  }

  const handleLogin = () => {
    window.location.href = import.meta.env.VITE_BACKEND_URL + ':' + import.meta.env.VITE_BACKEND_PORT + '/auth/gitlab';
  }

  const handleLogout = async () => {
    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + ':' + import.meta.env.VITE_BACKEND_PORT + '/auth/logout', {}, { withCredentials: true });
      setUser(null); // Remove user from state
      console.log("Logout successful!");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  const notify = (message) => {
    console.log(message);
    toast(message);
  };

  return (
    <div>
      <>
        <Box sx={{ 
          position: 'fixed', 
          bottom: 0, 
          width: '100%', 
          padding: '20px', 
          textAlign: 'center', 
          backgroundColor: '#20374e', 
          height: 'calc(48px * 2)',
          zIndex: 1001 // Add high z-index to ensure it's on top of everything
        }}>
          <IconButton className='scanner-button' onClick={handleCameraOpen} sx={{ color: 'white', fontSize: 'large'}}>
            <QrCodeScannerRoundedIcon sx={{ fontSize: 'large' }} />
          </IconButton>
        </Box>
        <Modal
          open={cameraOpen}
          onClose={handleCameraClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box style={style}>
            <QR cameraOpen={cameraOpen} notify={notify} />
            <Button onClick={handleCameraClose}>Close</Button>
          </Box>
        </Modal>          
      </>
      <ToastContainer />
      <IconButton className='drawer-button' onClick={handleDrawerOpen} sx={{ color: 'white' }}>
        <MenuIcon />
      </IconButton>
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        user={user}
      />
      
      <Box sx={{ 
        overflowY: 'auto',
        paddingBottom: '96px' // Add padding to account for the bottom bar
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>UTU Self Loaning System</h1>
        </Link>
        <Routes>
          <Route path='/' />
          <Route path='/auditlog' element={<AuditLog />} />
          <Route path='/loaninghistory' element={<LoaningHistory />} />
          <Route exact path="/rooms" element={<Home />} />
          <Route path="/CreateItem" element={<CreateItem />} />
          <Route path="/CreateLocation" element={<CreateLocation/>} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/generateqr" element={<GenerateQR />} />
        </Routes>
      </Box>
    </div>
  )
}

export default App