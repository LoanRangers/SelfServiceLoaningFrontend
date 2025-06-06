import './App.css'
import Drawer from './pages/Drawer'
import ItemPage from './pages/ItemPage';
import CreateItem from './pages/CreateItem';
import CreateLocation from './pages/CreateLocation';
import ItemSearch from './pages/ItemSearch';
import LoaningHistory from './pages/LoaningHistory';
import AuditLog from './pages/AuditLog';
import GenerateQR from './pages/GenerateQR';
import Help from './pages/Help';
import FrontPage from './pages/FrontPage';
import LoanItems from './pages/LoanItems';
import ReturnItems from './pages/ReturnItems';

import { useUser } from "./components/UserContext";

import { Fragment, forwardRef, useState, useEffect} from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { IconButton, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import api from './services/APIservice';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {user, setUser} = useUser();

  useEffect(() => {
    api
      .get('/auth/me', { withCredentials: true })
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
    window.location.href = import.meta.env.VITE_BACKEND_URL + '/auth/gitlab';
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
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
        user={user}
      />
    
      <Link to="/SelfServiceLoaningFrontend/" style={{ textDecoration: 'none' }}>
        <h1>UTU Self Loaning System</h1>
      </Link>
      <Routes>
        <Route path='/SelfServiceLoaningFrontend/' element={<FrontPage user={user} handleLogin={handleLogin}/>} />
        <Route path='/SelfServiceLoaningFrontend/qr/:id' element={<LoanItems />} />
        <Route path='/SelfServiceLoaningFrontend/loan' element={<LoanItems />} />
        <Route path='/SelfServiceLoaningFrontend/return' element={<ReturnItems />} />
        <Route path='/SelfServiceLoaningFrontend/auditlog' element={<AuditLog />} />
        <Route path='/SelfServiceLoaningFrontend/loaninghistory' element={<LoaningHistory />} />
        <Route exact path="/SelfServiceLoaningFrontend/browse" element={<ItemSearch />} />
        <Route path="/SelfServiceLoaningFrontend/CreateItem" element={<CreateItem />} />
        <Route path="/SelfServiceLoaningFrontend/CreateLocation" element={<CreateLocation/>} />
        <Route path="/SelfServiceLoaningFrontend/item/:id" element={<ItemPage />} />
        <Route path="/SelfServiceLoaningFrontend/generateqr" element={<GenerateQR />} />
      </Routes>
      <Help />
    </div>
  )
}

export default App