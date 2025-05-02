import api from '../services/APIservice';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { Link, useParams } from 'react-router-dom';

import { useUser } from '../components/UserContext';

function Pagination({visibleHistory, page, setPage, maxItems, setMaxItems}) {
  return(
    <>{!(page>1)?"":<button onClick={()=>setPage(page-1)}>&lt;</button>}page: {page}{!(visibleHistory.length==maxItems)?"":<button onClick={()=>setPage(page+1)}>&gt;</button>}<br></br> items/page: <select onChange={(e)=>{setMaxItems(parseInt(e.target.value)); setPage(1)}} defaultValue={10}><option value="5">5</option><option value="10">10</option><option value="15">15</option><option value="20">20</option></select></>
  )
}

function LoaningHistory() {
  const [page, setPage] = useState(1)
  const [visibleHistory, setVisibleHistory] = useState([])
  const [visibleLoaned, setVisibleLoaned] = useState([])
  const [maxItems, setMaxItems] = useState(10)
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showDropdown, setShowDropdown] = useState(true);
  const [view, setView] = useState('loaned')
  const {user} = useUser()

  async function fetchLoanedItems(){
    const req = await api.post(
      '/items/currentlyloaned',
      {
        "page":page,
        "maxItems":maxItems
      },
      {
        withCredentials: true
      }
    )
    setVisibleLoaned(req.data)
  }

  async function fetchLoaningHistory(){
    const req = await api.post(
      '/items/loanhistory', 
      {
        "page":page,
        "maxItems":maxItems
      },
      {
        withCredentials: true
      }
    )
    setVisibleHistory(req.data)
  }

  useEffect(() => {
    if(!!user){
      fetchLoanedItems()
    }
  }, [page, user, maxItems])

  useEffect(() => {
    if(!!user){
      fetchLoaningHistory()
    }
  }, [page, user, maxItems])

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await api.get(`/locations`);
        setLocations(res.data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    }
    fetchLocations();
  }, []);

  const handleReturn = async (itemId) => {
    const res = await api.post(`/items/return/${itemId}`,
      {"locationName": selectedLocation},
      {withCredentials: true},
    )
    fetchLoanedItems()
  }

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <Button
          variant={view === 'loaned' ? "contained" : "outlined"}
          onClick={() => setView("loaned")}
        >
          Loaned Items
        </Button>
        <Button
          variant={view === 'history' ? "contained" : "outlined"}
          onClick={() => setView("history")}
          style={{ marginLeft: '10px' }}
        >
          Loaning History
        </Button>
      </div>
      {view === "loaned" && (
        <>
          <h1>Currently loaned items</h1>
          {!user || !visibleLoaned ? "No Loaned devices" : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Loaned Date</TableCell>
                  <TableCell>Select location and return</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleLoaned.map((item, i) => (
                  <TableRow key={item.item.id+"-"+i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      <Link to={`/item/${item.item.id}`}>{item.item.name}</Link>
                    </TableCell>
                    <TableCell>{item.item.description}</TableCell>
                    <TableCell>{item.item.categoryName}</TableCell>
                    <TableCell>{item.loanedDate}</TableCell>
                    <TableCell>
                      {showDropdown && (
                        <div>
                          <select
                            id="locationSelect"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                          >
                            <option value="">-- Select a location --</option>
                            {locations.map((loc) => (
                              <option key={loc.name} value={loc.name}>{loc.name}</option>
                            ))}
                          </select>
                          <Button onClick={() => {console.log("Item returned"); handleReturn(item.item.id)}} disabled={!selectedLocation}>Return</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            )}
          {!user?"":<Pagination visibleHistory={visibleHistory} page={page} setPage={setPage} maxItems={maxItems} setMaxItems={setMaxItems}></Pagination>}
        </>
      )}
      {view === "history" && (
        <>
          <h1>Loaning history</h1>
          {!user||!visibleHistory ? "No Loaning history data" :
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Loaned Date</TableCell>
                  <TableCell>Returned Date</TableCell>
                  <TableCell>Returned To</TableCell>
                  <TableCell>Availability</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleHistory.map((item, i) => (
                  <TableRow key={item.item.id+"-"+i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      <Link to={`/item/${item.item.id}`}>{item.item.name}</Link>
                    </TableCell>
                    <TableCell>{item.item.description}</TableCell>
                    <TableCell>{item.item.categoryName}</TableCell>
                    <TableCell>{item.loanedDate}</TableCell>
                    <TableCell>{item.returnedDate}</TableCell>
                    <TableCell>{item.locationName}</TableCell>
                    <TableCell className={item.item.isAvailable ? "available" : "not-available"}>{item.item.isAvailable ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          }
          {!user?"":<Pagination visibleHistory={visibleHistory} page={page} setPage={setPage} maxItems={maxItems} setMaxItems={setMaxItems}></Pagination>}
        </>
      )}
        
    </>
  );
}

export default LoaningHistory;