import { useState } from 'react';
import items from '../assets/fakeItems.json';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, FormControlLabel, Checkbox, IconButton, InputAdornment } from "@mui/material";
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import QRcodeScanner from '../components/QRcodeScanner';

function QR() {

  const [mode, setMode] = useState("Loaning")
  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    const url = new URL(decodedText)
    if(url.origin=="http://localhost:5173"){
      console.log(url.origin)
    }
  };

  return (
    <>
        <h1>Setup QR-code reading here!</h1>
        <QRcodeScanner qrCodeSuccessCallback={qrCodeSuccessCallback} />
    </>
  );
}

export default QR;