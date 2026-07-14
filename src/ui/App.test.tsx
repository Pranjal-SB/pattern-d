import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';

afterEach(cleanup);

describe('App', () => {
  it('renders the gallery with pattern cards', () => {
    render(<App />);
    expect(screen.getByText('Checkerboard')).toBeInTheDocument();
    expect(screen.getByText('Brick')).toBeInTheDocument();
  });

  it('shows theme toggle', () => {
    render(<App />);
    const toggle = screen.getByRole('button', { name: /light mode|dark mode/i });
    expect(toggle).toBeInTheDocument();
    fireEvent.click(toggle);
  });
});
