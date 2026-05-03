<script>
import { useAuthStore } from '../stores/auth.js';
import ListaJuegos from '../components/ListaJuegos.vue'

export default {
  name: 'PerfilView',
  components: { ListaJuegos },

  computed: {
    usuarioLogueado() {
      return this.authStore.usuarioLogueado;
    },
    usuario() {
      return this.authStore.usuario;
    },
  },

  setup() {
    const authStore = useAuthStore();
    return { authStore };
  }
}
</script>

<template>
  <header>
    <h1>{{ this.usuario }}</h1>
  </header>
  <body>
    <article class="contenido-usuario">
      <section class="usuario-juegos">
        <hr />
        <h2>Lista Personal</h2>
        <ListaJuegos :personal="true"></ListaJuegos>
      </section>
    </article>
  </body>
</template>

<style scoped>
h1 {
  color: #359c61;
}
</style>
