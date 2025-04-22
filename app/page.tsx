'use client';

import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import Link from 'next/link';


export default function Page() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Full Stack Homework
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Choose a page to get started
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
        {/* <CrashTester /> */} 
        <Link href="/numbers" passHref>
          <Button variant="contained">Numbers</Button>
        </Link>
        <Link href="/grades" passHref>
          <Button variant="outlined">Grades</Button>
        </Link>
      </Stack>
    </Box>
  );
}
