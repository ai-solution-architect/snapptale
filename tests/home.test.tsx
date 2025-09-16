import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('Home Page', () => {
  it('renders Snapptale title and navigation link', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /snapptale/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to upload/i })).toBeInTheDocument();
  });
});