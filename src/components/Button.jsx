/**
 * Simple Button Component
 * Demonstrates: Basic component testing, props, event handlers
 */

import React from 'react';
import './Button.css';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  testId = 'button',
}) => {
  const buttonClass = `button button--${variant}`;
  const debugMode = true;

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {children}
    </button>
  );
};

export default Button;
