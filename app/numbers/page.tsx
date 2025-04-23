'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import { NumbersRow } from '@/types/numbers';

export default function NumbersPage() {
  const [valueInput, setValueInput] = useState<string>('');
  const [rows, setRows] = useState<NumbersRow[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const numberError =
    valueInput === ''
      ? 'Number is required'
      : isNaN(Number(valueInput))
      ? 'Must be a valid number'
      : !Number.isInteger(Number(valueInput))
      ? 'Please enter a whole number'
      : '';

  const fetchData = async () => {
    const res = await fetch('/api/numbers');
    setRows(await res.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (valueInput === '' || numberError) return; 

    const numericValue = Number(valueInput);
    await fetch('/api/numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: numericValue })
    });

    setValueInput('');
    fetchData();
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Number added successfully.
        </Alert>
      </Snackbar>

      <Typography variant="h4" align="center" gutterBottom>
        Number Pairs
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}
      >
        <TextField
          label="Enter a number"
          type="number"
          variant="outlined"
          value={valueInput}
          onChange={e => setValueInput(e.target.value)}
          required
          error={Boolean(numberError)}
          helperText={numberError}
          slotProps={{ htmlInput: { step: 1 } }}
          sx={{
            minWidth: 120,
            borderRadius: 1,
            backgroundColor: theme => theme.palette.background.paper,
            '& .MuiInputBase-input': { color: theme => theme.palette.text.primary },
            '& .MuiInputLabel-root': { color: theme => theme.palette.text.secondary },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme => (numberError ? theme.palette.error.main : theme.palette.divider)
            }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={Boolean(numberError)}
          sx={{ ml: 2 }}
        >
          Add
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID 1</TableCell>
              <TableCell align="center">Number 1</TableCell>
              <TableCell align="center">ID 2</TableCell>
              <TableCell align="center">Number 2</TableCell>
              <TableCell align="center">Sum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow
                key={`${r.id1}-${r.id2}`}
                sx={{ '&:nth-of-type(odd)': { backgroundColor: theme => theme.palette.action.hover } }}
              >
                <TableCell align="center">{r.id1}</TableCell>
                <TableCell align="center">{r.value1}</TableCell>
                <TableCell align="center">{r.id2}</TableCell>
                <TableCell align="center">{r.value2}</TableCell>
                <TableCell align="center">{r.sum}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}