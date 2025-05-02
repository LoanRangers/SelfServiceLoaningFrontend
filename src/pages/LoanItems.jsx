import {useState, useEffect} from 'react';
import QRCodeScanner from './QRCodeScanner';
import {Container, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import api from '../services/APIservice';

function LoanItems() {
    const [allItems, setAllItems] = useState([])
    const [scannedItems, setScannedItems] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        async function fetchItems() {
            let req = await api.get(`/items`);
            setAllItems(req.data)
        }
        fetchItems();
      }, [])

    const handleScan = (id) => {
        const item = allItems.find(item => item.id === id);
        if (item) {
            if (item.isAvailable) {
                if (scannedItems.some(scannedItem => scannedItem.id === id)) {
                    setSnackbarMessage(`Item already scanned.`)
                    setOpenSnackbar(true);
                }
                else {
                    setScannedItems(items => [...items, item]);
                }
                
            }
            else {
                setSnackbarMessage(`Item with ID ${id} is currently loaned out.`)
                setOpenSnackbar(true);
            }
        } 
        else {
            setSnackbarMessage(`Item with ID ${id} not found.`)
            setOpenSnackbar(true);
        }
    }

    const handleQR = (qr) => {
        console.log(qr)
        //check the backend for the item with the qr code
        //then call handleScan with the id of the item
    }

    const handleDelete = (id) => {
        setScannedItems(items => items.filter(item => item.id !== id))
    }

    const handleConfrimLoan = () => {
        console.log('Loan items:', scannedItems);
        //todo: send loan request to backend
    }
    
    return (
        <div>
            <Container maxWidth="xl" sx={{ paddingTop: 4, paddingBottom: 10 }}>
                <Box className="loaning-box">
                    <h3>Loan Items</h3>

                    <TableContainer component={Paper} className='table-container'>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {scannedItems.map((item) => (
                                    <TableRow key = {item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.categoryName}</TableCell>
                                        <TableCell className='table-cell-small' align="center">
                                            <IconButton onClick={() => handleDelete(item.id)} sx={{ color: 'gray' }}>
                                                <DeleteIcon></DeleteIcon>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    {scannedItems.length > 0 ? (<Button variant='outlined' className='confirm-button' onClick={handleConfrimLoan}>
                        Confirm loaned items
                    </Button>) : <p>No items selected</p>}
                    
                    <QRCodeScanner className="qr-code-scanner" handleScan={handleQR}/>
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


            {/*test buttons, remove when qr reading is possible*/}
            <Button variant='outlined' className='confirm-button' onClick={() => handleScan("ffa4078c-5433-4af3-a13f-7b3e8fecea39")}>
                available item 1
            </Button>
            <Button variant='outlined' className='confirm-button' onClick={() => handleScan("1bae4dcf-0634-4ec9-bbb2-102b26d86fd9")}>
                available item 2
            </Button>
            <Button variant='outlined' className='confirm-button' onClick={() => handleScan("ffd9437d-29bf-48ca-923a-e5faf0ab45d9")}>
                unavailable item
            </Button>
            <Button variant='outlined' className='confirm-button' onClick={() => handleScan("1234")}>
                not item
            </Button>
        </div>
    )
}

export default LoanItems