import React, {useState} from 'react'
import {useLocation} from 'react-router-dom'
import Qrhelp from '../assets/qr-reading'
import {Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Createitemhelp from '../assets/Createitemhelp'
import Loaninghistoryhelp from '../assets/Loaninghistoryhelp'
import Roomshelp from '../assets/Roomshelp'
import CreateLocationhelp from '../assets/Createlocationhelp'

const helpGuides = {
    '/': <Qrhelp/>,
    '/loaninghistory': <Loaninghistoryhelp/>,
    '/CreateItem': <Createitemhelp/>,
    '/rooms': <Roomshelp/>,
    '/CreateLocation': <CreateLocationhelp/>,
}

function Help() {
    const [open, setOpen] = useState(false)
    const location = useLocation()
    const path = location.pathname

    const guideContent = helpGuides[path] || 'No guide available for this page.'

    return (
        <>
            <Button variant='outlined' startIcon={<HelpOutlineIcon />} onClick={() => setOpen(true)} sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 2000 }}>
                Help
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <DialogContentText>{guideContent}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Help