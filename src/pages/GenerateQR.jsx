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
  const [hideQRprint, setHideQRprint] = useState(false)
  const [rows, setRows] = useState(8)
  const [cols, setCols] = useState(3)
  const [pages, setPages] = useState(1)
  const [committed, setCommitted] = useState(false)
  const URL = `${import.meta.env.VITE_BACKEND_URL}`

  useEffect(() => {
    if (readyToPrint && QRcodes) {
      try{
        reactToPrintFn()
        setReadyToPrint(false)
      } catch (error) {
        console.error("Failed to print QR codes")
        return
      }
      if(!committed){
        generateServerside(rows,cols,pages)
        setCommitted(true)
      }
    }
  }, [QRcodes, readyToPrint, reactToPrintFn]);

  const generateServerside = async (rows, cols, pages) => {
    await api.get(`/qr/generate/${rows*cols*pages}`,{withCredentials: true})
  }

  const getId = async () => {
   const req = await api.get('/qr/id',{withCredentials: true})
   return req
  }

  const generateQRprint = async () => {
    setCommitted(false)
    if (
      (pages && rows === 0 && cols === 0) ||
      (rows > 0 && cols > 0 && (pages || pages > 0))
    ) {
      let codes = [];
  
      const id = (await getId()).data._max.id || 0;
      const totalCodes = rows * cols * pages
  
      for (let i = id + 1; i <= id + totalCodes; i++) {
        codes.push(i);
      }
      setQRcodes(codes);
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
            <Typography variant="body1">Number of pages:</Typography>
            <TextField
              label="Number of codes: "
              variant="outlined"
              value={pages}
              margin='normal'
              slotProps={{ htmlInput: { 'type': 'number' } }}
              onChange={(e) => setPages(e.target.value)}
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
          <Button onClick={print}>Print and Commit</Button>
          <Button onClick={()=>{
            setShowAdvanced(!showAdvanced)
            showAdvanced?(setCols(3),setRows(8)):null
          }}>{showAdvanced?"Basic options":"Advanced options"}</Button>
          <Button onClick={()=>setHideQRprint(!hideQRprint)}>{hideQRprint?"Show QR print":"Hide QR print"}</Button>
        </Box>
      </Container>
      <QRprint ref={contentRef} URL={`${URL}/qr/`} QRcodes={QRcodes} row={rows} col={cols} hide={hideQRprint}/>
    </>
  )
}

export default GenerateQR;