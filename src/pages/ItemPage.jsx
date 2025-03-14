import { useParams } from 'react-router-dom';
import './ItemPage.css';
import items from '../assets/fakeItems.json';
import {Box, Container, Button, Typography} from '@mui/material';

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

  return (
    <div>
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
          {item.available && LoggedIn && (
            <Button variant="outlined" className='loan-button' onClick={handleLoan}>
              Loan Item
            </Button>
          )}
          {item.available && !LoggedIn && (
            <Button variant="outlined" className='loan-button' onClick={handleLogin}>
              Log in to loan the item
            </Button>
          )}
          {!item.available && (
            <Typography variant="h6" style={{ margin: '10px 0' }}>
              Item can be loaned once it is returned
            </Typography>
          )}
        </Box>
      </Container>
    </div>
  );
}
export default ItemPage;