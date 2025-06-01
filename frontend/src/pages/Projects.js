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
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Sankey,
} from 'recharts';
import { styled } from '@mui/material/styles';

// Color palette consistent with the Employees dashboard
const ACCENT = '#4F8DFD';
const ACCENT2 = '#00C49F';
const ACCENT3 = '#FFBB28';
const ACCENT4 = '#FF8042';
const ACCENT5 = '#8884D8';

// Styled components
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

const AddProjectDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg, #ffffff 70%, #f8fbff 100%)',
    boxShadow: '0 20px 60px rgba(79,141,253,0.2)',
  },
}));

// Utility function to format date to DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return 'En cours';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Utility function to calculate difference in days
const differenceInDays = (endDateString, startDateString) => {
  const endDate = new Date(endDateString || new Date());
  const startDate = new Date(startDateString);
  const diffTime = endDate - startDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const Projects = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [departmentsExpanded, setDepartmentsExpanded] = useState(false);
  const [statusExpanded, setStatusExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    project_name: '',
    client_id: '',
    department_id: '',
    start_date: '',
    end_date: '',
    chef_id: '',
    status: '',
    description: '',
    due_at: '',
  });

  // Mock data for projects
  const projects = [
    {
      project_id: 1,
      project_name: 'ERP System Upgrade',
      client_id: 'C001',
      department_id: 'IT',
      start_date: '2024-01-15',
      end_date: '2024-12-30',
      chef_id: 'E004',
      status: 'In Progress',
      description: 'Comprehensive upgrade of enterprise resource planning system',
      due_at: '2024-12-15',
      budget: '$500,000',
      progress: 75,
      team_size: 8,
      technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS'],
    },
    {
      project_id: 2,
      project_name: 'Employee Wellness Program',
      client_id: 'C002',
      department_id: 'HR',
      start_date: '2024-03-01',
      end_date: '2024-09-30',
      chef_id: 'E002',
      status: 'Completed',
      description: 'Implementation of company-wide wellness initiative',
      due_at: '2024-09-15',
      budget: '$100,000',
      progress: 100,
      team_size: 4,
      technologies: ['SurveyMonkey', 'Zoom', 'Wellness Platform'],
    },
    {
      project_id: 3,
      project_name: 'Financial Dashboard',
      client_id: 'C003',
      department_id: 'Finance',
      start_date: '2024-02-10',
      end_date: '2024-11-30',
      chef_id: 'E005',
      status: 'In Progress',
      description: 'Interactive financial reporting dashboard',
      due_at: '2024-11-15',
      budget: '$250,000',
      progress: 60,
      team_size: 6,
      technologies: ['PowerBI', 'Python', 'SQL Server'],
    },
    {
      project_id: 4,
      project_name: 'Brand Campaign',
      client_id: 'C004',
      department_id: 'Marketing',
      start_date: '2024-04-01',
      end_date: '2024-10-31',
      chef_id: 'E006',
      status: 'Delayed',
      description: 'Multi-channel marketing campaign for brand awareness',
      due_at: '2024-10-15',
      budget: '$200,000',
      progress: 45,
      team_size: 5,
      technologies: ['Google Analytics', 'Adobe Creative Suite', 'HubSpot'],
    },
    {
      project_id: 5,
      project_name: 'Cloud Migration',
      client_id: 'C005',
      department_id: 'IT',
      start_date: '2024-05-01',
      end_date: '2025-03-31',
      chef_id: 'E004',
      status: 'In Progress',
      description: 'Migration of legacy systems to AWS cloud',
      due_at: '2025-03-15',
      budget: '$750,000',
      progress: 30,
      team_size: 10,
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    },
    {
      project_id: 6,
      project_name: 'Budget Planning Tool',
      client_id: 'C006',
      department_id: 'Finance',
      start_date: '2024-06-15',
      end_date: '2024-12-31',
      chef_id: 'E005',
      status: 'On Hold',
      description: 'Automated budget planning and forecasting tool',
      due_at: '2024-12-15',
      budget: '$300,000',
      progress: 20,
      team_size: 4,
      technologies: ['Excel', 'SAP', 'Python'],
    },
  ];

  const departments = [
    { name: 'IT', head: 'Sarah Wilson', employees: 25 },
    { name: 'HR', head: 'Jane Smith', employees: 15 },
    { name: 'Finance', head: 'Robert Brown', employees: 20 },
    { name: 'Marketing', head: 'David Johnson', employees: 12 },
  ];

  const clients = [
    { id: 'C001', name: 'TechCorp' },
    { id: 'C002', name: 'HealthInc' },
    { id: 'C003', name: 'FinancePro' },
    { id: 'C004', name: 'BrandBoost' },
    { id: 'C005', name: 'CloudPeak' },
    { id: 'C006', name: 'MoneyWise' },
  ];

  const employees = [
    { id: 'E002', name: 'Jane Smith' },
    { id: 'E004', name: 'Sarah Wilson' },
    { id: 'E005', name: 'Robert Brown' },
    { id: 'E006', name: 'Emily Davis' },
  ];

  const statusOptions = ['In Progress', 'Completed', 'Delayed', 'On Hold'];

  // Filter projects based on selections
  const filteredProjects = useMemo(() => {
    if (selectedProjects.length === 0 && selectedDepartments.length === 0 && selectedStatus.length === 0) {
      return projects;
    }

    return projects.filter((proj) => {
      const projMatch = selectedProjects.length === 0 || selectedProjects.includes(proj.project_id);
      const deptMatch = selectedDepartments.length === 0 || selectedDepartments.includes(proj.department_id);
      const statusMatch = selectedStatus.length === 0 || selectedStatus.includes(proj.status);
      return projMatch && deptMatch && statusMatch;
    });
  }, [selectedProjects, selectedDepartments, selectedStatus]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalProjects = filteredProjects.length;
    const onTime = filteredProjects.filter(
      (proj) =>
        proj.status !== 'Delayed' &&
        new Date(proj.due_at) >= new Date(proj.end_date || new Date())
    ).length;
    const delayed = filteredProjects.filter(
      (proj) =>
        proj.status === 'Delayed' ||
        new Date(proj.due_at) < new Date(proj.end_date || new Date())
    ).length;
    const delivered = filteredProjects.filter((proj) => proj.status === 'Completed').length;
    const avgDuration = filteredProjects.reduce((sum, proj) => {
      const duration = differenceInDays(proj.end_date, proj.start_date);
      return sum + duration;
    }, 0) / (totalProjects || 1);

    return {
      totalProjects,
      onTime,
      delayed,
      delivered,
      avgDuration: Math.round(avgDuration),
    };
  }, [filteredProjects]);

  // Project status distribution for PieChart
  const statusDistribution = useMemo(() => {
    const statusCounts = statusOptions.map((status) => ({
      name: status,
      value: filteredProjects.filter((proj) => proj.status === status).length,
    }));
    return statusCounts.filter((item) => item.value > 0);
  }, [filteredProjects]);

  // Project duration data for BarChart
  const durationData = useMemo(() => {
    return filteredProjects.map((proj) => ({
      name: proj.project_name,
      duration: differenceInDays(proj.end_date, proj.start_date),
    }));
  }, [filteredProjects]);

  // Sankey data for project flow (departments to projects)
  const sankeyData = useMemo(() => {
    const nodes = [
      ...departments.map((dept) => ({ name: dept.name })),
      ...filteredProjects.map((proj) => ({ name: proj.project_name })),
    ];
    const links = filteredProjects.map((proj) => ({
      source: departments.findIndex((dept) => dept.name === proj.department_id),
      target: departments.length + filteredProjects.findIndex((p) => p.project_id === proj.project_id),
      value: proj.team_size,
    }));
    return { nodes, links };
  }, [filteredProjects]);

  const COLORS = [ACCENT, ACCENT2, ACCENT3, ACCENT4, ACCENT5];

  const handleInfoClick = (item, type) => {
    setSelectedInfo({ item, type });
    setShowInfo(true);
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleDepartmentSelect = (deptName) => {
    setSelectedDepartments((prev) =>
      prev.includes(deptName)
        ? prev.filter((name) => name !== deptName)
        : [...prev, deptName]
    );
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedProjects([]);
    setSelectedDepartments([]);
    setSelectedStatus([]);
  };

  const handleAddProject = () => {
    // Simulate adding project (in real app, this would be an API call)
    console.log('New Project:', newProject);
    setShowAddForm(false);
    setNewProject({
      project_name: '',
      client_id: '',
      department_id: '',
      start_date: '',
      end_date: '',
      chef_id: '',
      status: '',
      description: '',
      due_at: '',
    });
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        background: 'linear-gradient(120deg, #fafdff 70%, #e3f0ff 100%)',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            fontWeight: 800,
            color: ACCENT,
            textShadow: '0 2px 4px rgba(79,141,253,0.1)',
          }}
        >
          Espace Projets
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
          Ajouter un projet
        </Button>
      </Box>

      {/* Filter Section */}
      <FilterCard>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <FilterListIcon sx={{ color: ACCENT }} />
          <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 600 }}>
            Filtres
          </Typography>
          {(selectedProjects.length > 0 || selectedDepartments.length > 0 || selectedStatus.length > 0) && (
            <Button variant="outlined" size="small" onClick={clearFilters} sx={{ ml: 'auto' }}>
              Effacer les filtres
            </Button>
          )}
        </Stack>

        <Grid container spacing={2}>
          {/* Projects Filter */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <ListItem
                button
                onClick={() => setProjectsExpanded(!projectsExpanded)}
                sx={{ bgcolor: 'rgba(79,141,253,0.05)' }}
              >
                <ListItemIcon>
                  <AssignmentIcon sx={{ color: ACCENT }} />
                </ListItemIcon>
                <ListItemText primary="Projets" secondary={`${selectedProjects.length} sélectionné(s)`} />
                {projectsExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={projectsExpanded} timeout="auto" unmountOnExit>
                <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {projects.map((project) => (
                    <ListItem key={project.project_id} dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedProjects.includes(project.project_id)}
                            onChange={() => handleProjectSelect(project.project_id)}
                            sx={{ color: ACCENT }}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ bgcolor: ACCENT, width: 24, height: 24, fontSize: '0.75rem' }}>
                              {project.project_name[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">{project.project_name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {project.status}
                              </Typography>
                            </Box>
                          </Stack>
                        }
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleInfoClick(project, 'project')}
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

          {/* Departments Filter */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <ListItem
                button
                onClick={() => setDepartmentsExpanded(!departmentsExpanded)}
                sx={{ bgcolor: 'rgba(79,141,253,0.05)' }}
              >
                <ListItemIcon>
                  <BusinessIcon sx={{ color: ACCENT }} />
                </ListItemIcon>
                <ListItemText primary="Départements" secondary={`${selectedDepartments.length} sélectionné(s)`} />
                {departmentsExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={departmentsExpanded} timeout="auto" unmountOnExit>
                <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {departments.map((department) => (
                    <ListItem key={department.name} dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedDepartments.includes(department.name)}
                            onChange={() => handleDepartmentSelect(department.name)}
                            sx={{ color: ACCENT }}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ bgcolor: ACCENT2, width: 24, height: 24 }}>
                              <BusinessIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2">{department.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {department.employees} employés
                              </Typography>
                            </Box>
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Paper>
          </Grid>

          {/* Status Filter */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <ListItem
                button
                onClick={() => setStatusExpanded(!statusExpanded)}
                sx={{ bgcolor: 'rgba(79,141,253,0.05)' }}
              >
                <ListItemIcon>
                  <WorkIcon sx={{ color: ACCENT }} />
                </ListItemIcon>
                <ListItemText primary="Statut" secondary={`${selectedStatus.length} sélectionné(s)`} />
                {statusExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={statusExpanded} timeout="auto" unmountOnExit>
                <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {statusOptions.map((status) => (
  <ListItem key={status} dense>

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedStatus.includes(status)}
                            onChange={() => handleStatusSelect(status)}
                            sx={{ color: ACCENT }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2">{status}</Typography>
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

      <Grid container spacing={3}>
        {/* Charts Section */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* Project Progress Chart */}
            <DashboardPaper>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <TrendingUpIcon sx={{ color: ACCENT }} />
                <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 600 }}>
                  Progression des Projets
                </Typography>
              </Stack>
              <Box sx={{ height: { xs: 250, md: 300 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredProjects}>
                    <defs>
                      <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={ACCENT} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={ACCENT} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(79,141,253,0.1)" />
                    <XAxis dataKey="project_name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid rgba(79,141,253,0.2)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(79,141,253,0.1)',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="progress"
                      stroke={ACCENT}
                      fillOpacity={1}
                      fill="url(#colorProgress)"
                      name="Progression (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </DashboardPaper>

            <Grid container spacing={3}>
              {/* Status Distribution */}
              <Grid item xs={12} md={6}>
                <DashboardPaper>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <AssignmentIcon sx={{ color: ACCENT }} />
                    <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 600 }}>
                      Distribution par Statut
                    </Typography>
                  </Stack>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </DashboardPaper>
              </Grid>

              {/* Duration Bar Chart */}
              <Grid item xs={12} md={6}>
                <DashboardPaper>
                  <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
                    Durée des Projets
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={durationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(79,141,253,0.1)" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid rgba(79,141,253,0.2)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(79,141,253,0.1)',
                          }}
                        />
                        <Legend />
                        <Bar dataKey="duration" fill={ACCENT2} name="Durée (jours)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </DashboardPaper>
              </Grid>

              {/* Sankey Chart for Project Flow */}
              <Grid item xs={12}>
                <DashboardPaper>
                  <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
                    Flux des Projets par Département
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <Sankey
                        data={sankeyData}
                        nodeWidth={15}
                        nodePadding={50}
                        linkCurvature={0.5}
                        iterations={32}
                      >
                        <Tooltip />
                      </Sankey>
                    </ResponsiveContainer>
                  </Box>
                </DashboardPaper>
              </Grid>
            </Grid>
          </Stack>
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Summary Stats */}
            <DashboardPaper>
              <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
                Résumé
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ color: ACCENT, fontWeight: 700 }}>
                      {kpis.totalProjects}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Projets Totaux
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ color: ACCENT2, fontWeight: 700 }}>
                      {kpis.onTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      À Temps
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ color: ACCENT3, fontWeight: 700 }}>
                      {kpis.delayed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      En Retard
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ color: ACCENT4, fontWeight: 700 }}>
                      {kpis.delivered}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Livrés
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ color: ACCENT5, fontWeight: 700 }}>
                      {kpis.avgDuration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Durée Moyenne (jours)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DashboardPaper>

            {/* Quick Info Cards */}
            {filteredProjects.slice(0, 3).map((project) => (
              <InfoCard key={project.project_id}>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: ACCENT }}>
                      {project.project_name[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {project.project_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.department_id}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip
                          size="small"
                          label={`${project.progress}%`}
                          sx={{ bgcolor: 'rgba(79,141,253,0.1)', color: ACCENT }}
                        />
                        <Chip
                          size="small"
                          label={project.status}
                          sx={{ bgcolor: 'rgba(0,196,159,0.1)', color: ACCENT2 }}
                        />
                      </Stack>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleInfoClick(project, 'project')}
                    >
                      <InfoIcon sx={{ color: ACCENT }} />
                    </IconButton>
                  </Stack>
                </CardContent>
              </InfoCard>
            ))}
          </Stack>
        </Grid>
      </Grid>

      {/* Project Info Dialog */}
      <InfoDialog
        open={showInfo}
        onClose={() => setShowInfo(false)}
        TransitionComponent={Zoom}
        maxWidth="md"
        fullWidth
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(79,141,253,0.1)',
              backdropFilter: 'blur(8px)',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT2} 100%)`,
            color: 'white',
            m: -2,
            mb: 2,
            borderRadius: '20px 20px 0 0',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Détails du Projet
          </Typography>
          <IconButton onClick={() => setShowInfo(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedInfo?.type === 'project' && selectedInfo?.item && (
            <Box>
              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: ACCENT,
                    width: 80,
                    height: 80,
                    fontSize: '2rem',
                    fontWeight: 700,
                  }}
                >
                  {selectedInfo.item.project_name[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: ACCENT }}>
                    {selectedInfo.item.project_name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    {selectedInfo.item.department_id}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={selectedInfo.item.status}
                      sx={{ bgcolor: `${ACCENT}20`, color: ACCENT }}
                    />
                    <Chip
                      label={`${selectedInfo.item.progress}% complété`}
                      sx={{ bgcolor: `${ACCENT2}20`, color: ACCENT2 }}
                    />
                  </Stack>
                </Box>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, bgcolor: `${ACCENT}05` }}>
                    <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
                      Informations Générales
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: ACCENT }} />
                        <Typography variant="body2">
                          <strong>Chef de projet:</strong>{' '}
                          {employees.find((e) => e.id === selectedInfo.item.chef_id)?.name || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ color: ACCENT }} />
                        <Typography variant="body2">
                          <strong>Client:</strong>{' '}
                          {clients.find((c) => c.id === selectedInfo.item.client_id)?.name || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ color: ACCENT }} />
                        <Typography variant="body2">
                          <strong>Date de début:</strong>{' '}
                          {formatDate(selectedInfo.item.start_date)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ color: ACCENT }} />
                        <Typography variant="body2">
                          <strong>Date de fin:</strong>{' '}
                          {formatDate(selectedInfo.item.end_date)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          <strong>Échéance:</strong>{' '}
                          {formatDate(selectedInfo.item.due_at)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          <strong>Budget:</strong> {selectedInfo.item.budget}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, bgcolor: `${ACCENT2}05` }}>
                    <Typography variant="h6" sx={{ mb: 2, color: ACCENT2, fontWeight: 600 }}>
                      Performance
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Progression</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedInfo.item.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={selectedInfo.item.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: `${ACCENT}20`,
                            '& .MuiLinearProgress-bar': { bgcolor: ACCENT },
                          }}
                        />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Taille de l'équipe</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedInfo.item.team_size}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(selectedInfo.item.team_size / 10) * 100} // Assuming max team size of 10 for scaling
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: `${ACCENT2}20`,
                            '& .MuiLinearProgress-bar': { bgcolor: ACCENT2 },
                          }}
                        />
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 3, bgcolor: `${ACCENT3}05` }}>
                    <Typography variant="h6" sx={{ mb: 2, color: ACCENT3, fontWeight: 600 }}>
                      Technologies
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {selectedInfo.item.technologies.map((tech, index) => (
                        <Chip
                          key={index}
                          label={tech}
                          sx={{
                            bgcolor: `${COLORS[index % COLORS.length]}20`,
                            color: COLORS[index % COLORS.length],
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 3, bgcolor: `${ACCENT4}05` }}>
                    <Typography variant="h6" sx={{ mb: 2, color: ACCENT4, fontWeight: 600 }}>
                      Description
                    </Typography>
                    <Typography variant="body2">{selectedInfo.item.description}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </InfoDialog>

      {/* Add Project Form */}
      <AddProjectDialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        TransitionComponent={Zoom}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT2} 100%)`,
            color: 'white',
            m: -2,
            mb: 2,
            borderRadius: '20px 20px 0 0',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Ajouter un Nouveau Projet
          </Typography>
          <IconButton onClick={() => setShowAddForm(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Nom du Projet"
              value={newProject.project_name}
              onChange={(e) =>
                setNewProject({ ...newProject, project_name: e.target.value })
              }
              fullWidth
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                value={newProject.client_id}
                onChange={(e) =>
                  setNewProject({ ...newProject, client_id: e.target.value })
                }
                label="Client"
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Département</InputLabel>
              <Select
                value={newProject.department_id}
                onChange={(e) =>
                  setNewProject({ ...newProject, department_id: e.target.value })
                }
                label="Département"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.name} value={dept.name}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Chef de Projet</InputLabel>
              <Select
                value={newProject.chef_id}
                onChange={(e) =>
                  setNewProject({ ...newProject, chef_id: e.target.value })
                }
                label="Chef de Projet"
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Date de Début"
              type="date"
              value={newProject.start_date}
              onChange={(e) =>
                setNewProject({ ...newProject, start_date: e.target.value })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Date de Fin"
              type="date"
              value={newProject.end_date}
              onChange={(e) =>
                setNewProject({ ...newProject, end_date: e.target.value })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Échéance"
              type="date"
              value={newProject.due_at}
              onChange={(e) =>
                setNewProject({ ...newProject, due_at: e.target.value })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={newProject.status}
                onChange={(e) =>
                  setNewProject({ ...newProject, status: e.target.value })
                }
                label="Statut"
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleAddProject}
              sx={{
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT2} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${ACCENT} 20%, ${ACCENT2} 120%)`,
                },
              }}
            >
              Ajouter le Projet
            </Button>
          </Stack>
        </DialogContent>
      </AddProjectDialog>
    </Box>
  );
};

export default Projects;