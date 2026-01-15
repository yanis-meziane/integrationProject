import { render, screen } from '@testing-library/react';
import Register from './Register';

test('le formulaire Register s’affiche', () => {
  render(<Register />);

  expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Nom de famille/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
  expect(screen.getByText(/S'inscrire/i)).toBeInTheDocument();
});
