import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";
import { Link } from 'react-router-dom';

import { useUser } from '../components/UserContext';

function LoaningHistory() {
  const [page, setPage] = useState(1)
  const [visibleHistory, setVisibleHistory] = useState([])
  const {user} = useUser()

  useEffect(() => {
    async function fetchLoaningHistory(){
      const req = await axios.post(
        "http://localhost:3000/items/loanhistory", 
        {
          "user":user.nickname,
          "page":page
        }
      )
      setVisibleHistory(req.data)
      console.log(req.data)
    }
    fetchLoaningHistory()
  }, [page,user])

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
        {!(page>1)?"":<button onClick={()=>setPage(page-1)}>&lt;</button>}page: {page}{!(visibleHistory.length==10)?"":<button onClick={()=>setPage(page+1)}>&gt;</button>}
    </>
  );
}

export default LoaningHistory;