import React, { useState, useEffect, useMemo } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import DashboardPaper from '../common/DashboardPaper';

const ACCENT = '#4F8DFD';
const ACCENT2 = '#00C49F';
const ACCENT3 = '#FFBB28';
const ACCENT4 = '#FF8042';
const ACCENT5 = '#8884D8';

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

        // Validate the data structure
        if (!Array.isArray(departmentsData) || !Array.isArray(employeesData) || !Array.isArray(projectsData)) {
          throw new Error('Invalid data format received from server');
        }

        setDepartments(departmentsData);
        setEmployees(employeesData);
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const departmentDistribution = useMemo(() => {
    if (!departments || !employees || !projects) return [];
    
    return departments.map(dept => {
      const deptEmployees = employees.filter(emp => emp.departmentId === dept.departmentId);
      const deptProjects = projects.filter(proj => proj.departmentId === dept.departmentId);
      
      return {
        name: dept.departmentName || 'Unnamed Department',
        value: deptEmployees.length,
        employees: deptEmployees.length,
        projects: deptProjects.length
      };
    }).filter(dept => dept.value > 0); // Only show departments with employees
  }, [departments, employees, projects]);

  const COLORS = [ACCENT, ACCENT2, ACCENT3, ACCENT4, ACCENT5];

  if (loading) {
    return (
      <DashboardPaper>
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      </DashboardPaper>
    );
  }

  if (error) {
    return (
      <DashboardPaper>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading department distribution: {error}
        </Alert>
      </DashboardPaper>
    );
  }

  if (departmentDistribution.length === 0) {
    return (
      <DashboardPaper>
        <Alert severity="info" sx={{ mb: 2 }}>
          No department data available
        </Alert>
      </DashboardPaper>
    );
  }

  return (
    <DashboardPaper>
      <Box display="flex" alignItems="center" mb={2}>
        <GroupIcon sx={{ color: ACCENT, mr: 1 }} />
        <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 600 }}>
          Employee Distribution
        </Typography>
      </Box>
      <Box height={250}>
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