import React, { useState, useEffect, useMemo } from 'react';
import { 
  Typography, 
  Box, 
  Paper,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { styled } from '@mui/material/styles';

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

const DepartmentDistributionChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [departmentsRes, employeesRes, projectsRes] = await Promise.all([
          fetch('http://localhost:8080/api/departments'),
          fetch('http://localhost:8080/api/employees'),
          fetch('http://localhost:8080/api/projects')
        ]);

        if (!departmentsRes.ok || !employeesRes.ok || !projectsRes.ok) {
          throw new Error('Failed to fetch department distribution data');
        }

        const [departmentsData, employeesData, projectsData] = await Promise.all([
          departmentsRes.json(),
          employeesRes.json(),
          projectsRes.json()
        ]);

        setDepartments(departmentsData);
        setEmployees(employeesData);
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const departmentDistribution = useMemo(() => {
    return departments.map(dept => {
      const deptEmployees = employees.filter(emp => emp.departmentId === dept.departmentId);
      const deptProjects = projects.filter(proj => proj.departmentId === dept.departmentId);
      
      return {
        name: dept.departmentName,
        value: deptEmployees.length,
        employees: deptEmployees.length,
        projects: deptProjects.length
      };
    });
  }, [departments, employees, projects]);

  const COLORS = [ACCENT, ACCENT2, ACCENT3, ACCENT4, ACCENT5];

  if (loading) {
    return (
      <DashboardPaper>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress />
        </Box>
      </DashboardPaper>
    );
  }

  if (error) {
    return (
      <DashboardPaper>
        <Alert severity="error" sx={{ mb: 2 }}>
          Erreur lors du chargement de la distribution des départements: {error}
        </Alert>
      </DashboardPaper>
    );
  }

  return (
    <DashboardPaper>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <GroupIcon sx={{ color: ACCENT }} />
        <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 600 }}>
          Distribution Employés
        </Typography>
      </Stack>
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={departmentDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              dataKey="value"
            >
              {departmentDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </DashboardPaper>
  );
};

export default DepartmentDistributionChart;