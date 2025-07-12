import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Pagination, InputAdornment
} from '@mui/material';
import { Edit, Delete, Add, FilterList } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { usePageTitle } from '../hooks/usePageTitle';

// Mock data for demonstration
const mockEntries = [
  { id: 1, project: 'Project Name', hours: '05:35', description: 'A brief description of the activities performed', start: '25/08/14', end: '25/10/01', updated: '25/10/05 - 14:15' },
  { id: 2, project: 'Project Name', hours: '01:25', description: 'A brief description of the activities performed', start: '25/02/12', end: '25/05/05', updated: '25/10/05 - 14:15' },
  { id: 3, project: 'Project Name', hours: '03:20', description: 'A brief description of the activities performed', start: '25/08/11', end: '25/10/07', updated: '25/10/05 - 14:15' },
  { id: 4, project: 'Project Name', hours: '02:00', description: 'A brief description of the activities performed', start: '25/06/18', end: '25/10/02', updated: '25/10/05 - 14:15' },
  { id: 5, project: 'Project Name', hours: '00:50', description: 'A brief description of the activities performed', start: '25/05/17', end: '25/07/02', updated: '25/10/05 - 14:15' },
  { id: 6, project: 'Project Name', hours: '00:45', description: 'A brief description of the activities performed', start: '25/06/10', end: '25/09/01', updated: '25/10/05 - 14:15' },
  { id: 7, project: 'Project Name', hours: '02:15', description: 'A brief description of the activities performed', start: '25/02/06', end: '25/10/05', updated: '25/10/05 - 14:15' },
  { id: 8, project: 'Project Name', hours: '04:15', description: 'A brief description of the activities performed', start: '25/03/10', end: '25/05/05', updated: '25/10/05 - 14:15' },
  { id: 9, project: 'Project Name', hours: '00:23', description: 'A brief description of the activities performed', start: '25/04/14', end: '25/04/02', updated: '25/10/05 - 14:15' },
];

const PAGE_SIZE = 8;

const Dashboard: React.FC = () => {
  usePageTitle();
  const [entries, setEntries] = useState(mockEntries);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2); // as in the image
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [form, setForm] = useState({ project: '', hours: '', description: '', start: null as Date | null, end: null as Date | null });
  const [filter, setFilter] = useState({ start: null as Date | null, end: null as Date | null });

  // Pagination logic
  const pageCount = Math.ceil(entries.length / PAGE_SIZE);
  const pagedEntries = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Loading simulation
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [page, entries]);

  // Add entry handler
  const handleAdd = () => {
    setEntries([
      { id: Date.now(), project: form.project, hours: form.hours, description: form.description, start: form.start?.toLocaleDateString() || '', end: form.end?.toLocaleDateString() || '', updated: new Date().toLocaleString() },
      ...entries,
    ]);
    setOpen(false);
    setForm({ project: '', hours: '', description: '', start: null, end: null });
  };

  // Delete entry handler
  const handleDelete = (id: number) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Filter logic (not implemented in mock, but UI is present)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Top bar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add new work
        </Button>
        <Button variant="outlined" startIcon={<FilterList />} onClick={() => setFilterOpen(true)}>
          Filter
        </Button>
      </Box>
      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 220, boxShadow: 0, border: '1.5px solid #F0F0F0' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ fontSize: 36, color: '#096DD9' }}>⏳</Box>
            <Box>
              <Typography fontWeight={500} color="text.secondary" fontSize={16}>Today's Logged Hours</Typography>
              <Typography fontWeight={700} color="#096DD9" fontSize={22}>05:25h</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 220, boxShadow: 0, border: '1.5px solid #F0F0F0' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ fontSize: 36, color: '#D7268A' }}>⏱️</Box>
            <Box>
              <Typography fontWeight={500} color="text.secondary" fontSize={16}>Hours worked - Last week</Typography>
              <Typography fontWeight={700} color="#D7268A" fontSize={22}>38:15h</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 220, boxShadow: 0, border: '1.5px solid #F0F0F0' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ fontSize: 36, color: '#1BC47D' }}>✅</Box>
            <Box>
              <Typography fontWeight={500} color="text.secondary" fontSize={16}>Tasks Completed - Last week</Typography>
              <Typography fontWeight={700} color="#1BC47D" fontSize={22}>17</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* Table */}
      <Card sx={{ boxShadow: 0, border: '1.5px solid #F0F0F0' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#096DD9' }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#096DD9' }}>Hours (h/min)</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#096DD9' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#096DD9' }}>Start/End Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#096DD9' }}>Last Updated</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#096DD9' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : pagedEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">No entries found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedEntries.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.project}</TableCell>
                      <TableCell>{entry.hours}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{entry.start} - {entry.end}</TableCell>
                      <TableCell>{entry.updated}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" size="small"><Edit fontSize="small" /></IconButton>
                        <IconButton color="error" size="small" onClick={() => handleDelete(entry.id)}><Delete fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} color="primary" />
      </Box>
      {/* Add Entry Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Work Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Project" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} fullWidth required />
            <TextField label="Hours (h:min)" value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} fullWidth required placeholder="e.g. 02:30" InputProps={{ startAdornment: <InputAdornment position="start">⏰</InputAdornment> }} />
            <TextField label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} fullWidth required multiline minRows={2} />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker label="Start Date" value={form.start} onChange={(date: Date | null) => setForm(f => ({ ...f, start: date }))} slotProps={{ textField: { fullWidth: true, required: true } }} />
                <DatePicker label="End Date" value={form.end} onChange={(date: Date | null) => setForm(f => ({ ...f, end: date }))} slotProps={{ textField: { fullWidth: true, required: true } }} />
              </Box>
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
      {/* Filter Dialog */}
      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Filter by Date Range</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <DatePicker label="Start Date" value={filter.start} onChange={(date: Date | null) => setFilter(f => ({ ...f, start: date }))} slotProps={{ textField: { fullWidth: true } }} />
              <DatePicker label="End Date" value={filter.end} onChange={(date: Date | null) => setFilter(f => ({ ...f, end: date }))} slotProps={{ textField: { fullWidth: true } }} />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => setFilterOpen(false)}>Apply</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 