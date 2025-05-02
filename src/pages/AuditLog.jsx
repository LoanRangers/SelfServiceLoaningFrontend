import api from '../services/APIservice';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Link } from 'react-router-dom';
import { useUser } from '../components/UserContext';

function AuditLog() {
  const [page, setPage] = useState(1);
  const [visibleAuditLog, setVisibleAuditLog] = useState([]);
  const { user } = useUser();
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchAuditLog() {
      try {
        const req = await api.post(
          `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/auditlog/logs`,
          {
            page: page,
          }
        );
        setVisibleAuditLog(req.data.logs); // Set the logs
        setTotalPages(Math.ceil(req.data.total / 10)); // Calculate total pages
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      }
    }
    fetchAuditLog();
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
  
      {/* Pagination Buttons */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        {!(page > 1) ? "" : <button onClick={() => setPage(page - 1)}>&lt;</button>}
        page: {page}
        {!(visibleAuditLog.length === 10) ? "" : <button onClick={() => setPage(page + 1)}>&gt;</button>}
        <button onClick={() => setPage(totalPages)}>&gt;&gt;</button>
      </div>
  
      {/* Go to Specific Page Input */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <label htmlFor="pageInput">Go to page:</label>
        <input
          id="pageInput"
          type="number"
          min="1"
          max={totalPages}
          value={page}
          onChange={(e) => {
            const newPage = Math.min(Math.max(1, Number(e.target.value)), totalPages);
            setPage(newPage);
          }}
        />
      </div>
    </>
  );
}

export default AuditLog;