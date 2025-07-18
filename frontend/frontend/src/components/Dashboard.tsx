import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Pagination, InputAdornment, Alert, Checkbox, Avatar, Menu, MenuItem, Divider, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add, FilterList, AccountCircle, Logout } from '@mui/icons-material';
import DeleteIcon from '../assets/delete-icon.svg';
import EditIcon from '../assets/edit-icon.svg';
import TaskCompletedIcon from '../assets/task-completed-icon.svg';
import HoursWorkedIcon from '../assets/hours-worked-icon.svg';
import TimeLoggedIcon from '../assets/time-logged-icon.svg';
import dayjs from 'dayjs';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContextBase';
import { useWorkEntries } from '../hooks/useWorkEntries';
import type { WorkEntry } from '../hooks/useWorkEntries';
import { useAddEntry } from '../hooks/useAddEntry';
import { useDeleteEntry } from '../hooks/useDeleteEntry';
import { useUpdateEntry } from '../hooks/useUpdateEntry';
import { useStatistics } from '../hooks/useStatistics';

const PAGE_SIZE = 8;

const Dashboard: React.FC = () => {
  usePageTitle();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, token, logout } = useAuth();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);
  const [form, setForm] = useState({ date: '', hours: '', description: '', completed: false });
  const [filter, setFilter] = useState({ start_date: '', end_date: '' });
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmAnchor, setDeleteConfirmAnchor] = useState<null | HTMLElement>(null);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);

  const memoizedFilter = useMemo(() => ({
    page,
    per_page: PAGE_SIZE,
    start_date: filter.start_date,
    end_date: filter.end_date
  }), [page, filter.start_date, filter.end_date]);

  const { data: entries, loading, error, pagination, refetch } = useWorkEntries(
    token || '',
    memoizedFilter
  );
  const { addEntry, loading: addLoading, error: addError } = useAddEntry(
    token || '',
    () => {
      setOpen(false);
      setForm({ date: '', hours: '', description: '', completed: false });
      refetch();
      refetchStats();
    }
  );
  const { deleteEntry, loading: deleteLoading, error: deleteError } = useDeleteEntry(
    token || '',
    () => {
      refetch();
      refetchStats();
    }
  );
  const { updateEntry, loading: updateLoading, error: updateError } = useUpdateEntry(
    token || '',
    () => {
      setEditOpen(false);
      setEditingEntry(null);
      refetch();
      refetchStats();
    }
  );
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useStatistics(token || '');

  const handleAdd = () => {
    if (!form.date || !form.hours || !form.description) return;
    
    addEntry({
      date: form.date,
      hours: parseFloat(form.hours),
      description: form.description,
      completed: form.completed
    });
  };

  const handleEdit = (entry: WorkEntry) => {
    setEditingEntry(entry);
    setForm({
      date: entry.date,
      hours: entry.hours.toString(),
      description: entry.description,
      completed: entry.completed
    });
    setEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingEntry || !form.date || !form.hours || !form.description) return;
    
    updateEntry(editingEntry.id, {
      date: form.date,
      hours: parseFloat(form.hours),
      description: form.description,
      completed: form.completed
    });
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setDeleteConfirmAnchor(event.currentTarget);
    setEntryToDelete(id);
  };

  const handleDeleteConfirm = () => {
    if (entryToDelete) {
      deleteEntry(entryToDelete);
    }
    setDeleteConfirmAnchor(null);
    setEntryToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmAnchor(null);
    setEntryToDelete(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleSignOut = () => {
    handleProfileMenuClose();
    logout();
  };

  const handleResetFilter = () => {
    setFilter({ start_date: '', end_date: '' });
    setPage(1);
    refetch();
  };

  const hasActiveFilters = filter.start_date || filter.end_date;

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format('DD/MM/YY');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ py: isMobile ? 1 : 4, px: isMobile ? 0.5 : 2 }}>
          {/* Error alerts */}
          {(error || addError || deleteError || updateError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || addError || deleteError || updateError}
            </Alert>
          )}

          {/* Top bar */}
          <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            mb: 2,
            gap: isMobile ? 2 : 0
          }}>
            {/* Profile section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 1 : 0 }}>
              <Button
                onClick={handleProfileMenuOpen}
                variant="outlined"
                startIcon={
                  <Avatar sx={{ width: 24, height: 24, bgcolor: '#096DD9' }}>
                    <AccountCircle sx={{ fontSize: 16 }} />
                  </Avatar>
                }
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#096DD9',
                  borderColor: '#096DD9',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  width: isMobile ? '100%' : 'auto',
                  '&:hover': {
                    backgroundColor: 'rgba(9, 109, 217, 0.04)',
                    borderColor: '#096DD9'
                  }
                }}
              >
                <Typography variant="body2" sx={{ color: '#096DD9', fontWeight: 500 }}>
                  {user?.email}
                </Typography>
              </Button>
            </Box>

            {/* Action buttons */}
            <Box sx={{
              display: 'flex',
              gap: isMobile ? 1 : 2,
              flexDirection: isMobile ? 'column' : 'row',
              width: isMobile ? '100%' : 'auto'
            }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpen(true)}
                sx={{
                  backgroundColor: '#096DD9',
                  width: isMobile ? '100%' : 'auto',
                  '&:hover': {
                    backgroundColor: '#0756B3',
                  },
                }}
              >
                Add new work
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterOpen(true)}
                sx={{
                  borderColor: '#096DD9',
                  color: '#096DD9',
                  width: isMobile ? '100%' : 'auto',
                  '&:hover': { borderColor: '#0756B3', color: '#0756B3' }
                }}
              >
                Filter{hasActiveFilters && ' •'}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="text"
                  onClick={handleResetFilter}
                  sx={{
                    color: '#666',
                    width: isMobile ? '100%' : 'auto',
                    fontSize: '12px',
                    textTransform: 'none',
                    '&:hover': { 
                      color: '#096DD9',
                      backgroundColor: 'rgba(9, 109, 217, 0.04)'
                    }
                  }}
                >
                  Clear filters
                </Button>
              )}
            </Box>
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2
              }
            }}
          >
            <MenuItem sx={{ py: 2, px: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#096DD9' }}>
                  <AccountCircle />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#096DD9' }}>
                    {user?.email}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Signed in
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut} sx={{ py: 2, px: 3 }}>
              <Logout sx={{ mr: 2, color: '#096DD9' }} />
              <Typography sx={{ color: '#096DD9', fontWeight: 500 }}>
                Sign out
              </Typography>
            </MenuItem>
          </Menu>

          {/* Delete Confirmation Popup */}
          <Menu
            anchorEl={deleteConfirmAnchor}
            open={Boolean(deleteConfirmAnchor)}
            onClose={handleDeleteCancel}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 280,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                borderRadius: 2,
                border: '1px solid #f0f0f0',
                p: 0
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                backgroundColor: '#fff3e0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Box sx={{ fontSize: 24 }}>⚠️</Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                Delete Entry
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                Are you sure you want to delete this work entry? This action cannot be undone.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                  onClick={handleDeleteCancel}
                  variant="outlined"
              sx={{
                    borderColor: '#ddd',
                    color: '#666',
                    '&:hover': {
                      borderColor: '#999',
                      backgroundColor: '#f5f5f5'
                    }
              }}
            >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDeleteConfirm}
                  variant="contained"
                  disabled={deleteLoading}
                    sx={{
                    backgroundColor: '#096DD9',
                    '&:hover': {
                      backgroundColor: '#0756B3',
                    },
                    '&:disabled': {
                      backgroundColor: '#ffcdd2',
                      color: '#666'
                    }
                  }}
                >
                  {deleteLoading ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
                </Button>
              </Box>
            </Box>
          </Menu>

          {/* Stats */}
          <Box sx={{
            display: 'flex',
            gap: 3,
            mb: 3,
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            flexDirection: isMobile ? 'column' : 'row',
          }}>
            <Card sx={{ flex: 1, minWidth: 220, boxShadow: '0 4px 16px 0 rgba(9,109,217,0.08)', border: '1.5px solid #F0F0F0', '&:hover': { boxShadow: '0 4px 16px 0 rgba(9,109,217,0.08)' }, '&:focus': { boxShadow: '0 4px 16px 0 rgba(9,109,217,0.08)' } }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={TimeLoggedIcon} alt="Time logged" style={{ width: '100%', height: '100%', color: '#096DD9' }} />
                </Box>
                <Box>
                  <Typography fontWeight={500} color="black" fontSize={16}>Today's Logged Hours</Typography>
                  <Typography fontWeight={700} color="#096DD9" fontSize={22}>
                    {statsLoading ? '...' : `${formatHours(stats?.today_hours || 0)}h`}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, minWidth: 220, boxShadow: '0 4px 16px 0 rgba(196,29,127,0.08)', border: '1.5px solid #F0F0F0', '&:hover': { boxShadow: '0 4px 16px 0 rgba(196,29,127,0.08)' }, '&:focus': { boxShadow: '0 4px 16px 0 rgba(196,29,127,0.08)' } }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={HoursWorkedIcon} alt="Hours worked" style={{ width: '100%', height: '100%', color: '#C41D7F' }} />
                </Box>
                <Box>
                  <Typography fontWeight={500} color="black" fontSize={16}>Hours worked - Last week</Typography>
                  <Typography fontWeight={700} color="#C41D7F" fontSize={22}>
                    {statsLoading ? '...' : `${formatHours(stats?.last_week_hours || 0)}h`}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, minWidth: 220, boxShadow: '0 4px 16px 0 rgba(8,151,156,0.08)', border: '1.5px solid #F0F0F0', '&:hover': { boxShadow: '0 4px 16px 0 rgba(8,151,156,0.08)' }, '&:focus': { boxShadow: '0 4px 16px 0 rgba(8,151,156,0.08)' } }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={TaskCompletedIcon} alt="Tasks completed" style={{ width: '100%', height: '100%', color: '#08979C' }} />
                </Box>
                <Box>
                  <Typography fontWeight={500} color="black" fontSize={16}>Tasks Completed - Last week</Typography>
                  <Typography fontWeight={700} color="#08979C" fontSize={22}>
                    {statsLoading ? '...' : stats?.last_week_tasks || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Table or Card/List for Mobile */}
          {isMobile ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : entries.length === 0 ? (
                <Typography color="text.secondary" align="center">No entries found.</Typography>
              ) : (
                entries.map(entry => (
                  <Card key={entry.id} sx={{ boxShadow: 0, border: '1.5px solid #F0F0F0', p: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography fontWeight={700} color="#096DD9">{formatDate(entry.date)}</Typography>
                      <Typography fontSize={14}><b>Hours:</b> {formatHours(entry.hours)}</Typography>
                      <Typography fontSize={14}><b>Description:</b> {entry.description}</Typography>
                      <Typography fontSize={12} color="text.secondary">Created: {formatDate(entry.created_at)}</Typography>
                      <Typography fontSize={12} color="text.secondary">Updated: {formatDate(entry.updated_at)}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Checkbox
                          checked={entry.completed}
                          onChange={(e) => updateEntry(entry.id, { completed: e.target.checked })}
                          color="primary"
                          sx={{
                            color: '#096DD9',
                            '&.Mui-checked': {
                              color: '#096DD9',
                            },
                          }}
                        />
                        <Typography fontSize={14}>Completed</Typography>
                        <IconButton size="small" onClick={() => handleEdit(entry)} disabled={deleteLoading} sx={{ color: '#096DD9' }}>
                          <img src={EditIcon} alt="Edit" style={{ width: 22, height: 22 }} />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => handleDeleteClick(e, entry.id)} disabled={deleteLoading} sx={{ color: '#d32f2f' }}>
                          <img src={DeleteIcon} alt="Delete" style={{ width: 22, height: 22 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                ))
              )}
            </Box>
          ) : (
            <Card sx={{ boxShadow: 0, border: '1.5px solid #F0F0F0', overflowX: 'auto', '&:hover': { boxShadow: 0, backgroundColor: 'inherit' }, '&:focus': { boxShadow: 0, backgroundColor: 'inherit' } }}>
              <CardContent sx={{ p: 0 }}>
                <TableContainer sx={{ minWidth: 800, '&:hover': { boxShadow: 'none', backgroundColor: 'inherit' }, '&:focus': { boxShadow: 'none', backgroundColor: 'inherit' } }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ '&:hover': { boxShadow: 'none', backgroundColor: 'inherit' }, '&:focus': { boxShadow: 'none', backgroundColor: 'inherit' } }}>
                        <TableCell sx={{ fontWeight: 700, color: '#096DD9' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#096DD9' }}>Hours (h/min)</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#096DD9' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#096DD9' }}>Created</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#096DD9' }}>Updated</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: '#096DD9' }}>Completed</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: '#096DD9' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow sx={{ '&:hover': { boxShadow: 'none', backgroundColor: 'inherit' }, '&:focus': { boxShadow: 'none', backgroundColor: 'inherit' } }}>
                          <TableCell colSpan={7} align="center">
                            <CircularProgress size={32} />
                          </TableCell>
                        </TableRow>
                      ) : entries.length === 0 ? (
                        <TableRow sx={{ '&:hover': { boxShadow: 'none', backgroundColor: 'inherit' }, '&:focus': { boxShadow: 'none', backgroundColor: 'inherit' } }}>
                          <TableCell colSpan={7} align="center">
                            <Typography color="text.secondary">No entries found.</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        entries.map(entry => (
                          <TableRow key={entry.id} sx={{ '&:hover': { boxShadow: 'none', backgroundColor: 'inherit' }, '&:focus': { boxShadow: 'none', backgroundColor: 'inherit' }, backgroundColor: '#F9FAFC' }}>
                            <TableCell>{formatDate(entry.date)}</TableCell>
                            <TableCell>{formatHours(entry.hours)}</TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell>{formatDate(entry.created_at)}</TableCell>
                            <TableCell>{formatDate(entry.updated_at)}</TableCell>
                            <TableCell align="center">
                              <Checkbox
                                checked={entry.completed}
                                onChange={(e) => updateEntry(entry.id, { completed: e.target.checked })}
                                color="primary"
                                sx={{
                                  color: '#096DD9',
                                  '&.Mui-checked': {
                                    color: '#096DD9',
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEdit(entry)}
                                disabled={deleteLoading}
                                sx={{
                                  color: '#096DD9',
                                  mr: 2, // wider separation
                                  backgroundColor: 'transparent',
                                  boxShadow: 'none',
                                  '&:hover': { backgroundColor: 'transparent', boxShadow: 'none' },
                                  '&:active': { backgroundColor: 'transparent', boxShadow: 'none' },
                                }}
                              >
                                <img src={EditIcon} alt="Edit" style={{ width: 22, height: 22 }} />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={(e) => handleDeleteClick(e, entry.id)}
                                disabled={deleteLoading}
                                sx={{
                                  color: '#d32f2f',
                                  backgroundColor: 'transparent',
                                  boxShadow: 'none',
                                  '&:hover': { backgroundColor: 'transparent', boxShadow: 'none' },
                                  '&:active': { backgroundColor: 'transparent', boxShadow: 'none' },
                                }}
                              >
                                <img src={DeleteIcon} alt="Delete" style={{ width: 22, height: 22 }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pagination && typeof pagination.total_pages === 'number' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination 
                count={pagination.total_pages} 
                page={page} 
                onChange={(_, v) => setPage(v)} 
                siblingCount={1}
                boundaryCount={1}
                showFirstButton={false}
                showLastButton={false}
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: 500,
                    minWidth: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    margin: '0 4px',
                    '&.Mui-selected': {
                      backgroundColor: '#096DD9',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#0756B3',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(9, 109, 217, 0.08)',
                      color: '#096DD9',
                    },
                    '&.MuiPaginationItem-ellipsis': {
                      color: '#999',
                      fontSize: '16px',
                      fontWeight: 400,
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* Add Entry Dialog */}
          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Work Entry</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                  <TextField
                    label="Date"
                    type="date"
                    value={form.date} 
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))} 
                    fullWidth 
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Hours"
                  value={form.hours} 
                  onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} 
                  fullWidth 
                    required
                  placeholder="e.g. 2.5" 
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start">⏰</InputAdornment> 
                  }} 
                  />
                <TextField
                  label="Description" 
                  value={form.description} 
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                  fullWidth
                  required
                  multiline
                  minRows={2} 
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox
                    checked={form.completed}
                    onChange={e => setForm(f => ({ ...f, completed: e.target.checked }))}
                    sx={{ 
                      color: '#096DD9',
                      '&.Mui-checked': {
                        color: '#096DD9',
                      },
                    }}
                />
                  <Typography>Mark as completed</Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} sx={{ color: '#096DD9' }}>Cancel</Button>
              <Button
                onClick={handleAdd} 
                variant="contained"
                disabled={addLoading}
                sx={{ 
                  backgroundColor: '#096DD9',
                  '&:hover': {
                    backgroundColor: '#0756B3',
                  },
                }}
              >
                {addLoading ? <CircularProgress size={20} /> : 'Add'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Entry Dialog */}
          <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Work Entry</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField 
                  label="Date" 
                  type="date"
                  value={form.date} 
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))} 
                  fullWidth 
                  required 
                  InputLabelProps={{ shrink: true }}
                />
                <TextField 
                  label="Hours" 
                  type="number"
                  value={form.hours} 
                  onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} 
                  fullWidth 
                  required 
                  placeholder="e.g. 2.5" 
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start">⏰</InputAdornment> 
                  }} 
                />
                <TextField 
                  label="Description" 
                  value={form.description} 
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                  fullWidth 
                  required 
                  multiline 
                  minRows={2} 
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox
                    checked={form.completed}
                    onChange={e => setForm(f => ({ ...f, completed: e.target.checked }))}
                    sx={{ 
                      color: '#096DD9',
                      '&.Mui-checked': {
                        color: '#096DD9',
                      },
                    }}
                  />
                  <Typography>Mark as completed</Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button
                onClick={handleUpdate} 
                variant="contained"
                disabled={updateLoading}
                sx={{
                  backgroundColor: '#096DD9',
                  '&:hover': {
                    backgroundColor: '#0756B3',
                  },
                }}
              >
                {updateLoading ? <CircularProgress size={20} /> : 'Update'}
              </Button>
            </DialogActions>
        </Dialog>

          {/* Filter Dialog */}
          <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Filter by Date Range</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField 
                  label="Start Date" 
                  type="date"
                  value={filter.start_date} 
                  onChange={e => setFilter(f => ({ ...f, start_date: e.target.value }))} 
                  fullWidth 
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiInputBase-root': {
                      color: '#096DD9',
                      borderColor: '#096DD9',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#096DD9',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0756B3',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#096DD9',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#096DD9',
                    },
                  }}
                />
                <TextField 
                  label="End Date" 
                  type="date"
                  value={filter.end_date} 
                  onChange={e => setFilter(f => ({ ...f, end_date: e.target.value }))} 
                  fullWidth 
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiInputBase-root': {
                      color: '#096DD9',
                      borderColor: '#096DD9',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#096DD9',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0756B3',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#096DD9',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#096DD9',
                    },
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleResetFilter} sx={{ color: '#096DD9', borderColor: '#096DD9', borderWidth: 1, borderStyle: 'solid', background: 'none', '&:hover': { color: '#0756B3', borderColor: '#0756B3', background: 'none' } }}>Reset</Button>
              <Button onClick={() => setFilterOpen(false)} sx={{ color: '#096DD9', borderColor: '#096DD9', borderWidth: 1, borderStyle: 'solid', background: 'none', '&:hover': { color: '#0756B3', borderColor: '#0756B3', background: 'none' } }}>Close</Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  setFilterOpen(false);
                  setPage(1);
                  refetch();
                }}
                      sx={{
                  backgroundColor: '#096DD9',
                            '&:hover': {
                    backgroundColor: '#0756B3',
                            },
                          }}
                        >
                Apply
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
                      </Box>
    </Box>
  );
};

export default Dashboard; 