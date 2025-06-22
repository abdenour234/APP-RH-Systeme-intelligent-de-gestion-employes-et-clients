import React, { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Avatar,
  Chip,
  Stack,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Collapse,
  ListItemIcon,
  FormControlLabel,
  Button,
  TextField,
  MenuItem,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  DialogActions,
  Alert,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import InfoIcon from '@mui/icons-material/Info';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { styled } from '@mui/material/styles';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const ACCENT = '#4F8DFD';
const ACCENT2 = '#00C49F';
const ACCENT3 = '#FFBB28';
const ACCENT4 = '#FF8042';
const COLORS = [ACCENT, ACCENT2, ACCENT3, ACCENT4];

const DashboardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  backgroundColor: 'white',
  border: '1px solid #e0e0e0',
  boxShadow: '0 4px 24px rgba(79,141,253,0.08)',
  borderRadius: 18,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 8px 32px rgba(79,141,253,0.16)',
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fafdff 80%, #e3f0ff 100%)',
  borderLeft: `6px solid ${ACCENT}`,
  borderRadius: 12,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const FilterCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #ffffff 70%, #f8fbff 100%)',
  borderRadius: 16,
  border: '2px solid rgba(79,141,253,0.1)',
  marginBottom: theme.spacing(3),
}));

const InfoDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    padding: theme.spacing(2),
    background: 'linear-gradient(135deg, #ffffff 70%, #f8fbff 100%)',
    boxShadow: '0 20px 60px rgba(79,141,253,0.2)',
  },
}));

