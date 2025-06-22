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
    firstName: '',
    lastName: '',
    email: '',
    hireDate: new Date().toISOString().split('T')[0],
    jobTitle: '',
    managerId: '',
    status: 'Active',
    age: '',
    sexe: '',
    departmentId: '',
    skipDepartment: false,
    contractType: 'CDI',
    workHours: '35',
    salary: '',
    remoteAvailable: true,
    contractStartDate: new Date().toISOString().split('T')[0],
    contractEndDate: '',
    benefits: '',
    contractStatus: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  // Fetch departments with managers from the API
  useEffect(() => {
    if (open) {
      const fetchDepartments = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/departments/with-managers', {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) throw new Error('Failed to fetch departments');
          const data = await response.json();
          setDepartments(data);
          // Extract unique managers from departments
          const uniqueManagers = data
            .filter(dept => dept.managerFullName !== 'N/A' && dept.managerId)
            .map(dept => ({
              id: dept.managerId, // Use managerId from DTO
              name: dept.managerFullName,
              departmentId: dept.departmentId
            }));
          setManagers(uniqueManagers);
        } catch (error) {
          console.error('Error fetching departments:', error);
          setErrors(prev => ({ ...prev, fetch: 'Failed to load department data' }));
        }
      };
      fetchDepartments();
    }
  }, [open]);

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        hireDate: new Date().toISOString().split('T')[0],
        jobTitle: '',
        managerId: '',
        status: 'Active',
        age: '',
        sexe: '',
        departmentId: '',
        skipDepartment: false,
        contractType: 'CDI',
        workHours: '35',
        salary: '',
        remoteAvailable: true,
        contractStartDate: new Date().toISOString().split('T')[0],
        contractEndDate: '',
        benefits: '',
        contractStatus: 'Active'
      });
      setErrors({});
      setSubmitStatus(null);
    }
  }, [open]);

  // Handle manager selection and update department
  const handleManagerChange = (e) => {
    const selectedManagerId = e.target.value;
    const selectedManager = managers.find(m => m.id === selectedManagerId);
    setFormData(prev => ({
      ...prev,
      managerId: selectedManagerId,
      departmentId: selectedManager ? selectedManager.departmentId : '',
      skipDepartment: false
    }));
    if (errors.managerId || errors.departmentId) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.managerId;
        delete newErrors.departmentId;
        return newErrors;
      });
    }
  };

  // Handle department selection and update manager
  const handleDepartmentChange = (e) => {
    const selectedDepartmentId = e.target.value;
    const selectedDepartment = departments.find(d => d.departmentId === selectedDepartmentId);
    setFormData(prev => ({
      ...prev,
      departmentId: selectedDepartmentId,
      managerId: selectedDepartment && selectedDepartment.managerId ? selectedDepartment.managerId : '',
      skipDepartment: false
    }));
    if (errors.departmentId || errors.managerId) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.departmentId;
        delete newErrors.managerId;
        return newErrors;
      });
    }
  };

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
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
        if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
        if (!formData.age) {
          newErrors.age = 'Age is required';
        } else if (formData.age < 18 || formData.age > 70) {
          newErrors.age = 'Age must be between 18 and 70';
        }
        if (!formData.sexe) newErrors.sexe = 'Gender is required';
        break;
        
      case 1:
        if (!formData.skipDepartment && !formData.departmentId) {
          newErrors.departmentId = 'Please select a department or skip this step';
        }
        break;
        
      case 2:
        if (!formData.contractType) newErrors.contractType = 'Contract type is required';
        if (!formData.workHours) newErrors.workHours = 'Work hours are required';
        if (!formData.salary) {
          newErrors.salary = 'Salary is required';
        } else if (formData.salary < 1000 || formData.salary > 100000) {
          newErrors.salary = 'Salary must be between €1000 and €100,000';
        }
        if (!formData.contractStartDate) newErrors.contractStartDate = 'Start date is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitStatus(null);
    
    try {
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        hireDate: formData.hireDate,
        jobTitle: formData.jobTitle,
        managerId: formData.managerId ? parseInt(formData.managerId) : null,
        status: formData.status,
        age: parseInt(formData.age),
        sexe: formData.sexe,
        departmentId: formData.skipDepartment ? null : parseInt(formData.departmentId),
        contractType: formData.contractType,
        workHours: parseInt(formData.workHours),
        salary: parseFloat(formData.salary),
        remoteAvailable: formData.remoteAvailable,
        contractStartDate: formData.contractStartDate,
        contractEndDate: formData.contractEndDate || null,
        benefits: formData.benefits,
        contractStatus: formData.contractStatus
      };

      console.log('Sending employee with contract data:', requestData);

      const response = await fetch('http://localhost:8080/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Employee with contract created successfully:', data);
      setSubmitStatus('success');
      
      setTimeout(() => {
        onClose();
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error creating employee with contract:', error);
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
                {formData.firstName.charAt(0) || formData.lastName.charAt(0) || '?'}
              </Avatar>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name *"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                autoFocus
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name *"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
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
                name="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={handleChange}
                error={!!errors.hireDate}
                helperText={errors.hireDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Job Title *"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                error={!!errors.jobTitle}
                helperText={errors.jobTitle}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.managerId}>
                <InputLabel>Manager</InputLabel>
                <Select
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleManagerChange}
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
                      {manager.name} ({departments.find(d => d.departmentId === manager.departmentId)?.departmentName || 'N/A'})
                    </MenuItem>
                  ))}
                </Select>
                {errors.managerId && (
                  <Typography variant="caption" color="error">{errors.managerId}</Typography>
                )}
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
                <FormControl fullWidth error={!!errors.departmentId}>
                  <InputLabel>Select Department</InputLabel>
                  <Select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleDepartmentChange}
                    label="Select Department"
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.departmentId} value={dept.departmentId}>
                        <Box display="flex" alignItems="center">
                          <Box 
                            width={10} 
                            height={10} 
                            bgcolor={dept.departmentId % 5 === 1 ? PRIMARY : 
                                    dept.departmentId % 5 === 2 ? SECONDARY : 
                                    dept.departmentId % 5 === 3 ? '#ff7043' : 
                                    dept.departmentId % 5 === 4 ? '#ab47bc' : '#26a69a'} 
                            borderRadius="50%" 
                            mr={2} 
                          />
                          {dept.departmentName} (Manager: {dept.managerFullName})
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.departmentId && (
                    <Typography variant="caption" color="error">{errors.departmentId}</Typography>
                  )}
                </FormControl>
              </Grid>
            )}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.contractType}>
                <InputLabel>Contract Type</InputLabel>
                <Select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  label="Contract Type"
                >
                  <MenuItem value="CDI">CDI</MenuItem>
                  <MenuItem value="CDD">CDD</MenuItem>
                  <MenuItem value="Freelance">Freelance</MenuItem>
                  <MenuItem value="Stage">Stage</MenuItem>
                </Select>
                {errors.contractType && (
                  <Typography color="error" variant="caption">
                    {errors.contractType}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Weekly Hours *"
                name="workHours"
                value={formData.workHours}
                onChange={handleChange}
                error={!!errors.workHours}
                helperText={errors.workHours}
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
                    checked={formData.remoteAvailable}
                    onChange={handleChange}
                    name="remoteAvailable"
                    color="primary"
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    <Typography>Remote Work Available</Typography>
                    {formData.remoteAvailable && (
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
                name="contractStartDate"
                type="date"
                value={formData.contractStartDate}
                onChange={handleChange}
                error={!!errors.contractStartDate}
                helperText={errors.contractStartDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contract End Date"
                name="contractEndDate"
                type="date"
                value={formData.contractEndDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                disabled={formData.contractType === 'CDI'}
                helperText={formData.contractType === 'CDI' ? "Permanent contracts have no end date" : ""}
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
            {errors.fetch && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.fetch}
              </Alert>
            )}
            {submitStatus === 'success' ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: SUCCESS, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Employee Added Successfully!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {formData.firstName} {formData.lastName} has been added to the system.
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