import React, { useState, useEffect } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  Typography,
  Stack,
  Grid,
  Avatar,
  Box,
  Collapse,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import InfoIcon from '@mui/icons-material/Info';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const ACCENT = '#4F8DFD';
const ACCENT2 = '#00C49F';

const FilterCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #ffffff 70%, #f8fbff 100%)',
  borderRadius: 16,
  border: '2px solid rgba(79,141,253,0.1)',
  marginBottom: theme.spacing(3),
}));

const EmployeeFilter = ({ 
  selectedEmployees, 
  selectedDepartments, 
  onEmployeeSelect, 
  onDepartmentSelect, 
  onClearFilters,
  onInfoClick 
}) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeesExpanded, setEmployeesExpanded] = useState(false);
  const [departmentsExpanded, setDepartmentsExpanded] = useState(false);

  // Fetch data for filter component
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesRes, departmentsRes, tasksRes] = await Promise.all([
          fetch('http://localhost:8080/api/employees'),
          fetch('http://localhost:8080/api/departments'),
          fetch('http://localhost:8080/api/tasks')
        ]);

        const employeesData = employeesRes.ok ? await employeesRes.json() : [];
        const departmentsData = departmentsRes.ok ? await departmentsRes.json() : [];
        const tasksData = tasksRes.ok ? await tasksRes.json() : [];

        setEmployees(employeesData);
        setDepartments(departmentsData);
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching filter data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate employee performance
  const calculateEmployeePerformance = (employeeId) => {
    const employeeTasks = tasks.filter(task => task.employeeId === employeeId);
    const completedTasks = employeeTasks.filter(task => task.status === 'Completed').length;
    const taskCompletionRate = employeeTasks.length > 0 ? (completedTasks / employeeTasks.length) * 100 : 0;
    return Math.round(taskCompletionRate);
  };

  if (loading) {
    return (
      <FilterCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Chargement des filtres...
          </Typography>
        </Box>
      </FilterCard>
    );
  }

  if (error) {
    return (
      <FilterCard>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Erreur lors du chargement des filtres: {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Les filtres ne sont pas disponibles, mais les autres composants fonctionnent normalement.
        </Typography>
      </FilterCard>
    );
  }

  return (
    <FilterCard>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <FilterListIcon sx={{ color: ACCENT }} />
        <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 600 }}>
          Filtres
        </Typography>
        {(selectedEmployees.length > 0 || selectedDepartments.length > 0) && (
          <Button 
            variant="outlined" 
            size="small" 
            onClick={onClearFilters}
            sx={{ ml: 'auto' }}
          >
            Effacer les filtres
          </Button>
        )}
      </Stack>
      
      <Grid container spacing={2}>
        {/* Employees Filter */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <ListItem 
              button 
              onClick={() => setEmployeesExpanded(!employeesExpanded)}
              sx={{ bgcolor: 'rgba(79,141,253,0.05)' }}
            >
              <ListItemIcon>
                <PersonIcon sx={{ color: ACCENT }} />
              </ListItemIcon>
              <ListItemText 
                primary="Employés" 
                secondary={`${selectedEmployees.length} sélectionné(s)`}
              />
              {employeesExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={employeesExpanded} timeout="auto" unmountOnExit>
              <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                {employees.map((employee) => {
                  const performance = calculateEmployeePerformance(employee.employeeId);
                  return (
                    <ListItem key={employee.employeeId} dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedEmployees.includes(employee.employeeId)}
                            onChange={() => onEmployeeSelect(employee.employeeId)}
                            sx={{ color: ACCENT }}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ bgcolor: ACCENT, width: 24, height: 24, fontSize: '0.75rem' }}>
                              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">
                                {employee.firstName} {employee.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {employee.jobTitle}
                              </Typography>
                            </Box>
                          </Stack>
                        }
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => onInfoClick(employee, 'employee')}
                        sx={{ ml: 'auto' }}
                      >
                        <InfoIcon fontSize="small" sx={{ color: ACCENT }} />
                      </IconButton>
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          </Paper>
        </Grid>

        {/* Departments Filter */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <ListItem 
              button 
              onClick={() => setDepartmentsExpanded(!departmentsExpanded)}
              sx={{ bgcolor: 'rgba(79,141,253,0.05)' }}
            >
              <ListItemIcon>
                <WorkIcon sx={{ color: ACCENT }} />
              </ListItemIcon>
              <ListItemText 
                primary="Départements" 
                secondary={`${selectedDepartments.length} sélectionné(s)`}
              />
              {departmentsExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={departmentsExpanded} timeout="auto" unmountOnExit>
              <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                {departments.map((department) => {
                  const deptEmployees = employees.filter(emp => emp.departmentId === department.departmentId);
                  return (
                    <ListItem key={department.departmentId} dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedDepartments.includes(department.departmentId)}
                            onChange={() => onDepartmentSelect(department.departmentId)}
                            sx={{ color: ACCENT }}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ bgcolor: ACCENT2, width: 24, height: 24 }}>
                              <BusinessIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2">{department.departmentName}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {deptEmployees.length} employés
                              </Typography>
                            </Box>
                          </Stack>
                        }
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => onInfoClick(department, 'department')}
                        sx={{ ml: 'auto' }}
                      >
                        <InfoIcon fontSize="small" sx={{ color: ACCENT }} />
                      </IconButton>
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          </Paper>
        </Grid>
      </Grid>
    </FilterCard>
  );
};

export default EmployeeFilter;