const Client = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const queryClient = useQueryClient();

  // State variables
  const [selectedClients, setSelectedClients] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [clientsExpanded, setClientsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [viewDensity, setViewDensity] = useState('comfortable');
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState('clientName');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch data from backend
  const { data: clientsData, isLoading: clientsLoading, error: clientsError } = useQuery({
    queryKey: ['clients'],
    queryFn: () => axios.get('http://localhost:8080/api/clients').then(res => res.data),
  });

  const { data: departmentsData, isLoading: departmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => axios.get('http://localhost:8080/api/departments').then(res => res.data),
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => axios.get('http://localhost:8080/api/projects').then(res => res.data),
  });

  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => axios.get('http://localhost:8080/api/tickets').then(res => res.data),
  });

  const clients = clientsData || [];
  const departments = departmentsData || [];
  const projects = projectsData || [];
  const tickets = ticketsData || [];

  // Mutation for adding a client
  const addClientMutation = useMutation({
    mutationFn: newClient => axios.post('http://localhost:8080/api/clients', newClient),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      setShowAddForm(false);
    },
  });

  // Filter and sort clients
  const filteredClients = useMemo(() => {
    let result = clients.filter(client => {
      const matchesSearch =
        client.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter
        ? client.projects?.some(proj => proj.departmentId === parseInt(departmentFilter))
        : true;
      const matchesSelection = selectedClients.length === 0 || selectedClients.includes(client.clientId);
      return matchesSearch && matchesDepartment && matchesSelection;
    });

    result.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'projects':
          aValue = a.projects?.length || 0;
          bValue = b.projects?.length || 0;
          break;
        default:
          aValue = a.clientName?.toLowerCase() || '';
          bValue = b.clientName?.toLowerCase() || '';
      }
      const order = sortOrder === 'asc' ? 1 : -1;
      return aValue > bValue ? order : aValue < bValue ? -order : 0;
    });

    return result;
  }, [clients, searchTerm, departmentFilter, selectedClients, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(start, start + itemsPerPage);
  }, [filteredClients, currentPage, itemsPerPage]);

  // Chart Data
  const projectsPerClientData = useMemo(() => {
    const projectCounts = {};
    filteredClients.forEach(client => {
      const clientProjects = projects.filter(p => p.clientId === client.clientId);
      projectCounts[client.clientName || 'Unknown'] = clientProjects.length;
    });
    return Object.entries(projectCounts)
      .map(([name, projects]) => ({ name, projects }))
      .filter(client => client.projects > 0)
      .sort((a, b) => b.projects - a.projects)
      .slice(0, 10);
  }, [filteredClients, projects]);

  const ticketVolumeData = useMemo(() => {
    const ticketCounts = {};
    filteredClients.forEach(client => {
      const clientTickets = tickets.filter(t => t.clientId === client.clientId);
      ticketCounts[client.clientName || 'Unknown'] = clientTickets.length;
    });
    return Object.entries(ticketCounts)
      .map(([name, tickets]) => ({ name, value: tickets }))
      .filter(client => client.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [filteredClients, tickets]);

  const projectTimelineData = useMemo(() => {
    const timeline = {};
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 11 + i);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });

    months.forEach(month => {
      timeline[month] = { month, activeProjects: 0 };
    });

    projects.forEach(project => {
      const startDate = new Date(project.startDate);
      const endDate = project.endDate ? new Date(project.endDate) : new Date();
      const startMonth = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
      const endMonth = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;

      months.forEach(month => {
        if (month >= startMonth && month <= endMonth) {
          const client = filteredClients.find(c => c.clientId === project.clientId);
          if (client) {
            timeline[month].activeProjects += 1;
          }
        }
      });
    });

    return Object.values(timeline);
  }, [projects, filteredClients]);

  // Add Client Form Component
  const AddClientForm = ({ open, onClose }) => {
    const [clientData, setClientData] = useState({
      clientName: '',
      contactPerson: '',
      email: '',
      phone: '',
      contractDate: '',
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
      const newErrors = {};
      if (!clientData.clientName) newErrors.clientName = 'Required';
      if (!clientData.email || !/\S+@\S+\.\S+/.test(clientData.email))
        newErrors.email = 'Invalid email';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
      if (validate()) {
        addClientMutation.mutate(clientData);
        setClientData({
          clientName: '',
          contactPerson: '',
          email: '',
          phone: '',
          contractDate: '',
        });
      }
    };

    return (
      <InfoDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: ACCENT, color: 'white', borderRadius: '20px 20px 0 0', m: -2, mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add New Client</Typography>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {addClientMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error creating client: {addClientMutation.error.message}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                value={clientData.clientName}
                onChange={e => setClientData({ ...clientData, clientName: e.target.value })}
                error={!!errors.clientName}
                helperText={errors.clientName}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Person"
                value={clientData.contactPerson}
                onChange={e => setClientData({ ...clientData, contactPerson: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={clientData.email}
                onChange={e => setClientData({ ...clientData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={clientData.phone}
                onChange={e => setClientData({ ...clientData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contract Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={clientData.contractDate}
                onChange={e => setClientData({ ...clientData, contractDate: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={addClientMutation.isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={addClientMutation.isLoading}
          >
            {addClientMutation.isLoading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </InfoDialog>
    );
  };

  // Client Info Dialog Component (Updated)
  const ClientInfoDialog = ({ open, onClose, client }) => {
    if (!client) return null;

    const clientProjects = projects.filter(p => p.clientId === client.clientId);
    const clientTickets = tickets.filter(t => t.clientId === client.clientId);
    console.log('Client Projects:', clientProjects); // Debug: Check all projects for this client
    console.log('Client Tickets:', clientTickets); // Debug: Check all tickets for this client

    const completedProjects = clientProjects.filter(p => {
      console.log(`Project Status: ${p.status}`); // Debug: Log each project's status
      return p.status?.toUpperCase() === 'COMPLETED'; // Case-insensitive match
    }).length;
    const openTickets = clientTickets.filter(t => {
      console.log(`Ticket Status: ${t.status}`); // Debug: Log each ticket's status
      return t.status?.toUpperCase() === 'OPEN'; // Case-insensitive match
    }).length;

    const completionRate =
      clientProjects.length > 0
        ? ((completedProjects / clientProjects.length) * 100).toFixed(1)
        : 0;

    return (
      <InfoDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: ACCENT, color: 'white', borderRadius: '20px 20px 0 0', m: -2, mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{client.clientName || 'N/A'}</Typography>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <InfoCard>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: ACCENT }}>
                    General Information
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <BusinessIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Company</Typography>
                        <Typography variant="body1">{client.clientName || 'N/A'}</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <EmailIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{client.email || 'N/A'}</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <PhoneIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{client.phone || 'N/A'}</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <LocationOnIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Contract Date</Typography>
                        <Typography variant="body1">{client.contractDate || 'N/A'}</Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </InfoCard>
            </Grid>
            <Grid item xs={12}>
              <InfoCard>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: ACCENT }}>
                    Quick KPIs
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Total Projects</Typography>
                      <Typography variant="h6" sx={{ color: ACCENT2 }}>{clientProjects.length}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Completed Projects</Typography>
                      <Typography variant="h6" sx={{ color: ACCENT3 }}>{completedProjects}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Open Tickets</Typography>
                      <Typography variant="h6" sx={{ color: ACCENT4 }}>{openTickets}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Completion Rate</Typography>
                      <Typography variant="h6" sx={{ color: ACCENT }}>
                        {completionRate}%
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </InfoCard>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </InfoDialog>
    );
  };

  const handleInfoClick = client => {
    setSelectedInfo(client);
    setShowInfo(true);
  };

  const handleClientSelect = clientId => {
    setSelectedClients(prev =>
      prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId],
    );
  };

  const clearFilters = () => {
    setSelectedClients([]);
    setSearchTerm('');
    setDepartmentFilter('');
    setSortBy('clientName');
    setSortOrder('asc');
  };

  if (clientsLoading || departmentsLoading || projectsLoading || ticketsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (clientsError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography>Error loading clients: {clientsError.message}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please check your connection or try again.
          </Typography>
        </Alert>
        <Button
          variant="contained"
          onClick={() => queryClient.invalidateQueries(['clients'])}
          startIcon={<GroupIcon />}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, background: 'linear-gradient(120deg, #fafdff 70%, #e3f0ff 100%)', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 800, color: ACCENT }}>
          Clients Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
          sx={{ background: ACCENT, '&:hover': { background: ACCENT2 } }}
        >
          Add Client
        </Button>
      </Box>

      {/* Filter Section */}
      <FilterCard>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <FilterListIcon sx={{ color: ACCENT }} />
          <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 600 }}>Filters</Typography>
          {(selectedClients.length > 0 || searchTerm || departmentFilter) && (
            <Button variant="outlined" size="small" onClick={clearFilters} sx={{ ml: 'auto' }}>
              Clear Filters
            </Button>
          )}
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <ListItem button onClick={() => setClientsExpanded(!clientsExpanded)} sx={{ bgcolor: 'rgba(79,141,253,0.05)' }}>
                <ListItemIcon><BusinessIcon sx={{ color: ACCENT }} /></ListItemIcon>
                <ListItemText primary="Clients" secondary={`${selectedClients.length} selected`} />
                {clientsExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={clientsExpanded} timeout="auto" unmountOnExit>
                <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {clients.map(client => (
                    <ListItem key={client.clientId} dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedClients.includes(client.clientId)}
                            onChange={() => handleClientSelect(client.clientId)}
                            sx={{ color: ACCENT }}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ bgcolor: ACCENT, width: 24, height: 24, fontSize: '0.75rem' }}>
                              {client.clientName?.[0] || '?'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">{client.clientName || 'N/A'}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {client.contactPerson || 'N/A'}
                              </Typography>
                            </Box>
                          </Stack>
                        }
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleInfoClick(client)}
                        sx={{ ml: 'auto' }}
                      >
                        <InfoIcon fontSize="small" sx={{ color: ACCENT }} />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentFilter}
                label="Department"
                onChange={e => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </FilterCard>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Clients
                  </Typography>
                  <Typography variant="h4" sx={{ color: ACCENT, fontWeight: 'bold' }}>
                    {filteredClients.length}
                  </Typography>
                </Box>
                <GroupIcon sx={{ fontSize: 40, color: ACCENT, opacity: 0.7 }} />
              </Stack>
            </CardContent>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Projects
                  </Typography>
                  <Typography variant="h4" sx={{ color: ACCENT3, fontWeight: 'bold' }}>
                    {projects.filter(p => !p.endDate || new Date(p.endDate) >= new Date()).length}
                  </Typography>
                </Box>
                <WorkIcon sx={{ fontSize: 40, color: ACCENT3, opacity: 0.7 }} />
              </Stack>
            </CardContent>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Open Tickets
                  </Typography>
                  <Typography variant="h4" sx={{ color: ACCENT4, fontWeight: 'bold' }}>
                    {tickets.filter(t => t.status === 'OPEN').length}
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40, color: ACCENT4, opacity: 0.7 }} />
              </Stack>
            </CardContent>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Average Projects per Client
                  </Typography>
                  <Typography variant="h4" sx={{ color: ACCENT2, fontWeight: 'bold' }}>
                    {filteredClients.length > 0
                      ? (projects.length / filteredClients.length).toFixed(1)
                      : 0}
                  </Typography>
                </Box>
                <WorkIcon sx={{ fontSize: 40, color: ACCENT2, opacity: 0.7 }} />
              </Stack>
            </CardContent>
          </InfoCard>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <DashboardPaper>
            <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
              Number of Projects per Client (Top 10)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectsPerClientData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip formatter={(value) => `${value} projects`} />
                <Bar dataKey="projects" fill={ACCENT2} name="Projects" />
              </BarChart>
              {projectsPerClientData.length === 0 && (
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#666">
                  No data available
                </text>
              )}
            </ResponsiveContainer>
          </DashboardPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardPaper>
            <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
              Client Ticket Volume (Top 8)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketVolumeData}
                  cx="50%"
                  cy="50%"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {ticketVolumeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} tickets`} />
                {ticketVolumeData.length === 0 && (
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#666">
                    No data available
                  </text>
                )}
              </PieChart>
            </ResponsiveContainer>
          </DashboardPaper>
        </Grid>
        <Grid item xs={12}>
          <DashboardPaper>
            <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
              Active Projects Timeline
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} active projects`} />
                <Line type="monotone" dataKey="activeProjects" stroke={ACCENT3} name="Active Projects" />
              </LineChart>
            </ResponsiveContainer>
          </DashboardPaper>
        </Grid>
      </Grid>

      {/* Client List */}
      <DashboardPaper>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 600 }}>
            Client List ({filteredClients.length})
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                sx: { minWidth: 250 },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={e => setSortBy(e.target.value)}
              >
                <MenuItem value="clientName">Name</MenuItem>
                <MenuItem value="projects">Number of Projects</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                label="Order"
                onChange={e => setSortOrder(e.target.value)}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
            <ToggleButtonGroup
              value={viewDensity}
              exclusive
              onChange={(e, newDensity) => newDensity && setViewDensity(newDensity)}
              size="small"
            >
              <ToggleButton value="compact" aria-label="compact view">
                <ViewListIcon />
              </ToggleButton>
              <ToggleButton value="comfortable" aria-label="comfortable view">
                <ViewModuleIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={24}>24</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {(searchTerm || departmentFilter || sortBy !== 'clientName' || sortOrder !== 'asc') && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                Active Filters:
              </Typography>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  size="small"
                  onDelete={() => setSearchTerm('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {departmentFilter && (
                <Chip
                  label={`Department: ${
                    departments.find(d => d.departmentId === parseInt(departmentFilter))?.departmentName || 'N/A'
                  }`}
                  size="small"
                  onDelete={() => setDepartmentFilter('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {(sortBy !== 'clientName' || sortOrder !== 'asc') && (
                <Chip
                  label={`Sort by: ${sortBy === 'clientName' ? 'Name' : 'Projects'} (${
                    sortOrder === 'asc' ? 'Asc' : 'Desc'
                  })`}
                  size="small"
                  onDelete={() => {
                    setSortBy('clientName');
                    setSortOrder('asc');
                  }}
                  color="primary"
                  variant="outlined"
                />
              )}
              <Button size="small" onClick={clearFilters} sx={{ ml: 1 }}>
                Clear All
              </Button>
            </Stack>
          </Box>
        )}

        {paginatedClients.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SearchOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Clients Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={viewDensity === 'compact' ? 1 : 2}>
              {paginatedClients.map(client => {
                const clientProjects = projects.filter(p => p.clientId === client.clientId);
                const completionRate =
                  clientProjects.length > 0
                    ? ((clientProjects.filter(p => p.status === 'COMPLETED').length / clientProjects.length) * 100).toFixed(1)
                    : 0;

                return (
                  <Grid
                    item
                    xs={12}
                    sm={viewDensity === 'compact' ? 12 : 6}
                    md={viewDensity === 'compact' ? 6 : 4}
                    lg={viewDensity === 'compact' ? 4 : 3}
                    key={client.clientId}
                  >
                    <Card
                      sx={{
                        borderRadius: 3,
                        transition: 'all 0.3s',
                        height: '100%',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        },
                        border: clientProjects.length > 5 ? `2px solid ${ACCENT4}` : '1px solid #e0e0e0',
                      }}
                    >
                      <CardContent sx={{ p: viewDensity === 'compact' ? 2 : 3 }}>
                        {viewDensity === 'compact' ? (
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                              sx={{
                                bgcolor: clientProjects.length > 5 ? ACCENT4 : ACCENT,
                                fontWeight: 'bold',
                                width: 40,
                                height: 40,
                              }}
                            >
                              {client.clientName?.[0] || '?'}
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600, fontSize: '0.95rem' }}
                                    noWrap
                                  >
                                    {client.clientName || 'N/A'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" noWrap>
                                    {client.contactPerson || 'N/A'}
                                  </Typography>
                                </Box>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Chip
                                    label={`${clientProjects.length} projects`}
                                    size="small"
                                    sx={{ bgcolor: `${ACCENT2}20`, color: ACCENT2, fontWeight: 600 }}
                                  />
                                  <IconButton size="small" onClick={() => handleInfoClick(client)}>
                                    <InfoIcon sx={{ color: ACCENT }} />
                                  </IconButton>
                                </Stack>
                              </Stack>
                            </Box>
                          </Stack>
                        ) : (
                          <>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              sx={{ mb: 2 }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                  sx={{
                                    bgcolor: clientProjects.length > 5 ? ACCENT4 : ACCENT,
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {client.clientName?.[0] || '?'}
                                </Avatar>
                                <Box>
                                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                    {client.clientName || 'N/A'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {client.contactPerson || 'N/A'}
                                  </Typography>
                                </Box>
                              </Stack>
                              <IconButton size="small" onClick={() => handleInfoClick(client)}>
                                <InfoIcon sx={{ color: ACCENT }} />
                              </IconButton>
                            </Stack>

                            <Stack spacing={1} sx={{ mb: 2 }}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <EmailIcon fontSize="small" color="action" />
                                <Typography variant="body2" noWrap>
                                  {client.email || 'N/A'}
                                </Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <PhoneIcon fontSize="small" color="action" />
                                <Typography variant="body2">{client.phone || 'N/A'}</Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <LocationOnIcon fontSize="small" color="action" />
                                <Typography variant="body2" noWrap>
                                  {client.contractDate || 'N/A'}
                                </Typography>
                              </Stack>
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                  Projects
                                </Typography>
                                <Typography variant="h6" sx={{ color: ACCENT3, fontWeight: 600 }}>
                                  {clientProjects.length}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                  Completion Rate
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={parseFloat(completionRate)}
                                  sx={{
                                    mt: 0.5,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#f0f0f0',
                                    '& .MuiLinearProgress-bar': { backgroundColor: ACCENT4 },
                                  }}
                                />
                                <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                                  {completionRate}%
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Page {currentPage} of {totalPages} ({filteredClients.length} clients)
                  </Typography>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                      },
                      '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: ACCENT,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: ACCENT,
                          opacity: 0.8,
                        },
                      },
                    }}
                  />
                </Stack>
              </Box>
            )}
          </>
        )}
      </DashboardPaper>

      <ClientInfoDialog open={showInfo} onClose={() => setShowInfo(false)} client={selectedInfo} />
      <AddClientForm open={showAddForm} onClose={() => setShowAddForm(false)} />
    </Box>
  );
};

export default Client;