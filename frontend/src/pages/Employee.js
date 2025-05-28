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
  LinearProgress
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import AddEmployeeForm from '../components/AddEmployeeForm';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
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

const Employee = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [employeesExpanded, setEmployeesExpanded] = useState(false);
  const [departmentsExpanded, setDepartmentsExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Enhanced mock data with more details
  const employees = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Senior Developer',
      department: 'IT',
      experience: '5 years',
      performance: 92,
      avatar: 'JD',
      skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
      projects: 8,
      salary: '$85,000',
      email: 'john.doe@company.com',
      joinDate: '2019-03-15',
      satisfaction: 88,
      productivity: 95,
      teamwork: 90,
      leadership: 85
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'HR Manager',
      department: 'HR',
      experience: '7 years',
      performance: 88,
      avatar: 'JS',
      skills: ['Recruitment', 'Training', 'Employee Relations', 'Policy Development'],
      projects: 5,
      salary: '$75,000',
      email: 'jane.smith@company.com',
      joinDate: '2017-08-22',
      satisfaction: 92,
      productivity: 87,
      teamwork: 95,
      leadership: 93
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Financial Analyst',
      department: 'Finance',
      experience: '4 years',
      performance: 85,
      avatar: 'MJ',
      skills: ['Financial Analysis', 'Budgeting', 'Excel', 'PowerBI', 'SAP'],
      projects: 6,
      salary: '$70,000',
      email: 'mike.johnson@company.com',
      joinDate: '2020-01-10',
      satisfaction: 85,
      productivity: 88,
      teamwork: 82,
      leadership: 78
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      role: 'IT Director',
      department: 'IT',
      experience: '10 years',
      performance: 96,
      avatar: 'SW',
      skills: ['Leadership', 'Strategy', 'Cloud Architecture', 'Team Management'],
      projects: 12,
      salary: '$120,000',
      email: 'sarah.wilson@company.com',
      joinDate: '2014-05-01',
      satisfaction: 94,
      productivity: 92,
      teamwork: 96,
      leadership: 98
    },
    {
      id: 5,
      name: 'Robert Brown',
      role: 'Finance Director',
      department: 'Finance',
      experience: '12 years',
      performance: 94,
      avatar: 'RB',
      skills: ['Financial Strategy', 'Risk Management', 'Investment Analysis'],
      projects: 8,
      salary: '$115,000',
      email: 'robert.brown@company.com',
      joinDate: '2012-11-15',
      satisfaction: 91,
      productivity: 93,
      teamwork: 89,
      leadership: 96
    },
    {
      id: 6,
      name: 'Emily Davis',
      role: 'Marketing Specialist',
      department: 'Marketing',
      experience: '3 years',
      performance: 82,
      avatar: 'ED',
      skills: ['Digital Marketing', 'Content Creation', 'SEO', 'Social Media'],
      projects: 7,
      salary: '$55,000',
      email: 'emily.davis@company.com',
      joinDate: '2021-09-01',
      satisfaction: 87,
      productivity: 84,
      teamwork: 88,
      leadership: 75
    }
  ];

  const departments = [
    {
      name: 'IT',
      head: 'Sarah Wilson',
      employees: 25,
      projects: 12,
      budget: '$500,000',
      performance: 90,
      description: 'Technology infrastructure and software development',
      location: 'Building A, Floor 3',
      established: '2010',
      avgSalary: '$82,000',
      technologies: ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
      currentProjects: ['ERP System', 'Mobile App', 'Cloud Migration'],
      teamSatisfaction: 89
    },
    {
      name: 'HR',
      head: 'Jane Smith',
      employees: 15,
      projects: 8,
      budget: '$300,000',
      performance: 85,
      description: 'Human resources management and employee development',
      location: 'Building B, Floor 1',
      established: '2008',
      avgSalary: '$65,000',
      technologies: ['HRIS', 'ATS', 'Performance Management Systems'],
      currentProjects: ['Talent Acquisition', 'Training Program', 'Employee Wellness'],
      teamSatisfaction: 92
    },
    {
      name: 'Finance',
      head: 'Robert Brown',
      employees: 20,
      projects: 10,
      budget: '$400,000',
      performance: 88,
      description: 'Financial planning, analysis and accounting operations',
      location: 'Building A, Floor 2',
      established: '2005',
      avgSalary: '$78,000',
      technologies: ['SAP', 'Oracle', 'PowerBI', 'Excel'],
      currentProjects: ['Budget Planning', 'Cost Analysis', 'Financial Reporting'],
      teamSatisfaction: 87
    },
    {
      name: 'Marketing',
      head: 'David Johnson',
      employees: 12,
      projects: 6,
      budget: '$250,000',
      performance: 83,
      description: 'Brand management and digital marketing strategies',
      location: 'Building B, Floor 2',
      established: '2012',
      avgSalary: '$58,000',
      technologies: ['Google Analytics', 'HubSpot', 'Adobe Creative Suite'],
      currentProjects: ['Brand Campaign', 'Website Redesign', 'Social Media Strategy'],
      teamSatisfaction: 85
    }
  ];

  // Filter employees based on selections
  const filteredEmployees = useMemo(() => {
    if (selectedDepartments.length === 0 && selectedEmployees.length === 0) {
      return employees;
    }
    
    return employees.filter(emp => {
      const deptMatch = selectedDepartments.length === 0 || selectedDepartments.includes(emp.department);
      const empMatch = selectedEmployees.length === 0 || selectedEmployees.includes(emp.id);
      return deptMatch && empMatch;
    });
  }, [selectedEmployees, selectedDepartments]);

  // Filter departments based on selections
  const filteredDepartments = useMemo(() => {
    if (selectedDepartments.length === 0) {
      return departments;
    }
    return departments.filter(dept => selectedDepartments.includes(dept.name));
  }, [selectedDepartments]);

  // Generate filtered performance data
  const performanceData = useMemo(() => {
    const baseData = [
      { name: 'Jan', stress: 65, performance: 75, satisfaction: 80, productivity: 82 },
      { name: 'Feb', stress: 70, performance: 80, satisfaction: 82, productivity: 85 },
      { name: 'Mar', stress: 60, performance: 85, satisfaction: 85, productivity: 87 },
      { name: 'Apr', stress: 55, performance: 88, satisfaction: 87, productivity: 89 },
      { name: 'May', stress: 50, performance: 90, satisfaction: 90, productivity: 92 },
      { name: 'Jun', stress: 48, performance: 92, satisfaction: 93, productivity: 94 }
    ];

    if (filteredEmployees.length === 0) return baseData;

    // Adjust data based on filtered employees' average performance
    const avgPerformance = filteredEmployees.reduce((sum, emp) => sum + emp.performance, 0) / filteredEmployees.length;
    const performanceMultiplier = avgPerformance / 88; // Base average

    return baseData.map(month => ({
      ...month,
      performance: Math.round(month.performance * performanceMultiplier),
      satisfaction: Math.round(month.satisfaction * performanceMultiplier),
      productivity: Math.round(month.productivity * performanceMultiplier)
    }));
  }, [filteredEmployees]);

  // Generate department distribution data
  const departmentDistribution = useMemo(() => {
    if (selectedDepartments.length === 0) {
      return [
        { name: 'IT', value: 30, employees: 25 },
        { name: 'HR', value: 20, employees: 15 },
        { name: 'Finance', value: 25, employees: 20 },
        { name: 'Marketing', value: 15, employees: 12 },
        { name: 'Operations', value: 10, employees: 8 },
      ];
    }
    
    return filteredDepartments.map(dept => ({
      name: dept.name,
      value: dept.employees,
      employees: dept.employees
    }));
  }, [filteredDepartments, selectedDepartments]);

  // Generate skills radar data
  const skillsRadarData = useMemo(() => {
    if (filteredEmployees.length === 0) return [];
    
    const avgSkills = filteredEmployees.reduce((acc, emp) => {
      acc.performance += emp.performance;
      acc.satisfaction += emp.satisfaction;
      acc.productivity += emp.productivity;
      acc.teamwork += emp.teamwork;
      acc.leadership += emp.leadership;
      return acc;
    }, { performance: 0, satisfaction: 0, productivity: 0, teamwork: 0, leadership: 0 });

    const count = filteredEmployees.length;
    return [
      { subject: 'Performance', A: Math.round(avgSkills.performance / count), fullMark: 100 },
      { subject: 'Satisfaction', A: Math.round(avgSkills.satisfaction / count), fullMark: 100 },
      { subject: 'Productivity', A: Math.round(avgSkills.productivity / count), fullMark: 100 },
      { subject: 'Teamwork', A: Math.round(avgSkills.teamwork / count), fullMark: 100 },
      { subject: 'Leadership', A: Math.round(avgSkills.leadership / count), fullMark: 100 },
    ];
  }, [filteredEmployees]);

  const COLORS = [ACCENT, ACCENT2, ACCENT3, ACCENT4, ACCENT5];

  const handleInfoClick = (item, type) => {
    setSelectedInfo({ item, type });
    setShowInfo(true);
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleDepartmentSelect = (deptName) => {
    setSelectedDepartments(prev =>
      prev.includes(deptName)
        ? prev.filter(name => name !== deptName)
        : [...prev, deptName]
    );
  };

  const clearFilters = () => {
    setSelectedEmployees([]);
    setSelectedDepartments([]);
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

      {/* Filter Section */}
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
              onClick={clearFilters}
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
                  {employees.map((employee) => (
                    <ListItem key={employee.id} dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={() => handleEmployeeSelect(employee.id)}
                            sx={{ color: ACCENT }}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ bgcolor: ACCENT, width: 24, height: 24, fontSize: '0.75rem' }}>
                              {employee.avatar}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">{employee.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {employee.role}
                              </Typography>
                            </Box>
                          </Stack>
                        }
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleInfoClick(employee, 'employee')}
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
                      <IconButton 
                        size="small" 
                        onClick={() => handleInfoClick(department, 'department')}
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
        </Grid>
      </FilterCard>
      
      <Grid container spacing={3}>
        {/* Charts Section */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* Performance Chart */}
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

            <Grid container spacing={3}>
              {/* Department Distribution */}
              <Grid item xs={12} md={6}>
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
              </Grid>

              {/* Skills Radar */}
              <Grid item xs={12} md={6}>
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
                      {filteredEmployees.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Employés
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ color: ACCENT2, fontWeight: 700 }}>
                      {filteredDepartments.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Départements
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ color: ACCENT3, fontWeight: 700 }}>
                      {filteredEmployees.length > 0 ? 
                        Math.round(filteredEmployees.reduce((sum, emp) => sum + emp.performance, 0) / filteredEmployees.length) : 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Performance Moy.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ color: ACCENT4, fontWeight: 700 }}>
                      {filteredDepartments.reduce((sum, dept) => sum + dept.projects, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Projets Actifs
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DashboardPaper>

            {/* Quick Info Cards */}
            {filteredEmployees.slice(0, 3).map((employee) => (
              <InfoCard key={employee.id}>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: ACCENT }}>
                      {employee.avatar}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {employee.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {employee.role}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip 
                          size="small" 
                          label={`${employee.performance}%`}
                          sx={{ bgcolor: 'rgba(79,141,253,0.1)', color: ACCENT }}
                        />
                        <Chip 
                          size="small" 
                          label={employee.department}
                          sx={{ bgcolor: 'rgba(0,196,159,0.1)', color: ACCENT2 }}
                        />
                      </Stack>
                    </Box>
                    <IconButton 
                      size="small"
                      onClick={() => handleInfoClick(employee, 'employee')}
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

      {/* Enhanced Info Dialog with Blur Background */}
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
                  {selectedInfo.item.avatar}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: ACCENT }}>
                    {selectedInfo.item.name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    {selectedInfo.item.role}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip 
                      label={selectedInfo.item.department}
                      sx={{ bgcolor: `${ACCENT}20`, color: ACCENT }}
                    />
                    <Chip 
                      label={`${selectedInfo.item.experience} d'expérience`}
                      sx={{ bgcolor: `${ACCENT2}20`, color: ACCENT2 }}
                    />
                  </Stack>
                </Box>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, bgcolor: `${ACCENT}05` }}>
                    <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
                      Informations Personnelles
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ color: ACCENT }} />
                        <Typography variant="body2">
                          <strong>Email:</strong> {selectedInfo.item.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ color: ACCENT }} />
                        <Typography variant="body2">
                          <strong>Date d'embauche:</strong> {new Date(selectedInfo.item.joinDate).toLocaleDateString('fr-FR')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          <strong>Salaire:</strong> {selectedInfo.item.salary}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          <strong>Projets actifs:</strong> {selectedInfo.item.projects}
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
                          <Typography variant="body2">Performance</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedInfo.item.performance}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedInfo.item.performance} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: `${ACCENT}20`,
                            '& .MuiLinearProgress-bar': { bgcolor: ACCENT }
                          }}
                        />
                      </Box>
                      
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Satisfaction</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedInfo.item.satisfaction}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedInfo.item.satisfaction} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: `${ACCENT2}20`,
                            '& .MuiLinearProgress-bar': { bgcolor: ACCENT2 }
                          }}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Productivité</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedInfo.item.productivity}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedInfo.item.productivity} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: `${ACCENT3}20`,
                            '& .MuiLinearProgress-bar': { bgcolor: ACCENT3 }
                          }}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Travail d'équipe</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedInfo.item.teamwork}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedInfo.item.teamwork} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: `${ACCENT4}20`,
                            '& .MuiLinearProgress-bar': { bgcolor: ACCENT4 }
                          }}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Leadership</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedInfo.item.leadership}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedInfo.item.leadership} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: `${ACCENT5}20`,
                            '& .MuiLinearProgress-bar': { bgcolor: ACCENT5 }
                          }}
                        />
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 3, bgcolor: `${ACCENT3}05` }}>
                    <Typography variant="h6" sx={{ mb: 2, color: ACCENT3, fontWeight: 600 }}>
                      Compétences
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {selectedInfo.item.skills.map((skill, index) => (
                        <Chip 
                          key={index}
                          label={skill}
                          sx={{ 
                            bgcolor: `${COLORS[index % COLORS.length]}20`,
                            color: COLORS[index % COLORS.length],
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {selectedInfo?.type === 'department' && selectedInfo?.item && (
            <Box>
              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: ACCENT2, 
                    width: 80, 
                    height: 80,
                    fontSize: '2rem'
                  }}
                >
                  <BusinessIcon fontSize="large" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: ACCENT2 }}>
                    Département {selectedInfo.item.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {selectedInfo.item.description}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip 
                      label={`${selectedInfo.item.employees} employés`}
                      sx={{ bgcolor: `${ACCENT2}20`, color: ACCENT2 }}
                    />
                    <Chip 
                      label={`Créé en ${selectedInfo.item.established}`}
                      sx={{ bgcolor: `${ACCENT}20`, color: ACCENT }}
                    />
                  </Stack>
                </Box>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, bgcolor: `${ACCENT2}05` }}>
                    <Typography variant="h6" sx={{ mb: 2, color: ACCENT2, fontWeight: 600 }}>
                      Informations Générales
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2">
                          <strong>Chef de département:</strong> {selectedInfo.item.head}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          <strong>Localisation:</strong> {selectedInfo.item.location}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          <strong>Budget:</strong> {selectedInfo.item.budget}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          <strong>Salaire moyen:</strong> {selectedInfo.item.avgSalary}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          <strong>Projets actifs:</strong> {selectedInfo.item.projects}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, bgcolor: `${ACCENT}05` }}>
                    <Typography variant="h6" sx={{ mb: 2, color: ACCENT, fontWeight: 600 }}>
                      Performance & Satisfaction
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Performance du département</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedInfo.item.performance}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedInfo.item.performance} 
                          sx={{ 
                            height: 10, 
                            borderRadius: 4,
                            bgcolor: `${ACCENT}20`,
                            '& .MuiLinearProgress-bar': { bgcolor: ACCENT }
                          }}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Satisfaction de l'équipe</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedInfo.item.teamSatisfaction}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedInfo.item.teamSatisfaction} 
                          sx={{ 
                            height: 10, 
                            borderRadius: 4,
                            bgcolor: `${ACCENT2}20`,
                            '& .MuiLinearProgress-bar': { bgcolor: ACCENT2 }
                          }}
                        />
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, bgcolor: `${ACCENT3}05` }}>
                    <Typography variant="h6" sx={{ mb: 2, color: ACCENT3, fontWeight: 600 }}>
                      Technologies Utilisées
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {selectedInfo.item.technologies.map((tech, index) => (
                        <Chip 
                          key={index}
                          label={tech}
                          sx={{ 
                            bgcolor: `${COLORS[index % COLORS.length]}20`,
                            color: COLORS[index % COLORS.length],
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, bgcolor: `${ACCENT4}05` }}>
                    <Typography variant="h6" sx={{ mb: 2, color: ACCENT4, fontWeight: 600 }}>
                      Projets Actuels
                    </Typography>
                    <Stack spacing={1}>
                      {selectedInfo.item.currentProjects.map((project, index) => (
                        <Box 
                          key={index}
                          sx={{ 
                            p: 1, 
                            bgcolor: 'white', 
                            borderRadius: 2,
                            border: `1px solid ${COLORS[index % COLORS.length]}30`
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {project}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </InfoDialog>

      <AddEmployeeForm 
        open={showAddForm} 
        onClose={() => setShowAddForm(false)} 
      />
    </Box>
  );
};

export default Employee;