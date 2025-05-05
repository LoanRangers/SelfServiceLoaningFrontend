import { useState } from 'react';
import QR from './QR';
import api from '../services/APIservice';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import { Box, Button, IconButton, Modal } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function QRCodeScanner({handleScan}) {
    
    const [cameraOpen, setCameraOpen] = useState(false);
    const handleCameraOpen = () => {
        setCameraOpen(true);
    }
    const handleCameraClose = () => {
        setCameraOpen(false);
    }

    const handleQR = (message) => {

        if (message.includes(api.defaults.baseURL + '/qr/')) {
            const trimmedMessage = message.replace(api.defaults.baseURL + '/qr/', '');
            setCameraOpen(false);
            handleScan(trimmedMessage)
        } 
        else 
        {
            toast.error(message);
        }
    };



    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 400,
        bgcolor: 'background.black',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        zIndex: 9999
      };

    return(
        <div>  
            <Box sx={{ 
            padding: '20px', 
            textAlign: 'center'
            }}>
                <IconButton className='scanner-button' onClick={handleCameraOpen} sx={{ color: 'white', fontSize: 'large'}}>
                    <QrCodeScannerRoundedIcon sx={{ fontSize: 'large' }} />
                </IconButton>
            </Box>
            <Modal
            open={cameraOpen}
            onClose={handleCameraClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box style={style}>
                    <QR cameraOpen={cameraOpen} notify={handleQR} />
                    <Button onClick={handleCameraClose}>Close</Button>
                </Box>
            </Modal>          
            <ToastContainer />
        </div>
    )   
}

export default QRCodeScanner