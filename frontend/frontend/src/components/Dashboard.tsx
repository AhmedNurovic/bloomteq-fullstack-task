import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import {
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface WorkEntry {
  id: number;
  date: string;
  hours: number;
  description: string;
  created_at: string;
  updated_at: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    hours: '',
    description: ''
  });

  useEffect(() => {
    fetchWorkEntries();
  }, []);

  const fetchWorkEntries = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/entries/');
      setWorkEntries(response.data.work_entries || []);
    } catch (error) {
      console.error('Failed to fetch work entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEntry) {
        await axios.put(`http://127.0.0.1:5000/entries/${editingEntry.id}`, formData);
      } else {
        await axios.post('http://127.0.0.1:5000/entries/', formData);
      }
      setFormData({ date: '', hours: '', description: '' });
      setShowAddForm(false);
      setEditingEntry(null);
      fetchWorkEntries();
    } catch (error) {
      console.error('Failed to save work entry:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`http://127.0.0.1:5000/entries/${id}`);
        fetchWorkEntries();
      } catch (error) {
        console.error('Failed to delete work entry:', error);
      }
    }
  };

  const handleEdit = (entry: WorkEntry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date,
      hours: entry.hours.toString(),
      description: entry.description
    });
    setShowAddForm(true);
  };

  const totalHours = workEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const averageHours = workEntries.length > 0 ? totalHours / workEntries.length : 0;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                mr: 2,
              }}
            >
              <ScheduleIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Work Tracker
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Welcome back, {user?.email}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Stats Cards */}
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      mr: 2,
                    }}
                  >
                    <BarChartIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Total Hours
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {totalHours.toFixed(1)}h
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                color: 'white',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      mr: 2,
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Average Hours
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {averageHours.toFixed(1)}h
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                color: 'white',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      mr: 2,
                    }}
                  >
                    <AssignmentIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Total Entries
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {workEntries.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Add Entry Button */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setShowAddForm(true);
              setEditingEntry(null);
              setFormData({ date: '', hours: '', description: '' });
            }}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8],
              },
            }}
          >
            Add Work Entry
          </Button>
        </Box>

        {/* Add/Edit Dialog */}
        <Dialog
          open={showAddForm}
          onClose={() => setShowAddForm(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                {editingEntry ? 'Edit Work Entry' : 'Add New Work Entry'}
              </Typography>
              <IconButton onClick={() => setShowAddForm(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Hours"
                    type="number"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    placeholder="0.0"
                    required
                    inputProps={{ step: 0.5 }}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What did you work on?"
                  required
                  multiline
                  rows={3}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingEntry(null);
                  setFormData({ date: '', hours: '', description: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                }}
              >
                {editingEntry ? 'Update Entry' : 'Add Entry'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Work Entries List */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6">Work Entries</Typography>
            </Box>
            {loading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Loading entries...
                </Typography>
              </Box>
            ) : workEntries.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  No work entries yet. Add your first entry!
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {workEntries.map((entry) => (
                  <ListItem
                    key={entry.id}
                    sx={{
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: 'white',
                        mr: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {new Date(entry.date).getDate()}
                      </Typography>
                    </Box>
                    <ListItemText
                      primary={entry.description}
                      secondary={`${new Date(entry.date).toLocaleDateString()} • ${entry.hours} hours`}
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => handleEdit(entry)}
                          sx={{
                            color: theme.palette.primary.main,
                            '&:hover': {
                              bgcolor: `${theme.palette.primary.main}10`,
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(entry.id)}
                          sx={{
                            color: theme.palette.error.main,
                            '&:hover': {
                              bgcolor: `${theme.palette.error.main}10`,
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Dashboard; 