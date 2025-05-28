import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Alert,
  CircularProgress,
  Avatar,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/material/styles';

// Theme colors
const PRIMARY = '#4F8DFD';
const SECONDARY = '#00C49F';
const LIGHT_BG = '#f8fbff';
const SUCCESS = '#4caf50';
const ERROR = '#f44336';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #ffffff 70%, #f8fbff 100%)',
  borderRadius: 16,
  border: `1px solid ${PRIMARY}20`,
  boxShadow: '0px 8px 24px rgba(79, 141, 253, 0.15)',
  transition: 'all 0.3s ease',
}));

const steps = ['Employee Information', 'Department Details', 'Contract Terms'];

const AddEmployeeForm = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    hire_date: new Date().toISOString().split('T')[0],
    job_title: '',
    manager_id: '',
    status: 'active',
    age: '',
    sexe: '',
    department_id: '',
    skipDepartment: false,
    contract_type: 'CDI',
    work_hours: '35',
    salary: '',
    remote_available: true,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    benefits: '',
    contract_status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [managers, setManagers] = useState([
    { id: 'mgr001', name: 'Alexandre Martin' },
    { id: 'mgr002', name: 'Sophie Dubois' },
    { id: 'mgr003', name: 'Thomas Bernard' }
  ]);
  
  const [departments] = useState([
    { id: '1', name: 'IT Department' },
    { id: '2', name: 'Human Resources' },
    { id: '3', name: 'Finance' },
    { id: '4', name: 'Marketing' },
    { id: '5', name: 'Operations' }
  ]);

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        hire_date: new Date().toISOString().split('T')[0],
        job_title: '',
        manager_id: '',
        status: 'active',
        age: '',
        sexe: '',
        department_id: '',
        skipDepartment: false,
        contract_type: 'CDI',
        work_hours: '35',
        salary: '',
        remote_available: true,
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        benefits: '',
        contract_status: 'active'
      });
      setErrors({});
      setSubmitStatus(null);
    }
  }, [open]);

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateStep = () => {
    const newErrors = {};
    
    switch (activeStep) {
      case 0:
        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.hire_date) newErrors.hire_date = 'Hire date is required';
        if (!formData.job_title.trim()) newErrors.job_title = 'Job title is required';
        if (!formData.age) {
          newErrors.age = 'Age is required';
        } else if (formData.age < 18 || formData.age > 70) {
          newErrors.age = 'Age must be between 18 and 70';
        }
        if (!formData.sexe) newErrors.sexe = 'Gender is required';
        break;
        
      case 1:
        if (!formData.skipDepartment && !formData.department_id) {
          newErrors.department_id = 'Please select a department or skip this step';
        }
        break;
        
      case 2:
        if (!formData.contract_type) newErrors.contract_type = 'Contract type is required';
        if (!formData.work_hours) newErrors.work_hours = 'Work hours are required';
        if (!formData.salary) {
          newErrors.salary = 'Salary is required';
        } else if (formData.salary < 1000 || formData.salary > 100000) {
          newErrors.salary = 'Salary must be between €1000 and €100,000';
        }
        if (!formData.start_date) newErrors.start_date = 'Start date is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitStatus(null);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would make actual API calls here
      setSubmitStatus('success');
      
      // Close after success
      setTimeout(() => {
        onClose();
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} textAlign="center">
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                margin: '0 auto 20px',
                background: `linear-gradient(135deg, ${PRIMARY} 0%, ${SECONDARY} 100%)`,
                fontSize: 32
              }}>
                {formData.first_name.charAt(0) || formData.last_name.charAt(0) || '?'}
              </Avatar>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name *"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={!!errors.first_name}
                helperText={errors.first_name}
                autoFocus
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name *"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={!!errors.last_name}
                helperText={errors.last_name}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email || "We'll send onboarding details here"}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hire Date *"
                name="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={handleChange}
                error={!!errors.hire_date}
                helperText={errors.hire_date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Job Title *"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                error={!!errors.job_title}
                helperText={errors.job_title}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Manager</InputLabel>
                <Select
                  name="manager_id"
                  value={formData.manager_id}
                  onChange={handleChange}
                  label="Manager"
                  renderValue={(selected) => {
                    if (!selected) return "Not assigned";
                    const manager = managers.find(m => m.id === selected);
                    return manager ? manager.name : selected;
                  }}
                >
                  <MenuItem value="">Not assigned</MenuItem>
                  {managers.map((manager) => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Age *"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                error={!!errors.age}
                helperText={errors.age}
                inputProps={{ min: 18, max: 70 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.sexe}>
                <InputLabel>Gender *</InputLabel>
                <Select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                  label="Gender *"
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </Select>
                {errors.sexe && <Typography variant="caption" color="error">{errors.sexe}</Typography>}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Department assignment is optional. You can assign later from employee profile.
              </Alert>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.skipDepartment}
                    onChange={handleChange}
                    name="skipDepartment"
                    color="primary"
                  />
                }
                label="Skip department assignment for now"
              />
            </Grid>
            
            {!formData.skipDepartment && (
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.department_id}>
                  <InputLabel>Select Department</InputLabel>
                  <Select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    label="Select Department"
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        <Box display="flex" alignItems="center">
                          <Box 
                            width={10} 
                            height={10} 
                            bgcolor={dept.id === '1' ? PRIMARY : 
                                     dept.id === '2' ? SECONDARY : 
                                     dept.id === '3' ? '#ff7043' : 
                                     dept.id === '4' ? '#ab47bc' : '#26a69a'} 
                            borderRadius="50%" 
                            mr={2} 
                          />
                          {dept.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.department_id && (
                    <Typography variant="caption" color="error">{errors.department_id}</Typography>
                  )}
                </FormControl>
              </Grid>
            )}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.contract_type}>
                <InputLabel>Contract Type *</InputLabel>
                <Select
                  name="contract_type"
                  value={formData.contract_type}
                  onChange={handleChange}
                  label="Contract Type *"
                >
                  <MenuItem value="CDI">Permanent Contract (CDI)</MenuItem>
                  <MenuItem value="CDD">Fixed-term Contract (CDD)</MenuItem>
                  <MenuItem value="INTERIM">Temporary Work (Intérim)</MenuItem>
                  <MenuItem value="FREELANCE">Freelance</MenuItem>
                </Select>
                {errors.contract_type && (
                  <Typography variant="caption" color="error">{errors.contract_type}</Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Weekly Hours *"
                name="work_hours"
                value={formData.work_hours}
                onChange={handleChange}
                error={!!errors.work_hours}
                helperText={errors.work_hours}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Annual Salary (€) *"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                error={!!errors.salary}
                helperText={errors.salary || "Gross annual amount"}
                InputProps={{
                  startAdornment: <Typography variant="body1" mr={1}>€</Typography>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.remote_available}
                    onChange={handleChange}
                    name="remote_available"
                    color="primary"
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    <Typography>Remote Work Available</Typography>
                    {formData.remote_available && (
                      <CheckCircleIcon fontSize="small" sx={{ color: SUCCESS, ml: 1 }} />
                    )}
                  </Box>
                }
                sx={{ height: '100%', alignItems: 'center' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contract Start Date *"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                error={!!errors.start_date}
                helperText={errors.start_date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contract End Date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                disabled={formData.contract_type === 'CDI'}
                helperText={formData.contract_type === 'CDI' ? "Permanent contracts have no end date" : ""}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Benefits & Perks"
                name="benefits"
                placeholder="Health insurance, gym membership, company car, etc."
                multiline
                rows={3}
                value={formData.benefits}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'white',
          overflow: 'visible'
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: `linear-gradient(135deg, ${PRIMARY} 0%, ${SECONDARY} 100%)`,
        color: 'white',
        p: 3,
        borderRadius: '12px 12px 0 0'
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            Add New Employee
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Complete the form to onboard a new team member
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            color: 'white',
            background: 'rgba(255,255,255,0.2)',
            '&:hover': {
              background: 'rgba(255,255,255,0.3)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3, px: 2 }}>
        <Box sx={{ width: '100%', mt: 1 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontWeight: 600,
                      color: activeStep === index ? PRIMARY : 'text.secondary'
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <StyledPaper>
            {submitStatus === 'success' ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: SUCCESS, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Employee Added Successfully!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {formData.first_name} {formData.last_name} has been added to the system.
                </Typography>
              </Box>
            ) : submitStatus === 'error' ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ErrorOutlineIcon sx={{ fontSize: 60, color: ERROR, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Error Adding Employee
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Please try again or contact support if the problem persists.
                </Typography>
              </Box>
            ) : (
              renderStepContent(activeStep)
            )}
          </StyledPaper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
        <Box>
          {activeStep > 0 && !submitStatus && (
            <Button
              onClick={handleBack}
              sx={{ 
                color: PRIMARY,
                fontWeight: 600,
                '&:hover': {
                  background: `${PRIMARY}10`
                }
              }}
            >
              Back
            </Button>
          )}
        </Box>
        
        <Box>
          {!submitStatus && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              sx={{
                fontWeight: 600,
                px: 4,
                py: 1,
                background: `linear-gradient(135deg, ${PRIMARY} 0%, ${SECONDARY} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${PRIMARY} 20%, ${SECONDARY} 120%)`,
                  boxShadow: '0 4px 12px rgba(79, 141, 253, 0.4)'
                },
                boxShadow: '0 2px 8px rgba(79, 141, 253, 0.3)',
                minWidth: 120
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === steps.length - 1 ? (
                'Complete Onboarding'
              ) : (
                'Continue'
              )}
            </Button>
          )}
          
          {submitStatus && (
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: PRIMARY,
                color: PRIMARY,
                fontWeight: 600,
                px: 4,
                py: 1,
                '&:hover': {
                  background: `${PRIMARY}10`,
                  borderColor: PRIMARY
                }
              }}
            >
              Close
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeForm;