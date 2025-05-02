import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import './GenerateQR.css'; // Import the CSS file for print-specific styling

function GenerateQR() {
  const [number, setNumber] = useState('');
  const [qrCodes, setQrCodes] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false); // Tracks if QR codes are generated

  const handleGenerate = async () => {
    if (!isNaN(number) && number > 0) {
      // Generate QR codes with GUIDs as IDs
      const codes = Array.from({ length: Number(number) }, (_, i) => ({
        guid: crypto.randomUUID(), // Generate a GUID for each QR code
        name: `QR Code ${i + 1}`, // Name for the QR code
      }));
      setQrCodes(codes);
      setIsGenerated(true);

      // Send QR codes to the backend
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/qrcodes`,
          codes, // Send the array of QR codes
          { withCredentials: true }
        );
        console.log('QR codes saved to the database:', response.data);
      } catch (error) {
        console.error('Error saving QR codes:', error);
      }
    } else {
      alert('Please enter a valid number greater than 0.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(qrCodes, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'qrcodes.json';
    link.click();
  };

  const handleReset = () => {
    setNumber('');
    setQrCodes([]);
    setIsGenerated(false);
  };

  const handlePrint = () => {
    window.print(); // Trigger the browser's print dialog
  };

  // Ensure the grid always has 20 cells
  const gridItems = [...qrCodes];
  while (gridItems.length < 20) {
    gridItems.push({ guid: null, name: null }); // Add placeholders for empty cells
  }

  return (
    <Container
      maxWidth="sm"
      style={{
        marginTop: '2rem',
        overflow: 'hidden', // Hide the scrollbar
      }}
    >
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <Typography variant="h4">Generate</Typography>
        <TextField
          label="Enter a number"
          variant="outlined"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={{ flex: 1, margin: '0 1rem' }}
        />
        <Typography variant="h4">QR Codes</Typography>
      </Box>

      <Box
        className="print-grid" // Ensure this class is applied
        style={{
          marginTop: '1rem',
          display: 'grid',
          gridTemplateColumns: `repeat(4, 1fr)`, // 4 columns for printing
          gap: '10px',
          justifyContent: 'center',
        }}
      >
        {gridItems.map((code, index) => (
          <Box key={index} style={{ textAlign: 'center' }}>
            {code.guid ? (
              <>
                <QRCode value={code.guid} size={128} />
                <Typography variant="body2">{code.name}</Typography>
              </>
            ) : (
              <div className="placeholder"></div> // Placeholder for empty cells
            )}
          </Box>
        ))}
      </Box>

      <Box
        style={{
          marginTop: '2rem',
          textAlign: 'center',
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={isGenerated ? handleReset : handleGenerate}
        >
          {isGenerated ? 'Reset' : 'Generate'}
        </Button>
        {isGenerated && (
          <>
            <Button variant="contained" color="secondary" onClick={handleDownload}>
              Download QR Codes
            </Button>
            <Button variant="contained" color="success" onClick={handlePrint}>
              Print QR Codes
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}

export default GenerateQR;