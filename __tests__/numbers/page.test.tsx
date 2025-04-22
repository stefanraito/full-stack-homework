import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumbersPage from '@/app/numbers/page';

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
}

describe('NumbersPage', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders heading, disabled Add button & required error initially', async () => {
    // initial GET returns empty list
    mockFetchSequence([{ body: [] }]);

    render(<NumbersPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // heading
    expect(screen.getByRole('heading', { name: /Number Pairs/i })).toBeInTheDocument();

    // input and its initial helper text
    const input = screen.getByRole('spinbutton', { name: /enter a number/i });
    expect(input).toHaveDisplayValue('');
    expect(screen.getByText(/Number is required/i)).toBeInTheDocument();

    // add button disabled
    const addBtn = screen.getByRole('button', { name: /add/i });
    expect(addBtn).toBeDisabled();

    // wait for initial fetch
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });

  it('validates non-integer inputs', async () => {
    mockFetchSequence([{ body: [] }]);
    render(<NumbersPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const input = screen.getByRole('spinbutton', { name: /enter a number/i });

    // type decimal
    await userEvent.clear(input);
    await userEvent.type(input, '3.14');
    await screen.findByText(/Please enter a whole number/i);
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('enables Add when valid integer entered', async () => {
    mockFetchSequence([{ body: [] }]);
    render(<NumbersPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const input = screen.getByRole('spinbutton', { name: /enter a number/i });
    const addBtn = screen.getByRole('button', { name: /add/i });

    await userEvent.clear(input);
    await userEvent.type(input, '42');

    // helperText should disappear
    expect(screen.queryByText(/Number is required|Must be a valid number|Please enter a whole number/)).toBeNull();
    expect(addBtn).toBeEnabled();
  });

  it('submits new number and refreshes table', async () => {
    // 1st call: GET initial rows
    // 2nd call: POST new row
    // 3rd call: GET updated rows
    const initial: unknown[] = [];
    const created = { id1: 1, value1: 42, id2: 2, value2: 58, sum: 100 };
    const updated = [created];

    mockFetchSequence([
      { body: initial },             // initial GET
      { body: created, status: 201 },// POST response
      { body: updated },             // GET after POST
    ]);

    render(<NumbersPage />);

    // wait for first GET
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const input = screen.getByRole('spinbutton', { name: /enter a number/i });
    const addBtn = screen.getByRole('button', { name: /add/i });

    // enter valid number and submit
    await userEvent.clear(input);
    await userEvent.type(input, '42');
    await userEvent.click(addBtn);

    // POST should have been called second
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      '/api/numbers',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 42 })
      })
    );

    // input should clear
    expect(input).toHaveDisplayValue('');

    // wait for final GET and table update
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3));
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('58')).toBeInTheDocument();
  });
});