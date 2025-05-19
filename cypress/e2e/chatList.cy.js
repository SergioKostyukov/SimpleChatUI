describe('ChatListPage', () => {
  const chatsMock = [
    { id: 1, name: 'Чат 1' },
    { id: 2, name: 'Чат 2' },
  ];

  beforeEach(() => {
    // Вставляємо токен, щоб пройти авторизацію
    window.localStorage.setItem('authToken', 'fake-token-for-testing');

    // Перехоплюємо запит на отримання чатів і повертаємо мок
    cy.intercept('GET', 'http://127.0.0.1:8000/api/chat/chats/', {
      statusCode: 200,
      body: chatsMock,
    }).as('getChats');
  });

  it('Показує список чатів і відкриває чат на десктопі', () => {
    cy.viewport(1280, 800);
    cy.visit('/chats');

    cy.wait('@getChats');

    // Перевіряємо заголовок
    cy.contains('💬 Список чатів').should('exist');

    // Перевіряємо, що відображено два чати
    cy.get('aside ul li').should('have.length', chatsMock.length);

    // Перевіряємо, що перший чат підсвічений
    cy.get('aside ul li').first().should('have.class', 'bg-indigo-100');

    // Перевіряємо, що основна секція містить компонент чату (тут - просто перевірка наявності)
    cy.get('main').should('exist');

    // Клікаємо по другому чату
    cy.get('aside ul li').eq(1).click();

    // Тепер другий чат має бути підсвічений
    cy.get('aside ul li').eq(1).should('have.class', 'bg-indigo-100');
  });

  it('Показує список чатів і відкриває чат на мобільному, потім повертається назад', () => {
    cy.viewport(375, 667);
    cy.visit('/chats');

    cy.wait('@getChats');

    // На мобільному спочатку є список чатів
    cy.get('aside').should('exist');
    cy.get('aside ul li').should('have.length', chatsMock.length);

    // Основний чат не показаний
    cy.get('main').should('not.exist');

    // Клік по першому чату відкриває чат
    cy.get('aside ul li').first().click();

    cy.get('main').should('exist');
    cy.contains('← Назад до списку чатів').should('exist');

    // Повертаємось назад до списку чатів
    cy.contains('← Назад до списку чатів').click();

    cy.get('aside').should('exist');
    cy.get('main').should('not.exist');
  });
});
