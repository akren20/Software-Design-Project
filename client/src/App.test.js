import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home screen text properly', () => {
  render(<App />);
  const linkElement = screen.getByText(/Make a Difference Today/i);
  expect(linkElement).toBeInTheDocument();
});
