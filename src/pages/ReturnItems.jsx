import {useState, useEffect} from 'react';
import QRCodeScanner from './QRCodeScanner';
import {Container, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

import { useUser } from '../components/UserContext';

function ReturnItems() {
    const [allItems, setAllItems] = useState([])
    const [loanedItems, setLoanedItems] = useState([])
    const [scannedItems, setScannedItems] = useState([])
    const [allLocations, setAllLocations] = useState([])
    const [selectLocation, setSelectLocation] = useState(false)
    const [returnLocation, setReturnLocation] = useState('')
    const [confirmReturns, setConfirmReturns] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const {user} = useUser()

    useEffect(() => {
        async function fetchItems() {
            let req = await axios.get(`${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/items`);
            setAllItems(req.data)
        }
        fetchItems();
    }, [user, scannedItems])

    useEffect(() => {
        if(!!user){
          async function fetchLoanedItems(){
            const req = await axios.post(
              import.meta.env.VITE_BACKEND_URL + ':' + import.meta.env.VITE_BACKEND_PORT + '/items/currentlyloaned',
              {
                "page": 1, // duct tape coding
                "maxItems": 9999 // duct tape coding
              },
              {
                withCredentials: true
              }
            )
            setLoanedItems(req.data)
          }
          fetchLoanedItems()
        }
      }, [user, scannedItems])
    
      useEffect(() => {
        async function fetchLocations() {
          try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/locations`);
            setAllLocations(res.data);
          } catch (err) {
            console.error("Failed to fetch locations:", err);
          }
        }
        fetchLocations();
      }, []);

    const handleScan = (id) => {
        if (!selectLocation) {
            const item = allItems.find(item => item.id === id);
            if (item) {
                if (!item.isAvailable) {
                    if (scannedItems.some(scannedItem => scannedItem.item.id === id)) {
                        setSnackbarMessage(`Item already scanned.`)
                        setOpenSnackbar(true);
                    }
                    else if (loanedItems.some(loanedItem => loanedItem.item.id === id)) {
                        setScannedItems(items => [...items, loanedItems.find(loanedItem => loanedItem.item.id === id)]);
                    }
                    else {
                        setSnackbarMessage(`Item with ID ${id} is not loaned by ${user.nickname}.`)
                        setOpenSnackbar(true);
                    }
                    
                }
                else {
                    setSnackbarMessage(`Item with ID ${id} is not currently loaned by anyone.`)
                    setOpenSnackbar(true);
                }
            } 
            else {
                setSnackbarMessage(`Item with ID ${id} not found.`)
                setOpenSnackbar(true);
            }
        }
        else {
            //set the location of the returns
            // once location scan is possible, this needs to change
            if (allLocations.some(location => location.name === id)) {
                setReturnLocation(id)
                setConfirmReturns(true)
            }
            else {
                setSnackbarMessage(`Location with ID ${id} not found.`)
                console.log(allLocations)
                setOpenSnackbar(true)
            }
        }
    }

    const handleDelete = (id) => {
        setScannedItems(items => items.filter(item => item.id !== id))
    }

    const handleConfrimReturn = () => {
        const returnedItems = scannedItems.map(scannedItem => scannedItem.item.id)
        console.log('Return items:', returnedItems, 'to location:', returnLocation);
    }
    
    return (
        <div>
            <Container maxWidth="xl" sx={{ paddingTop: 4, paddingBottom: 10 }}>
                <Box className="loaning-box">
                    <h3>Return Items</h3>

                    <TableContainer component={Paper} className='table-container'>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>Loaned on</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {scannedItems.map((item) => (
                                    <TableRow key = {item.item.id}>
                                        <TableCell>{item.item.name}</TableCell>
                                        <TableCell>{item.loanedDate.toLocaleString()}</TableCell>
                                        <TableCell className='table-cell-small' align="center">
                                            <IconButton onClick={() => handleDelete(item.id)} sx={{ color: 'gray' }} disabled={selectLocation}>
                                                <DeleteIcon></DeleteIcon>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {selectLocation && !confirmReturns && (<p>Select the location by scanning the Location QR code</p>)}
                    
                    {scannedItems.length > 0 && !selectLocation ? (<Button variant='outlined' className='confirm-button' onClick={() => setSelectLocation(true)}>
                        Choose returning location
                    </Button>) : !selectLocation && (<p>No items selected</p>)}
                    {selectLocation && !confirmReturns && (
                        <Button variant='outlined' className='confirm-button' onClick={() => setSelectLocation(false)}>Scan more items</Button>
                    )}
                    {confirmReturns && (
                        <h4> Selected location: {returnLocation}</h4>
                    )}
                    {confirmReturns && (
                        <>
                            <Button variant='outlined' className='confirm-button' onClick={handleConfrimReturn}>
                                Confirm returns
                            </Button>
                            <Button variant='outlined' className='confirm-button' onClick={() => setConfirmReturns(false)}>
                                Back to scanning
                            </Button>
                        </>
                    )}

                </Box>
            </Container>
            <Snackbar
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={openSnackbar}
            action={
                <IconButton aria-label="close" color="inherit" onClick={() => setOpenSnackbar(false)} sx={{ p: 0 }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
            message={snackbarMessage}
            onClose={() => setOpenSnackbar(false)}
            />

            <QRCodeScanner className="qr-code-scanner" />

            {/* test buttons, remove when qr reading is possible */}
            <Button variant='outlined' className='confirm-button' onClick={() => handleScan("a4edf3f6-0fc3-4fb9-926a-58829227a3cd")}>
                loaned item
            </Button>
            <Button variant='outlined' className='confirm-button' onClick={() => handleScan("1bae4dcf-0634-4ec9-bbb2-102b26d86fd9")}>
                available item (not loaned)
            </Button>
            <Button variant='outlined' className='confirm-button' onClick={() => handleScan("ffd9437d-29bf-48ca-923a-e5faf0ab45d9")}>
                Loaned by someone else
            </Button>
            <Button variant='outlined' className='confirm-button' onClick={() => handleScan("1234")}>
                not item
            </Button>
            <Button variant='outlined' className='confirm-button' onClick={() => handleScan("asd")}>
                scan location
            </Button>
        </div>
    )
}

export default ReturnItems