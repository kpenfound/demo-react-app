/**
 * Tests for Button Component
 * Demonstrates: Component rendering, props testing, event handlers, snapshots
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Button from './Button.jsx';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with children text', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should apply default variant', () => {
      render(<Button>Click Me</Button>);
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('button--primary');
    });

    it('should apply custom variant', () => {
      render(<Button variant="secondary">Click Me</Button>);
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('button--secondary');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Click Me</Button>);
      const button = screen.getByTestId('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Events', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByTestId('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click Me
        </Button>
      );

      const button = screen.getByTestId('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should call onClick multiple times', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByTestId('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for primary button', () => {
      const { container } = render(<Button>Primary</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for disabled button', () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for secondary variant', () => {
      const { container } = render(
        <Button variant="secondary">Secondary</Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
