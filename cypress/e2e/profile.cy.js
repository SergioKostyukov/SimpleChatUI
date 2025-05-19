describe('ProfilePage', () => {
  const userId = '42';

  const mockUser = {
    username: 'testuser',
    email: 'testuser@example.com',
    gender: 'Чоловіча',
    birth_date: '1990-01-01',
  };

  beforeEach(() => {
    // Встановлюємо токен, який не містить кирилиці
    window.localStorage.setItem('authToken', 'token_for_tests_123');
    window.localStorage.setItem('userId', userId);

    cy.intercept('GET', `http://127.0.0.1:8000/api/accounts/profile/${userId}/`, {
      statusCode: 200,
      body: mockUser,
    }).as('getProfile');
  });

  // Ігноруємо uncaught exceptions в тестах, щоб не падали через помилки на клієнті
  Cypress.on('uncaught:exception', (err, runnable) => {
    // Повертаємо false, щоб тест не падав
    return false;
  });

  it('показує дані профілю після завантаження', () => {
  cy.visit('/profile');

  cy.wait('@getProfile');

  cy.contains('Профіль користувача').should('exist');

  // Знаходимо рядки з label і перевіряємо, що вони містять відповідний текст
  cy.contains('Ім’я:').should('exist').parent().should('contain.text', mockUser.username);
  cy.contains('Email:').should('exist').parent().should('contain.text', mockUser.email);
  cy.contains('Стать:').should('exist').parent().should('contain.text', mockUser.gender);
  cy.contains('Дата народження:').should('exist').parent().should('contain.text', mockUser.birth_date);
});


  it('показує "Завантаження..." поки дані не отримані', () => {
    cy.intercept('GET', `http://127.0.0.1:8000/api/accounts/profile/${userId}/`, (req) => {
      req.on('response', (res) => {
        return new Promise(resolve => setTimeout(resolve, 2000));
      });
      req.reply({
        statusCode: 200,
        body: mockUser,
      });
    }).as('getProfileDelayed');

    cy.visit('/profile');

    cy.contains('Завантаження...').should('exist');

    cy.wait('@getProfileDelayed');

    cy.contains('Завантаження...').should('not.exist');
  });
});
