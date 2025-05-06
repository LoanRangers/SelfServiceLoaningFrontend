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
    const [readQR, setReadQR] = useState(false);
    const [successfulCreation, setSuccessfulCreation] = useState(false);

    const handleCreateLocation = async (qr) => {
        const newLocation = {
            name: locationName.trim(),
            description: locationDescription.trim(),
            qr: parseInt(qr),
        };
    
        try {
            const response = await api.post(
                `/locations`,
                newLocation,
                { withCredentials: true }
            );
            console.log('Location created:', response.data);
            setLocationCreated(true);
            setReadQR(false)
            setSuccessfulCreation(true);
        } catch (error) {
            console.error('Error creating location:', error);
            setErrorMessage(error.response?.data?.error || 'Failed to create location');
        }
    };

    const handleScan = (qr) => {
        console.log(qr);
        handleCreateLocation(qr)
    
    }

    return (
        <>
            {!locationCreated && !readQR && (
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
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        <Button
                            variant="outlined"
                            className="button"
                            onClick={() => setReadQR(true)}
                            disabled={!locationName.trim()}
                        >
                            Assign QR code
                        </Button>
                    </Box>
                </Container>
            )}
            {readQR && (
                <Container maxWidth="xl" className="container">
                    <Box className="box">
                        <h2>Assign QR code for</h2>
                        <p>{locationName}</p>
                        <Button variant="outlined" className="create-button" onClick={() => setReadQR(false)}>
                            Edit location name
                        </Button>
                        <QRCodeScanner className="qr-code-scanner" handleScan={handleScan} />
                    </Box>
                </Container>
            )}
            {successfulCreation && (
                <Container maxWidth="xl" className="container">
                    <Box className="box">
                        <h2>Location {locationName} created successfully!</h2>
                    </Box>
                </Container>
            )}
        </>
    );
}

export default CreateLocation;