import React from 'react';
import { render } from '@testing-library/react-native';
import Loading from '../Loading';

describe('Loading', () => {
  it('should render with default message', () => {
    const { getByText } = render(<Loading />);
    
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should render with custom message', () => {
    const customMessage = 'Fetching data...';
    const { getByText } = render(<Loading message={customMessage} />);
    
    expect(getByText(customMessage)).toBeTruthy();
  });

  it('should render ActivityIndicator', () => {
    const { getByTestId } = render(<Loading />);
    
    // ActivityIndicator doesn't have a default testID, so we check for the component type
    const { UNSAFE_getAllByType } = render(<Loading />);
    const activityIndicators = UNSAFE_getAllByType('ActivityIndicator' as any);
    
    expect(activityIndicators.length).toBeGreaterThan(0);
  });

  it('should match snapshot', () => {
    const { toJSON } = render(<Loading />);
    
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with custom message', () => {
    const { toJSON } = render(<Loading message="Custom loading message" />);
    
    expect(toJSON()).toMatchSnapshot();
  });
});
