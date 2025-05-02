import { Box, Button, Container, TextField, Typography, Stack } from '@mui/material';
import QRprint from "../components/QRprint"
import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import api from '../services/APIservice';

function GenerateQR() {
  const contentRef = useRef("");
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [QRcodes, setQRcodes] = useState(null)
  const [readyToPrint, setReadyToPrint] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showQRprint, setShowQRprint] = useState(true)
  const [rows, setRows] = useState(0)
  const [cols, setCols] = useState(0)
  const [pages, setPages] = useState(1)
  const URL = `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}`
  const [count, setCount] = useState("");

  useEffect(() => {
    if (readyToPrint && QRcodes) {
      reactToPrintFn()
      setReadyToPrint(false)
    }
  }, [QRcodes, readyToPrint, reactToPrintFn]);

  const generateQRprint = async () => {
    if(count&&rows==0&&cols==0||rows>0&&cols>0&(!count||!count>0)){
      if (!QRcodes) {
        const req = count?await api.get(`/qrCodes/generate/${count}`,
        {withCredentials: true}):
        await api.get(`/qrCodes/generate/${rows*cols*pages}`,
          {withCredentials: true})
        setQRcodes(req.data)
        console.log(req.data)
      }
    }
  }

  const print = () => {
    setReadyToPrint(true)
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ paddingTop: 4, paddingBottom: 10 }}>
        <Box className="loaning-box">
          <h3>Generate QR-codes</h3>
          {!showAdvanced&&
          <Stack direction="row" spacing={2}>
            <Typography variant="body1">Number of codes:</Typography>
            <TextField
              label="Number of codes: "
              variant="outlined"
              value={count}
              margin='normal'
              slotProps={{ htmlInput: { 'type': 'number' } }}
              onChange={(e) => setCount(e.target.value)}
              style={{ flex: 1, margin: '0 1rem' }}
            />
          </Stack>}
          {showAdvanced&&
          <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2}>
              <Typography variant="body1">Number of rows:</Typography>
              <TextField
                label="Number of rows: "
                helperText="Default amount of rows is 8"
                variant="outlined"
                value={rows}
                margin='normal'
                slotProps={{ htmlInput: { 'type': 'number' } }}
                onChange={(e) => setRows(e.target.value)}
                style={{ flex: 1, margin: '0 1rem' }}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography variant="body1">Number of columns:</Typography>
              <TextField
                label="Number of columns: "
                helperText="Default amount of columns is 3"
                variant="outlined"
                value={cols}
                margin='normal'
                slotProps={{ htmlInput: { 'type': 'number' } }}
                onChange={(e) => setCols(e.target.value)}
                style={{ flex: 1, margin: '0 1rem' }}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography variant="body1">Number of pages:</Typography>
              <TextField
                label="Number of pages: "
                helperText="Default amount of pages is 1"
                variant="outlined"
                value={pages}
                margin='normal'
                slotProps={{ htmlInput: { 'type': 'number' } }}
                onChange={(e) => setPages(e.target.value)}
                style={{ flex: 1, margin: '0 1rem' }}
              />
            </Stack>
          </Stack>}
          <Button onClick={generateQRprint}>Generate</Button>
          <Button onClick={print}>Print</Button>
          <Button onClick={()=>setQRcodes(null)}>Reset</Button>
          <Button onClick={()=>{
            setShowAdvanced(!showAdvanced)
            showAdvanced?(setCols(0),setRows(0)):setCount("")
          }}>{showAdvanced?"Basic options":"Advanced options"}</Button>
          <Button onClick={()=>setShowQRprint(!showQRprint)}>{showQRprint?"Show QR print":"Hide QR print"}</Button>
        </Box>
      </Container>
      <QRprint ref={contentRef} URL={`${URL}/qr/`} QRcodes={QRcodes} row={rows?rows:8} col={cols?cols:3} show={showQRprint}/>
    </>
  )
}

export default GenerateQR;