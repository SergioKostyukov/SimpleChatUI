import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPage from '../Chat';
import * as api from '../../services/api';

jest.mock('../../services/api', () => ({
  getMessages: jest.fn(),
  sendMessageToChat: jest.fn(),
}));

describe('ChatPage Component', () => {
  const mockMessages = [
    { sender: 1, sender_name: 'Іван', content: 'Привіт!' },
    { sender: 2, sender_name: 'Оля', content: 'Привіт, Іване!' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('userId', '1');
  });

  test('renders messages on mount', async () => {
    api.getMessages.mockResolvedValueOnce({ data: mockMessages });

    render(<ChatPage chatId="123" />);

    expect(screen.getByText('Повідомлення')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Іван')).toBeInTheDocument();
      expect(screen.getByText('Привіт!')).toBeInTheDocument();
      expect(screen.getByText('Оля')).toBeInTheDocument();
      expect(screen.getByText('Привіт, Іване!')).toBeInTheDocument();
    });

    expect(api.getMessages).toHaveBeenCalledWith('123');
  });

  test('sends a message and updates the message list', async () => {
    api.getMessages.mockResolvedValueOnce({ data: mockMessages }); // Initial load
    api.sendMessageToChat.mockResolvedValueOnce({});
    const updatedMessages = [...mockMessages, {
      sender: 1,
      sender_name: 'Іван',
      content: 'Як справи?',
    }];
    api.getMessages.mockResolvedValueOnce({ data: updatedMessages }); // After sending

    render(<ChatPage chatId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Привіт!')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Напишіть повідомлення...'), {
      target: { value: 'Як справи?' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Надіслати' }));

    await waitFor(() => {
      expect(api.sendMessageToChat).toHaveBeenCalledWith('123', '1', 'Як справи?');
      expect(screen.getByText('Як справи?')).toBeInTheDocument();
    });
  });

  test('does not send empty message', async () => {
    api.getMessages.mockResolvedValueOnce({ data: mockMessages });

    render(<ChatPage chatId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Привіт!')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Надіслати' }));

    expect(api.sendMessageToChat).not.toHaveBeenCalled();
  });
});
