import { render, screen } from '@testing-library/react';
import Upload from '../src/app/upload/page';

describe('Upload Page', () => {
  it('renders upload heading and disabled controls', () => {
    render(<Upload />);
    expect(screen.getByRole('heading', { name: /upload photo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});
