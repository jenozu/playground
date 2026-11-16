import { render, screen, fireEvent } from '@testing-library/react';
import { OutputPanel, type OutputEntry } from './OutputPanel';

describe('OutputPanel', () => {
  it('renders each entry type', () => {
    const entries: OutputEntry[] = [
      { type: 'stdout', text: 'hello' },
      { type: 'stderr', text: 'bad' },
      { type: 'warning', text: 'warn' },
      { type: 'error', message: 'Oops', raw: 'Traceback xyz' },
      { type: 'table', columns: ['a', 'b'], rows: [[1, null]] },
      { type: 'test', name: 't1', passed: false, expected: '1', actual: '2' },
      { type: 'test', name: 't2', passed: true },
    ];
    render(<OutputPanel entries={entries} status="failed" durationMs={42} />);
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('Traceback xyz')).toBeInTheDocument();
    expect(screen.getByText('NULL')).toBeInTheDocument();
    expect(screen.getByText('Expected: 1')).toBeInTheDocument();
    expect(screen.getByText('Actual: 2')).toBeInTheDocument();
    expect(screen.getByTestId('status')).toHaveTextContent('failed · 42 ms');
  });

  it('renders a 1000-row table', () => {
    const rows = Array.from({ length: 1000 }, (_, i) => [i, `r${i}`]);
    render(<OutputPanel entries={[{ type: 'table', columns: ['id', 'v'], rows }]} />);
    expect(screen.getAllByRole('row')).toHaveLength(1001);
  });

  it('clear calls handler', () => {
    const onClear = vi.fn();
    render(<OutputPanel entries={[]} onClear={onClear} />);
    fireEvent.click(screen.getByText('Clear'));
    expect(onClear).toHaveBeenCalled();
  });
});
