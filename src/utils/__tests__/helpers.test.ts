import {
  formatDate,
  formatNumber,
  formatEnergy,
  isValidEmail,
  truncateText,
  calculatePercentage,
  debounce,
} from '../helpers';
import { DATE_FORMATS } from '../constants';

describe('helpers', () => {
  describe('formatDate', () => {
    it('should format a Date object with default format', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date);
      expect(result).toBe('Jan 15, 2024');
    });

    it('should format a date string with default format', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = formatDate(dateString);
      expect(result).toBe('Jan 15, 2024');
    });

    it('should format a date with custom format', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date, DATE_FORMATS.DISPLAY_WITH_TIME);
      expect(result).toMatch(/Jan 15, 2024 \d{2}:\d{2}/);
    });
  });

  describe('formatNumber', () => {
    it('should format number with 2 decimal places by default', () => {
      expect(formatNumber(10.12345)).toBe('10.12');
    });

    it('should format number with specified decimal places', () => {
      expect(formatNumber(10.12345, 3)).toBe('10.123');
    });

    it('should handle integers', () => {
      expect(formatNumber(10)).toBe('10.00');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0.00');
    });
  });

  describe('formatEnergy', () => {
    it('should format energy value with unit', () => {
      expect(formatEnergy(10.5, 'kWh')).toBe('10.50 kWh');
    });

    it('should format energy with default decimal places', () => {
      expect(formatEnergy(123.456, 'kW')).toBe('123.46 kW');
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@example.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user @example.com')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('truncateText', () => {
    it('should not truncate text shorter than maxLength', () => {
      expect(truncateText('Short text', 20)).toBe('Short text');
    });

    it('should truncate text longer than maxLength', () => {
      expect(truncateText('This is a very long text', 10)).toBe('This is...');
    });

    it('should return exact maxLength text unchanged', () => {
      expect(truncateText('Exact', 5)).toBe('Exact');
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(50, 100)).toBe(50);
      expect(calculatePercentage(25, 100)).toBe(25);
    });

    it('should handle decimal values', () => {
      expect(calculatePercentage(33, 100)).toBe(33);
      expect(calculatePercentage(1, 3)).toBeCloseTo(33.33, 2);
    });

    it('should return 0 when total is 0', () => {
      expect(calculatePercentage(50, 0)).toBe(0);
    });

    it('should handle zero value', () => {
      expect(calculatePercentage(0, 100)).toBe(0);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn('arg1', 'arg2');

      jest.advanceTimersByTime(500);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should reset timer on subsequent calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn();
      jest.advanceTimersByTime(300);
      debouncedFn();
      jest.advanceTimersByTime(300);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(200);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
