import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AddEmployeeForm from '../components/AddEmployeeForm';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

// Import the separate components
import PerformanceChart from '../components/PerformanceChart';
import DepartmentDistributionChart from '../components/DepartmentDistributionChart';
import EmployeeMetrics from '../components/EmployeeMetrics';
import TaskCompletionChart from '../components/TaskCompletionChart';
import EmployeeFilter from '../components/EmployeeFilter';

const ACCENT = '#4F8DFD';
const ACCENT2 = '#00C49F';
const ACCENT3 = '#FFBB28';
const ACCENT4 = '#FF8042';
const ACCENT5 = '#8884D8';

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

const InfoDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    padding: theme.spacing(2),
    background: 'linear-gradient(135deg, #ffffff 70%, #f8fbff 100%)',
    boxShadow: '0 20px 60px rgba(79,141,253,0.2)',
  },
}));

const Employee = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);

  // State for data that needs to be shared across components
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesRes, departmentsRes, tasksRes, ticketsRes, projectsRes] = await Promise.all([
          fetch('http://localhost:8080/api/employees'),
          fetch('http://localhost:8080/api/departments'),
          fetch('http://localhost:8080/api/tasks'),
          fetch('http://localhost:8080/api/tickets'),
          fetch('http://localhost:8080/api/projects')
        ]);

        // We'll let individual components handle their own data errors
        const [employeesData, departmentsData, tasksData, ticketsData, projectsData] = await Promise.all([
          employeesRes.ok ? employeesRes.json() : [],
          departmentsRes.ok ? departmentsRes.json() : [],
          tasksRes.ok ? tasksRes.json() : [],
          ticketsRes.ok ? ticketsRes.json() : [],
          projectsRes.ok ? projectsRes.json() : []
        ]);

        setEmployees(employeesData);
        setDepartments(departmentsData);
        setTasks(tasksData);
        setTickets(ticketsData);
        setProjects(projectsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInfoClick = (item, type) => {
    setSelectedInfo({ item, type });
    setShowInfo(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Link to="/" style={{
          padding: '8px 16px',
          background: '#6366f1',
          color: 'white',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 500
        }}>
          ← Retour à l'accueil
        </Link>
      </Box>
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
            Espace Employé
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
            Ajouter un employé
          </Button>
        </Box>

        {/* Employee Filter Component */}
        <EmployeeFilter
          employees={employees}
          departments={departments}
          selectedEmployees={selectedEmployees}
          selectedDepartments={selectedDepartments}
          setSelectedEmployees={setSelectedEmployees}
          setSelectedDepartments={setSelectedDepartments}
          handleInfoClick={handleInfoClick}
        />

        <Grid container spacing={3}>
          {/* Charts Section */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              {/* Performance Chart Component */}
              <PerformanceChart
                tasks={tasks}
                tickets={tickets}
                selectedEmployees={selectedEmployees}
                selectedDepartments={selectedDepartments}
                employees={employees}
              />

              <Grid container spacing={3}>
                {/* Department Distribution Component */}
                <Grid item xs={12} md={6}>
                  <DepartmentDistributionChart
                    departments={departments}
                    employees={employees}
                    projects={projects}
                  />
                </Grid>

                {/* Task Completion Component */}
                <Grid item xs={12} md={6}>
                  <TaskCompletionChart
                    tasks={tasks}
                    selectedEmployees={selectedEmployees}
                    selectedDepartments={selectedDepartments}
                    employees={employees}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          {/* Summary Cards Section */}
          <Grid item xs={12} lg={4}>
            <EmployeeMetrics
              employees={employees}
              departments={departments}
              projects={projects}
              tasks={tasks}
              tickets={tickets}
              selectedEmployees={selectedEmployees}
              selectedDepartments={selectedDepartments}
              handleInfoClick={handleInfoClick}
            />
          </Grid>
        </Grid>

        {/* Info Dialog */}
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
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT2} 100%)`,
            color: 'white',
            m: -2,
            mb: 2,
            borderRadius: '20px 20px 0 0'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedInfo?.type === 'employee' ? 'Détails de l\'employé' : 'Détails du département'}
            </Typography>
            <IconButton 
              onClick={() => setShowInfo(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            {selectedInfo?.type === 'employee' && selectedInfo?.item && (
              <Box>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: ACCENT, 
                      width: 80, 
                      height: 80,
                      fontSize: '2rem',
                      fontWeight: 700
                    }}
                  >
                    {selectedInfo.item.firstName.charAt(0)}{selectedInfo.item.lastName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: ACCENT }}>
                      {selectedInfo.item.firstName} {selectedInfo.item.lastName}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      {selectedInfo.item.jobTitle}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip 
                        label={departments.find(d => d.departmentId === selectedInfo.item.departmentId)?.departmentName || 'N/A'}
                        sx={{ bgcolor: `${ACCENT}20`, color: ACCENT }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            )}
          </DialogContent>
        </InfoDialog>

        <AddEmployeeForm 
          open={showAddForm} 
          onClose={() => setShowAddForm(false)} 
        />
      </Box>
    </>
  );
};

export default Employee;