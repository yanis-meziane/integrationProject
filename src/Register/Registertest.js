import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Register Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    global.fetch = jest.fn();
  });

  test('renders registration form', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom de famille/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  test('validates password format', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Prénom/i), {
      target: { value: 'Jean' }
    });
    fireEvent.change(screen.getByLabelText(/Nom de famille/i), {
      target: { value: 'Dupont' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'jean@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'weak' }
    });

    fireEvent.click(screen.getByText(/S'inscrire/i));

    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe doit contenir/i)).toBeInTheDocument();
    });
  });

  test('handles successful registration', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        message: 'Inscription réussie'
      })
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Prénom/i), {
      target: { value: 'Jean' }
    });
    fireEvent.change(screen.getByLabelText(/Nom de famille/i), {
      target: { value: 'Dupont' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'jean@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'Password123@!' }
    });

    fireEvent.click(screen.getByText(/S'inscrire/i));

    await waitFor(() => {
      expect(screen.getByText(/Inscription réussie/i)).toBeInTheDocument();
    });
  });
});