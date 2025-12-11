/**
 * Theme Context
 * Demonstrates: React Context API for global state
 */

import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children, defaultTheme = 'light' }) => {
  const [theme, setTheme] = useState(defaultTheme);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Component that uses the theme context
export const ThemedBox = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div 
      data-testid="themed-box"
      style={{
        backgroundColor: theme === 'light' ? '#ffffff' : '#333333',
        color: theme === 'light' ? '#000000' : '#ffffff',
        padding: '20px',
        borderRadius: '8px'
      }}
    >
      {children}
    </div>
  );
};

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      data-testid="theme-toggle-button"
    >
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};
