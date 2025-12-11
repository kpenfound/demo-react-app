/**
 * UserList Component with Async Data Fetching
 * Demonstrates: async operations, loading states, error handling, useEffect
 */

import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../utils/api';
import './UserList.css';

const UserList = ({ limit = 5 }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchUsers(limit);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [limit]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    loadUsers();
  };

  if (loading) {
    return <div data-testid="loading">Loading users...</div>;
  }

  if (error) {
    return (
      <div data-testid="error" className="error">
        <p>Error: {error}</p>
        <button onClick={handleRefresh} data-testid="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="user-list" data-testid="user-list">
      <div className="user-list__header">
        <h2>Users</h2>
        <button onClick={handleRefresh} data-testid="refresh-button">
          Refresh
        </button>
      </div>
      {users.length === 0 ? (
        <p data-testid="no-users">No users found</p>
      ) : (
        <ul data-testid="users">
          {users.map(user => (
            <li key={user.id} data-testid={`user-${user.id}`}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
