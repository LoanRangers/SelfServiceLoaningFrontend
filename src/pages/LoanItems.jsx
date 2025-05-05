import { useState, useEffect } from 'react';
import QRCodeScanner from './QRCodeScanner';
import { Container, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import api from '../services/APIservice';
import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, TextField } from '@mui/material';

function LoanItems(user) {
    const [events, setEvents] = useState([]);
    const [allItems, setAllItems] = useState([])
    const [scannedItems, setScannedItems] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openFlagDialog, setOpenFlagDialog] = useState(false);
    const [selectedFlag, setSelectedFlag] = useState('');
    const [flagComment, setFlagComment] = useState('');
    const [itemToFlag, setItemToFlag] = useState(null);
    const [predefinedFlags, setPredefinedFlags] = useState([]);

    useEffect(() => {
        async function fetchItems() {
            try {
                const req = await api.get(`/items`);
                setAllItems(req.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        }
        fetchItems();
    }, []);

    useEffect(() => {
        async function fetchFlags() {
            try {
                const response = await api.get('/flags');
                setPredefinedFlags(response.data.map((flag) => flag.name)); // Extract flag names
            } catch (error) {
                console.error('Error fetching flags:', error);
            }
        }
        fetchFlags();
    }, []);

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

    const handleConfirmLoan = () => {
        console.log('Loan items:', scannedItems);
        //todo: send loan request to backend
    }

    const handleOpenFlagDialog = (item) => {
        setItemToFlag(item);
        setOpenFlagDialog(true);
    };

    const handleCloseFlagDialog = () => {
        setOpenFlagDialog(false);
        setSelectedFlag('');
        setFlagComment('');
    };

    const handleSubmitFlag = async () => {
        if (!selectedFlag || !flagComment.trim() || !itemToFlag?.id) {
            alert('Please select a flag, add a comment, and ensure the item ID is valid.');
            return;
        }

        const flagData = {
            flagName: selectedFlag.trim(),
            itemId: itemToFlag.id.trim(),
        };

        try {
            console.log('Sending flag data to backend:', flagData); // Debugging

            // Call the backend to add the flag to the item
            const response = await api.post('/flags/items', flagData, { withCredentials: true });

            console.log('Backend response:', response.data); // Debugging

            setSelectedFlag('');
            setFlagComment('');
            handleCloseFlagDialog();
            alert('Item flagged successfully.');
        } catch (error) {
            console.error('Error flagging item:', error);

            // Handle specific backend errors
            if (error.response?.data?.error) {
                alert(`Error: ${error.response.data.error}`);
            } else {
                alert('Failed to flag the item. Please try again.');
            }
        }
    };

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
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.categoryName}</TableCell>
                                        <TableCell className="table-cell-small" align="center">
                                            <IconButton onClick={() => handleDelete(item.id)} sx={{ color: 'gray' }}>
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenFlagDialog(item)} sx={{ color: 'orange' }}>
                                                <span role="img" aria-label="flag">
                                                    🚩
                                                </span>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {scannedItems.length > 0 ? (<Button variant='outlined' className='confirm-button' onClick={handleConfirmLoan}>
                        Confirm loaned items
                    </Button>) : <p>No items selected</p>}

                    <QRCodeScanner className="qr-code-scanner" handleScan={handleQR} />
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

            <Dialog open={openFlagDialog} onClose={handleCloseFlagDialog}>
                <DialogTitle>Flag Item</DialogTitle>
                <DialogContent>
                    <Select
                        fullWidth
                        value={selectedFlag}
                        onChange={(e) => setSelectedFlag(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            Select a flag
                        </MenuItem>
                        {predefinedFlags.map((flag) => (
                            <MenuItem key={flag} value={flag}>
                                {flag}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        fullWidth
                        multiline
                        margin="normal"
                        label="Add a comment"
                        value={flagComment}
                        onChange={(e) => setFlagComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFlagDialog}>Cancel</Button>
                    <Button onClick={handleSubmitFlag} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
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