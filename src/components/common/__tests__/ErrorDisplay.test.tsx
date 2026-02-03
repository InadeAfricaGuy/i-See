import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorDisplay from '../ErrorDisplay';

describe('ErrorDisplay', () => {
  it('should render with default message', () => {
    const { getByText } = render(<ErrorDisplay />);
    
    expect(getByText('Oops!')).toBeTruthy();
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('should render with custom message', () => {
    const customMessage = 'Network connection failed';
    const { getByText } = render(<ErrorDisplay message={customMessage} />);
    
    expect(getByText('Oops!')).toBeTruthy();
    expect(getByText(customMessage)).toBeTruthy();
  });

  it('should not render retry button when onRetry is not provided', () => {
    const { queryByText } = render(<ErrorDisplay />);
    
    expect(queryByText('Try Again')).toBeNull();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetryMock = jest.fn();
    const { getByText } = render(<ErrorDisplay onRetry={onRetryMock} />);
    
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('should call onRetry when retry button is pressed', () => {
    const onRetryMock = jest.fn();
    const { getByText } = render(<ErrorDisplay onRetry={onRetryMock} />);
    
    const retryButton = getByText('Try Again');
    fireEvent.press(retryButton);
    
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  it('should render both custom message and retry button', () => {
    const customMessage = 'Failed to load data';
    const onRetryMock = jest.fn();
    const { getByText } = render(
      <ErrorDisplay message={customMessage} onRetry={onRetryMock} />
    );
    
    expect(getByText(customMessage)).toBeTruthy();
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('should match snapshot with default props', () => {
    const { toJSON } = render(<ErrorDisplay />);
    
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with all props', () => {
    const onRetryMock = jest.fn();
    const { toJSON } = render(
      <ErrorDisplay message="Custom error message" onRetry={onRetryMock} />
    );
    
    expect(toJSON()).toMatchSnapshot();
  });
});
