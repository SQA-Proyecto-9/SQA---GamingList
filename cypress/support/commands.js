// ***********************************************
// Comandos personalizados de Cypress para GamingList
// ***********************************************

/**
 * Comando reutilizable de login via UI.
 * Navega a /login, ingresa las credenciales y espera la redireccion.
 * Usa el backend real (sin stub).
 *
 * @example cy.login('cypress_test', 'Pass123!')
 */
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('#username').type(username);
  cy.get('#clave').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});