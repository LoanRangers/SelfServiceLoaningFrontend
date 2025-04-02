
import './CreateItem.css';
import { useState } from 'react';
import { Box, Container, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Button, List, ListItem, ListItemText }    from '@mui/material';

function CreateLocation() {

    const [locationName, setLocationName] = useState('');
    const [locationDescription, setLocationDescription] = useState('');
    
    const [locationCreated, setLocationCreated] = useState(false);

    const handleCreateLocation = () => {
        setLocationCreated(true);
        const newLocation = {
            name: locationName,
            description: locationDescription,
        }
        console.log('Location created:', newLocation);
    }
    
    return (
        <>
            {!locationCreated ? (
                <Container maxWidth="xl" className="container">
                    <Box className="box">
                        <h2>Create a new location</h2>
                        <TextField
                            className='input'
                            label="Location name"
                            variant="filled"
                            fullWidth
                            margin="normal"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                        />
                        <TextField
                            className='input'
                            label="Location description"
                            variant="filled"
                            fullWidth
                            margin="normal"
                            value={locationDescription}
                            onChange={(e) => setLocationDescription(e.target.value)}
                        />
                        <Button 
                        variant="outlined" 
                        className='button' 
                        onClick={handleCreateLocation}
                        disabled={!locationName || !locationDescription}
                        >
                            Create location
                        </Button>
                    </Box>
                </Container>
         ): (
                <Container maxWidth="xl" className="container">
                    <Box className="box">
                        <h2>Location creation</h2>
                        <p>Location name: {locationName}</p>
                        <p>Location description: {locationDescription}</p>
                        <Button variant="outlined" className='button'>
                            Scan QR code
                        </Button>
                    </Box>
                </Container>
         )}
        
        </>
    )
}

export default CreateLocation