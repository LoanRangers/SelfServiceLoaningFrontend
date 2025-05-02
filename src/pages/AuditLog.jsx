import api from '../services/APIservice';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Link } from 'react-router-dom';
import { useUser } from '../components/UserContext';

function AuditLog() {
  const [page, setPage] = useState(1);
  const [visibleAuditLog, setVisibleAuditLog] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    async function fetchAuditLog() {
        const req = await api.post(
            "/auditlog/logs", 
            {
              "page":page
            }
          )
          setVisibleAuditLog(req.data)
        }
        fetchAuditLog()
  }, [page, user]);

  return (
    <>
      <h1>Audit Log</h1>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Log ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Table</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleAuditLog.map((log) => (
                <TableRow key={log.LogId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{log.LogId}</TableCell>
                  <TableCell>{log.ssoId || "Unknown"}</TableCell>
                  <TableCell>{log.Action}</TableCell>
                  <TableCell>{log.Table}</TableCell>
                  <TableCell>{JSON.stringify(log.Details)}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!(page>1)?"":<button onClick={()=>setPage(page-1)}>&lt;</button>}page: {page}{!(visibleAuditLog.length==10)?"":<button onClick={()=>setPage(page+1)}>&gt;</button>}
    </>
  );
}

export default AuditLog;