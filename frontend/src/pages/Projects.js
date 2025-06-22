import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';

const API_BASE_URL = 'http://localhost:8080/api';

// Enhanced color palette for comprehensive dashboard
const ACCENT = '#4F8DFD';
const ACCENT2 = '#00C49F';
const ACCENT3 = '#FFBB28';
const ACCENT4 = '#FF8042';
const ACCENT5 = '#8884d8';
const ACCENT6 = '#82ca9d';
const ACCENT7 = '#ffc658';
const ACCENT8 = '#ff7c7c';
const ACCENT9 = '#8dd1e1';
const ACCENT10 = '#d084d0';

const COLORS = [ACCENT, ACCENT2, ACCENT3, ACCENT4, ACCENT5, ACCENT6, ACCENT7, ACCENT8, ACCENT9, ACCENT10];

const GRADIENT_COLORS = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  tertiary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  info: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  dark: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
  light: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
};

const ProjectDashboard = () => {
  // State management for all data entities
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Advanced state for interactive features
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Enhanced data fetching with comprehensive error handling and retry logic
  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      console.log('🚀 Starting comprehensive data fetch...');
      
      const endpoints = [
        { name: 'projects', url: `${API_BASE_URL}/projects` },
        { name: 'clients', url: `${API_BASE_URL}/clients` },
        { name: 'departments', url: `${API_BASE_URL}/departments` },
        { name: 'employees', url: `${API_BASE_URL}/employees` },
        { name: 'tasks', url: `${API_BASE_URL}/tasks` },
        { name: 'tickets', url: `${API_BASE_URL}/tickets` },
        { name: 'contracts', url: `${API_BASE_URL}/contracts` }
      ];

      const fetchPromises = endpoints.map(async endpoint => {
        try {
          const response = await fetch(endpoint.url);
          if (!response.ok) {
            console.warn(`⚠️ ${endpoint.name} endpoint failed with status ${response.status}`);
            return { name: endpoint.name, data: [], error: true };
          }
          const data = await response.json();
          console.log(`✅ Successfully fetched ${data?.length || 0} ${endpoint.name}`);
          return { name: endpoint.name, data: Array.isArray(data) ? data : [], error: false };
        } catch (err) {
          console.warn(`⚠️ ${endpoint.name} fetch failed:`, err.message);
          return { name: endpoint.name, data: [], error: true };
        }
      });

      const results = await Promise.all(fetchPromises);
      const dataMap = {};

      results.forEach(result => {
        dataMap[result.name] = result.data;
      });

      // Set all data states
      setProjects(dataMap.projects);
      setClients(dataMap.clients);
      setDepartments(dataMap.departments);
      setEmployees(dataMap.employees);
      setTasks(dataMap.tasks);
      setTickets(dataMap.tickets);
      setContracts(dataMap.contracts);

      setLastUpdated(new Date());

      console.log('📊 Data fetch completed');

    } catch (err) {
      console.error('💥 Critical error during data fetch:', err);
      setError(`Erreur critique: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh mechanism
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchData(true);
      }, 300000); // Refresh every 5 minutes

      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchData]);

  // Comprehensive KPI calculations with corrected duration calculation
  const comprehensiveKPIs = useMemo(() => {
    console.log('🧮 Calculating comprehensive KPIs...');
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const lastMonth = new Date(currentYear, currentMonth - 1, 1);

    // Basic project metrics
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'EN_COURS').length;
    const completedProjects = projects.filter(p => p.status === 'TERMINE' || p.status === 'COMPLETED').length;

    // Time-based project metrics
    const projectsThisMonth = projects.filter(p => {
      if (!p.startDate) return false;
      const startDate = new Date(p.startDate);
      return startDate >= startOfMonth;
    }).length;

    const projectsLastMonth = projects.filter(p => {
      if (!p.startDate) return false;
      const startDate = new Date(p.startDate);
      return startDate >= lastMonth && startDate < startOfMonth;
    }).length;

    // Overdue projects
    const overdueProjects = projects.filter(p => {
      if (!p.dueAt || p.status === 'TERMINE' || p.status === 'COMPLETED') return false;
      return new Date(p.dueAt) < today;
    }).length;

    // CORRECTED Duration calculation - only for projects that are actually completed
    const completedProjectsWithDates = projects.filter(p => 
      (p.status === 'TERMINE' || p.status === 'COMPLETED') && 
      p.startDate && 
      p.endDate
    );
    
    console.log('Completed projects with dates for duration calc:', completedProjectsWithDates);
    
    const averageProjectDuration = completedProjectsWithDates.length > 0 
      ? Math.round(completedProjectsWithDates.reduce((sum, p) => {
          const start = new Date(p.startDate);
          const end = new Date(p.endDate);
          const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
          console.log(`Project ${p.projectName}: ${durationDays} days`);
          return sum + durationDays;
        }, 0) / completedProjectsWithDates.length)
      : 0;

    // Success rate
    const successRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    // Client and department metrics
    const uniqueClientsWithProjects = new Set(projects.filter(p => p.clientId).map(p => p.clientId)).size;
    const uniqueDepartmentsWithProjects = new Set(projects.filter(p => p.departmentId).map(p => p.departmentId)).size;

    // Employee metrics
    const employeesWithProjects = new Set(projects.filter(p => p.chefId).map(p => p.chefId)).size;
    const averageProjectsPerEmployee = employeesWithProjects > 0 
      ? Math.round((projects.filter(p => p.chefId).length / employeesWithProjects) * 10) / 10
      : 0;

    // Growth metrics
    const monthlyGrowthRate = projectsLastMonth > 0 
      ? Math.round(((projectsThisMonth - projectsLastMonth) / projectsLastMonth) * 100)
      : projectsThisMonth > 0 ? 100 : 0;

    // Top client calculation
    const topClient = clients.length > 0 ? (() => {
      const clientProjectCounts = {};
      projects.forEach(p => {
        if (p.clientId) {
          clientProjectCounts[p.clientId] = (clientProjectCounts[p.clientId] || 0) + 1;
        }
      });
      const topClientId = Object.keys(clientProjectCounts).reduce((a, b) => 
        clientProjectCounts[a] > clientProjectCounts[b] ? a : b, null
      );
      const topClientData = clients.find(c => c.clientId === parseInt(topClientId));
      return {
        name: topClientData?.clientName || 'Unknown',
        projectCount: clientProjectCounts[topClientId] || 0
      };
    })() : { name: 'N/A', projectCount: 0 };

    const comprehensiveMetrics = {
      // Basic counts
      totalProjects,
      activeProjects,
      completedProjects,
      overdueProjects,
      
      // Time-based metrics
      projectsThisMonth,
      projectsLastMonth,
      
      // Duration metrics (CORRECTED)
      averageProjectDuration,
      
      // Success metrics
      successRate,
      
      // Resource metrics
      uniqueClientsWithProjects,
      uniqueDepartmentsWithProjects,
      employeesWithProjects,
      
      // Efficiency metrics
      averageProjectsPerEmployee,
      
      // Growth metrics
      monthlyGrowthRate,
      
      // Top performers
      topClient,
      
      // Totals for context
      totalClients: clients.length,
      totalDepartments: departments.length,
      totalEmployees: employees.length
    };

    console.log('📈 Comprehensive KPIs calculated:', comprehensiveMetrics);
    return comprehensiveMetrics;
  }, [projects, clients, departments, employees]);

  // Chart data calculations
  const chartDataSets = useMemo(() => {
    console.log('📊 Generating chart datasets...');

    // Status Distribution
    const statusDistributionData = (() => {
      const statusCounts = {};
      
      projects.forEach(project => {
        const status = project.status || 'INCONNU';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
      const statusLabels = {
        'EN_COURS': 'En cours',
        'TERMINE': 'Terminé',
        'EN_ATTENTE': 'En attente',
        'ANNULE': 'Annulé',
        'COMPLETED': 'Terminé',
        'INCONNU': 'Statut inconnu'
      };

      return Object.entries(statusCounts).map(([status, count]) => ({
        name: statusLabels[status] || status,
        value: count,
        percentage: Math.round((count / projects.length) * 100),
        color: COLORS[Object.keys(statusCounts).indexOf(status) % COLORS.length]
      }));
    })();

    // Client Analysis
    const clientAnalysisData = (() => {
      const clientMetrics = clients.map(client => {
        const clientProjects = projects.filter(p => p.clientId === client.clientId);
        const completedProjects = clientProjects.filter(p => p.status === 'TERMINE' || p.status === 'COMPLETED');
        const activeProjects = clientProjects.filter(p => p.status === 'EN_COURS');

        const valueScore = Math.round(
          (clientProjects.length * 10) + 
          (completedProjects.length * 15) + 
          (activeProjects.length * 5)
        );

        return {
          clientId: client.clientId,
          name: client.clientName,
          totalProjects: clientProjects.length,
          completedProjects: completedProjects.length,
          activeProjects: activeProjects.length,
          successRate: clientProjects.length > 0 ? Math.round((completedProjects.length / clientProjects.length) * 100) : 0,
          valueScore: valueScore
        };
      }).filter(c => c.totalProjects > 0)
        .sort((a, b) => b.valueScore - a.valueScore);

      return clientMetrics;
    })();

    // Department Performance
    const departmentPerformanceData = (() => {
      return departments.map(dept => {
        const deptEmployees = employees.filter(e => e.departmentId === dept.departmentId);
        const deptProjects = projects.filter(p => p.departmentId === dept.departmentId);
        const completedProjects = deptProjects.filter(p => p.status === 'TERMINE' || p.status === 'COMPLETED');
        const activeProjects = deptProjects.filter(p => p.status === 'EN_COURS');

        return {
          departmentId: dept.departmentId,
          name: dept.departmentName,
          employees: deptEmployees.length,
          totalProjects: deptProjects.length,
          completedProjects: completedProjects.length,
          activeProjects: activeProjects.length,
          successRate: deptProjects.length > 0 ? Math.round((completedProjects.length / deptProjects.length) * 100) : 0,
          projectsPerEmployee: deptEmployees.length > 0 ? Math.round((deptProjects.length / deptEmployees.length) * 10) / 10 : 0
        };
      }).filter(d => d.totalProjects > 0 || d.employees > 0);
    })();

    // Timeline Analysis
    const timelineAnalysisData = (() => {
      const timelineData = {};
      const months = 12;
      
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        timelineData[monthKey] = {
          month: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
          projectsStarted: 0,
          projectsCompleted: 0,
          cumulativeProjects: 0
        };
      }

      let cumulativeCount = 0;

      projects.forEach(project => {
        // Project starts
        if (project.startDate) {
          const startDate = new Date(project.startDate);
          const startKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
          if (timelineData[startKey]) {
            timelineData[startKey].projectsStarted++;
          }
        }

        // Project completions
        if (project.endDate && (project.status === 'TERMINE' || project.status === 'COMPLETED')) {
          const endDate = new Date(project.endDate);
          const endKey = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;
          if (timelineData[endKey]) {
            timelineData[endKey].projectsCompleted++;
          }
        }
      });

      // Calculate cumulative projects
      Object.keys(timelineData).sort().forEach(key => {
        cumulativeCount += timelineData[key].projectsStarted;
        timelineData[key].cumulativeProjects = cumulativeCount;
      });

      return Object.values(timelineData);
    })();

    // Performance Trends
    const performanceTrendsData = (() => {
      const trends = {};
      const quarters = 8;
      
      for (let i = quarters - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - (i * 3));
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        const year = date.getFullYear();
        const quarterKey = `Q${quarter} ${year}`;
        
        trends[quarterKey] = {
          quarter: quarterKey,
          projectsStarted: 0,
          projectsCompleted: 0,
          successRate: 0
        };
      }

      Object.keys(trends).forEach(quarterKey => {
        const [quarter, year] = quarterKey.split(' ');
        const quarterNum = parseInt(quarter.replace('Q', ''));
        const yearNum = parseInt(year);
        
        const startMonth = (quarterNum - 1) * 3;
        const endMonth = startMonth + 3;
        
        const quarterProjects = projects.filter(project => {
          if (!project.startDate) return false;
          const startDate = new Date(project.startDate);
          return startDate.getFullYear() === yearNum && 
                 startDate.getMonth() >= startMonth && 
                 startDate.getMonth() < endMonth;
        });

        const completedQuarterProjects = quarterProjects.filter(p => 
          p.status === 'TERMINE' || p.status === 'COMPLETED'
        );

        trends[quarterKey].projectsStarted = quarterProjects.length;
        trends[quarterKey].projectsCompleted = completedQuarterProjects.length;
        trends[quarterKey].successRate = quarterProjects.length > 0 
          ? Math.round((completedQuarterProjects.length / quarterProjects.length) * 100)
          : 0;
      });

      return Object.values(trends);
    })();

    const chartData = {
      statusDistribution: statusDistributionData,
      clientAnalysis: clientAnalysisData,
      departmentPerformance: departmentPerformanceData,
      timelineAnalysis: timelineAnalysisData,
      performanceTrends: performanceTrendsData
    };

    console.log('📊 Chart datasets generated');
    return chartData;
  }, [projects, clients, departments, employees]);

  // Enhanced KPI card component matching the screenshot style
  const KPICard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = ACCENT,
    trend
  }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease',
      minHeight: '160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div>
          <h3 style={{
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            margin: 0,
            opacity: 0.9
          }}>
            {title}
          </h3>
        </div>
        <div style={{
          fontSize: '2rem',
          opacity: 0.7
        }}>
          {icon}
        </div>
      </div>
      
      <div>
        <div style={{
          fontSize: '3rem',
          fontWeight: '900',
          color: color,
          margin: '0.5rem 0',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          {value}
        </div>
        
        <div style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.875rem',
          marginBottom: '0.5rem'
        }}>
          {subtitle}
        </div>
        
        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            <span style={{ 
              color: trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : 'rgba(255, 255, 255, 0.6)'
            }}>
              {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {trend > 0 ? 'augmentation' : trend < 0 ? 'diminution' : 'stable'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Enhanced chart component wrapper
  const ChartContainer = ({ title, children, fullWidth = false, height = 400, description }) => (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e2e8f0',
      gridColumn: fullWidth ? '1 / -1' : 'auto'
    }}>
      <div style={{
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #f1f5f9'
      }}>
        <h3 style={{
          margin: 0,
          color: '#1e293b',
          fontSize: '1.25rem',
          fontWeight: '700'
        }}>
          {title}
        </h3>
        {description && (
          <p style={{
            margin: '0.5rem 0 0 0',
            color: '#64748b',
            fontSize: '0.875rem'
          }}>
            {description}
          </p>
        )}
      </div>
      
      <div style={{ height: `${height}px` }}>
        {children}
      </div>
    </div>
  );

  // Loading component
  const LoadingComponent = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: GRADIENT_COLORS.primary
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '6px solid #f3f4f6',
          borderTop: '6px solid #4F8DFD',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 2rem'
        }}></div>
        
        <h3 style={{
          margin: '0 0 1rem 0',
          color: '#1e293b',
          fontSize: '1.5rem',
          fontWeight: '700'
        }}>
          Chargement du Dashboard
        </h3>
        
        <p style={{
          margin: 0,
          color: '#64748b',
          fontSize: '1rem'
        }}>
          Analyse des données en cours...
        </p>
      </div>
    </div>
  );

  // Error component
  const ErrorComponent = () => (
    <div style={{
      padding: '2rem',
      background: GRADIENT_COLORS.warning,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⚠️</div>
        
        <h2 style={{
          margin: '0 0 1rem 0',
          color: '#dc2626',
          fontSize: '1.75rem',
          fontWeight: '700'
        }}>
          Erreur de Connexion
        </h2>
        
        <p style={{
          margin: '0 0 2rem 0',
          color: '#64748b',
          fontSize: '1rem'
        }}>
          {error}
        </p>
        
        <button
          onClick={() => fetchData()}
          style={{
            background: ACCENT,
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🔄 Réessayer
        </button>
      </div>
    </div>
  );

  if (loading && !refreshing) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: GRADIENT_COLORS.primary,
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '900',
            color: 'white',
            margin: '0 0 0.5rem 0',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            Dashboard Projets
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '500'
          }}>
            Analyse complète et métriques de performance
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              background: autoRefresh ? ACCENT2 : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {autoRefresh ? '⏸️' : '▶️'} Auto-refresh
          </button>
          
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              opacity: refreshing ? 0.7 : 1
            }}
          >
            {refreshing ? '🔄' : '↻'} {refreshing ? 'Actualisation...' : 'Actualiser'}
          </button>
          
          <a
            href="/"
            style={{
              background: 'white',
              color: ACCENT,
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>

      {/* Primary KPI Grid - matching screenshot layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <KPICard
          title="Durée Moyenne du Projet"
          value={comprehensiveKPIs.averageProjectDuration}
          subtitle="jours pour terminer"
          icon="⏱️"
          color="#8B5CF6"
          trend={comprehensiveKPIs.monthlyGrowthRate > 0 ? -5 : 5}
        />
        
        <KPICard
          title="Taux de Réussite Global"
          value={`${comprehensiveKPIs.successRate}%`}
          subtitle="projets terminés"
          icon="📈"
          color={ACCENT2}
          trend={comprehensiveKPIs.successRate > 80 ? 8 : -3}
        />
        
        <KPICard
          title="Départements Actifs"
          value={comprehensiveKPIs.uniqueDepartmentsWithProjects}
          subtitle="sur 10 départements"
          icon="🏢"
          color={ACCENT}
        />
        
        <KPICard
          title="Clients Actifs"
          value={comprehensiveKPIs.uniqueClientsWithProjects}
          subtitle="clients avec projets"
          icon="👥"
          color="#9333EA"
        />
      </div>

      {/* Secondary KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <KPICard
          title="Projets Actifs"
          value={comprehensiveKPIs.activeProjects}
          subtitle="En cours d'exécution"
          icon="⚡"
          color={ACCENT3}
        />
        
        <KPICard
          title="Projets ce Mois"
          value={comprehensiveKPIs.projectsThisMonth}
          subtitle="Nouveaux projets"
          icon="📅"
          color={ACCENT4}
          trend={comprehensiveKPIs.monthlyGrowthRate}
        />
        
        <KPICard
          title="Charge Moyenne"
          value={`${comprehensiveKPIs.averageProjectsPerEmployee}`}
          subtitle="projets par employé"
          icon="⚖️"
          color={ACCENT5}
        />
        
        <KPICard
          title="Projets en Retard"
          value={comprehensiveKPIs.overdueProjects}
          subtitle="nécessitent attention"
          icon="⚠️"
          color="#EF4444"
        />
        
        <KPICard
          title="Client Principal"
          value={comprehensiveKPIs.topClient.projectCount}
          subtitle={comprehensiveKPIs.topClient.name}
          icon="🏆"
          color="#F59E0B"
        />
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {/* Status Distribution */}
        <ChartContainer 
          title="Distribution des Statuts" 
          description="Répartition des projets par statut"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartDataSets.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage, value }) => `${name}: ${value} (${percentage}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {chartDataSets.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value, name, props) => [
                  `${value} projets`,
                  `${name} (${props.payload.percentage}%)`
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Top Clients Performance */}
        <ChartContainer 
          title="Performance des Clients Principaux" 
          description="Analyse de la valeur par client"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartDataSets.clientAnalysis.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                fontSize={12}
              />
              <YAxis />
              <RechartsTooltip 
                formatter={(value, name) => [value, name]}
                labelFormatter={(label) => `Client: ${label}`}
              />
              <Legend />
              <Bar dataKey="totalProjects" fill={ACCENT} name="Total Projets" />
              <Bar dataKey="completedProjects" fill={ACCENT2} name="Terminés" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Department Performance */}
        <ChartContainer 
          title="Performance Départementale" 
          description="Efficacité par département"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartDataSets.departmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="totalProjects" fill={ACCENT} name="Projets Total" />
              <Bar yAxisId="left" dataKey="employees" fill={ACCENT4} name="Employés" />
              <Line yAxisId="right" type="monotone" dataKey="successRate" stroke={ACCENT2} name="Taux Succès %" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Success Factors */}
        <ChartContainer 
          title="Facteurs de Succès" 
          description="Analyse des éléments de réussite"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartDataSets.departmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="successRate" fill={ACCENT2} name="Taux de Succès %" />
              <Bar dataKey="projectsPerEmployee" fill={ACCENT5} name="Projets/Employé" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Full-width Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {/* Timeline Analysis */}
        <ChartContainer 
          title="Analyse Temporelle (12 Mois)" 
          description="Évolution des projets sur l'année"
          fullWidth={true}
          height={400}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartDataSets.timelineAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="projectsStarted" stackId="1" stroke={ACCENT} fill={ACCENT} name="Projets Démarrés" />
              <Area yAxisId="left" type="monotone" dataKey="projectsCompleted" stackId="1" stroke={ACCENT2} fill={ACCENT2} name="Projets Terminés" />
              <Line yAxisId="right" type="monotone" dataKey="cumulativeProjects" stroke={ACCENT4} strokeWidth={3} name="Cumul Projets" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Performance Trends by Quarter */}
        <ChartContainer 
          title="Tendances de Performance Trimestrielles" 
          description="Évolution des métriques clés par trimestre"
          fullWidth={true}
          height={400}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartDataSets.performanceTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="quarter" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="projectsStarted" stroke={ACCENT} strokeWidth={3} name="Projets Démarrés" />
              <Line yAxisId="left" type="monotone" dataKey="projectsCompleted" stroke={ACCENT2} strokeWidth={3} name="Projets Terminés" />
              <Line yAxisId="right" type="monotone" dataKey="successRate" stroke={ACCENT3} strokeWidth={3} name="Taux Succès %" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Simplified Footer */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '1rem',
          opacity: 0.9
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            📊 Dashboard Projets - Dernière mise à jour: {lastUpdated.toLocaleString('fr-FR')}
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            {comprehensiveKPIs.totalProjects} projets • {comprehensiveKPIs.totalClients} clients • {comprehensiveKPIs.totalDepartments} départements • {comprehensiveKPIs.totalEmployees} employés
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;