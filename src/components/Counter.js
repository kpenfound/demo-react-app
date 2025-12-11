/**
 * Counter Component with State
 * Demonstrates: useState hook, state management, user interactions
 */

import React, { useState } from 'react';
import './Counter.css';

const Counter = ({ initialCount = 0, step = 1, min, max }) => {
  const [count, setCount] = useState(initialCount);

  const increment = () => {
    setCount(prevCount => {
      const newCount = prevCount + step;
      return max !== undefined ? Math.min(newCount, max) : newCount;
    });
  };

  const decrement = () => {
    setCount(prevCount => {
      const newCount = prevCount - step;
      return min !== undefined ? Math.max(newCount, min) : newCount;
    });
  };

  const reset = () => {
    setCount(initialCount);
  };

  return (
    <div className="counter" data-testid="counter">
      <h2>Counter</h2>
      <div className="counter__display" data-testid="counter-display">
        {count}
      </div>
      <div className="counter__controls">
        <button 
          onClick={decrement} 
          data-testid="decrement-button"
          disabled={min !== undefined && count <= min}
        >
          -
        </button>
        <button 
          onClick={reset} 
          data-testid="reset-button"
        >
          Reset
        </button>
        <button 
          onClick={increment} 
          data-testid="increment-button"
          disabled={max !== undefined && count >= max}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;
