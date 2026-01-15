import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    global.fetch = jest.fn();
  });

  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        type: 'user',
        userId: 1,
        firstname: 'Jean',
        lastname: 'Dupont'
      })
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByText(/Se connecter/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/homepage');
    });
  });

  test('handles failed login', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message: 'Email ou mot de passe incorrect'
      })
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'wrongpass' }
    });
    
    fireEvent.click(screen.getByText(/Se connecter/i));

    await waitFor(() => {
      expect(screen.getByText(/Email ou mot de passe incorrect/i)).toBeInTheDocument();
    });
  });
});