import React, { useState, useEffect, useMemo } from 'react';
import { 
  Typography, 
  Box, 
  Paper,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ACCENT = '#4F8DFD';
const ACCENT2 = '#00C49F';
const ACCENT3 = '#FFBB28';
const ACCENT4 = '#FF8042';

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

const EmployeeMetrics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesRes, departmentsRes, projectsRes, tasksRes] = await Promise.all([
          fetch('http://localhost:8080/api/employees'),
          fetch('http://localhost:8080/api/departments'),
          fetch('http://localhost:8080/api/projects'),
          fetch('http://localhost:8080/api/tasks')
        ]);

        if (!employeesRes.ok || !departmentsRes.ok || !projectsRes.ok || !tasksRes.ok) {
          throw new Error('Failed to fetch metrics data');
        }

        const [employeesData, departmentsData, projectsData, tasksData] = await Promise.all([
          employeesRes.json(),
          departmentsRes.json(),
          projectsRes.json(),
          tasksRes.json()
        ]);

        setEmployees(employeesData);
        setDepartments(departmentsData);
        setProjects(projectsData);
        setTasks(tasksData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateEmployeePerformance = (employeeId) => {
    const employeeTasks = tasks.filter(task => task.employeeId === employeeId);
    
    // Task completion rate
    const completedTasks = employeeTasks.filter(task => task.status === 'Completed').length;
    const taskCompletionRate = employeeTasks.length > 0 ? (completedTasks / employeeTasks.length) * 100 : 0;

    return {
      performance: Math.round(taskCompletionRate)
    };
  };

  const averagePerformance = useMemo(() => {
    if (employees.length === 0) return 0;
    
    const totalPerformance = employees.reduce((sum, emp) => {
      const perf = calculateEmployeePerformance(emp.employeeId);
      return sum + perf.performance;
    }, 0);
    
    return Math.round(totalPerformance / employees.length);
  }, [employees, tasks]);

  const activeProjects = useMemo(() => {
    return projects.filter(p => p.status === 'InProgress').length;
  }, [projects]);

  if (loading) {
    return (
      <DashboardPaper>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      </DashboardPaper>
    );
  }

  if (error) {
    return (
      <DashboardPaper>
        <Alert severity="error" sx={{ mb: 2 }}>
          Erreur lors du chargement des métriques: {error}
        </Alert>
      </DashboardPaper>
    );
  }

  return (
    <DashboardPaper>
      <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
        Résumé
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="h4" sx={{ color: ACCENT, fontWeight: 700 }}>
              {employees.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Employés
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="h4" sx={{ color: ACCENT2, fontWeight: 700 }}>
              {departments.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Départements
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="h4" sx={{ color: ACCENT3, fontWeight: 700 }}>
              {averagePerformance}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Performance Moy.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="h4" sx={{ color: ACCENT4, fontWeight: 700 }}>
              {activeProjects}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Projets Actifs
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </DashboardPaper>
  );
};

export default EmployeeMetrics;