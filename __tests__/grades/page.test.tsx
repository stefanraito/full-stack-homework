import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GradesPage from '@/app/grades/page';

function mockFetchSequence(responses: Array<{ body: unknown; status?: number } | Error>) {
  let call = 0;
  global.fetch = jest.fn().mockImplementation(() => {
    const resp = responses[call++];
    
    if (resp instanceof Error) {
      return Promise.reject(resp);
    }

    return Promise.resolve({
      ok: true,
      status: resp.status ?? 200,
      json: () => Promise.resolve(resp.body),
    } as unknown as Response);
  });
};

describe('GradesPage', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders heading, default class, disabled Add button & required error initially', async () => {
    // initial GET returns empty list
    mockFetchSequence([{ body: [] }]);

    render(<GradesPage />);
    // wait for useEffect fetch
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Heading
    expect(screen.getByRole('heading', { name: /Grades/i })).toBeInTheDocument();

    // Class select shows default value
    const classSelect = screen.getByLabelText(/class/i);
    expect(classSelect).toHaveTextContent('Math');

    // Grade input starts empty with required error
    const gradeInput = screen.getByRole('spinbutton', { name: /grade/i });
    expect(gradeInput).toHaveDisplayValue('');
    expect(screen.getByText(/Grade is required/i)).toBeInTheDocument();

    // Add button disabled
    const addBtn = screen.getByRole('button', { name: /add grade/i });
    expect(addBtn).toBeDisabled();
  });

  it('validates out-of-range grades', async () => {
    mockFetchSequence([{ body: [] }])
    render(<GradesPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))

    const gradeInput = screen.getByRole('spinbutton', { name: /grade/i })
    const addBtn = screen.getByRole('button', { name: /add grade/i })

    // Negative
    await userEvent.clear(gradeInput)
    await userEvent.type(gradeInput, '-5')
    await screen.findByText(/Grade must be between 0 and 100/i)
    expect(addBtn).toBeDisabled()

    // Above 100
    await userEvent.clear(gradeInput)
    await userEvent.type(gradeInput, '150')
    await screen.findByText(/Grade must be between 0 and 100/i)
    expect(addBtn).toBeDisabled()
  });

  it('enables Add Grade when valid grade entered', async () => {
    mockFetchSequence([{ body: [] }])
    render(<GradesPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))

    const gradeInput = screen.getByRole('spinbutton', { name: /grade/i })
    const addBtn = screen.getByRole('button', { name: /add grade/i })

    await userEvent.clear(gradeInput)
    await userEvent.type(gradeInput, '85')

    expect(
      screen.queryByText(/Grade is required|Must be a valid number|Grade must be between 0 and 100/i)
    ).toBeNull()
    expect(addBtn).toBeEnabled()
  });

  it('submits new grade and refreshes table', async () => {
    const created = { id: 1, class: 'Math', grade: 95 }
    const updated = [created]

    mockFetchSequence([
      { body: [] },                // initial GET
      { body: created, status: 201 }, // POST response
      { body: updated },           // GET after POST
    ])

    render(<GradesPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))

    const gradeInput = screen.getByRole('spinbutton', { name: /grade/i })
    const addBtn = screen.getByRole('button', { name: /add grade/i })

    await userEvent.clear(gradeInput)
    await userEvent.type(gradeInput, '95')
    await userEvent.click(addBtn)

    // verify POST call
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      '/api/grades',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class: 'Math', grade: 95 }),
      })
    )

    // input should clear
    expect(gradeInput).toHaveDisplayValue('')

    // wait for final GET and check table
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3))
    const table = screen.getByRole('table');
    const { getByText: getByTextInTable } = within(table);
    expect(getByTextInTable('Math')).toBeInTheDocument();
    expect(getByTextInTable('95')).toBeInTheDocument();
  });
})