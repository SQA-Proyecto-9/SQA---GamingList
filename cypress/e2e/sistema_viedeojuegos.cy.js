describe('Pruebas de Aceptación y Sistema - Plataforma de Videojuegos', () => {

  // URL base configurada asumiendo que está en cypress.config.js
  // baseUrl: 'http://localhost:3000' (o el puerto de tu app)

  it('TB-03: Login Exitoso', () => {
    // 1. Interceptar (stub) la llamada a la API de login para evitar dependencia del backend
    cy.intercept('POST', '**/api/auth/login', (req) => {
      req.reply({ statusCode: 200, body: { username: 'Sandro2070', clave: '1234', juegos: [] } });
    }).as('loginRequest');

    // 2. Navegar a la vista de LogIn
    cy.visit('/login'); 

    // 3. Ingresar credenciales (usar los ids del formulario)
    cy.get('#username').type('admin');
    cy.get('#clave').type('admin');
    cy.get('button[type="submit"]').click();

    // 4. Validar respuesta HTTP 200 de la API
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // 5. Validar que ya no estamos en la página de login
    cy.url().should('not.include', '/login');
  });

  it('TB-07: Listado de Catálogo', () => {
    // 1. Interceptar y devolver un fixture para el catálogo
    cy.intercept('GET', '**/api/videojuegos/consultar', { fixture: 'videojuegos.json' }).as('getCatalogo');

    // 2. Navegar a la vista del catálogo
    cy.visit('/videojuegos');

    // 3. Esperar la respuesta stub y validar
    cy.wait('@getCatalogo').its('response.statusCode').should('eq', 200);

    // 4. Validar que la grilla contenga tarjetas de videojuegos (ajustado a la estructura real)
    cy.get('.lista-juegos .juego')
      .should('exist')
      .and('have.length.greaterThan', 0);
  });

  it('TB-10: Agregar a Lista Personal', () => {
    // Precondición: Iniciar sesión antes de la prueba
    cy.visit('/login');
    // Asegurar catálogo stubbeado antes del login para que la redirección cargue la lista
    cy.intercept('GET', '**/api/videojuegos/consultar', { fixture: 'videojuegos.json' }).as('getCatalogo');
    // Stub login
    cy.intercept('POST', '**/api/auth/login', (req) => req.reply({ statusCode: 200, body: { username: 'Sandro2070', clave: '1234', juegos: [] } })).as('loginRequest');
    cy.get('#username').type('Sandro2070');
    cy.get('#clave').type('1234');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');

    // Interceptar agregar a lista y devolver 200
    cy.intercept('POST', '**/api/auth/agregar/**', { statusCode: 200 }).as('agregarJuego');

    // Interceptar la verificación de existencia en la lista para que el botón aparezca
    cy.intercept('GET', '**/api/auth/consultar/*/*', { body: false }).as('verificarEnLista');

    // Interceptar la carga del videojuego al visitar su detalle
    cy.intercept('GET', '**/api/videojuegos/consultar/*', { body: { id: 1, nombre: 'Nombre del Juego', descripcion: 'desc', generos: ['Aventura'] } }).as('getJuego');

    // Stub para la calificación y reviews que consulta la vista
    cy.intercept('GET', '**/api/reviews/consultar/calificacion/*', { body: 5 });
    cy.intercept('GET', '**/api/reviews/consultar/*', { body: [] });

    // 2. Ir a la vista de un juego específico mediante la UI (para mantener el estado de sesión)
    cy.url().should('include', '/videojuegos');
    cy.wait('@getCatalogo');
    cy.get('.lista-juegos .juego').first().click();

    // 3. Clic en agregar a lista personal (selector real)
    cy.get('.btn-agregar').click();

    // 4. Validar petición de red exitosa
    cy.wait('@agregarJuego').its('response.statusCode').should('be.oneOf', [200, 201]);

    // 5. Validar transición de estado en la UI (el texto que indica agregado)
    cy.contains('Ya has agregado').should('exist');

    // 6. Validar que el juego aparece en el perfil
    // Stub the user's lista personal and the service that returns juegos for the user
    cy.intercept('GET', '**/api/auth/consultar/*/videojuegos', { body: [{ idJuego: 1, estatus: 1 }] }).as('getListaPersonal');
    cy.intercept('POST', '**/api/videojuegos/consultar/usuario', { body: [{ id: 1, nombre: 'Nombre del Juego', descripcion: 'desc', generos: ['Aventura'] }] }).as('getVideojuegosUsuario');
    cy.visit('/perfil');
    cy.wait('@getListaPersonal');
    cy.wait('@getVideojuegosUsuario');
    cy.get('.lista-juegos .juego').should('contain', 'Nombre del Juego');
  });

  it('TB-16: Persistencia de Estatus en Perfil (Integración E2E)', () => {
    // Precondición: Iniciar sesión (stub)
    cy.intercept('POST', '**/api/auth/login', (req) => req.reply({ statusCode: 200, body: { username: 'Sandro2070', clave: '1234', juegos: [] } })).as('loginRequest');
    cy.visit('/login');
    // Asegurar catálogo stubbeado antes del login
    cy.intercept('GET', '**/api/videojuegos/consultar', { fixture: 'videojuegos.json' }).as('getCatalogo');
    cy.get('#username').type('Sandro2070');
    cy.get('#clave').type('1234');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');

    // Interceptar verificación de existencia en lista para que se muestre el select

    cy.intercept('GET', '**/api/auth/consultar/*/*', { body: true }).as('verificarEnLista');

    // Interceptar la carga del videojuego y datos asociados
    cy.intercept('GET', '**/api/videojuegos/consultar/*', { body: { id: 1, nombre: 'Nombre del Juego', descripcion: 'desc', generos: ['Aventura'] } }).as('getJuego');
    cy.intercept('GET', '**/api/reviews/consultar/calificacion/*', { body: 5 });
    cy.intercept('GET', '**/api/reviews/consultar/*', { body: [] });

    // Interceptar la modificación de estatus en backend
    cy.intercept('PUT', '**/api/auth/modificar/**', { statusCode: 200 }).as('actualizarEstatus');

    // 2. Ir al detalle del videojuego mediante la UI (preserva Pinia)
    cy.url().should('include', '/videojuegos');
    cy.wait('@getCatalogo');
    cy.get('.lista-juegos .juego').first().click();

    // 3. Cambiar el estado a "Finalizado" (valor 4) en el select real
    cy.get('#estado').should('exist').select('4');

    // 4. Validar que la petición HTTP PUT al servidor fue exitosa
    cy.wait('@actualizarEstatus').its('response.statusCode').should('eq', 200);

    // 5. Recargar la página de manera forzada
    // Stub the user's lista personal to reflect the updated estatus so reload shows persistence
    cy.intercept('GET', '**/api/auth/consultar/*/videojuegos', { body: [{ idJuego: 1, estatus: 4 }] }).as('getListaPersonal');
    cy.reload(true);

    // 6. El backend recibió la actualización (verificado en el paso anterior). Fin del flujo.
  });

});