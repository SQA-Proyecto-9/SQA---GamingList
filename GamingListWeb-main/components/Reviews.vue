<script>
import ApplicationControl from '../router/ApplicationControl.js'
import { useAuthStore } from '../stores/auth.js'
import { useToast } from 'vue-toastification'

export default {
  name: 'ReviewsView',

  data() {
    return {
      reviews: [],
      mostrarModalEliminar: false,
    }
  },

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

  methods: {
    async cargarReviews() {
      try {
        const data = await ApplicationControl.pedirReviews(this.$route.params.id);
        if (data && Array.isArray(data)) {
          this.reviews = data;
        } else {
          console.warn('No se pudieron cargar las reseñas o el formato de datos es incorrecto');
        }
      } catch (error) {
        console.error('Error cargando las reseñas:', error);
      }
    },

    async eliminarReview(userName) {
      if (!this.usuario) return;

      if (await ApplicationControl.eliminarReviewUser(userName, this.$route.params.id)) {
        this.toast.success("Reseña eliminada con éxito!");
        await this.cargarReviews();
      } else {
        this.toast.error('Hubo un error eliminando la reseña');
      }
      this.mostrarModalEliminar = false;
    }
  },

  async mounted() {
    await this.cargarReviews();
  },

  setup() {
    const authStore = useAuthStore();
    const toast = useToast();
    return { authStore, toast };
  },
}
</script>

<template>
  <h1>Reseñas</h1>
  <ul class="lista-reviews">
    <li
      v-for="review in reviews"
      :key="review"
      class="review"
    >
      <header>
        <h2>{{ review.nomUsuario }}</h2>
        <h3>Calificación: {{review.calificacion}}/10</h3>
        <button
          v-if="this.usuarioLogueado && ((this.usuario === review.nomUsuario) || this.adminLogueado)"
          @click="mostrarModalEliminar = true"
          class="btn-eliminar"
        >
          Eliminar
        </button>
      </header>
      <main>
        <p>{{ review.mensaje }}</p>
        <div v-if="mostrarModalEliminar" class="modal-overlay">
          <div class="modal-content">
            <h2>Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas <em>eliminar</em> esta reseña? <br>Esta acción no se puede deshacer.</p>
            <div class="modal-buttons">
              <button @click="eliminarReview(review.nomUsuario)" class="btn-confirmar">Sí, Eliminar</button>
              <button @click="mostrarModalEliminar = false" class="btn-cancelar">Cancelar</button>
            </div>
          </div>
        </div>
      </main>
    </li>
  </ul>
</template>

<style scoped>
.lista-reviews {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 25px;
  padding: 0;
  list-style: none;
  margin: 20px 0;
}

.review {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: auto;
}


header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  background-color: #359c61;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
}

h2 {
  margin: 0 1rem 0 1rem;
  font-size: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

h3 {
  margin-left: auto;
  padding-left: 1rem;
  font-size: 1rem;
  color: #ffffff;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: black;
  background-color: #f9f9f9;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
}

p {
  margin-top: 1rem;
  font-style: italic;
  font-size: 1rem;
  line-height: 1.4;
  color: #333;
}

.btn-eliminar {
  padding: 8px 16px;
  background-color: #ff4b5c;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 1rem;
  margin-right: 0.5rem;
}

.btn-eliminar:hover {
  background-color: #d9534f;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.btn-eliminar:active {
  background-color: #d9534f;
  transform: translateY(0);
}

/* Estilo para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  border: 3px solid #ff4b5c;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
}

.modal-content h2 {
  color: #ff4b5c;
  margin-bottom: 10px;
}

.modal-content p {
  font-size: 1rem;
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.btn-confirmar {
  background-color: #ff4b5c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-confirmar:hover {
  background-color: #d9534f;
}

.btn-cancelar {
  background-color: transparent;
  color: #333;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-cancelar:hover {
  background-color: #ddd;
}
</style>
