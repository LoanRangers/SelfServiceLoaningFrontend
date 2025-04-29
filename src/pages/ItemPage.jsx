import { useNavigate, useParams } from 'react-router-dom';
import './ItemPage.css';
import ItemTimeline from './ItemTimeline';
import ModifyItem from './ModifyItem';
import {Box, Container, Button, Typography} from '@mui/material';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

import axios from 'axios';

import { useUser } from '../components/UserContext';
import { useEffect, useState } from 'react';

function ItemPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null)
    const [loaned, setLoaned] = useState(false)
    const [modifyItem, setModifyItem] = useState(false);
    const navigate = useNavigate()

    let LoggedIn = false;
    const { user } = useUser()
    if (user) {LoggedIn = true}

    useEffect(()=>{
      async function fetchItem(){
        let req = await axios.get(import.meta.env.VITE_BACKEND_URL + ':' + import.meta.env.VITE_BACKEND_PORT + `/items/id/${id}/`)
        setItem(req.data)
        console.log(req)
      }
      fetchItem()
    },[loaned,id])

    if (!item) {
      return <h1>Item not found</h1>;
    }
    if (item.description === undefined) {
      item.description = undefined;
    }

    const handleLoan = () => {
      async function loanItem(){
        let req = await axios.post(import.meta.env.VITE_BACKEND_URL + ':' + import.meta.env.VITE_BACKEND_PORT + `/items/loan/${id}/`,
          {},
          {withCredentials: true}
            )
        if(req.data.loanId){
          setLoaned(!loaned)
        }
      }
      loanItem()
    }

    const handleItemModification = (modifiedItem) => {
      setModifyItem(false);
      console.log(modifiedItem);
    }
    const handleRedirect = () => {
      navigate('/loaninghistory'); // Replace with your actual route
    };

  return (
    <div>
      {!modifyItem && (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box className="item-box">
            <Typography variant="h4" style={{ margin: '10px 0', fontWeight: 'bold' }}>
            Item: {item.name}
            </Typography>

            <Typography variant="h5" style={{ margin: '10px 0' }}>
              ID: {item.id}
            </Typography>

            <Typography variant="h6" >
              Description: {item.description ? item.description : "No description"}
            </Typography>

            <Typography variant="h6">
              {item.manufacturedYear ? `Manufactured in ${item.manufacturedYear}` : "No information on item age"}
            </Typography>

            <Typography variant="h6"  >
              Item is currently {item.isAvailable ? `available for loaning at ${item.currentLocation}` : "Unavailable"}
            </Typography>

            <Box style={{ margin: '20px ', textAlign: 'center' }}>
              <ImageNotSupportedIcon className="no-image-icon" />
            </Box>

            {item.isAvailable && LoggedIn && (
              <Button variant="outlined" className='button' onClick={handleLoan}>
                Loan Item
              </Button>
            )}
            {!item.isAvailable && (
              <Typography variant="h6" style={{ margin: '10px 0' }}>
                Item can be loaned once it is returned
              </Typography>
            )}

            {LoggedIn && (
              <Button variant="outlined" className='button' onClick={handleRedirect}>
              View loaning history
            </Button>)}

            {LoggedIn && (
              <Button variant="outlined" className='button' onClick={() => setModifyItem(true)}>
                Modify item
              </Button>
            )}
            <ItemTimeline item={item} user={user}></ItemTimeline>
          </Box>
        </Container>
      )}
      {modifyItem && (
        <ModifyItem item={item} handleModify={handleItemModification}></ModifyItem>
      )}    
    </div>
  );
}



export default ItemPage;