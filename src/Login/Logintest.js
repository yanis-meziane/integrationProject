import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

test('le formulaire Login s’affiche', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
  expect(screen.getByText(/Se connecter/i)).toBeInTheDocument();
});
