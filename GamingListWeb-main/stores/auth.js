import { defineStore } from 'pinia';
import ApplicationControl from '../router/ApplicationControl.js'

const admins = ['admin'];

// Maneja los estados de Inicio de Sesión
export const useAuthStore = defineStore('auth', {
  state: () => ({
    adminLogueado: localStorage.getItem('adminLogueado') === 'true' || false,
    usuarioLogueado: localStorage.getItem('usuarioLogueado') === 'true' || false,
    usuario: localStorage.getItem('usuario') || null,
  }),

  actions: {
    async login(credenciales) {
      try {
        let userData = await ApplicationControl.loginUsuario(credenciales);

        if (userData) {
          this.adminLogueado = false;
          this.usuarioLogueado = true;
          this.usuario = userData.username;
          localStorage.setItem('usuarioLogueado', 'true');
          localStorage.setItem('usuario', this.usuario);
        } else {
          this.adminLogueado = false;
          this.usuarioLogueado = false;
          localStorage.setItem('usuarioLogueado', 'false');
          localStorage.removeItem('usuario');
        }

        // Te asigna como administrador en el caso que se valide que eres administrador
        let ind;
        for (ind in admins) {
          if (this.usuario === admins[ind]) {
            this.adminLogueado = true;
            localStorage.setItem('adminLogueado', 'true');
          }
        }

      } catch (error) {
        console.error('Error en login:', error);
        this.adminLogueado = false;
        this.usuarioLogueado = false;
        this.usuario = null;
        localStorage.setItem('usuarioLogueado', 'false');
        localStorage.removeItem('usuario');
        localStorage.setItem('adminLogueado', 'false');
      }
    },

    logout() {
      this.adminLogueado = false;
      this.usuarioLogueado = false;
      this.usuario = null;
      localStorage.setItem('usuarioLogueado', 'false');
      localStorage.removeItem('usuario');
      localStorage.setItem('adminLogueado', 'false');
    },
  },
});
