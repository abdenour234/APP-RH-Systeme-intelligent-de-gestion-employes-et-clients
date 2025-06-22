import React, { useState, useEffect, useMemo } from 'react';
import { 
  Typography, 
  Box, 
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer
} from 'recharts';
import { styled } from '@mui/material/styles';

const ACCENT = '#4F8DFD';

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

const TaskCompletionChart = ({ selectedEmployees = [], selectedDepartments = [] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksRes, ticketsRes, projectsRes, employeesRes] = await Promise.all([
          fetch('http://localhost:8080/api/tasks'),
          fetch('http://localhost:8080/api/tickets'),
          fetch('http://localhost:8080/api/projects'),
          fetch('http://localhost:8080/api/employees')
        ]);

        if (!tasksRes.ok || !ticketsRes.ok || !projectsRes.ok || !employeesRes.ok) {
          throw new Error('Failed to fetch task completion data');
        }

        const [tasksData, ticketsData, projectsData, employeesData] = await Promise.all([
          tasksRes.json(),
          ticketsRes.json(),
          projectsRes.json(),
          employeesRes.json()
        ]);

        setTasks(tasksData);
        setTickets(ticketsData);
        setProjects(projectsData);
        setEmployees(employeesData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter employees based on selections
  const filteredEmployees = useMemo(() => {
    if (selectedDepartments.length === 0 && selectedEmployees.length === 0) {
      return employees;
    }
    
    return employees.filter(emp => {
      const deptMatch = selectedDepartments.length === 0 || selectedDepartments.includes(emp.departmentId);
      const empMatch = selectedEmployees.length === 0 || selectedEmployees.includes(emp.employeeId);
      return deptMatch && empMatch;
    });
  }, [selectedEmployees, selectedDepartments, employees]);

  // Generate skills radar data
  const skillsRadarData = useMemo(() => {
    if (filteredEmployees.length === 0) return [];

    const employeeIds = filteredEmployees.map(emp => emp.employeeId);
    const relevantTasks = tasks.filter(task => employeeIds.includes(task.employeeId));
    const relevantTickets = tickets.filter(ticket => employeeIds.includes(ticket.employeeId));
    const relevantProjects = projects.filter(project => employeeIds.includes(project.chefId));

    // Calculate various metrics
    const taskCompletionRate = relevantTasks.length > 0 
      ? (relevantTasks.filter(t => t.status === 'Completed').length / relevantTasks.length) * 100 
      : 0;

    const ticketResolutionRate = relevantTickets.length > 0
      ? (relevantTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length / relevantTickets.length) * 100
      : 0;

    const projectSuccessRate = relevantProjects.length > 0
      ? (relevantProjects.filter(p => p.status === 'Completed').length / relevantProjects.length) * 100
      : 0;

    const highPriorityTaskRate = relevantTasks.filter(t => t.priority === 'High').length > 0
      ? (relevantTasks.filter(t => t.priority === 'High' && t.status === 'Completed').length / 
         relevantTasks.filter(t => t.priority === 'High').length) * 100
      : 0;

    const teamCollaboration = relevantTasks.length > 0
      ? (relevantTasks.filter(t => t.employeeId !== t.project?.chefId).length / relevantTasks.length) * 100
      : 0;

    return [
      { subject: 'Task Completion', A: Math.round(taskCompletionRate), fullMark: 100 },
      { subject: 'Ticket Resolution', A: Math.round(ticketResolutionRate), fullMark: 100 },
      { subject: 'Project Success', A: Math.round(projectSuccessRate), fullMark: 100 },
      { subject: 'High Priority Tasks', A: Math.round(highPriorityTaskRate), fullMark: 100 },
      { subject: 'Team Collaboration', A: Math.round(teamCollaboration), fullMark: 100 }
    ];
  }, [tasks, tickets, projects, filteredEmployees]);

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
          Erreur lors du chargement des compétences: {error}
        </Alert>
      </DashboardPaper>
    );
  }

  return (
    <DashboardPaper>
      <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
        Compétences Moyennes
      </Typography>
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={skillsRadarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Compétences"
              dataKey="A"
              stroke={ACCENT}
              fill={ACCENT}
              fillOpacity={0.3}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </DashboardPaper>
  );
};

export default TaskCompletionChart;