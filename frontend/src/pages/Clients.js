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
  Fade,
  Zoom,
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
  Backdrop,
  FormControlLabel,
  Button,
  LinearProgress,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  DialogActions
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import InfoIcon from '@mui/icons-material/Info';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import PhoneIcon from '@mui/icons-material/Phone';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import StarIcon from '@mui/icons-material/Star';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Scatter, ScatterChart, ZAxis
} from 'recharts';
import { styled } from '@mui/material/styles';

const ACCENT = '#4F8DFD';
const ACCENT2 = '#00C49F';
const ACCENT3 = '#FFBB28';
const ACCENT4 = '#FF8042';
const ACCENT5 = '#8884D8';
const ACCENT6 = '#82CA9D';

const DashboardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
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
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [clientsExpanded, setClientsExpanded] = useState(false);
  const [typesExpanded, setTypesExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [viewDensity, setViewDensity] = useState('comfortable');
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpToPage, setJumpToPage] = useState('');


  // Mock data for clients with comprehensive information
  const clients = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      contactPerson: 'Jean Dupont',
      email: 'jean.dupont@techcorp.com',
      phone: '+33 1 23 45 67 89',
      contractDate: '2020-03-15',
      type: 'Entreprise',
      sector: 'Technologie',
      ticketsPerMonth: 12,
      avgResolutionTime: 2.3, // days
      projectsDelivered: 15,
      avgProjectDuration: 45, // days
      clientAge: 1460, // days since contract
      ticketsOnTime: 85,
      ticketsLate: 15,
      projectsOnTime: 12,
      projectsLate: 3,
      satisfaction: 88,
      avatar: 'TC',
      status: 'Actif',
      revenue: 450000,
      currentProjects: ['ERP Migration', 'Mobile App'],
      upcomingDeadlines: ['2024-02-15', '2024-03-10'],
      priority: 'High',
      tags: ['VIP', 'Tech', 'Long-term']
    },
    {
      id: 2,
      name: 'Green Energy Ltd',
      contactPerson: 'Marie Martin',
      email: 'marie.martin@greenenergy.com',
      phone: '+33 1 98 76 54 32',
      contractDate: '2021-07-22',
      type: 'PME',
      sector: 'Énergie',
      ticketsPerMonth: 8,
      avgResolutionTime: 1.8,
      projectsDelivered: 8,
      avgProjectDuration: 30,
      clientAge: 950,
      ticketsOnTime: 92,
      ticketsLate: 8,
      projectsOnTime: 7,
      projectsLate: 1,
      satisfaction: 92,
      avatar: 'GE',
      status: 'Actif',
      revenue: 280000,
      currentProjects: ['Solar Dashboard'],
      upcomingDeadlines: ['2024-02-28'],
      priority: 'Medium',
      tags: ['Sustainable', 'Growing']
    },
    {
      id: 3,
      name: 'FinanceFirst Bank',
      contactPerson: 'Pierre Leblanc',
      email: 'p.leblanc@financefirst.com',
      phone: '+33 1 11 22 33 44',
      contractDate: '2019-11-10',
      type: 'Grande Entreprise',
      sector: 'Finance',
      ticketsPerMonth: 25,
      avgResolutionTime: 1.2,
      projectsDelivered: 22,
      avgProjectDuration: 60,
      clientAge: 1600,
      ticketsOnTime: 78,
      ticketsLate: 22,
      projectsOnTime: 18,
      projectsLate: 4,
      satisfaction: 85,
      avatar: 'FF',
      status: 'Actif',
      revenue: 890000,
      currentProjects: ['Security Audit', 'API Integration', 'Mobile Banking'],
      upcomingDeadlines: ['2024-01-30', '2024-03-15', '2024-04-20'],
      priority: 'High',
      tags: ['VIP', 'Finance', 'Critical']
    },
    {
      id: 4,
      name: 'HealthCare Plus',
      contactPerson: 'Dr. Sophie Bernard',
      email: 'sophie.bernard@healthcareplus.com',
      phone: '+33 1 55 66 77 88',
      contractDate: '2022-01-15',
      type: 'Startup',
      sector: 'Santé',
      ticketsPerMonth: 5,
      avgResolutionTime: 3.1,
      projectsDelivered: 4,
      avgProjectDuration: 25,
      clientAge: 745,
      ticketsOnTime: 88,
      ticketsLate: 12,
      projectsOnTime: 3,
      projectsLate: 1,
      satisfaction: 90,
      avatar: 'HP',
      status: 'Actif',
      revenue: 120000,
      currentProjects: ['Patient Portal'],
      upcomingDeadlines: ['2024-02-20'],
      priority: 'Medium',
      tags: ['Healthcare', 'Innovation']
    },
    {
      id: 5,
      name: 'RetailMaster Group',
      contactPerson: 'Antoine Rousseau',
      email: 'a.rousseau@retailmaster.com',
      phone: '+33 1 33 44 55 66',
      contractDate: '2018-06-01',
      type: 'Grande Entreprise',
      sector: 'Commerce',
      ticketsPerMonth: 18,
      avgResolutionTime: 2.8,
      projectsDelivered: 28,
      avgProjectDuration: 35,
      clientAge: 2050,
      ticketsOnTime: 82,
      ticketsLate: 18,
      projectsOnTime: 24,
      projectsLate: 4,
      satisfaction: 86,
      avatar: 'RM',
      status: 'Actif',
      revenue: 650000,
      currentProjects: ['E-commerce Platform', 'Inventory System'],
      upcomingDeadlines: ['2024-02-10', '2024-03-05'],
      priority: 'High',
      tags: ['Retail', 'E-commerce', 'Long-term']
    },
    {
      id: 6,
      name: 'EduTech Academy',
      contactPerson: 'Clara Moreau',
      email: 'clara.moreau@edutech.com',
      phone: '+33 1 77 88 99 00',
      contractDate: '2023-03-20',
      type: 'PME',
      sector: 'Éducation',
      ticketsPerMonth: 6,
      avgResolutionTime: 2.0,
      projectsDelivered: 3,
      avgProjectDuration: 20,
      clientAge: 315,
      ticketsOnTime: 95,
      ticketsLate: 5,
      projectsOnTime: 3,
      projectsLate: 0,
      satisfaction: 94,
      avatar: 'EA',
      status: 'Nouveau',
      revenue: 95000,
      currentProjects: ['LMS Platform'],
      upcomingDeadlines: ['2024-02-25'],
      priority: 'Medium',
      tags: ['Education', 'New']
    }
  ];

  const clientTypes = [
    { name: 'Grande Entreprise', count: 2, avgRevenue: 770000 },
    { name: 'PME', count: 2, avgRevenue: 187500 },
    { name: 'Startup', count: 1, avgRevenue: 120000 },
    { name: 'Entreprise', count: 1, avgRevenue: 450000 }
  ];

  // Filter clients based on selections
  const filteredClients = useMemo(() => {
    if (selectedTypes.length === 0 && selectedClients.length === 0) {
      return clients;
    }
    
    return clients.filter(client => {
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(client.type);
      const clientMatch = selectedClients.length === 0 || selectedClients.includes(client.id);
      return typeMatch && clientMatch;
    });
  }, [selectedClients, selectedTypes]);

  // Generate performance data over time
  const performanceData = useMemo(() => {
    const baseData = [
      { month: 'Jan', satisfaction: 85, tickets: 68, resolutionTime: 2.5, revenue: 180000 },
      { month: 'Fév', satisfaction: 87, tickets: 72, resolutionTime: 2.3, revenue: 195000 },
      { month: 'Mar', satisfaction: 89, tickets: 75, resolutionTime: 2.1, revenue: 210000 },
      { month: 'Avr', satisfaction: 88, tickets: 78, resolutionTime: 2.0, revenue: 225000 },
      { month: 'Mai', satisfaction: 90, tickets: 82, resolutionTime: 1.9, revenue: 240000 },
      { month: 'Jun', satisfaction: 91, tickets: 85, resolutionTime: 1.8, revenue: 255000 }
    ];

    if (filteredClients.length === 0) return baseData;

    const avgSatisfaction = filteredClients.reduce((sum, client) => sum + client.satisfaction, 0) / filteredClients.length;
    const totalRevenue = filteredClients.reduce((sum, client) => sum + client.revenue, 0);
    const multiplier = avgSatisfaction / 88;

    return baseData.map(month => ({
      ...month,
      satisfaction: Math.round(month.satisfaction * multiplier),
      revenue: Math.round(totalRevenue / 6)
    }));
  }, [filteredClients]);
