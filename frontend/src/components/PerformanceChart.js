import React, { useState, useEffect, useMemo } from 'react';
import { 
  Typography, 
  Box, 
  Paper,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line
} from 'recharts';
import { styled } from '@mui/material/styles';

const ACCENT = '#4F8DFD';
const ACCENT2 = '#00C49F';
const ACCENT3 = '#FFBB28';

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

const PerformanceChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksRes, ticketsRes] = await Promise.all([
          fetch('http://localhost:8080/api/tasks'),
          fetch('http://localhost:8080/api/tickets')
        ]);

        if (!tasksRes.ok || !ticketsRes.ok) {
          throw new Error('Failed to fetch performance data');
        }

        const [tasksData, ticketsData] = await Promise.all([
          tasksRes.json(),
          ticketsRes.json()
        ]);

        setTasks(tasksData);
        setTickets(ticketsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const performanceData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentDate = new Date();
    
    return months.map(month => {
      const monthIndex = months.indexOf(month);
      
      // Calculate metrics for the month
      const monthTasks = tasks.filter(task => {
        const taskDate = new Date(task.assignedDate);
        return taskDate.getMonth() === monthIndex && taskDate.getFullYear() === currentDate.getFullYear();
      });

      const monthTickets = tickets.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt);
        return ticketDate.getMonth() === monthIndex && ticketDate.getFullYear() === currentDate.getFullYear();
      });

      const completedTasks = monthTasks.filter(task => task.status === 'Completed').length;
      const resolvedTickets = monthTickets.filter(ticket => 
        ticket.status === 'Resolved' || ticket.status === 'Closed'
      ).length;

      const performance = monthTasks.length > 0 ? (completedTasks / monthTasks.length) * 100 : 0;
      const satisfaction = monthTickets.length > 0 ? (resolvedTickets / monthTickets.length) * 100 : 0;
      const productivity = ((performance + satisfaction) / 2);

      return {
        name: month,
        performance: Math.round(performance),
        satisfaction: Math.round(satisfaction),
        productivity: Math.round(productivity)
      };
    });
  }, [tasks, tickets]);

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
          Erreur lors du chargement des données de performance: {error}
        </Alert>
      </DashboardPaper>
    );
  }

  return (
    <DashboardPaper>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TrendingUpIcon sx={{ color: ACCENT }} />
        <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 600 }}>
          Performance & Satisfaction
        </Typography>
      </Stack>
      <Box sx={{ height: { xs: 250, md: 300 } }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ACCENT} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={ACCENT} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ACCENT2} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={ACCENT2} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(79,141,253,0.1)" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid rgba(79,141,253,0.2)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(79,141,253,0.1)'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="performance" 
              stroke={ACCENT} 
              fillOpacity={1} 
              fill="url(#colorPerformance)"
              name="Performance" 
            />
            <Area 
              type="monotone" 
              dataKey="satisfaction" 
              stroke={ACCENT2} 
              fillOpacity={1} 
              fill="url(#colorSatisfaction)"
              name="Satisfaction" 
            />
            <Line type="monotone" dataKey="productivity" stroke={ACCENT3} name="Productivité" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </DashboardPaper>
  );
};

export default PerformanceChart;