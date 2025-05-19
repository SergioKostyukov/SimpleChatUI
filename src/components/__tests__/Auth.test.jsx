import { BrowserRouter } from "react-router-dom";
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthPage from '../Auth';
import * as api from '../../services/api';

jest.mock('../../services/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('AuthPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form by default', () => {
    renderWithRouter(<AuthPage />);
    expect(screen.getByText('Вхід')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Увійти' })).toBeInTheDocument();
  });

  test('switches to registration form', () => {
    renderWithRouter(<AuthPage />);
    fireEvent.click(screen.getByText('Реєстрація'));

    expect(screen.getByPlaceholderText('Ім’я')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Зареєструватися' })).toBeInTheDocument();
  });

  test('submits login form', async () => {
    const mockLogin = api.login.mockResolvedValue({
      data: { token: 'mock-token', user_id: '123' },
    });

    renderWithRouter(<AuthPage />);
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Увійти' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(localStorage.getItem('authToken')).toBe('mock-token');
      expect(localStorage.getItem('userId')).toBe('123');
    });
  });

  test('submits registration form', async () => {
    const mockRegister = api.register.mockResolvedValue({});
    renderWithRouter(<AuthPage />);
    fireEvent.click(screen.getByText('Реєстрація'));

    fireEvent.change(screen.getByPlaceholderText('Ім’я'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'male' },
    });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), {
      target: { value: 'pass123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Зареєструватися' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });
});
