import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProfilePage from '../Profile';
import * as api from '../../services/api';

jest.mock('../../services/api', () => ({
  getProfile: jest.fn(),
}));

describe('ProfilePage Component', () => {
  const mockUser = {
    username: 'IvanPetrenko',
    email: 'ivan@example.com',
    gender: 'чоловік',
    birth_date: '1995-08-12',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('userId', '123');
  });

  test('renders loading text initially', async () => {
    api.getProfile.mockResolvedValue({ data: mockUser });

    render(<ProfilePage />);
    expect(screen.getByText(/Завантаження/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/Профіль користувача/i)).toBeInTheDocument()
    );
  });

  test('renders user profile after loading', async () => {
    api.getProfile.mockResolvedValue({ data: mockUser });

    render(<ProfilePage />);

    expect(await screen.findByText('Профіль користувача')).toBeInTheDocument();
    expect(screen.getByText(/Ім’я:/)).toBeInTheDocument();
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(mockUser.gender)).toBeInTheDocument();
    expect(screen.getByText(mockUser.birth_date)).toBeInTheDocument();
  });

  test('calls getProfile with userId from localStorage', async () => {
    api.getProfile.mockResolvedValue({ data: mockUser });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(api.getProfile).toHaveBeenCalledWith('123');
    });
  });
});
