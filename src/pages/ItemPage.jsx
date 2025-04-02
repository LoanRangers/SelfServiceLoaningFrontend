import { useParams } from 'react-router-dom';
import { useState } from 'react';
import './ItemPage.css';
import ModifyItem from './ModifyItem';
import items from '../assets/fakeItems.json';
import {Box, Container, Button, Typography} from '@mui/material';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

function ItemPage({ LoggedIn, handleLogin }) {
    const { id } = useParams();
  

    const item = items.flatMap(category => category.items).find(item => item.id === id);
    if (!item) {
      return <h1>Item not found</h1>;
    }
    if (item.description === undefined) {
      item.description = undefined;
    }

    const handleLoan = () => {
      console.log("item loaned")
    }

    const [modifyItem, setModifyItem] = useState(false);
    const handleItemModification = (modifiedItem) => {
      setModifyItem(false);
      console.log(modifiedItem);
    }

  return (
    <div>
      {!modifyItem && (
      <Container
        maxWidth="xl"
        className="container">
        <Box className="box">
          <Typography variant="h3" style={{ margin: '10px 0', fontWeight: 'bold' }}>
          Item: {item.name} - ID: {item.id}
          </Typography>

          <Typography variant="h6" style={{ margin: '10px 0' }}>
            Description: {item.description ? item.description : "No description"}
          </Typography>

          <Typography variant="h6" style={{ margin: '10px 0' }}>
            {item.manufacturedYear ? `Manufactured in ${item.manufacturedYear}` : "No information on item age"}
          </Typography>

          <Typography variant="h6" style={{ margin: '10px 0' }}>
          Tags: {item.tags && item.tags.length > 0 ? item.tags.join(', ') : "No tags"}
          </Typography>

          <Typography variant="h6" style={{ margin: '10px 0' }}>
            Item is currently {item.available ? "available" : "Unavailable"}
          </Typography>
          
          <Typography variant="h6" style={{ margin: '10px 0' }}>
            Location: {item.location ? item.location : "Unavailable"}
          </Typography>

          <Box style={{ margin: '20px ', textAlign: 'center' }}>
            <ImageNotSupportedIcon className="no-image-icon" />
          </Box>

          {item.available && LoggedIn && (
            <Button variant="outlined" className='button' onClick={handleLoan}>
              Loan Item
            </Button>
          )}

          {item.available && !LoggedIn && (
            <Button variant="outlined" className='button' onClick={handleLogin}>
              Log in for loaning and other functions
            </Button>
          )}

          {!item.available && (
            <Typography variant="h6" style={{ margin: '10px 0' }}>
              Item can be loaned once it is returned
            </Typography>
          )}

          {LoggedIn && (
            <Button variant="outlined" className='button'>
            View loaning history
          </Button>)}

          {LoggedIn && (
            <Button variant="outlined" className='button' onClick={() => setModifyItem(true)}>
              Modify item
            </Button>
          )}

          {LoggedIn && (
            <Button variant='outlined' className='button'>
            View item changes
          </Button>)}
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