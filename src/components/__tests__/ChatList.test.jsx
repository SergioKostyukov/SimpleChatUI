import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatListPage from '../ChatList';
import * as api from '../../services/api';

jest.mock('../../services/api', () => ({
  getChats: jest.fn(),
}));

jest.mock('../Chat', () => () => <div data-testid="chat-page">ChatPage</div>);

describe('ChatListPage Component', () => {
  const mockChats = [
    { id: 1, name: 'Загальний' },
    { id: 2, name: 'Проєкт A' },
  ];

  const resizeWindow = (width) => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    api.getChats.mockResolvedValue({ data: mockChats });
  });

  test('renders chat list and default chat on desktop', async () => {
    resizeWindow(1024); // десктоп

    render(<ChatListPage />);

    expect(await screen.findByText('💬 Список чатів')).toBeInTheDocument();
    expect(await screen.findByText('Загальний')).toBeInTheDocument();
    expect(await screen.findByText('Проєкт A')).toBeInTheDocument();

    // За замовчуванням має відкриватися перший чат
    expect(await screen.findByTestId('chat-page')).toBeInTheDocument();
  });

  test('clicking chat updates selected chat on desktop', async () => {
    resizeWindow(1024);

    render(<ChatListPage />);

    await screen.findByText('Проєкт A');

    fireEvent.click(screen.getByText('Проєкт A'));

    expect(await screen.findByTestId('chat-page')).toBeInTheDocument();
  });

  test('renders only chat list on mobile initially', async () => {
    resizeWindow(375); // мобільна

    render(<ChatListPage />);

    expect(await screen.findByText('💬 Список чатів')).toBeInTheDocument();
    expect(screen.queryByTestId('chat-page')).not.toBeInTheDocument();
  });

  test('navigates to chat on mobile when chat is clicked', async () => {
    resizeWindow(375);

    render(<ChatListPage />);

    await waitFor(() => {
      expect(screen.getByText('Проєкт A')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Проєкт A'));

    expect(await screen.findByTestId('chat-page')).toBeInTheDocument();
  });

  test('back button returns to chat list on mobile', async () => {
    resizeWindow(375);

    render(<ChatListPage />);

    fireEvent.click(await screen.findByText('Загальний'));

    await screen.findByTestId('chat-page');

    fireEvent.click(screen.getByText(/назад до списку/i));

    expect(await screen.findByText('💬 Список чатів')).toBeInTheDocument();
  });
});
