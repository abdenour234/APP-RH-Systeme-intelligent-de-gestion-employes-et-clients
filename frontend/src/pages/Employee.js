import React from 'react';
import { Typography, Box } from '@mui/material';

const Employee = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Espace Employé
      </Typography>
      <Typography>
        Bienvenue dans l'espace Employé. Ici, vous pouvez gérer les employés.
      </Typography>
    </Box>
  );
};

export default Employee; 