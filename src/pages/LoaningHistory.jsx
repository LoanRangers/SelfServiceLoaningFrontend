import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";
import { Link } from 'react-router-dom';

import { useUser } from '../components/UserContext';

function Pagination({visibleHistory, page, setPage, maxItems, setMaxItems}) {
  return(
    <>{!(page>1)?"":<Button onClick={()=>setPage(page-1)}>&lt;</Button>}page: {page}{!(visibleHistory.length==maxItems)?"":<Button onClick={()=>setPage(page+1)}>&gt;</Button>}<br></br> items/page: <select onChange={(e)=>{setMaxItems(parseInt(e.target.value)); setPage(1)}} defaultValue={10}><option value="5">5</option><option value="10">10</option><option value="15">15</option><option value="20">20</option></select></>
  )
}

function LoaningHistory() {
  const [page, setPage] = useState(1)
  const [visibleHistory, setVisibleHistory] = useState([])
  const [maxItems, setMaxItems] = useState(10)
  const {user} = useUser()

  useEffect(() => {
    if(!!user){
      async function fetchLoaningHistory(){
        const req = await axios.post(
          import.meta.env.VITE_BACKEND_URL + ':' + import.meta.env.VITE_BACKEND_PORT + '/items/loanhistory', 
          {
            "user":user.nickname,
            "page":page,
            "maxItems":maxItems
          }
        )
        setVisibleHistory(req.data)
      }
      fetchLoaningHistory()
    }
  }, [page, user, maxItems])

  return (
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
  );
}

export default LoaningHistory;