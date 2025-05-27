import React from 'react';
import { Typography, Box } from '@mui/material';

const Clients = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Espace Clients
      </Typography>
      <Typography>
        Bienvenue dans l'espace Clients. Ici, vous pouvez gérer les clients.
      </Typography>
    </Box>
  );
};

export default Clients; 