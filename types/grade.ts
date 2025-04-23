export type GradeEntry = { id: number; class: string; grade: number };

export type ClassAverage = { class: string; average: number };

export const classesList = ['Math','Science','History'] as const;

export const filters = [
  { label: 'Show All Data',      value: 'all' },
  { label: 'Class Averages',     value: 'averages' },
  { label: 'Passing Average',    value: 'passing' },
  { label: 'High Performing',    value: 'high' },
] as const;

export type Filter = typeof filters[number]['value'];