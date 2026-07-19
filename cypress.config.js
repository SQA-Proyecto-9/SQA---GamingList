const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  // Genera reporte JUnit XML para integracion con dorny/test-reporter en Actions.
  // toConsole: true imprime cada test en el log de consola del pipeline mientras corre.
  reporter: 'mocha-junit-reporter',
  reporterOptions: {
    mochaFile: 'cypress/results/[hash].xml',
    toConsole: true,
  },

  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
