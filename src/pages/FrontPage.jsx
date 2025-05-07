import {Button} from "@mui/material"
import { useNavigate } from "react-router-dom";
import QRCodeScanner from './QRCodeScanner';


function FrontPage({user, handleLogin}) {
    const navigate = useNavigate()

    const handleBrowse = () => {
        navigate('/SelfServiceLoaningFrontend/browse'); 
      };

    const handleLoan = () => {
    navigate('/SelfServiceLoaningFrontend/loan'); 
    };

    const handleReturn = () => {
        navigate('/SelfServiceLoaningFrontend/return'); 
      };

    const handleScan = (qr) => {
        console.log(qr);
    }

    return (
        <div className="front-page">
            {user && (
                <>
                    <Button variant="outlined" className="frontpage-button" onClick={handleLoan}>
                        Loan items
                    </Button>
                    <Button variant="outlined" className="frontpage-button" onClick={handleReturn}>
                        Return items
                    </Button>
                </>
            )}
            {!user && (
                <Button variant="outlined" className="frontpage-button" onClick={handleLogin}>
                    Login for loaning and other actions
                </Button>
            )}
            <Button variant="outlined" className="frontpage-button" onClick={handleBrowse}>
                Browse items
            </Button>
            <p>
                Or scan a QR code for details
            </p>
            <QRCodeScanner className="qr-code-scanner" handleScan={handleScan}/>
        </div>
    )

}

export default FrontPage