// Application des filtres de recherche, de priorité et de secteur
const searchedClients = useMemo(() => {
  return filteredClients.filter(client => {
    const matchSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = priorityFilter ? client.priority === priorityFilter : true;
    const matchSector = sectorFilter ? client.sector.toLowerCase().includes(sectorFilter.toLowerCase()) : true;
    return matchSearch && matchPriority && matchSector;
  });
}, [filteredClients, searchTerm, priorityFilter, sectorFilter]);

// Pagination
const totalPages = Math.ceil(searchedClients.length / itemsPerPage);
const paginatedClients = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  return searchedClients.slice(start, start + itemsPerPage);
}, [searchedClients, currentPage, itemsPerPage]);

  // Ticket resolution analysis
  const ticketAnalysis = useMemo(() => {
    return filteredClients.map(client => ({
      name: client.name.substring(0, 15) + '...',
      onTime: client.ticketsOnTime,
      late: client.ticketsLate,
      satisfaction: client.satisfaction,
      avgTime: client.avgResolutionTime
    }));
  }, [filteredClients]);

  // Project delivery analysis
  const projectAnalysis = useMemo(() => {
    return [
      { name: 'Projets À Temps', value: filteredClients.reduce((sum, c) => sum + c.projectsOnTime, 0), color: ACCENT2 },
      { name: 'Projets En Retard', value: filteredClients.reduce((sum, c) => sum + c.projectsLate, 0), color: ACCENT4 }
    ];
  }, [filteredClients]);

  // Sector distribution
  const sectorData = useMemo(() => {
    const sectors = {};
    filteredClients.forEach(client => {
      sectors[client.sector] = (sectors[client.sector] || 0) + 1;
    });
    
    return Object.entries(sectors).map(([sector, count]) => ({
      name: sector,
      value: count
    }));
  }, [filteredClients]);

  // Client performance radar
  const clientRadarData = useMemo(() => {
    if (filteredClients.length === 0) return [];
    
    const avgMetrics = filteredClients.reduce((acc, client) => {
      acc.satisfaction += client.satisfaction;
      acc.onTimeDelivery += (client.projectsOnTime / (client.projectsOnTime + client.projectsLate)) * 100;
      acc.ticketResolution += (client.ticketsOnTime / (client.ticketsOnTime + client.ticketsLate)) * 100;
      acc.projectEfficiency += Math.max(0, 100 - (client.avgProjectDuration - 20)); // Normalized
      acc.responseTime += Math.max(0, 100 - (client.avgResolutionTime * 20)); // Normalized
      return acc;
    }, { satisfaction: 0, onTimeDelivery: 0, ticketResolution: 0, projectEfficiency: 0, responseTime: 0 });

    const count = filteredClients.length;
    return [
      { subject: 'Satisfaction', A: Math.round(avgMetrics.satisfaction / count), fullMark: 100 },
      { subject: 'Livraison À Temps', A: Math.round(avgMetrics.onTimeDelivery / count), fullMark: 100 },
      { subject: 'Résolution Tickets', A: Math.round(avgMetrics.ticketResolution / count), fullMark: 100 },
      { subject: 'Efficacité Projets', A: Math.round(avgMetrics.projectEfficiency / count), fullMark: 100 },
      { subject: 'Temps de Réponse', A: Math.round(avgMetrics.responseTime / count), fullMark: 100 },
    ];
  }, [filteredClients]);

  const COLORS = [ACCENT, ACCENT2, ACCENT3, ACCENT4, ACCENT5, ACCENT6];

  // Add Client Form Component
  const AddClientForm = ({ open, onClose }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [clientData, setClientData] = useState({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      type: '',
      sector: '',
      priority: 'Medium',
      projects: [],
      expectedDeadline: ''
    });

    const steps = [
      'Informations Générales',
      'Détails Business',
      'Projets & Échéances'
    ];

    const handleNext = () => setActiveStep(prev => prev + 1);
    const handleBack = () => setActiveStep(prev => prev - 1);
    const handleReset = () => {
      setActiveStep(0);
      setClientData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        type: '',
        sector: '',
        priority: 'Medium',
        projects: [],
        expectedDeadline: ''
      });
    };

    const handleSubmit = () => {
      console.log('Nouveau client:', clientData);
      onClose();
      handleReset();
    };

    return (
      <InfoDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT2} 100%)`,
          color: 'white',
          m: -2,
          mb: 2,
          borderRadius: '20px 20px 0 0'
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Ajouter un Nouveau Client
            </Typography>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Informations Générales</StepLabel>
              <StepContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nom de l'entreprise"
                      value={clientData.name}
                      onChange={(e) => setClientData({...clientData, name: e.target.value})}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Personne de contact"
                      value={clientData.contactPerson}
                      onChange={(e) => setClientData({...clientData, contactPerson: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={clientData.email}
                      onChange={(e) => setClientData({...clientData, email: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Téléphone"
                      value={clientData.phone}
                      onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Button onClick={handleNext} variant="contained">
                    Suivant
                  </Button>
                </Box>
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Détails Business</StepLabel>
              <StepContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Type d'entreprise"
                      value={clientData.type}
                      onChange={(e) => setClientData({...clientData, type: e.target.value})}
                    >
                      <MenuItem value="Startup">Startup</MenuItem>
                      <MenuItem value="PME">PME</MenuItem>
                      <MenuItem value="Entreprise">Entreprise</MenuItem>
                      <MenuItem value="Grande Entreprise">Grande Entreprise</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Secteur d'activité"
                      value={clientData.sector}
                      onChange={(e) => setClientData({...clientData, sector: e.target.value})}
                    >
                      <MenuItem value="Technologie">Technologie</MenuItem>
                      <MenuItem value="Finance">Finance</MenuItem>
                      <MenuItem value="Santé">Santé</MenuItem>
                      <MenuItem value="Éducation">Éducation</MenuItem>
                      <MenuItem value="Commerce">Commerce</MenuItem>
                      <MenuItem value="Énergie">Énergie</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Priorité"
                      value={clientData.priority}
                      onChange={(e) => setClientData({...clientData, priority: e.target.value})}
                    >
                      <MenuItem value="Low">Basse</MenuItem>
                      <MenuItem value="Medium">Moyenne</MenuItem>
                      <MenuItem value="High">Haute</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Retour
                  </Button>
                  <Button onClick={handleNext} variant="contained">
                    Suivant
                  </Button>
                </Box>
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Projets & Échéances</StepLabel>
              <StepContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Projets initiaux (séparés par des virgules)"
                      multiline
                      rows={3}
                      value={clientData.projects.join(', ')}
                      onChange={(e) => setClientData({...clientData, projects: e.target.value.split(', ')})}
                      placeholder="Ex: Site web, Application mobile, Système de gestion"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Date limite prévue"
                      type="date"
                      value={clientData.expectedDeadline}
                      onChange={(e) => setClientData({...clientData, expectedDeadline: e.target.value})}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Retour
                  </Button>
                  <Button onClick={handleSubmit} variant="contained" color="success">
                    Créer le Client
                  </Button>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
      </InfoDialog>
    );
  };

  const handleInfoClick = (item, type) => {
    setSelectedInfo({ item, type });
    setShowInfo(true);
  };

  const handleClientSelect = (clientId) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleTypeSelect = (typeName) => {
    setSelectedTypes(prev =>
      prev.includes(typeName)
        ? prev.filter(name => name !== typeName)
        : [...prev, typeName]
    );
  };

  const clearFilters = () => {
    setSelectedClients([]);
    setSelectedTypes([]);
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      background: 'linear-gradient(120deg, #fafdff 70%, #e3f0ff 100%)', 
      minHeight: '100vh' 
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            fontWeight: 800, 
            color: ACCENT, 
            textShadow: '0 2px 4px rgba(79,141,253,0.1)'
          }}
        >
          Espace Client
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
          sx={{
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT2} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${ACCENT} 20%, ${ACCENT2} 120%)`,
            },
          }}
        >
          Ajouter un client
        </Button>
      </Box>

      {/* Filter Section */}
      <FilterCard>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <FilterListIcon sx={{ color: ACCENT }} />
          <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 600 }}>
            Filtres
          </Typography>
          {(selectedClients.length > 0 || selectedTypes.length > 0) && (
            <Button 
              variant="outlined" 
              size="small" 
              onClick={clearFilters}
              sx={{ ml: 'auto' }}
            >
              Effacer les filtres
            </Button>
          )}
        </Stack>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <ListItem 
                button 
                onClick={() => setClientsExpanded(!clientsExpanded)}
                sx={{ bgcolor: 'rgba(79,141,253,0.05)' }}
              >
                <ListItemIcon>
                  <BusinessIcon sx={{ color: ACCENT }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Clients" 
                  secondary={`${selectedClients.length} sélectionné(s)`}
                />
                {clientsExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={clientsExpanded} timeout="auto" unmountOnExit>
                <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {clients.map((client) => (
                    <ListItem key={client.id} dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedClients.includes(client.id)}
                            onChange={() => handleClientSelect(client.id)}
                            sx={{ color: ACCENT }}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ bgcolor: ACCENT, width: 24, height: 24, fontSize: '0.75rem' }}>
                              {client.avatar}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">{client.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {client.type} - {client.sector}
                              </Typography>
                            </Box>
                          </Stack>
                        }
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleInfoClick(client, 'client')}
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
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <ListItem 
                button 
                onClick={() => setTypesExpanded(!typesExpanded)}
                sx={{ bgcolor: 'rgba(79,141,253,0.05)' }}
              >
                <ListItemIcon>
                  <WorkIcon sx={{ color: ACCENT }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Types d'entreprise" 
                  secondary={`${selectedTypes.length} sélectionné(s)`}
                />
                {typesExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={typesExpanded}
              timeout="auto" unmountOnExit>
                <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {clientTypes.map((type) => (
                    <ListItem key={type.name} dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedTypes.includes(type.name)}
                            onChange={() => handleTypeSelect(type.name)}
                            sx={{ color: ACCENT }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2">{type.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.count} clients - €{type.avgRevenue.toLocaleString()} moyen
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Paper>
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
                    Revenus Totaux
                  </Typography>
                  <Typography variant="h4" sx={{ color: ACCENT2, fontWeight: 'bold' }}>
                    €{filteredClients.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: ACCENT2, opacity: 0.7 }} />
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
                    Satisfaction Moyenne
                  </Typography>
                  <Typography variant="h4" sx={{ color: ACCENT3, fontWeight: 'bold' }}>
                    {filteredClients.length > 0 
                      ? Math.round(filteredClients.reduce((sum, c) => sum + c.satisfaction, 0) / filteredClients.length)
                      : 0}%
                  </Typography>
                </Box>
                <StarIcon sx={{ fontSize: 40, color: ACCENT3, opacity: 0.7 }} />
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
                    Projets Actifs
                  </Typography>
                  <Typography variant="h4" sx={{ color: ACCENT4, fontWeight: 'bold' }}>
                    {filteredClients.reduce((sum, c) => sum + c.currentProjects.length, 0)}
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40, color: ACCENT4, opacity: 0.7 }} />
              </Stack>
            </CardContent>
          </InfoCard>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <DashboardPaper>
            <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
              Performance dans le Temps
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: `1px solid ${ACCENT}`, 
                    borderRadius: 8 
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke={ACCENT} 
                  strokeWidth={3}
                  dot={{ fill: ACCENT, strokeWidth: 2, r: 4 }}
                  name="Satisfaction (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="tickets" 
                  stroke={ACCENT2} 
                  strokeWidth={3}
                  dot={{ fill: ACCENT2, strokeWidth: 2, r: 4 }}
                  name="Tickets Résolus"
                />
              </LineChart>
            </ResponsiveContainer>
          </DashboardPaper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <DashboardPaper>
            <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
              Répartition par Secteur
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </DashboardPaper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6}>
          <DashboardPaper>
            <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
              Analyse des Tickets
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Bar dataKey="onTime" stackId="a" fill={ACCENT2} name="À Temps" />
                <Bar dataKey="late" stackId="a" fill={ACCENT4} name="En Retard" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardPaper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <DashboardPaper>
            <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
              Performance Globale
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={clientRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Performance"
                  dataKey="A"
                  stroke={ACCENT}
                  fill={ACCENT}
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </DashboardPaper>
        </Grid>
      </Grid>

      {/* Client List */}
      <DashboardPaper>
        {/* Header with Controls */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 600 }}>
            Liste des Clients ({filteredClients.length})
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            {/* Search Bar */}
            <TextField
              size="small"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                sx: { minWidth: 250 }
              }}
            />
            
            {/* Priority Filter */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Priorité</InputLabel>
              <Select
                value={priorityFilter}
                label="Priorité"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="">Toutes</MenuItem>
                <MenuItem value="High">Haute</MenuItem>
                <MenuItem value="Medium">Moyenne</MenuItem>
                <MenuItem value="Low">Basse</MenuItem>
              </Select>
            </FormControl>
            
            {/* Sector Filter */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Secteur</InputLabel>
              <Select
                value={sectorFilter}
                label="Secteur"
                onChange={(e) => setSectorFilter(e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="E-commerce">E-commerce</MenuItem>
                <MenuItem value="Santé">Santé</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Immobilier">Immobilier</MenuItem>
              </Select>
            </FormControl>

            {/* View Density Toggle */}
            <ToggleButtonGroup
              value={viewDensity}
              exclusive
              onChange={(e, newDensity) => newDensity && setViewDensity(newDensity)}
              size="small"
            >
              <ToggleButton value="compact" aria-label="vue compacte">
                <ViewListIcon />
              </ToggleButton>
              <ToggleButton value="comfortable" aria-label="vue confortable">
                <ViewModuleIcon />
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Items per page selector */}
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(e.target.value);
                  setCurrentPage(1);
                }}
                displayEmpty
              >
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={24}>24</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {/* Results Summary */}
        {(searchTerm || priorityFilter || sectorFilter) && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                Filtres actifs:
              </Typography>
              {searchTerm && (
                <Chip
                  label={`Recherche: "${searchTerm}"`}
                  size="small"
                  onDelete={() => setSearchTerm('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {priorityFilter && (
                <Chip
                  label={`Priorité: ${priorityFilter}`}
                  size="small"
                  onDelete={() => setPriorityFilter('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {sectorFilter && (
                <Chip
                  label={`Secteur: ${sectorFilter}`}
                  size="small"
                  onDelete={() => setSectorFilter('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              <Button
                size="small"
                onClick={() => {
                  setSearchTerm('');
                  setPriorityFilter('');
                  setSectorFilter('');
                }}
                sx={{ ml: 1 }}
              >
                Effacer tout
              </Button>
            </Stack>
          </Box>
        )}

        {/* No Results Message */}
        {paginatedClients.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SearchOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucun client trouvé
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Essayez de modifier vos critères de recherche
            </Typography>
          </Box>
        ) : (
          <>
            {/* Client Grid */}
            <Grid container spacing={viewDensity === 'compact' ? 1 : 2}>
              {paginatedClients.map((client) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={viewDensity === 'compact' ? 12 : 6} 
                  md={viewDensity === 'compact' ? 6 : 4} 
                  lg={viewDensity === 'compact' ? 4 : 4}
                  xl={viewDensity === 'compact' ? 3 : 4}
                  key={client.id}
                >
                  <Card sx={{ 
                    borderRadius: 3, 
                    transition: 'all 0.3s',
                    height: viewDensity === 'compact' ? 'auto' : '100%',
                    '&:hover': { 
                      transform: 'translateY(-4px)', 
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)' 
                    },
                    border: client.priority === 'High' ? `2px solid ${ACCENT4}` : '1px solid #e0e0e0'
                  }}>
                    <CardContent sx={{ p: viewDensity === 'compact' ? 2 : 3 }}>
                      {viewDensity === 'compact' ? (
                        // Compact View
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ 
                            bgcolor: client.priority === 'High' ? ACCENT4 : ACCENT,
                            fontWeight: 'bold',
                            width: 40,
                            height: 40
                          }}>
                            {client.avatar}
                          </Avatar>
                          
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }} noWrap>
                                  {client.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  {client.contactPerson} • {client.sector}
                                </Typography>
                              </Box>
                              
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Chip 
                                  label={`${client.satisfaction}%`}
                                  size="small"
                                  sx={{ 
                                    bgcolor: client.satisfaction >= 90 ? `${ACCENT2}20` : 
                                          client.satisfaction >= 80 ? `${ACCENT3}20` : `${ACCENT4}20`,
                                    color: client.satisfaction >= 90 ? ACCENT2 : 
                                        client.satisfaction >= 80 ? ACCENT3 : ACCENT4,
                                    fontWeight: 600,
                                    minWidth: 50
                                  }}
                                />
                                <Typography variant="body2" sx={{ color: ACCENT2, fontWeight: 600, minWidth: 60 }}>
                                  €{(client.revenue / 1000).toFixed(0)}k
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleInfoClick(client, 'client')}
                                >
                                  <InfoIcon sx={{ color: ACCENT }} />
                                </IconButton>
                              </Stack>
                            </Stack>
                          </Box>
                        </Stack>
                      ) : (
                        // Comfortable View (original design)
                        <>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar sx={{ 
                                bgcolor: client.priority === 'High' ? ACCENT4 : ACCENT,
                                fontWeight: 'bold'
                              }}>
                                {client.avatar}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                  {client.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {client.contactPerson}
                                </Typography>
                              </Box>
                            </Stack>
                            <IconButton 
                              size="small" 
                              onClick={() => handleInfoClick(client, 'client')}
                            >
                              <InfoIcon sx={{ color: ACCENT }} />
                            </IconButton>
                          </Stack>

                          <Stack spacing={1} sx={{ mb: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <BusinessIcon fontSize="small" color="action" />
                              <Typography variant="body2">{client.type} - {client.sector}</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <EmailIcon fontSize="small" color="action" />
                              <Typography variant="body2" noWrap>{client.email}</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <PhoneIcon fontSize="small" color="action" />
                              <Typography variant="body2">{client.phone}</Typography>
                            </Stack>
                          </Stack>

                          <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
                            {client.tags.slice(0, 2).map((tag) => (
                              <Chip 
                                key={tag} 
                                label={tag} 
                                size="small" 
                                sx={{ 
                                  bgcolor: `${ACCENT}20`, 
                                  color: ACCENT,
                                  fontWeight: 500
                                }} 
                              />
                            ))}
                            {client.tags.length > 2 && (
                              <Chip 
                                label={`+${client.tags.length - 2}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                          </Stack>

                          <Divider sx={{ my: 2 }} />

                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                Satisfaction
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={client.satisfaction} 
                                sx={{ 
                                  mt: 0.5, 
                                  height: 8, 
                                  borderRadius: 4,
                                  backgroundColor: '#f0f0f0',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: client.satisfaction >= 90 ? ACCENT2 : 
                                                  client.satisfaction >= 80 ? ACCENT3 : ACCENT4
                                  }
                                }} 
                              />
                              <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                                {client.satisfaction}%
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                Revenus
                              </Typography>
                              <Typography variant="h6" sx={{ color: ACCENT2, fontWeight: 600 }}>
                                €{client.revenue.toLocaleString()}
                              </Typography>
                            </Grid>
                          </Grid>

                          {client.currentProjects.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                Projets en cours:
                              </Typography>
                              <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }} flexWrap="wrap">
                                {client.currentProjects.slice(0, 2).map((project, idx) => (
                                  <Chip 
                                    key={idx} 
                                    label={project} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                ))}
                                {client.currentProjects.length > 2 && (
                                  <Chip 
                                    label={`+${client.currentProjects.length - 2}`} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                )}
                              </Stack>
                            </Box>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Page {currentPage} sur {totalPages} ({filteredClients.length} clients)
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

                  {/* Quick Jump */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Aller à:
                    </Typography>
                    <TextField
                      size="small"
                      type="number"
                      value={jumpToPage}
                      onChange={(e) => setJumpToPage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const page = parseInt(jumpToPage);
                          if (page >= 1 && page <= totalPages) {
                            setCurrentPage(page);
                            setJumpToPage('');
                          }
                        }
                      }}
                      sx={{ 
                        width: 80,
                        '& input': { textAlign: 'center' }
                      }}
                      inputProps={{ 
                        min: 1, 
                        max: totalPages,
                        placeholder: currentPage
                      }}
                    />
                  </Stack>
                </Stack>
              </Box>
            )}
          </>
        )}
      </DashboardPaper>

      {/* Info Dialog */}
      <InfoDialog open={showInfo} onClose={() => setShowInfo(false)} maxWidth="md" fullWidth>
        {selectedInfo && (
          <>
            <DialogTitle sx={{ 
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT2} 100%)`,
              color: 'white',
              m: -2,
              mb: 2,
              borderRadius: '20px 20px 0 0'
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedInfo.type === 'client' ? selectedInfo.item.name : selectedInfo.item.name}
                </Typography>
                <IconButton onClick={() => setShowInfo(false)} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              {selectedInfo.type === 'client' && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <InfoCard sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, color: ACCENT }}>
                          Informations Générales
                        </Typography>
                        <Stack spacing={2}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <PersonIcon color="action" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">Contact</Typography>
                              <Typography variant="body1">{selectedInfo.item.contactPerson}</Typography>
                            </Box>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <EmailIcon color="action" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">Email</Typography>
                              <Typography variant="body1">{selectedInfo.item.email}</Typography>
                            </Box>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <PhoneIcon color="action" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">Téléphone</Typography>
                              <Typography variant="body1">{selectedInfo.item.phone}</Typography>
                            </Box>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <CalendarTodayIcon color="action" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">Date de contrat</Typography>
                              <Typography variant="body1">{selectedInfo.item.contractDate}</Typography>
                            </Box>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </InfoCard>

                    <InfoCard>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, color: ACCENT }}>
                          Projets en Cours
                        </Typography>
                        <Stack spacing={1}>
                          {selectedInfo.item.currentProjects.map((project, idx) => (
                            <Chip 
                              key={idx} 
                              label={project} 
                              sx={{ bgcolor: `${ACCENT}10`, color: ACCENT }}
                            />
                          ))}
                        </Stack>
                      </CardContent>
                    </InfoCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <InfoCard sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, color: ACCENT }}>
                          Métriques de Performance
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box textAlign="center">
                              <Typography variant="h4" sx={{ color: ACCENT2, fontWeight: 'bold' }}>
                                {selectedInfo.item.satisfaction}%
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Satisfaction
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box textAlign="center">
                              <Typography variant="h4" sx={{ color: ACCENT3, fontWeight: 'bold' }}>
                                {selectedInfo.item.avgResolutionTime}j
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Temps moyen
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box textAlign="center">
                              <Typography variant="h4" sx={{ color: ACCENT4, fontWeight: 'bold' }}>
                                {selectedInfo.item.projectsDelivered}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Projets livrés
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box textAlign="center">
                              <Typography variant="h4" sx={{ color: ACCENT5, fontWeight: 'bold' }}>
                                €{selectedInfo.item.revenue.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Chiffre d'affaires
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </InfoCard>

                    <InfoCard>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, color: ACCENT }}>
                          Échéances Importantes
                        </Typography>
                        <Stack spacing={1}>
                          {selectedInfo.item.upcomingDeadlines.map((deadline, idx) => (
                            <Stack key={idx} direction="row" alignItems="center" spacing={2}>
                              <WarningIcon 
                                sx={{ 
                                  color: new Date(deadline) < new Date() ? ACCENT4 : ACCENT3 
                                }} 
                              />
                              <Typography variant="body2">
                                {new Date(deadline).toLocaleDateString('fr-FR')}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </CardContent>
                    </InfoCard>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
          </>
        )}
      </InfoDialog>

      {/* Add Client Form */}
      <AddClientForm open={showAddForm} onClose={() => setShowAddForm(false)} />
    </Box>
  );
};

export default Client;