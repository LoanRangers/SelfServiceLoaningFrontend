import { useParams } from 'react-router-dom';
import './ItemPage.css';
import items from '../assets/fakeItems.json';
import {Box, Container, Button, Typography} from '@mui/material';

import axios from 'axios';

import { useUser } from '../components/UserContext';
import { useEffect, useState } from 'react';

function ItemPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null)
    const [loaned, setLoaned] = useState(false)

    let LoggedIn = false;
    const { user } = useUser()
    if (!!user) {LoggedIn = true}

    useEffect(()=>{
      async function fetchItem(){
        let req = await axios.get(`http://localhost:3000/items/id/${id}/`)
        setItem(req.data)
        console.log(req)
      }
      fetchItem()
    },[loaned])

    //const item = items.flatMap(category => category.items).find(item => item.id === id);
    if (!item) {
      return <h1>Item not found</h1>;
    }
    if (item.description === undefined) {
      item.description = undefined;
    }

    const handleLoan = () => {
      async function loanItem(){
        let req = await axios.post(`http://localhost:3000/items/loan/${id}/`,{
          "userId":user.nickname,
        })
        if(req.data.loanId){
          setLoaned(!loaned)
          console.log("LOANED!!!!!!!!!!!!!")
        }
        console.log(req.data)
      }
      loanItem()
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
            Item is currently {item.isAvailable ? "available" : "Unavailable"}
          </Typography>
          <Typography variant="h6" style={{ margin: '10px 0' }}>
            Location: {item.currentLocation ? item.currentLocation : "Unavailable"}
          </Typography>
          {item.isAvailable && LoggedIn && (
            <Button variant="outlined" className='loan-button' onClick={handleLoan}>
              Loan Item
            </Button>
          )}
          {item.isAvailable && !LoggedIn && (
            <Button variant="outlined" className='loan-button' onClick={console.log("HandeLogin")}>
              Log in to loan the item
            </Button>
          )}
          {!item.isAvailable && (
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