import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

describe('Home Page', () => {
  it('renders Snapptale title and navigation link', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /snapptale/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to upload/i })).toBeInTheDocument();
  });
});
