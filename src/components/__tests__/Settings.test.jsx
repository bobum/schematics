import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Settings from '../Settings';

/**
 * Test suite for Settings component with dark mode toggle
 */
describe('Settings Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Remove dark-mode class from document
    document.documentElement.classList.remove('dark-mode');
  });

  test('renders settings heading', () => {
    render(<Settings />);
    const heading = screen.getByText(/Settings/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders dark mode toggle', () => {
    render(<Settings />);
    const toggle = screen.getByRole('checkbox', { name: /dark mode/i });
    expect(toggle).toBeInTheDocument();
  });

  test('dark mode toggle is initially unchecked', () => {
    render(<Settings />);
    const toggle = screen.getByRole('checkbox');
    expect(toggle).not.toBeChecked();
  });

  test('clicking toggle switches to dark mode', () => {
    render(<Settings />);
    const toggle = screen.getByRole('checkbox');
    
    fireEvent.click(toggle);
    
    expect(toggle).toBeChecked();
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    expect(localStorage.getItem('darkMode')).toBe('true');
  });

  test('clicking toggle twice returns to light mode', () => {
    render(<Settings />);
    const toggle = screen.getByRole('checkbox');
    
    fireEvent.click(toggle); // Enable dark mode
    fireEvent.click(toggle); // Disable dark mode
    
    expect(toggle).not.toBeChecked();
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    expect(localStorage.getItem('darkMode')).toBe('false');
  });

  test('loads dark mode state from localStorage', () => {
    localStorage.setItem('darkMode', 'true');
    
    render(<Settings />);
    const toggle = screen.getByRole('checkbox');
    
    expect(toggle).toBeChecked();
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
  });

  test('displays dark mode description', () => {
    render(<Settings />);
    const description = screen.getByText(/Toggle between light and dark themes/i);
    expect(description).toBeInTheDocument();
  });
});
