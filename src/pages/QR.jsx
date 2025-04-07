import { useState } from 'react';
import items from '../assets/fakeItems.json';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, FormControlLabel, Checkbox, IconButton, InputAdornment } from "@mui/material";
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
// import QRcodeScanner from '../components/QRcodeScanner';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ToastContainer, toast } from 'react-toastify';

function QR() {

  /* Topias' old implementation
  const [mode, setMode] = useState("Loaning")
  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    const url = new URL(decodedText)
    if(url.origin=="http://localhost:5173"){
      console.log(url.origin)
    }
  };

  return (
    <div>
      <ToastContainer />
      <Scanner onScan={(result) => notify(result[0].rawValue)} />
      <button onClick={() => notify("hello")}>Notify !</button>
    </div>
  );
  */

  const notify = (message) => {
    console.log(message);
    toast(message);
  }
  return (
    <div>
      <ToastContainer />
      <Scanner 
        onScan={(result) => notify(result[0].rawValue)}
      />
      <button onClick={() => notify("hello")}>Notify !</button>
    </div>
  );
}

export default QR;