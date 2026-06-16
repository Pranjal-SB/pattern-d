import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the control surface', () => {
    render(<App />);
    expect(screen.getByText('Pattern studio')).toBeInTheDocument();
    expect(screen.getByText('Colors')).toBeInTheDocument();
  });

  it('toggles theme', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /light mode/i })[0]);
    expect(screen.getAllByRole('button', { name: /dark mode/i }).length).toBeGreaterThan(0);
  });

  it('toggles the 3d floor preview', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /3d floor/i })[0]);
    expect(screen.getAllByRole('button', { name: /2d view/i }).length).toBeGreaterThan(0);
  });
});
