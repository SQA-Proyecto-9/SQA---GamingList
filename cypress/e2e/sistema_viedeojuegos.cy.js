describe('Pruebas de Aceptación y Sistema - Plataforma de Videojuegos', () => {

  // URL base configurada asumiendo que está en cypress.config.js
  // baseUrl: 'http://localhost:3000' (o el puerto de tu app)

  it('TB-03: Login Exitoso', () => {
    // 1. Interceptar la llamada a la API de login
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');

    // 2. Navegar a la vista de LogIn
    cy.visit('/login'); 

    // 3. Ingresar credenciales
    cy.get('[data-cy="input-username"]').type('admin');
    cy.get('[data-cy="input-password"]').type('admin');
    cy.get('[data-cy="btn-submit-login"]').click();

    // 4. Validar respuesta HTTP 200 de la API
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // 5. Validar redirección al inicio o perfil (cambio de estado)
    cy.url().should('match', /\/(inicio|perfil)$/);
  });

  it('TB-07: Listado de Catálogo', () => {
    // 1. Interceptar la consulta del catálogo
    cy.intercept('GET', '**/api/videojuegos/consultar').as('getCatalogo');

    // 2. Navegar a la vista del catálogo
    cy.visit('/catalogo');

    // 3. Esperar que el backend devuelva correctamente el JSON
    cy.wait('@getCatalogo').its('response.statusCode').should('eq', 200);

    // 4. Validar que la grilla contenga tarjetas de videojuegos
    cy.get('[data-cy="videojuego-card"]')
      .should('exist')
      .and('have.length.greaterThan', 0);
  });

  it('TB-10: Agregar a Lista Personal', () => {
    // Precondición: Iniciar sesión antes de la prueba
    cy.visit('/login');
    cy.get('[data-cy="input-username"]').type('admin');
    cy.get('[data-cy="input-password"]').type('admin');
    cy.get('[data-cy="btn-submit-login"]').click();

    // 1. Interceptar la ruta dinámica POST
    cy.intercept('POST', '**/api/auth/agregar/admin/*').as('agregarJuego');

    // 2. Ir a la vista de un juego específico (ejemplo ID 1)
    cy.visit('/videojuego/1');

    // 3. Clic en agregar a lista personal
    cy.get('[data-cy="btn-agregar-lista"]').click();

    // 4. Validar petición de red exitosa
    cy.wait('@agregarJuego').its('response.statusCode').should('be.oneOf', [200, 201]);

    // 5. Validar transición de estado en la UI (el botón se oculta)
    cy.get('[data-cy="btn-agregar-lista"]').should('not.exist');

    // 6. Validar que el juego aparece en el perfil
    cy.visit('/perfil');
    cy.get('[data-cy="lista-personal-item"]').should('contain', 'Nombre del Juego'); // Reemplazar con validación dinámica si es necesario
  });

  it('TB-16: Persistencia de Estatus en Perfil (Integración E2E)', () => {
    // Precondición: Iniciar sesión
    cy.visit('/login');
    cy.get('[data-cy="input-username"]').type('admin');
    cy.get('[data-cy="input-password"]').type('admin');
    cy.get('[data-cy="btn-submit-login"]').click();

    // 1. Interceptar la actualización de estatus
    cy.intercept('PUT', '**/api/videojuegos/estatus/*').as('actualizarEstatus');

    // 2. Ir al perfil
    cy.visit('/perfil');

    // 3. Cambiar el estado a "Finalizado" (valor 4) en el menú desplegable del primer juego
    cy.get('[data-cy="select-estatus"]').first().select('4');

    // 4. Validar que la petición HTTP PUT al servidor fue exitosa
    cy.wait('@actualizarEstatus').its('response.statusCode').should('eq', 200);

    // 5. Recargar la página de manera forzada
    cy.reload(true);

    // 6. Validar persistencia en la interfaz
    cy.get('[data-cy="select-estatus"]').first().should('have.value', '4');
  });

});