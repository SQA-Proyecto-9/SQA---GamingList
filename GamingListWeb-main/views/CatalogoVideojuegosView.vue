<script>
import { defineComponent } from 'vue'
import { useAuthStore } from '../stores/auth.js';
import ListaJuegos from '../components/ListaJuegos.vue'
import ApplicationControl from '../router/ApplicationControl.js'

export default defineComponent({
  components: { ListaJuegos },

  computed: {
    adminLogueado() {
      return this.authStore.adminLogueado;
    },
    usuarioLogueado() {
      return this.authStore.usuarioLogueado;
    },
    usuario() {
      return this.authStore.usuario;
    },
  },

  // Aquí guardar debe es pasar los datos del form que se hará para la información del juego, por ahora es para agregar cosas al repositorio
  methods: {
    agregarVideojuego() {
      ApplicationControl.cambiarVista('agregar-videojuego');
    }
  },

  setup() {
    const authStore = useAuthStore();
    return { authStore };
  }
})
</script>

<template>
  <div class="juegos">
    <header>
      <h1>Catálogo de Videojuegos</h1>
    </header>
    <hr>
    <section class="lista-juegos">
      <button v-if="adminLogueado" @click="agregarVideojuego">Agregar Videojuego</button>
      <ListaJuegos />
    </section>
  </div>
</template>

<style scoped>
  h1 {
    color: #359c61;
  }

  .lista-juegos {
    justify-content: center;
  }

  button {
    margin-top: 1rem;
  }
</style>
