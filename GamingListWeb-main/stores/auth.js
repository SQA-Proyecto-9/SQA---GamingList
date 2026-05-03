import { defineStore } from 'pinia';
import ApplicationControl from '../router/ApplicationControl.js'

const admins = ['admin'];

// Maneja los estados de Inicio de Sesión
export const useAuthStore = defineStore('auth', {
  state: () => ({
    adminLogueado: false,
    usuarioLogueado: false,
    usuario: null,
  }),

  actions: {
    async login(credenciales) {
      try {
        let userData = await ApplicationControl.loginUsuario(credenciales);

        if (userData) {
          this.adminLogueado = false;
          this.usuarioLogueado = true;
          this.usuario = userData.username;
        } else {
          this.adminLogueado = false;
          this.usuarioLogueado = false;
        }

        // Te asigna como administrador en el caso que se valide que eres administrador
        let ind;
        for (ind in admins) {
          if (this.usuario === admins[ind]) {
            this.adminLogueado = true;
          }
        }

      } catch (error) {
        console.error('Error en login:', error);
        this.adminLogueado = false;
        this.usuarioLogueado = false;
        this.usuario = null;
      }
    },

    logout() {
      this.adminLogueado = false;
      this.usuarioLogueado = false;
      this.usuario = null;
    },
  },
});
