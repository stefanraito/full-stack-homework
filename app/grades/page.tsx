'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Alert,
  Snackbar
} from '@mui/material';
import { classesList, GradeEntry, ClassAverage, Filter, filters } from '@/types/grade';


export default function GradesPage() {
  const [cls, setCls] = useState<typeof classesList[number]>('Math');
  const [gradeInput, setGradeInput] = useState<string>('');
  const [rows, setRows] = useState<GradeEntry[]|ClassAverage[]>([]);
  const [filter, setFilter] = useState<Filter>(filters[0].value);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const gradeError =
          gradeInput === ''
            ? 'Grade is required'
            : isNaN(Number(gradeInput))
            ? 'Must be a valid number'
            : Number(gradeInput) < 0 || Number(gradeInput) > 100
            ? 'Grade must be between 0 and 100'
            : '';

  const fetchData = useCallback(async (f: Filter = filter) => {
    const res = await fetch(`/api/grades?filter=${f}`);
    setRows(await res.json());
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (gradeError) return;
    const numericGrade = Number(gradeInput);
    await fetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ class: cls, grade: numericGrade })
    });
    setGradeInput('');
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
          Grade added successfully.
        </Alert>
      </Snackbar>
      <Typography variant="h4" align="center" gutterBottom>
        Grades
      </Typography>

      <Box
        component="form"
        onSubmit={handleAdd}
        sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'flex-start' }}
      >
        <TextField
          select
          label="Class"
          variant="outlined"
          value={cls}
          onChange={e => setCls(e.target.value as typeof classesList[number])}
          sx={{
            minWidth: 120,
            borderRadius: 1,
            backgroundColor: theme => theme.palette.background.paper,
            '& .MuiInputBase-input': { color: theme => theme.palette.text.primary },
            '& .MuiInputLabel-root': { color: theme => theme.palette.text.secondary },
            '& .MuiOutlinedInput-notchedOutline': {borderColor: theme => theme.palette.divider},
          }}
        >
          {classesList.map(c => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Grade"
          type="number"
          variant="outlined"
          value={gradeInput}
          onChange={e => setGradeInput(e.target.value)}
          slotProps={{ htmlInput: { min: 0, max: 100 } }}
          required
          error={Boolean(gradeError)}
          helperText={gradeError}
          sx={{
            minWidth: 100,
            borderRadius: 1,
            backgroundColor: theme => theme.palette.background.paper,
            '& .MuiInputBase-input': { color: theme => theme.palette.text.primary },
            '& .MuiInputLabel-root': { color: theme => theme.palette.text.secondary },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme => (gradeError ? theme.palette.error.main : theme.palette.divider)
            },
          }}
        />
        <Button type="submit" variant="contained" disabled={Boolean(gradeError)}>
          Add Grade
        </Button>
      </Box>

      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        {filters.map(f => (
          <Button
            key={f.value}
            variant={filter === f.value ? 'contained' : 'outlined'}
            onClick={() => { setFilter(f.value); fetchData(f.value); }}
          >
            {f.label}
          </Button>
        ))}
      </Stack>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              {filter === 'all' ? (
                <>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">Class</TableCell>
                  <TableCell align="center">Grade</TableCell>
                </>
              ) : (
                <>
                  <TableCell align="center">Class</TableCell>
                  <TableCell align="center">Average</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow
                key={i}
                sx={{ '&:nth-of-type(odd)': { backgroundColor: theme => theme.palette.action.hover } }}
              >
                {filter === 'all' ? (
                  <>
                    <TableCell align="center">{(r as GradeEntry).id}</TableCell>
                    <TableCell align="center">{(r as GradeEntry).class}</TableCell>
                    <TableCell align="center">{(r as GradeEntry).grade}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell align="center">{(r as ClassAverage).class}</TableCell>
                    <TableCell align="center">{(r as ClassAverage).average}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}