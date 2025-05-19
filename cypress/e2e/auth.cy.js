describe('Аутентифікація', () => {
  beforeEach(() => {
    // перехоплюємо реальний маршрут логіну з services/api.js
    cy.intercept('POST', 'http://127.0.0.1:8000/api/accounts/login/', {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user_id: '123',
      },
    }).as('login');
  });

  it('Успішний вхід', () => {
    cy.visit('/auth');
    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Пароль"]').type('password123');
    cy.contains('Увійти').click();

    // очікуємо запит на логін
    cy.wait('@login');

    // перевірка редіректу після входу
    cy.url().should('include', '/chats');
  });
});
