import { useState } from 'react';
import QR from './QR';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import { Box, Button, IconButton, Modal } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function QRCodeScanner() {
    
    const [cameraOpen, setCameraOpen] = useState(false);
    const handleCameraOpen = () => {
        setCameraOpen(true);
    }
    const handleCameraClose = () => {
        setCameraOpen(false);
    }

    const notify = (message) => {
    console.log(message);
    toast(message);
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
            position: 'fixed', 
            bottom: 0, 
            width: '100%', 
            padding: '20px', 
            textAlign: 'center', 
            backgroundColor: '#20374e', 
            height: 'calc(48px * 2)',
            zIndex: 1001 // Add high z-index to ensure it's on top of everything
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
                    <QR cameraOpen={cameraOpen} notify={notify} />
                    <Button onClick={handleCameraClose}>Close</Button>
                </Box>
            </Modal>          
            <ToastContainer />
        </div>
    )   
}

export default QRCodeScanner