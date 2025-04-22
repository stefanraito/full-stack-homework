'use client';

import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

export default function CrashTester() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error('Test error from CrashTester');
  }

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      gap: 2,
    }}>
      <Button
        variant="outlined"
        color="error"
        onClick={() => setShouldCrash(true)}
      >
        Crash App
      </Button>
    </Box>
  );
}