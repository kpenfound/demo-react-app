/**
 * Tests for Custom Hooks
 * Demonstrates: Testing hooks with renderHook, act, fake timers
 */

import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, useDebounce, useToggle } from './customHooks';

describe('Custom Hooks', () => {
  describe('useLocalStorage', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
    });

    it('should return initial value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      const [value] = result.current;
      expect(value).toBe('initial');
    });

    it('should save value to localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      act(() => {
        const [, setValue] = result.current;
        setValue('new value');
      });

      expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new value'));
    });

    it('should load value from localStorage', () => {
      localStorage.setItem('test-key', JSON.stringify('stored value'));
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      const [value] = result.current;
      expect(value).toBe('stored value');
    });

    it('should update value in state and localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 0));
      
      act(() => {
        const [, setValue] = result.current;
        setValue(42);
      });

      const [value] = result.current;
      expect(value).toBe(42);
      expect(localStorage.getItem('test-key')).toBe('42');
    });

    it('should support function updates', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0));
      
      act(() => {
        const [, setValue] = result.current;
        setValue(prev => prev + 1);
      });

      const [value] = result.current;
      expect(value).toBe(1);
    });

    it('should handle complex objects', () => {
      const obj = { name: 'Test', count: 5 };
      const { result } = renderHook(() => useLocalStorage('test-obj', obj));
      
      act(() => {
        const [, setValue] = result.current;
        setValue({ ...obj, count: 10 });
      });

      const [value] = result.current;
      expect(value).toEqual({ name: 'Test', count: 10 });
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock localStorage to throw error
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('localStorage is full');
      });

      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      
      act(() => {
        const [, setValue] = result.current;
        setValue('new value');
      });

      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe('useDebounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 500));
      expect(result.current).toBe('initial');
    });

    it('should debounce value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      expect(result.current).toBe('initial');

      // Update the value
      rerender({ value: 'updated', delay: 500 });
      
      // Value should not change immediately
      expect(result.current).toBe('initial');

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Now it should be updated
      expect(result.current).toBe('updated');
    });

    it('should cancel previous timeout on rapid changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'first', delay: 500 } }
      );

      rerender({ value: 'second', delay: 500 });
      act(() => {
        jest.advanceTimersByTime(250);
      });

      rerender({ value: 'third', delay: 500 });
      act(() => {
        jest.advanceTimersByTime(250);
      });

      // Should still be first
      expect(result.current).toBe('first');

      act(() => {
        jest.advanceTimersByTime(250);
      });

      // Now should be third
      expect(result.current).toBe('third');
    });
  });

  describe('useToggle', () => {
    it('should initialize with default false value', () => {
      const { result } = renderHook(() => useToggle());
      
      const [value] = result.current;
      expect(value).toBe(false);
    });

    it('should initialize with custom value', () => {
      const { result } = renderHook(() => useToggle(true));
      
      const [value] = result.current;
      expect(value).toBe(true);
    });

    it('should toggle value', () => {
      const { result } = renderHook(() => useToggle(false));
      
      act(() => {
        const [, { toggle }] = result.current;
        toggle();
      });

      const [value] = result.current;
      expect(value).toBe(true);

      act(() => {
        const [, { toggle }] = result.current;
        toggle();
      });

      const [newValue] = result.current;
      expect(newValue).toBe(false);
    });

    it('should set to true', () => {
      const { result } = renderHook(() => useToggle(false));
      
      act(() => {
        const [, { setTrue }] = result.current;
        setTrue();
      });

      const [value] = result.current;
      expect(value).toBe(true);
    });

    it('should set to false', () => {
      const { result } = renderHook(() => useToggle(true));
      
      act(() => {
        const [, { setFalse }] = result.current;
        setFalse();
      });

      const [value] = result.current;
      expect(value).toBe(false);
    });

    it('should handle multiple operations', () => {
      const { result } = renderHook(() => useToggle(false));
      
      act(() => {
        const [, { setTrue }] = result.current;
        setTrue();
      });
      expect(result.current[0]).toBe(true);

      act(() => {
        const [, { toggle }] = result.current;
        toggle();
      });
      expect(result.current[0]).toBe(false);

      act(() => {
        const [, { toggle }] = result.current;
        toggle();
      });
      expect(result.current[0]).toBe(true);

      act(() => {
        const [, { setFalse }] = result.current;
        setFalse();
      });
      expect(result.current[0]).toBe(false);
    });
  });
});
