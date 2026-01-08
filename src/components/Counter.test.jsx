/**
 * Tests for Counter Component
 * Demonstrates: Testing state changes, user interactions, conditional rendering
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter.jsx';

describe('Counter Component', () => {
  describe('Initial Rendering', () => {
    it('should render with default initial count of 0', () => {
      render(<Counter />);
      expect(screen.getByTestId('counter-display')).toHaveTextContent('0');
    });

    it('should render with custom initial count', () => {
      render(<Counter initialCount={10} />);
      expect(screen.getByTestId('counter-display')).toHaveTextContent('10');
    });

    it('should render all control buttons', () => {
      render(<Counter />);
      expect(screen.getByTestId('increment-button')).toBeInTheDocument();
      expect(screen.getByTestId('decrement-button')).toBeInTheDocument();
      expect(screen.getByTestId('reset-button')).toBeInTheDocument();
    });
  });

  describe('Increment Functionality', () => {
    it('should increment by default step of 1', () => {
      render(<Counter />);
      const incrementButton = screen.getByTestId('increment-button');

      fireEvent.click(incrementButton);
      expect(screen.getByTestId('counter-display')).toHaveTextContent('1');
    });

    it('should increment by custom step', () => {
      render(<Counter step={5} />);
      const incrementButton = screen.getByTestId('increment-button');

      fireEvent.click(incrementButton);
      expect(screen.getByTestId('counter-display')).toHaveTextContent('5');
    });

    it('should increment multiple times', () => {
      render(<Counter />);
      const incrementButton = screen.getByTestId('increment-button');

      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      expect(screen.getByTestId('counter-display')).toHaveTextContent('3');
    });

    it('should not exceed max value', () => {
      render(<Counter max={5} />);
      const incrementButton = screen.getByTestId('increment-button');

      // Click 10 times
      for (let i = 0; i < 10; i++) {
        fireEvent.click(incrementButton);
      }

      expect(screen.getByTestId('counter-display')).toHaveTextContent('5');
    });

    it('should disable increment button when max is reached', () => {
      render(<Counter max={5} />);
      const incrementButton = screen.getByTestId('increment-button');

      // Click until max
      for (let i = 0; i < 5; i++) {
        fireEvent.click(incrementButton);
      }

      expect(incrementButton).toBeDisabled();
    });
  });

  describe('Decrement Functionality', () => {
    it('should decrement by default step of 1', () => {
      render(<Counter initialCount={5} />);
      const decrementButton = screen.getByTestId('decrement-button');

      fireEvent.click(decrementButton);
      expect(screen.getByTestId('counter-display')).toHaveTextContent('4');
    });

    it('should decrement by custom step', () => {
      render(<Counter initialCount={10} step={3} />);
      const decrementButton = screen.getByTestId('decrement-button');

      fireEvent.click(decrementButton);
      expect(screen.getByTestId('counter-display')).toHaveTextContent('7');
    });

    it('should not go below min value', () => {
      render(<Counter min={0} />);
      const decrementButton = screen.getByTestId('decrement-button');

      // Click 5 times
      for (let i = 0; i < 5; i++) {
        fireEvent.click(decrementButton);
      }

      expect(screen.getByTestId('counter-display')).toHaveTextContent('0');
    });

    it('should disable decrement button when min is reached', () => {
      render(<Counter min={0} />);
      const decrementButton = screen.getByTestId('decrement-button');

      expect(decrementButton).toBeDisabled();
    });
  });

  describe('Reset Functionality', () => {
    it('should reset to initial count', () => {
      render(<Counter initialCount={5} />);
      const incrementButton = screen.getByTestId('increment-button');
      const resetButton = screen.getByTestId('reset-button');

      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      expect(screen.getByTestId('counter-display')).toHaveTextContent('7');

      fireEvent.click(resetButton);
      expect(screen.getByTestId('counter-display')).toHaveTextContent('5');
    });

    it('should reset to 0 when no initial count provided', () => {
      render(<Counter />);
      const incrementButton = screen.getByTestId('increment-button');
      const resetButton = screen.getByTestId('reset-button');

      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      fireEvent.click(resetButton);
      expect(screen.getByTestId('counter-display')).toHaveTextContent('0');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle increment, decrement, and reset correctly', () => {
      render(<Counter initialCount={10} />);
      const display = screen.getByTestId('counter-display');
      const incrementButton = screen.getByTestId('increment-button');
      const decrementButton = screen.getByTestId('decrement-button');
      const resetButton = screen.getByTestId('reset-button');

      expect(display).toHaveTextContent('10');

      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      expect(display).toHaveTextContent('12');

      fireEvent.click(decrementButton);
      expect(display).toHaveTextContent('11');

      fireEvent.click(resetButton);
      expect(display).toHaveTextContent('10');
    });

    it('should work correctly with min and max boundaries', () => {
      render(<Counter initialCount={5} min={0} max={10} step={2} />);
      const display = screen.getByTestId('counter-display');
      const incrementButton = screen.getByTestId('increment-button');
      const decrementButton = screen.getByTestId('decrement-button');

      // Increment to max
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      expect(display).toHaveTextContent('10');
      expect(incrementButton).toBeDisabled();

      // Try to increment beyond max
      fireEvent.click(incrementButton);
      expect(display).toHaveTextContent('10');

      // Decrement to min
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      expect(display).toHaveTextContent('0');
      expect(decrementButton).toBeDisabled();
    });
  });
});
