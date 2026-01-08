/**
 * API utilities for fetching data
 * Demonstrates: Functions that will be mocked in tests
 */

export const fetchUsers = async (limit = 5) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users?_limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

export const fetchUserById = async (id) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch user with id ${id}`);
  }

  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
};
