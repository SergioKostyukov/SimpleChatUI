import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Мокаємо useNavigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockClear();
  });

  test('рендерить SimpleChat посилання завжди', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('SimpleChat')).toBeInTheDocument();
  });

  test('не показує меню Профіль, якщо не аутентифікований', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.queryByText('Профіль')).not.toBeInTheDocument();
  });

  test('показує меню Профіль, якщо є токен в localStorage', () => {
    localStorage.setItem('authToken', 'token123');
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('Профіль')).toBeInTheDocument();
  });

  test('відкриває і закриває меню при кліку', () => {
    localStorage.setItem('authToken', 'token123');
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const profileBtn = screen.getByText('Профіль');
    fireEvent.click(profileBtn);
    expect(screen.getByText('Мій профіль')).toBeInTheDocument();

    fireEvent.click(profileBtn);
    expect(screen.queryByText('Мій профіль')).not.toBeInTheDocument();
  });

  test('клік Вийти очищає токен і виконує навігацію', () => {
    localStorage.setItem('authToken', 'token123');
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Профіль'));
    const logoutBtn = screen.getByText('Вийти');
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(mockedNavigate).toHaveBeenCalledWith('/auth');
  });
});
