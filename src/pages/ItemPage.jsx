import React from 'react';
import { useParams } from 'react-router-dom';
import items from '../assets/fakeItems.json';
import Button from '@mui/material/Button';

function ItemPage() {
    const { id } = useParams();
    console.log('itemId', id);

    const item = items.flatMap(category => category.items).find(item => item.id === id);
    if (!item) {
      return <h1>Item not found</h1>;
    }
    if (item.description === undefined) {
      item.description = undefined;
    }

  return (
    <div>
      <h2>Loan an item</h2>
      <p>Item: {item.name} - ID: {item.id}</p>
      <p>Location: {item.location ? item.location : "Unavailable"}</p>
      {item.description && <p>Description: {item.description}</p>}

      {item.available ? (
        <Button variant="contained" color="primary" sx={{padding: '16 px 32 px', fontSize: '1.25rem', width: '100%'}}>
          Log in to loan this item
        </Button>
      ) : (
        <Button variant="contained" color="primary" sx={{padding: '16 px 32 px', fontSize: '1.25rem', width: '100%'}}>
          Item is currently loaned out
        </Button>
      )}

    </div>
  );
}
export default ItemPage;