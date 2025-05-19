describe('ChatPage E2E', () => {
  const chatId = 1;
  const userId = '123';

  beforeEach(() => {
  window.localStorage.setItem('userId', '123');
  window.localStorage.setItem('authToken', 'token_for_tests_123');

  cy.intercept('GET', `http://127.0.0.1:8000/api/chat/messages/1/`, {
    statusCode: 200,
    body: [
      { sender: 123, sender_name: 'Юзер1', content: 'Привіт!' },
      { sender: 456, sender_name: 'Юзер2', content: 'Як справи?' },
    ],
  }).as('getMessages');

  cy.intercept('POST', `http://127.0.0.1:8000/api/chat/message/send/`, (req) => {
    req.reply({ statusCode: 200, body: {} });
  }).as('sendMessage');
});


  it('завантажує і показує повідомлення, надсилає нове', () => {
    cy.visit(`/chat/${chatId}`);

    cy.wait('@getMessages');

    cy.contains('Привіт!').should('exist');
    cy.contains('Як справи?').should('exist');

    cy.get('input[placeholder="Напишіть повідомлення..."]').type('Новое повідомлення');

    cy.intercept('GET', `http://127.0.0.1:8000/api/chat/messages/${chatId}/`, {
      statusCode: 200,
      body: [
        { sender: 123, sender_name: 'Юзер1', content: 'Привіт!' },
        { sender: 456, sender_name: 'Юзер2', content: 'Як справи?' },
        { sender: 123, sender_name: 'Юзер1', content: 'Новое повідомлення' },
      ],
    }).as('getMessagesAfterSend');

    cy.get('form').submit();

    cy.wait('@sendMessage');
    cy.wait('@getMessagesAfterSend');

    cy.contains('Новое повідомлення').should('exist');
    cy.get('input[placeholder="Напишіть повідомлення..."]').should('have.value', '');
  });
});
