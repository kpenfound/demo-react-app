/**
 * Tests for Theme Context
 * Demonstrates: Testing Context, Providers, and consumers
 */

import { render, screen, fireEvent } from '@testing-library/react';
import {
  ThemeProvider,
  useTheme,
  ThemedBox,
  ThemeToggleButton,
} from './ThemeContext';

describe('ThemeContext', () => {
  describe('ThemeProvider', () => {
    it('should provide default light theme', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('should accept custom default theme', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme">{theme}</div>;
      };

      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('should provide toggleTheme function', () => {
      const TestComponent = () => {
        const { theme, toggleTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <button onClick={toggleTheme} data-testid="toggle">
              Toggle
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      fireEvent.click(screen.getByTestId('toggle'));

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('should provide setTheme function', () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <button onClick={() => setTheme('dark')} data-testid="set-dark">
              Set Dark
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('set-dark'));

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  describe('useTheme hook', () => {
    it('should throw error when used outside provider', () => {
      const TestComponent = () => {
        useTheme();
        return <div>Test</div>;
      };

      // Suppress console.error for this test
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleError.mockRestore();
    });
  });

  describe('ThemedBox component', () => {
    it('should render with light theme styles', () => {
      render(
        <ThemeProvider>
          <ThemedBox>Content</ThemedBox>
        </ThemeProvider>
      );

      const box = screen.getByTestId('themed-box');
      expect(box).toHaveStyle({
        backgroundColor: '#ffffff',
        color: '#000000',
      });
    });

    it('should render with dark theme styles', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <ThemedBox>Content</ThemedBox>
        </ThemeProvider>
      );

      const box = screen.getByTestId('themed-box');
      expect(box).toHaveStyle({
        backgroundColor: '#333333',
        color: '#ffffff',
      });
    });

    it('should update styles when theme changes', () => {
      render(
        <ThemeProvider>
          <ThemedBox>Content</ThemedBox>
          <ThemeToggleButton />
        </ThemeProvider>
      );

      const box = screen.getByTestId('themed-box');

      expect(box).toHaveStyle({ backgroundColor: '#ffffff' });

      fireEvent.click(screen.getByTestId('theme-toggle-button'));

      expect(box).toHaveStyle({ backgroundColor: '#333333' });
    });

    it('should render children', () => {
      render(
        <ThemeProvider>
          <ThemedBox>
            <span data-testid="child">Child Content</span>
          </ThemedBox>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
    });
  });

  describe('ThemeToggleButton component', () => {
    it('should render with correct initial text', () => {
      render(
        <ThemeProvider>
          <ThemeToggleButton />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-toggle-button')).toHaveTextContent(
        'Switch to Dark Mode'
      );
    });

    it('should toggle theme when clicked', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{theme}</div>
            <ThemeToggleButton />
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

      fireEvent.click(screen.getByTestId('theme-toggle-button'));

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('theme-toggle-button')).toHaveTextContent(
        'Switch to Light Mode'
      );
    });

    it('should toggle back and forth', () => {
      render(
        <ThemeProvider>
          <ThemeToggleButton />
        </ThemeProvider>
      );

      const button = screen.getByTestId('theme-toggle-button');

      expect(button).toHaveTextContent('Switch to Dark Mode');

      fireEvent.click(button);
      expect(button).toHaveTextContent('Switch to Light Mode');

      fireEvent.click(button);
      expect(button).toHaveTextContent('Switch to Dark Mode');
    });
  });

  describe('Integration', () => {
    it('should share theme state across multiple components', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme-display">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
          <ThemedBox>Box Content</ThemedBox>
          <ThemeToggleButton />
        </ThemeProvider>
      );

      const themeDisplay = screen.getByTestId('theme-display');
      const box = screen.getByTestId('themed-box');
      const button = screen.getByTestId('theme-toggle-button');

      expect(themeDisplay).toHaveTextContent('light');
      expect(box).toHaveStyle({ backgroundColor: '#ffffff' });
      expect(button).toHaveTextContent('Switch to Dark Mode');

      fireEvent.click(button);

      expect(themeDisplay).toHaveTextContent('dark');
      expect(box).toHaveStyle({ backgroundColor: '#333333' });
      expect(button).toHaveTextContent('Switch to Light Mode');
    });
  });
});
