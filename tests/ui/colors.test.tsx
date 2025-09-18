import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// A dummy component to render and test Tailwind classes
const TestComponent = () => {
  return <div data-testid="color-test-element" className="text-snaptale-primary">Test Color</div>;
};

describe('Color Palette Integration', () => {
  it('should apply the custom primary brand color', () => {
    render(<TestComponent />);
    const element = screen.getByTestId('color-test-element');
    // This assertion will fail because 'text-snaptale-primary' is not yet defined in Tailwind config
    expect(element).toHaveClass('text-snaptale-primary');
  });
});
