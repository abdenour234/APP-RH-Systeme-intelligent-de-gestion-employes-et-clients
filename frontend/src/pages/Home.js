import React from 'react';
import { Box, Grid, Paper, Typography, ListItem, ListItemIcon, ListItemText, Divider, AppBar, Toolbar, Stack, Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

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
    transform: 'translateY(-4px) scale(1.03)',
    boxShadow: '0 8px 32px rgba(79,141,253,0.16)',
  },
}));

const KpiPaper = styled(DashboardPaper)(({ theme }) => ({
  borderLeft: `6px solid ${ACCENT}`,
  background: 'linear-gradient(135deg, #fafdff 80%, #e3f0ff 100%)',
  boxShadow: '0 4px 24px rgba(79,141,253,0.10)',
  '&:hover': {
    borderLeft: `8px solid ${ACCENT}`,
    boxShadow: '0 8px 32px rgba(79,141,253,0.18)',
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  marginTop: 80,
  padding: 0,
  width: '100vw',
  minHeight: `calc(100vh - 80px)`,
  boxSizing: 'border-box',
  background: 'linear-gradient(120deg, #fafdff 70%, #e3f0ff 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 0,
}));

// Mock data for graphs
const genderData = [
  { name: 'Hommes', value: 65 },
  { name: 'Femmes', value: 35 },
];

const ageData = [
  { age: '20-25', count: 15 },
  { age: '26-30', count: 25 },
  { age: '31-35', count: 30 },
  { age: '36-40', count: 20 },
  { age: '41+', count: 10 },
];

const departmentData = [
  { name: 'IT', value: 30 },
  { name: 'RH', value: 20 },
  { name: 'Finance', value: 25 },
  { name: 'Marketing', value: 15 },
  { name: 'Operations', value: 10 },
];

// Vivid colors for charts
const COLORS = [ACCENT, ACCENT2, ACCENT3, ACCENT4, '#8884D8'];

const navLinks = [
  {
    to: '/employee',
    icon: <PeopleIcon />, 
    label: "Espace Employé"
  },
  {
    to: '/clients',
    icon: <BusinessIcon />, 
    label: "Espace Client"
  },
  {
    to: '/projects',
    icon: <AssignmentIcon />, 
    label: "Espace Projets"
  },
];

const Home = () => {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top AppBar */}
      <AppBar position="fixed" color="default" elevation={3} sx={{ zIndex: 1201, bgcolor: 'white', color: 'black', boxShadow: '0 2px 8px rgba(79,141,253,0.08)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1, color: ACCENT }}>
            RH Monitor
          </Typography>
          <Stack direction="row" spacing={4}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                startIcon={link.icon}
                sx={{ color: ACCENT, fontWeight: 500, fontSize: '1rem', textTransform: 'none', '&:hover': { color: ACCENT2 } }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      <MainContent>
        <Box sx={{ width: '100%', maxWidth: 1300, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h3" sx={{ mb: 4, fontWeight: 800, letterSpacing: 1, color: ACCENT, textAlign: 'center' }}>
            Tableau de Bord
          </Typography>

          {/* KPIs en haut, centrés */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, width: '100%', mb: 5 }}>
            <KpiPaper sx={{ minWidth: 260, flex: 1, maxWidth: 350 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, textAlign: 'center', fontWeight: 600 }}>
                Total Employés
              </Typography>
              <Typography variant="h2" sx={{ mt: 2, fontWeight: 700, color: ACCENT, textAlign: 'center' }}>
                150
              </Typography>
            </KpiPaper>
            <KpiPaper sx={{ minWidth: 260, flex: 1, maxWidth: 350 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, textAlign: 'center', fontWeight: 600 }}>
                Départements
              </Typography>
              <Typography variant="h2" sx={{ mt: 2, fontWeight: 700, color: ACCENT, textAlign: 'center' }}>
                5
              </Typography>
            </KpiPaper>
            <KpiPaper sx={{ minWidth: 260, flex: 1, maxWidth: 350 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, textAlign: 'center', fontWeight: 600 }}>
                Taux de rotation
              </Typography>
              <Typography variant="h2" sx={{ mt: 2, fontWeight: 700, color: ACCENT, textAlign: 'center' }}>
                12%
              </Typography>
            </KpiPaper>
          </Box>

          {/* Graphiques Genre et Âge côte à côte, centrés et larges */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, width: '100%', maxWidth: 1100, mb: 5 }}>
            <DashboardPaper sx={{ flex: 1, minWidth: 320, maxWidth: 500, height: { xs: 350, md: 420 } }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: ACCENT, textAlign: 'center' }}>
                Répartition par Genre
              </Typography>
              <Box sx={{ height: { xs: 220, md: 300 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </DashboardPaper>
            <DashboardPaper sx={{ flex: 1, minWidth: 320, maxWidth: 500, height: { xs: 350, md: 420 } }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: ACCENT, textAlign: 'center' }}>
                Distribution par Âge
              </Typography>
              <Box sx={{ height: { xs: 220, md: 300 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                    <Bar dataKey="count" fill={ACCENT2} name="Nombre d'employés" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </DashboardPaper>
          </Box>

          {/* Graphique Département centré, 70% largeur */}
          <Box sx={{ width: { xs: '100%', md: '70%' }, mx: 'auto', mb: 5 }}>
            <DashboardPaper sx={{ height: { xs: 350, md: 420 }, width: '100%', mx: 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: ACCENT, textAlign: 'center' }}>
                Répartition par Département
              </Typography>
              <Box sx={{ height: { xs: 220, md: 300 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </DashboardPaper>
          </Box>
        </Box>
      </MainContent>
    </Box>
  );
};

export default Home;
