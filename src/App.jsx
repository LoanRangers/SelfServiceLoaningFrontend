import items from './assets/fakeItems.json'
import './App.css'
import * as React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import ItemPage from './pages/ItemPage.jsx';
import {Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
function Home() {

  return (
    <>    
      {items.map((categories) => (
        <Accordion key={categories.category}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${categories.category}-content`}
            id={`panel-${categories.category}-header`}
          >
            <Typography component="span" variant="h6">{categories.category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Availability</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.items.map((item) => (
                    <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        <Link to={`/item/${item.id}`} component={Link}>{item.name}</Link>
                      </TableCell>
                      <TableCell className={item.available ? "available" : "not-available"}>{item.available ? "Yes" : "No"}</TableCell>
                      <TableCell>{item.location ? item.location : "Loaned out"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
      
    </>
  )
}

function App() {
  return (
    <div>
      <h1>UTU Self Loaning System</h1>

    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemPage/>} />
      </Routes>
    </Router>
    </div>
  )
}

export default App
