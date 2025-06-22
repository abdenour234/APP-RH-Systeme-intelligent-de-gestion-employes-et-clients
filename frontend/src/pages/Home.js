import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  People, 
  Business, 
  Autorenew, 
  Star, 
  DateRange, 
  TrackChanges, 
  FlashOn 
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6', 
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

// API service functions based on your Spring Boot controllers
const apiService = {
  // Base API URL - adjust this to match your backend
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',

  async fetchEmployees() {
    try {
      const response = await fetch(`${this.baseURL}/employees`);
      if (!response.ok) throw new Error('Failed to fetch employees');
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  },

  async fetchDepartments() {
    try {
      const response = await fetch(`${this.baseURL}/departments`);
      if (!response.ok) throw new Error('Failed to fetch departments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  },

  async fetchProjects() {
    try {
      const response = await fetch(`${this.baseURL}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async fetchClients() {
    try {
      const response = await fetch(`${this.baseURL}/clients`);
      if (!response.ok) throw new Error('Failed to fetch clients');
      return await response.json();
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  async fetchContracts() {
    try {
      const response = await fetch(`${this.baseURL}/contracts`);
      if (!response.ok) throw new Error('Failed to fetch contracts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching contracts:', error);
      return [];
    }
  },

  async fetchTickets() {
    try {
      const response = await fetch(`${this.baseURL}/tickets`);
      if (!response.ok) throw new Error('Failed to fetch tickets');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return [];
    }
  }
};

// Data processing utilities based on your model structure
const dataProcessors = {
  // Process employees data for gender distribution
  processGenderData(employees) {
    if (!employees.length) return [];
    
    const genderCounts = employees.reduce((acc, emp) => {
      const gender = emp.sexe || 'Non spécifié';
      const genderKey = gender === 'M' ? 'Hommes' : 
                       gender === 'F' ? 'Femmes' : 'Autre';
      acc[genderKey] = (acc[genderKey] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(genderCounts).map(([name, value], index) => ({
      name,
      value,
      color: index === 0 ? COLORS.primary : index === 1 ? COLORS.secondary : COLORS.accent
    }));
  },

  // Process employees data for age distribution
  processAgeData(employees) {
    if (!employees.length) return [];

    const ageRanges = {
      '20-25': 0,
      '26-30': 0,
      '31-35': 0,
      '36-40': 0,
      '41+': 0
    };

    employees.forEach(emp => {
      let age = emp.age;
      
      // If age is not directly available, calculate from birth date or hire date
      if (!age && emp.hireDate) {
        // Estimate age based on typical career start (assuming 22-25 years old at hire)
        const yearsWorked = this.calculateYearsFromDate(emp.hireDate);
        age = 24 + yearsWorked; // Rough estimation
      }

      if (age >= 20 && age <= 25) ageRanges['20-25']++;
      else if (age >= 26 && age <= 30) ageRanges['26-30']++;
      else if (age >= 31 && age <= 35) ageRanges['31-35']++;
      else if (age >= 36 && age <= 40) ageRanges['36-40']++;
      else if (age >= 41) ageRanges['41+']++;
    });

    return Object.entries(ageRanges).map(([age, count]) => ({
      age,
      count,
      growth: '+0%' // Can be calculated with historical data
    }));
  },

  // Calculate years from a given date
  calculateYearsFromDate(date) {
    if (!date) return 0;
    const today = new Date();
    const pastDate = new Date(date);
    return today.getFullYear() - pastDate.getFullYear();
  },

  // Process departments data with employee counts
  processDepartmentData(departments, employees) {
    if (!departments.length) return [];
    
    const departmentColors = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success, COLORS.warning];
    
    return departments.map((dept, index) => {
      // Count employees in this department
      const employeeCount = employees.filter(emp => 
        emp.department && emp.department.departmentId === dept.departmentId
      ).length;

      return {
        name: dept.departmentName,
        value: employeeCount,
        color: departmentColors[index % departmentColors.length],
        budget: `€${Math.round(employeeCount * 50000)}` // Estimated budget
      };
    }).filter(dept => dept.value > 0); // Only show departments with employees
  },

  // Calculate turnover rate
  calculateTurnoverRate(employees) {
    if (!employees.length) return 0;
    
    const currentYear = new Date().getFullYear();
    const inactiveThisYear = employees.filter(emp => 
      emp.status === 'INACTIVE' && 
      emp.hireDate && 
      new Date(emp.hireDate).getFullYear() === currentYear
    ).length;
    
    return Math.round((inactiveThisYear / employees.length) * 100);
  },

  // Generate performance data based on projects and tickets
  generatePerformanceData(projects, tickets) {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(0, currentMonth + 1).map((month, index) => {
      // Calculate performance based on project completion
      const completedProjects = projects.filter(p => 
        p.status === 'Completed' && 
        new Date(p.endDate).getMonth() === index
      ).length;
      
      const totalProjects = projects.filter(p => 
        new Date(p.startDate).getMonth() <= index
      ).length;
      
      const performance = totalProjects > 0 ? 
        Math.round((completedProjects / totalProjects) * 100) : 85;
      
      // Calculate satisfaction based on ticket resolution
      const resolvedTickets = tickets.filter(t => 
        t.status === 'Resolved' && 
        new Date(t.resolvedAt).getMonth() === index
      ).length;
      
      const totalTickets = tickets.filter(t => 
        new Date(t.createdAt).getMonth() <= index
      ).length;
      
      const satisfaction = totalTickets > 0 ? 
        Math.round((resolvedTickets / totalTickets) * 100) : 90;
      
      return {
        month,
        performance: Math.min(100, performance + 70), // Baseline performance
        satisfaction: Math.min(100, satisfaction)
      };
    });
  },

  // Process contract type distribution
  processContractData(contracts) {
    if (!contracts.length) return [];
    
    const contractTypes = contracts.reduce((acc, contract) => {
      const type = contract.contractType || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(contractTypes).map(([name, value], index) => ({
      name,
      value,
      color: [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success, COLORS.warning][index % 5]
    }));
  }
};

const KPICard = ({ title, value, subtitle, icon: Icon, gradient, trend, delay = 0, loading = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const cardStyle = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
    background: loading ? '#f3f4f6' : gradient,
    transform: isVisible ? 'translateY(0px) scale(1)' : 'translateY(32px) scale(0.95)',
    opacity: isVisible ? 1 : 0,
    cursor: 'pointer',
  };

  const hoverStyle = {
    ...cardStyle,
    transform: 'translateY(-8px) scale(1.05)',
    boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.35)',
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={isHovered && !loading ? hoverStyle : cardStyle}
      onMouseEnter={() => !loading && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: loading ? 'none' : 'linear-gradient(to bottom right, rgba(255,255,255,0.2), transparent)'
      }}></div>
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{
            padding: '12px',
            background: loading ? '#e5e7eb' : 'rgba(255,255,255,0.2)',
            borderRadius: '16px',
            backdropFilter: 'blur(8px)'
          }}>
            <Icon style={{ fontSize: 32, color: loading ? '#9ca3af' : 'white' }} />
          </div>
          {trend && !loading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)'
            }}>
              <TrendingUp style={{ fontSize: 16, color: 'white' }} />
              <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{trend}</span>
            </div>
          )}
        </div>
        
        <div style={{ color: loading ? '#6b7280' : 'white' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 500, opacity: 0.9, margin: '0 0 8px 0' }}>{title}</h3>
          <div style={{ fontSize: '36px', fontWeight: 700, margin: '0 0 4px 0' }}>
            {loading ? '...' : value}
          </div>
          {subtitle && <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>{subtitle}</p>}
        </div>
      </div>
      
      {!loading && (
        <div style={{
          position: 'absolute',
          bottom: '-24px',
          right: '-24px',
          width: '96px',
          height: '96px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          transition: 'transform 0.5s ease',
          transform: isHovered ? 'scale(1.5)' : 'scale(1)'
        }}></div>
      )}
    </div>
  );
};

const ChartCard = ({ title, children, delay = 0, style = {}, loading = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid #f3f4f6',
    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isVisible ? 'translateY(0px)' : 'translateY(32px)',
    opacity: isVisible ? 1 : 0,
    ...style
  };

  const hoverStyle = {
    ...cardStyle,
    transform: 'translateY(-4px)',
    boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.35)',
  };

  const LoadingSpinner = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '320px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  return (
    <div 
      style={isHovered && !loading ? hoverStyle : cardStyle}
      onMouseEnter={() => !loading && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 style={{ 
        fontSize: '24px', 
        fontWeight: 700, 
        color: '#1f2937', 
        marginBottom: '24px', 
        textAlign: 'center',
        margin: '0 0 24px 0'
      }}>{title}</h3>
      {loading ? <LoadingSpinner /> : children}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'white',
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <p style={{ fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ fontSize: '14px', color: entry.color, margin: '4px 0' }}>
            {entry.name}: {entry.value}
            {entry.payload.growth && <span style={{ marginLeft: '8px', color: '#10b981' }}>({entry.payload.growth})</span>}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const NavButton = ({ icon: Icon, label, isActive = false, to }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    background: isActive ? '#4f46e5' : (isHovered ? '#eef2ff' : 'transparent'),
    color: isActive ? 'white' : (isHovered ? '#4f46e5' : '#6b7280'),
    boxShadow: isActive ? '0 10px 25px -3px rgba(79, 70, 229, 0.3)' : 'none',
    textDecoration: 'none'
  };

  return (
    <Link 
      to={to}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon style={{ fontSize: 20 }} />
      {label}
    </Link>
  );
};

const HRDashboard = () => {
  // State for all data
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Processed data state
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [contractData, setContractData] = useState([]);
  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    turnoverRate: 0,
    satisfactionScore: 0,
    activeProjects: 0,
    resolvedTickets: 0
  });

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          employeesData,
          departmentsData,
          projectsData,
          clientsData,
          contractsData,
          ticketsData
        ] = await Promise.all([
          apiService.fetchEmployees(),
          apiService.fetchDepartments(),
          apiService.fetchProjects(),
          apiService.fetchClients(),
          apiService.fetchContracts(),
          apiService.fetchTickets()
        ]);

        // Set raw data
        setEmployees(employeesData);
        setDepartments(departmentsData);
        setProjects(projectsData);
        setClients(clientsData);
        setContracts(contractsData);
        setTickets(ticketsData);

        // Process data for charts
        const processedGenderData = dataProcessors.processGenderData(employeesData);
        const processedAgeData = dataProcessors.processAgeData(employeesData);
        const processedDepartmentData = dataProcessors.processDepartmentData(departmentsData, employeesData);
        const processedPerformanceData = dataProcessors.generatePerformanceData(projectsData, ticketsData);
        const processedContractData = dataProcessors.processContractData(contractsData);

        setGenderData(processedGenderData);
        setAgeData(processedAgeData);
        setDepartmentData(processedDepartmentData);
        setPerformanceData(processedPerformanceData);
        setContractData(processedContractData);

        // Calculate metrics
        const activeEmployees = employeesData.filter(emp => emp.status !== 'INACTIVE');
        const turnoverRate = dataProcessors.calculateTurnoverRate(employeesData);
        const activeProjects = projectsData.filter(p => p.status === 'IN_PROGRESS').length;
        const resolvedTickets = ticketsData.filter(t => t.status === 'Resolved').length;
        
        setMetrics({
          totalEmployees: activeEmployees.length,
          totalDepartments: departmentsData.length,
          turnoverRate,
          satisfactionScore: Math.round((resolvedTickets / (ticketsData.length || 1)) * 100),
          activeProjects,
          resolvedTickets
        });

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const gradients = {
    gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    gradient4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  };

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #f9fafb, #dbeafe, #e0e7ff)'
      }}>
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          <h2>Erreur</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '12px 24px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f9fafb, #dbeafe, #e0e7ff)'
    }}>
      {/* Modern Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(to bottom right, #4f46e5, #7c3aed)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FlashOn style={{ fontSize: 24, color: 'white' }} />
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 700,
              background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              RH Monitor Pro
            </h1>
          </div>
          
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NavButton icon={People} label="Employés" to="/employee" />
            <NavButton icon={Business} label="Clients" to="/clients" />
            <NavButton icon={TrackChanges} label="Projets" to="/projects" />
            <NavButton icon={DateRange} label="Contrats" to="/contracts" />
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            Tableau de Bord
            <span style={{
              background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}> Intelligent</span>
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            maxWidth: '672px',
            margin: '0 auto'
          }}>
            Analysez les performances RH avec des insights en temps réel et des visualisations interactives
          </p>
        </div>

        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <KPICard
            title="Total Employés"
            value={metrics.totalEmployees}
            subtitle="Employés actifs"
            icon={People}
            gradient={gradients.gradient1}
            trend="+15%"
            delay={0}
            loading={loading}
          />
          <KPICard
            title="Départements"
            value={metrics.totalDepartments}
            subtitle="Secteurs actifs"
            icon={Business}
            gradient={gradients.gradient2}
            trend="+1"
            delay={100}
            loading={loading}
          />
          <KPICard
            title="Projets Actifs"
            value={metrics.activeProjects}
            subtitle="En cours"
            icon={TrackChanges}
            gradient={gradients.gradient3}
            trend="+5"
            delay={200}
            loading={loading}
          />
          <KPICard
            title="Satisfaction"
            value={`${metrics.satisfactionScore}%`}
            subtitle="Tickets résolus"
            icon={Star}
            gradient={gradients.gradient4}
            trend="+8%"
            delay={300}
            loading={loading}
          />
        </div>

        {/* Performance Trend */}
        {performanceData.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <ChartCard title="Évolution des Performances" delay={400} loading={loading}>
              <div style={{ height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="performance" 
                      stroke={COLORS.primary}
                      strokeWidth={3}
                      fill="url(#performanceGradient)"
                      name="Performance (%)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke={COLORS.accent}
                      strokeWidth={3}
                      fill="url(#satisfactionGradient)"
                      name="Satisfaction (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        )}

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* Gender Distribution */}
          <ChartCard title="Répartition par Genre" delay={500} loading={loading}>
            <div style={{ height: '320px' }}>
              {genderData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#6b7280' }}>
                  Aucune donnée disponible
                </div>
              )}
              </div>
            </ChartCard>
  
            {/* Age Distribution */}
            <ChartCard title="Répartition par Âge" delay={600} loading={loading}>
              <div style={{ height: '320px' }}>
                {ageData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                      <XAxis dataKey="age" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill={COLORS.secondary} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#6b7280' }}>
                    Aucune donnée disponible
                  </div>
                )}
              </div>
            </ChartCard>
          </div>
  
          {/* Department Distribution */}
          {departmentData.length > 0 && (
            <ChartCard title="Répartition par Département" delay={700} loading={loading}>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis type="category" dataKey="name" stroke="#64748b" width={120} />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div style={{
                              background: 'white',
                              padding: '16px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '12px',
                              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}>
                              <p style={{ fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>{label}</p>
                              <p style={{ fontSize: '14px', color: payload[0].color, margin: '4px 0' }}>
                                Employés: {payload[0].value}
                              </p>
                              {data.budget && (
                                <p style={{ fontSize: '14px', color: '#10b981', margin: '4px 0' }}>
                                  Budget estimé: {data.budget}
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" fill={COLORS.accent} radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          )}

          {/* Contract Type Distribution */}
          {contractData.length > 0 && (
            <ChartCard title="Types de Contrats" delay={800} loading={loading}>
              <div style={{ height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contractData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {contractData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          )}
  
          {/* Quick Actions */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            marginTop: '32px'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              Actions Rapides
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <Link 
                to="/employees/new"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
              >
                <People style={{ fontSize: 24 }} />
                <span style={{ fontWeight: 500 }}>Nouvel Employé</span>
              </Link>
  
              <Link 
                to="/projects/new"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
              >
                <TrackChanges style={{ fontSize: 24 }} />
                <span style={{ fontWeight: 500 }}>Nouveau Projet</span>
              </Link>
  
              <Link 
                to="/departments/new"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
              >
                <Business style={{ fontSize: 24 }} />
                <span style={{ fontWeight: 500 }}>Nouveau Département</span>
              </Link>
  
              <Link 
                to="/contracts/new"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
              >
                <DateRange style={{ fontSize: 24 }} />
                <span style={{ fontWeight: 500 }}>Nouveau Contrat</span>
              </Link>
            </div>
          </div>
  
          {/* Footer */}
          <footer style={{
            textAlign: 'center',
            marginTop: '48px',
            padding: '24px',
            color: '#6b7280'
          }}>
            <p style={{ margin: 0 }}>
              © 2024 RH Monitor Pro. Système de gestion des ressources humaines.
            </p>
          </footer>
        </main>
      </div>
    );
  };
  
  export default HRDashboard;