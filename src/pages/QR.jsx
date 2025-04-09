import { useState, useEffect } from 'react';
import items from '../assets/fakeItems.json';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, FormControlLabel, Checkbox, IconButton, InputAdornment } from "@mui/material";
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
// import QRcodeScanner from '../components/QRcodeScanner';
import { Scanner } from '@yudiel/react-qr-scanner';
import CircularProgress from '@mui/material/CircularProgress';

function QR({ cameraOpen, notify }) {

  return (
    <div>
        <Scanner
          paused={!cameraOpen}
          onScan={(result) => notify(result[0].rawValue)}
        />
    </div>
  );
}

export default QR;