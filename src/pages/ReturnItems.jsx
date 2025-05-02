import { useState, useEffect } from 'react';
import QRCodeScanner from './QRCodeScanner';
import {
  Container,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import api from '../services/APIservice';
import { useUser } from '../components/UserContext';

function ReturnItems() {
  const [allItems, setAllItems] = useState([]);
  const [loanedItems, setLoanedItems] = useState([]);
  const [scannedItems, setScannedItems] = useState([
    {
      item: {
        id: 'test-item-id',
        name: 'Test Item',
      },
      loanedDate: new Date(), // Current date for testing
    },
  ]);
  const [allLocations, setAllLocations] = useState([]);
  const [selectLocation, setSelectLocation] = useState(false);
  const [returnLocation, setReturnLocation] = useState('');
  const [confirmReturns, setConfirmReturns] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openFlagDialog, setOpenFlagDialog] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState('');
  const [flagComment, setFlagComment] = useState('');
  const [itemToFlag, setItemToFlag] = useState(null);
  const [predefinedFlags, setPredefinedFlags] = useState([]); // Dynamically fetched flags
  const { user } = useUser();

  useEffect(() => {
    async function fetchItems() {
      let req = await api.get(`/items`);
      setAllItems(req.data);
    }
    fetchItems();
  }, [user, scannedItems]);

  useEffect(() => {
    if (!!user) {
      async function fetchLoanedItems() {
        const req = await api.post(
          '/items/currentlyloaned',
          {
            page: 1, // duct tape coding
            maxItems: 9999, // duct tape coding
          },
          {
            withCredentials: true,
          }
        );
        setLoanedItems(req.data);
      }
      fetchLoanedItems();
    }
  }, [user, scannedItems]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await api.get(`/locations`);
        setAllLocations(res.data);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
      }
    }
    fetchLocations();
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
    if (!selectLocation) {
      const item = allItems.find((item) => item.id === id);
      if (item) {
        if (!item.isAvailable) {
          if (scannedItems.some((scannedItem) => scannedItem.item.id === id)) {
            setSnackbarMessage(`Item already scanned.`);
            setOpenSnackbar(true);
          } else if (loanedItems.some((loanedItem) => loanedItem.item.id === id)) {
            setScannedItems((items) => [...items, loanedItems.find((loanedItem) => loanedItem.item.id === id)]);
          } else {
            setSnackbarMessage(`Item with ID ${id} is not loaned by ${user.nickname}.`);
            setOpenSnackbar(true);
          }
        } else {
          setSnackbarMessage(`Item with ID ${id} is not currently loaned by anyone.`);
          setOpenSnackbar(true);
        }
      } else {
        setSnackbarMessage(`Item with ID ${id} not found.`);
        setOpenSnackbar(true);
      }
    } else {
      if (allLocations.some((location) => location.name === id)) {
        setReturnLocation(id);
        setConfirmReturns(true);
      } else {
        setSnackbarMessage(`Location with ID ${id} not found.`);
        setOpenSnackbar(true);
      }
    }
  };

  const handleDelete = (id) => {
    setScannedItems((items) => items.filter((item) => item.id !== id));
  };

  const handleConfrimReturn = () => {
    const returnedItems = scannedItems.map((scannedItem) => scannedItem.item.id);
    console.log('Return items:', returnedItems, 'to location:', returnLocation);
  };

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
    if (!selectedFlag || !flagComment.trim()) {
      alert('Please select a flag and add a comment.');
      return;
    }
  
    try {
      const response = await api.post('/flags', {
        itemId: itemToFlag.item.id, // ID of the flagged item
        flagName: selectedFlag, // Selected flag name
        comment: flagComment.trim(), // Comment added by the user
      });
  
      alert('Item flagged successfully.');
      console.log('Flag response:', response.data);
      handleCloseFlagDialog();
    } catch (error) {
      console.error('Error flagging item:', error);
      alert('Failed to flag the item.');
    }
  };

  return (
    <div>
      <Container maxWidth="xl" sx={{ paddingTop: 4, paddingBottom: 10 }}>
        <Box className="loaning-box">
          <h3>Return Items</h3>

          <TableContainer component={Paper} className="table-container">
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
                  <TableRow key={item.item.id}>
                    <TableCell>{item.item.name}</TableCell>
                    <TableCell>{item.loanedDate.toLocaleString()}</TableCell>
                    <TableCell className="table-cell-small" align="center">
                      <IconButton onClick={() => handleDelete(item.id)} sx={{ color: 'gray' }} disabled={selectLocation}>
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

          {selectLocation && !confirmReturns && <p>Select the location by scanning the Location QR code</p>}

          {scannedItems.length > 0 && !selectLocation ? (
            <Button variant="outlined" className="confirm-button" onClick={() => setSelectLocation(true)}>
              Choose returning location
            </Button>
          ) : (
            !selectLocation && <p>No items selected</p>
          )}
          {selectLocation && !confirmReturns && (
            <Button variant="outlined" className="confirm-button" onClick={() => setSelectLocation(false)}>
              Scan more items
            </Button>
          )}
          {confirmReturns && <h4> Selected location: {returnLocation}</h4>}
          {confirmReturns && (
            <>
              <Button variant="outlined" className="confirm-button" onClick={handleConfrimReturn}>
                Confirm returns
              </Button>
              <Button variant="outlined" className="confirm-button" onClick={() => setConfirmReturns(false)}>
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
    </div>
  );
}

export default ReturnItems;