/**
 * Tests for Main App Component
 * Demonstrates: Integration testing, rendering with Context
 */

import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

// Mock the UserList component since it makes real API calls
vi.mock('./components/UserList', () => {
  return {
    default: function UserList() {
      return <div data-testid="user-list-mock">UserList Component</div>;
    },
  };
});

describe('App Component', () => {
  it('should render the main heading', () => {
    render(<App />);
    expect(screen.getByText('Jest Testing Demonstration')).toBeInTheDocument();
  });

  it('should render the description', () => {
    render(<App />);
    expect(
      screen.getByText(/comprehensive React app showcasing/i)
    ).toBeInTheDocument();
  });

  it('should render Button Component section', () => {
    render(<App />);
    expect(screen.getByText('Button Component')).toBeInTheDocument();
  });

  it('should render Counter Component section', () => {
    render(<App />);
    expect(screen.getByText('Counter Component')).toBeInTheDocument();
  });

  it('should render User List Component section', () => {
    render(<App />);
    expect(screen.getByText('User List Component')).toBeInTheDocument();
  });

  it('should render all button variants', () => {
    render(<App />);
    expect(screen.getByText('Primary Button')).toBeInTheDocument();
    expect(screen.getByText('Secondary Button')).toBeInTheDocument();
    expect(screen.getByText('Danger Button')).toBeInTheDocument();
    expect(screen.getByText('Disabled Button')).toBeInTheDocument();
  });

  it('should render Counter component', () => {
    render(<App />);
    expect(screen.getByTestId('counter')).toBeInTheDocument();
  });

  it('should render footer with test commands', () => {
    render(<App />);
    expect(screen.getByText(/Run tests with:/i)).toBeInTheDocument();
    expect(screen.getByText(/View coverage:/i)).toBeInTheDocument();
  });
});
