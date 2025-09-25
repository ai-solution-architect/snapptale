import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  test('renders primary button with correct text', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const buttonElement = screen.getByText('Primary Button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-primary');
  });

  test('renders secondary button with correct text', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const buttonElement = screen.getByText('Secondary Button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-background-light');
  });

  test('applies additional className correctly', () => {
    render(<Button className="custom-class">Styled Button</Button>);
    const buttonElement = screen.getByText('Styled Button');
    expect(buttonElement).toHaveClass('custom-class');
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByText('Disabled Button');
    expect(buttonElement).toBeDisabled();
  });
});