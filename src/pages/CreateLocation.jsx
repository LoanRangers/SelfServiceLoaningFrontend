import './CreateItem.css';
import { useState } from 'react';
import { Box, Container, TextField, Button } from '@mui/material';
import api from '../services/APIservice';
import QRCodeScanner from './QRCodeScanner';

function CreateLocation() {
    const [locationName, setLocationName] = useState('');
    const [locationDescription, setLocationDescription] = useState('');
    const [locationCreated, setLocationCreated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateLocation = async () => {
        const newLocation = {
            name: locationName.trim(),
            description: locationDescription.trim(),
        };
    
        try {
            const response = await api.post(
                `/locations`,
                newLocation,
                { withCredentials: true }
            );
            console.log('Location created:', response.data);
            setLocationCreated(true);
        } catch (error) {
            console.error('Error creating location:', error);
            setErrorMessage(error.response?.data?.error || 'Failed to create location');
        }
    };

    const handleScan = (qr) => {
        console.log(qr);
        //check the backend for the item with the qr code
        //then call handleScan with the id of the item
    
    }

    return (
        <>
            {!locationCreated ? (
                <Container maxWidth="xl" className="container">
                    <Box className="box">
                        <h2>Create a new location</h2>
                        <TextField
                            className="input"
                            label="Location name"
                            variant="filled"
                            fullWidth
                            margin="normal"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                        />
                        <TextField
                            className="input"
                            label="Location description"
                            variant="filled"
                            fullWidth
                            margin="normal"
                            value={locationDescription}
                            onChange={(e) => setLocationDescription(e.target.value)}
                        />
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        <QRCodeScanner className="qr-code-scanner" />
                        <Button
                            variant="outlined"
                            className="button"
                            onClick={handleCreateLocation}
                            disabled={!locationName.trim() || !locationDescription.trim()}
                        >
                            Create location
                        </Button>
                    </Box>
                </Container>
            ) : (
                <Container maxWidth="xl" className="container">
                    <Box className="box">
                        <h2>Location created</h2>
                        <p>Location name: {locationName}</p>
                        <p>Location description: {locationDescription}</p>
                    </Box>
                </Container>
            )}
        </>
    );
}

export default CreateLocation;