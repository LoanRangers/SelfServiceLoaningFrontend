import React, {useState} from 'react'
import {useLocation} from 'react-router-dom'
import {Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

// Importing help button components for different pages
import Createitemhelp from '../assets/help_buttons/Create_item_help'
import Loaninghistoryhelp from '../assets/help_buttons/Loaning_history_help'
import Itempagehelp from '../assets/help_buttons/Item_page_help'
import CreateLocationhelp from '../assets/help_buttons/Create_location_help'
import Browsehelp from '../assets/help_buttons/Browse_help'
import Loanhelp from '../assets/help_buttons/Loaning_help'
import QRGenerate from '../assets/help_buttons/QR_generating_help'
import Mainpage from '../assets/help_buttons/Main_page_help'
import Returnhelp from '../assets/help_buttons/Returning_help'

const helpGuides = {
    '/loaninghistory': <Loaninghistoryhelp/>,
    '/CreateItem': <Createitemhelp/>,
    '/item': <Itempagehelp/>,
    '/CreateLocation': <CreateLocationhelp/>,
    '/browse': <Browsehelp/>,
    '/loan': <Loanhelp/>,
    '/generateqr': <QRGenerate/>,
    '/': <Mainpage/>,
    '/return': <Returnhelp/>,
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