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

// Enhanced mock data
const genderData = [
  { name: 'Hommes', value: 65, color: COLORS.primary },
  { name: 'Femmes', value: 35, color: COLORS.secondary },
];

const ageData = [
  { age: '20-25', count: 15, growth: '+5%' },
  { age: '26-30', count: 25, growth: '+12%' },
  { age: '31-35', count: 30, growth: '+8%' },
  { age: '36-40', count: 20, growth: '+3%' },
  { age: '41+', count: 10, growth: '-2%' },
];

const departmentData = [
  { name: 'IT', value: 30, color: COLORS.primary, budget: '€250K' },
  { name: 'RH', value: 20, color: COLORS.secondary, budget: '€180K' },
  { name: 'Finance', value: 25, color: COLORS.accent, budget: '€220K' },
  { name: 'Marketing', value: 15, color: COLORS.success, budget: '€150K' },
  { name: 'Operations', value: 10, color: COLORS.warning, budget: '€120K' },
];

const performanceData = [
  { month: 'Jan', performance: 85, satisfaction: 82 },
  { month: 'Feb', performance: 88, satisfaction: 85 },
  { month: 'Mar', performance: 92, satisfaction: 88 },
  { month: 'Apr', performance: 90, satisfaction: 87 },
  { month: 'Mai', performance: 94, satisfaction: 91 },
  { month: 'Jun', performance: 96, satisfaction: 93 },
];

const KPICard = ({ title, value, subtitle, icon: Icon, gradient, trend, delay = 0 }) => {
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
    background: gradient,
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
      style={isHovered ? hoverStyle : cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), transparent)'
      }}></div>
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{
            padding: '12px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '16px',
            backdropFilter: 'blur(8px)'
          }}>
            <Icon style={{ fontSize: 32, color: 'white' }} />
          </div>
          {trend && (
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
        
        <div style={{ color: 'white' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 500, opacity: 0.9, margin: '0 0 8px 0' }}>{title}</h3>
          <div style={{ fontSize: '36px', fontWeight: 700, margin: '0 0 4px 0' }}>{value}</div>
          {subtitle && <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>{subtitle}</p>}
        </div>
      </div>
      
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
    </div>
  );
};

const ChartCard = ({ title, children, delay = 0, style = {} }) => {
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

  return (
    <div 
      style={isHovered ? hoverStyle : cardStyle}
      onMouseEnter={() => setIsHovered(true)}
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
      {children}
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

const EnhancedHRDashboard = () => {
  const [activeView, setActiveView] = useState('overview');

  const gradients = {
    gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    gradient4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  };

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
            <NavButton icon={People} label="Employés" isActive={activeView === 'employees'} to="/employee" />
            <NavButton icon={Business} label="Clients" to="/clients" />
            <NavButton icon={TrackChanges} label="Projets" to="/projects" />
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
            value="150"
            subtitle="Croissance annuelle"
            icon={People}
            gradient={gradients.gradient1}
            trend="+15%"
            delay={0}
          />
          <KPICard
            title="Départements"
            value="5"
            subtitle="Secteurs actifs"
            icon={Business}
            gradient={gradients.gradient2}
            trend="+1"
            delay={100}
          />
          <KPICard
            title="Taux de Rotation"
            value="12%"
            subtitle="Amélioration continue"
            icon={Autorenew}
            gradient={gradients.gradient3}
            trend="-3%"
            delay={200}
          />
          <KPICard
            title="Satisfaction"
            value="93%"
            subtitle="Score global"
            icon={Star}
            gradient={gradients.gradient4}
            trend="+8%"
            delay={300}
          />
        </div>

        {/* Performance Trend */}
        <div style={{ marginBottom: '32px' }}>
          <ChartCard title="Évolution des Performances" delay={400}>
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

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* Gender Distribution */}
          <ChartCard title="Répartition par Genre" delay={500}>
            <div style={{ height: '320px' }}>
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
            </div>
          </ChartCard>

          {/* Age Distribution */}
          <ChartCard title="Distribution par Âge" delay={600}>
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="age" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill={COLORS.secondary}
                    name="Employés"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Department Analysis */}
        <ChartCard title="Analyse par Département" delay={700}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '32px'
          }}>
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '16px'
              }}>Détails des Départements</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {departmentData.map((dept) => (
                  <div key={dept.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: dept.color
                      }}></div>
                      <span style={{ fontWeight: 500, color: '#1f2937' }}>{dept.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#1f2937' }}>{dept.value} employés</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{dept.budget}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>
      </main>
    </div>
  );
};

export default EnhancedHRDashboard;