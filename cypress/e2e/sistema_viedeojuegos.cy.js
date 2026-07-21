describe('Pruebas de Sistema y Aceptación - Plataforma de Videojuegos', () => {

  const testUser = 'cypress_test';
  const testPassword = 'Pass123!';

  before(() => {
    // Registrar el usuario de prueba directamente via API (sin UI).
    // failOnStatusCode: false permite continuar si el usuario ya existe en el JSON
    // (caso de ejecucion local repetida; en CI la VM es efimera y el usuario nunca existe).
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/api/auth/register',
      body: { username: testUser, clave: testPassword, juegos: [] },
      failOnStatusCode: false,
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TB-03: Login Exitoso (Prueba de Aceptacion)
  // ──────────────────────────────────────────────────────────────────────────
  describe('Suite de Aceptación', () => {
    it('TB-03 [RF-02]: Login Exitoso', () => {
    // Monitorear la llamada real al backend SIN interceptar (sin stub).
    // cy.intercept sin reply deja pasar la peticion al servidor real.
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');

    cy.visit('/login');
    cy.get('#username').type(testUser);
    cy.get('#clave').type(testPassword);
    cy.get('button[type="submit"]').click();

    // Validar codigo HTTP 200 del backend real
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // Validar que la UI redirigió fuera de /login
    cy.url().should('not.include', '/login');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TB-07: Listado de Catálogo (Prueba de Aceptacion)
  // ──────────────────────────────────────────────────────────────────────────
    it('TB-07 [RF-03]: Listado de Catálogo', () => {
    // Monitorear la llamada al catalogo sin stub
    cy.intercept('GET', '**/api/videojuegos/consultar').as('getCatalogo');

    cy.login(testUser, testPassword);
    cy.visit('/videojuegos');

    // El backend real devuelve los juegos de videojuegos.json
    cy.wait('@getCatalogo').its('response.statusCode').should('eq', 200);
    cy.get('.lista-juegos .juego')
      .should('exist')
      .and('have.length.greaterThan', 0);
  });

    });
  });

  describe('Suite de Sistema', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // TB-10: Agregar a Lista Personal (Prueba de Sistema)
  // ──────────────────────────────────────────────────────────────────────────
    it('TB-10 [RF-05]: Agregar a Lista Personal', () => {
    // Monitorear sin stub — el backend real procesa y persiste en usuarios.json
    cy.intercept('POST', '**/api/auth/agregar/**').as('agregarJuego');

    cy.login(testUser, testPassword);
    cy.visit('/videojuegos');

    // Hacer click en el primer juego del catalogo (id=0, Zelda)
    cy.get('.lista-juegos .juego').first().click();

    // Clic en el boton real de agregar
    cy.get('.btn-agregar').click();

    // Verificar que el backend respondio correctamente
    cy.wait('@agregarJuego').its('response.statusCode').should('be.oneOf', [200, 201]);

    // Verificar el cambio de estado en la UI
    cy.contains('Ya has agregado').should('exist');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TS-01: Persistencia de Estatus en Perfil (Prueba de Sistema E2E)
  // Depende de TB-10: el juego debe estar en la lista del usuario.
  // ──────────────────────────────────────────────────────────────────────────
    it('TS-01 [RF-05]: Persistencia de Estatus en Perfil (Sistema E2E)', () => {
    // Monitorear la PUT real al backend sin stub
    cy.intercept('PUT', '**/api/auth/modificar/**').as('actualizarEstatus');

    cy.login(testUser, testPassword);
    cy.visit('/videojuegos');
    cy.get('.lista-juegos .juego').first().click();

    // El selector de estatus aparece porque el juego ya fue agregado en TB-10
    cy.get('#estado').should('exist').select('4');

    // Verificar que el backend real recibio y proceso el cambio (HTTP 200)
    cy.wait('@actualizarEstatus').its('response.statusCode').should('eq', 200);

    // Verificar la PERSISTENCIA consultando el backend directamente.
    // Usamos cy.request() en lugar de recargar la UI porque la sesion de Pinia
    // (que no persiste a localStorage) se perderia en un cy.reload().
    cy.request(`http://localhost:8080/api/auth/consultar/${testUser}/videojuegos`).then(
      (response) => {
        expect(response.status).to.equal(200);
        const juegoEnLista = response.body.find((j) => j.idJuego === 0);
        expect(juegoEnLista, 'El juego debe estar en la lista personal').to.exist;
        expect(juegoEnLista.estatus, 'El estatus debe ser 4 (Finalizado)').to.equal(4);
      },
    );
    });
  });

});