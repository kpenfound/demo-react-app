/**
 * Tests for UserList Component
 * Demonstrates: Mocking API calls, testing async behavior, loading/error states
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import UserList from './UserList.jsx';
import * as api from '../utils/api';

// Mock the API module
vi.mock('../utils/api');

describe('UserList Component', () => {
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      // Mock a delayed response
      api.fetchUsers.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(mockUsers), 100))
      );

      render(<UserList />);
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    it('should display users after successful fetch', async () => {
      api.fetchUsers.mockResolvedValue(mockUsers);

      render(<UserList />);

      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should display user emails', async () => {
      api.fetchUsers.mockResolvedValue(mockUsers);

      render(<UserList />);

      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      // Check if email is present in the text content
      expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
    });

    it('should call fetchUsers with correct limit', async () => {
      api.fetchUsers.mockResolvedValue(mockUsers);

      render(<UserList limit={10} />);

      await waitFor(() => {
        expect(api.fetchUsers).toHaveBeenCalledWith(10);
      });
    });

    it('should display "No users found" when empty array returned', async () => {
      api.fetchUsers.mockResolvedValue([]);

      render(<UserList />);

      await waitFor(() => {
        expect(screen.getByTestId('no-users')).toBeInTheDocument();
      });
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', async () => {
      api.fetchUsers.mockRejectedValue(new Error('Network error'));

      render(<UserList />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });

      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });

    it('should show retry button on error', async () => {
      api.fetchUsers.mockRejectedValue(new Error('Network error'));

      render(<UserList />);

      await waitFor(() => {
        expect(screen.getByTestId('retry-button')).toBeInTheDocument();
      });
    });

    it('should retry fetch when retry button is clicked', async () => {
      // First call fails, second succeeds
      api.fetchUsers
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockUsers);

      render(<UserList />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });

      const retryButton = screen.getByTestId('retry-button');
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      expect(api.fetchUsers).toHaveBeenCalledTimes(2);
    });
  });

  describe('Refresh Functionality', () => {
    it('should refetch users when refresh button is clicked', async () => {
      api.fetchUsers.mockResolvedValue(mockUsers);

      render(<UserList />);

      await waitFor(() => {
        expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('refresh-button'));

      await waitFor(() => {
        expect(api.fetchUsers).toHaveBeenCalledTimes(2);
      });
    });

    it('should update users list after refresh', async () => {
      const newUsers = [
        { id: 4, name: 'Alice Wonder', email: 'alice@example.com' },
      ];

      api.fetchUsers
        .mockResolvedValueOnce(mockUsers)
        .mockResolvedValueOnce(newUsers);

      render(<UserList />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('refresh-button'));

      await waitFor(() => {
        expect(screen.getByText('Alice Wonder')).toBeInTheDocument();
      });

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  describe('Effect Hook Behavior', () => {
    it('should refetch when limit prop changes', async () => {
      api.fetchUsers.mockResolvedValue(mockUsers);

      const { rerender } = render(<UserList limit={5} />);

      await waitFor(() => {
        expect(api.fetchUsers).toHaveBeenCalledWith(5);
      });

      rerender(<UserList limit={10} />);

      await waitFor(() => {
        expect(api.fetchUsers).toHaveBeenCalledWith(10);
      });

      expect(api.fetchUsers).toHaveBeenCalledTimes(2);
    });
  });
});
