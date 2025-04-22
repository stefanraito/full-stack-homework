import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Container from '@mui/material/Container';
import HomeIcon from '@mui/icons-material/Home';
import FunctionsIcon from '@mui/icons-material/Functions';
import SchoolIcon from '@mui/icons-material/School';

export default function NavBar() {
  return (
    <AppBar position="static" color="primary" elevation={4} sx={{ mb: 3 }}>
      <Container maxWidth="lg">
      <Toolbar disableGutters sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <Link href="/" passHref>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            sx={{ textTransform: 'none', fontWeight: 'bold', mr: 2 }}
          >
            Home
          </Button>
        </Link>
        <Link href="/numbers" passHref>
          <Button
            color="inherit"
            startIcon={<FunctionsIcon />}
            sx={{ textTransform: 'none', mr: 2 }}
          >
            Numbers
          </Button>
        </Link>
        <Link href="/grades" passHref>
          <Button
            color="inherit"
            startIcon={<SchoolIcon />}
            sx={{ textTransform: 'none' }}
          >
            Grades
          </Button>
        </Link>
      </Toolbar>
      </Container>
    </AppBar>
  );
}