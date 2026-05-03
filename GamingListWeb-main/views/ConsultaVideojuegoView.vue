<script>
import { useAuthStore } from '../stores/auth.js';
import { useToast } from 'vue-toastification';
import ReviewsView from '../components/Reviews.vue'
import ApplicationControl from '../router/ApplicationControl.js'

export default {
  name: 'ConsultaVideojuegoView',
  components: { ReviewsView },

  data() {
    return {
      videojuego: {
        nombre: '',
        descripcion: '',
        sinopsis: '',
        yearPublicacion: 0,
        generos: [],
      },
      calificacionJuego: 0,

      review: {
        nomUsuario: '',
        mensaje: '',
        calificacion: 0,
        idJuego: 0,
      },

      reviewExistente: false,
      enListaExistente: false,
      mostrarModalEliminar: false,
      mostrarModalReview: false,
    };
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
    reviewInvalido() {
      return (
        this.review.mensaje.length === 0 ||
        this.review.calificacion === ''
      );
    },
  },

  methods: {
    // Guardar la Review que tenga escrito el Usuario
    guardarReview() {
      if (!this.usuario) return;
      if (this.adminLogueado) return;

      if (this.review.calificacion < 0 || this.review.calificacion > 10) {
        this.toast.error('La calificación debe estar entre 0 y 10.');
        return;
      }

      if (ApplicationControl.agregarReview(this.review)) {
        this.reviewExistente = true;
      }
    },

    // Función que agrega la ID del juego a la lista del Usuario
    async agregarIdLista() {
      if (!this.usuario) return;

      if (await ApplicationControl.agregarIdListaPersonal(this.usuario, this.$route.params.id)) {
        this.enListaExistente = true;
      }
    },

    async eliminarVideojuego() {
      if (!this.usuario) return;

      if (await ApplicationControl.eliminarJuego(this.$route.params.id)) {
        ApplicationControl.cambiarVista('juegos');
        this.toast.success('Se ha eliminado el Videojuego con éxito!');
      } else {
        this.toast.error('Hubo un error eliminado el videojuego');
      }
      this.mostrarModalEliminar = false;
    },

    modificarVideojuego() {
      ApplicationControl.cambiarVista('editar-videojuego', {id: this.$route.params.id});
    },

    async mostrarModificarReview() {
      if (!this.usuario) return;

      this.review = await ApplicationControl.pedirReviewPorUsuario(this.usuario, this.$route.params.id);
      this.mostrarModalReview = true;
    },

    modificarReview() {
      if (!this.usuario) return;

      if (this.review.calificacion < 0 || this.review.calificacion > 10) {
        this.toast.error('La calificación debe estar entre 0 y 10.');
        return;
      }

      ApplicationControl.modificarReview(this.review);
      this.mostrarModalReview = false;
    },

    guardarEstado() {
      const select = document.getElementById('estado');
      this.modificarEstado(select.value);
    },

    modificarEstado(estatus) {
      ApplicationControl.modificarEstatus(this.usuario, this.$route.params.id, estatus);
    },

  // Función que elimine la ID del juego a la lista del Usuario
  async eliminarIdLista() {
      if (!this.usuario) return;

      if (await ApplicationControl.eliminarIdListaPersonal(this.usuario, this.$route.params.id)) {
        this.enListaExistente = false;
      }
    }
  },

  async mounted() {
    let id = this.$route.params.id; // Id de la ruta del URL, que se corresponde al del juego

    this.videojuego = await ApplicationControl.pedirJuego(id);
    this.calificacionJuego = await ApplicationControl.pedirCalificacion(id);

    if (this.usuario) {
      this.reviewExistente = await ApplicationControl.pedirVerificarReview(this.usuario, id);
      this.enListaExistente = await ApplicationControl.pedirVerificarJuegoLista(this.usuario, id);
    }

    this.review.nomUsuario = this.usuario;
    this.review.idJuego = id;
  },

  setup() {
    const authStore = useAuthStore();
    const toast = useToast();
    return { authStore, toast };
  }
};
</script>

<template>
  <article class="videojuego-detalle">
    <section class="videojuego-info">
      <!-- Encabezado del Videojuego -->
      <header class="videojuego-header">
        <h1>{{ videojuego.nombre }}</h1>
      </header>

      <!-- Tarjeta de Calificación Independiente -->
      <div class="calificacion-card">
        <div class="calificacion-circle">
          <span class="calificacion-num">{{ calificacionJuego }}</span>
          <span class="calificacion-text">/ 10</span>
        </div>
        <p class="calificacion-label">Calificación Global</p>
      </div>

      <!-- Información del Juego -->
      <section class="info-juego">
        <div class="info-card">
          <h2>Descripción</h2>
          <p class="videojuego-descripcion">{{ videojuego.descripcion }}</p>
        </div>

        <div class="info-card">
          <h2>Sinopsis</h2>
          <p class="videojuego-sinopsis">{{ videojuego.sinopsis }}</p>
        </div>

        <div class="info-details">
          <div class="detail-item">
            <span class="icon">📅</span>
            <span>Año de publicación: {{ videojuego.yearPublicacion }}</span>
          </div>

          <div class="detail-item">
            <span class="icon">🎮</span>
            <ul class="videojuego-generos">
              <li
                v-for="genero in videojuego.generos"
                :key="genero"
                class="genero-badge"
              >
                {{ genero }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Botón para agregar a la lista personal -->
      <button
        v-if="usuarioLogueado && !adminLogueado && !enListaExistente"
        @click="agregarIdLista"
        class="btn-agregar"
      >
        Agregar a tu Lista Personal
      </button>
      <p v-if="usuarioLogueado && !adminLogueado && enListaExistente">
        <em>Ya has agregado</em> este juego a tu lista!
      </p>

      <!-- Botón para eliminar la lista personal -->
      <button
        v-if="usuarioLogueado && !adminLogueado && enListaExistente"
        @click="eliminarIdLista"
        class="btn-eliminar"
      >
        Eliminar de tu Lista Personal
      </button>

      <!-- Selección de estado del videojuego -->
      <h3 v-if="enListaExistente && usuarioLogueado">Estatus del Videojuego:</h3>
      <select v-if="enListaExistente && usuarioLogueado"
      id="estado" @change="guardarEstado()">
          <option value="0">--Selecciona--</option>
          <option value="1">Sin jugar</option>
          <option value="2">Por jugar</option>
          <option value="3">Jugando</option>
          <option value="4">Finalizado</option>
          <option value="5">Completado 100%</option>
      </select>

      <div class="admin-options" v-if="usuarioLogueado && adminLogueado">
        <button
          @click="modificarVideojuego"
          class="btn-admin btn-modificar"
        >
          Modificar Videojuego
        </button>
        <button
          @click="mostrarModalEliminar = true"
          class="btn-admin btn-eliminar"
        >
          Eliminar Videojuego
        </button>

        <!-- Modal de confirmación -->
        <div v-if="mostrarModalEliminar" class="modal-overlay">
          <div class="modal-content">
            <h2>Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas <em>eliminar</em> este videojuego? Esta acción no se puede deshacer.</p>
            <div class="modal-buttons">
              <button @click="eliminarVideojuego" class="btn-confirmar">Sí, Eliminar</button>
              <button @click="mostrarModalEliminar = false" class="btn-cancelar">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección para agregar reseñas -->
    <div v-if="mostrarModalReview" class="modal-overlay">
      <div class="modal-content-review">
        <h2>Modificar Reseña</h2>
        <form @submit.prevent="modificarReview">
          <label for="mensaje">Mensaje:</label>
          <textarea v-model="review.mensaje" rows="4" required></textarea>

          <label for="calificacion">Calificación (1-10):</label>
          <input v-model.number="review.calificacion" type="number" min="1" max="10" required />

          <div class="modal-buttons-review">
            <button type="submit" class="btn-guardar">Guardar Cambios</button>
            <button @click="mostrarModalReview = false" type="button" class="btn-cancelar-review">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <section class="videojuego-reseñas">
      <hr />
      <div class="review-form-container">
        <form
          @submit.prevent="guardarReview"
          v-if="usuarioLogueado && !adminLogueado && !reviewExistente">
          <h2>Agregar Reseña</h2>
          <label for="mensaje">Mensaje:</label>
          <textarea
            v-model="review.mensaje"
            id="mensaje"
            rows="4"
            placeholder="Escribe tu reseña aquí..."
            required
          ></textarea>

          <label for="calificacion">Calificación (1-10):</label>
          <input
            v-model.number="review.calificacion"
            type="number"
            id="calificacion"
            min="1"
            max="10"
            required
          />

          <button type="submit" :disabled="reviewInvalido" class="submit-btn">
            Agregar Reseña
          </button>
        </form>

        <p v-if="reviewExistente"><em>Ya has reseñado</em> este juego.</p>
        <button
          @click="mostrarModificarReview" class="btn-modificar"
          v-if="usuarioLogueado && !adminLogueado && reviewExistente">
          Modificar reseña
        </button>

        <p v-if="adminLogueado">
          <em>El administrador</em> no debe reseñar
        </p>
        <p v-else-if="!usuarioLogueado">
          <em>Inicia sesión</em> para agregar una reseña.
        </p>
      </div>
      <ReviewsView />
    </section>
  </article>
</template>

<style scoped>
.videojuego-detalle {
  width: 80%;
  margin: 20px auto;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 25px;
  color: #333;
}

.videojuego-header {
  background-color: #359c61;
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  font-size: 1.4rem;
}

.calificacion-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.calificacion-circle {
  background: radial-gradient(circle, #fdd835, #f57f17);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
}

.calificacion-num {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
}

.calificacion-text {
  font-size: 1.2rem;
  color: #fff;
}

.calificacion-label {
  font-weight: bold;
  font-size: 1.1rem;
  color: #444;
}

.info-juego {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background-color: #f1f5f8;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.videojuego-descripcion,
.videojuego-sinopsis {
  line-height: 1.6;
  color: #555;
}

.info-details {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #eef5f1;
  padding: 10px;
  border-radius: 8px;
}

.videojuego-generos {
  display: flex;
  gap: 10px;
}

.genero-badge {
  display: flex;
  background-color: #d0f2e3;
  color: #359c61;
  border-radius: 5px;
  padding: 0.3rem 0.8rem;
  font-weight: bold;
}

.btn-agregar, .btn-eliminar {
  background-color: #359c61;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-agregar:hover, .btn-eliminar:hover {
  background-color: #2b7d4f;
}

#estado {
  padding: 10px;
  font-size: 16px;
}

.review-form-container {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h2 {
  color: #2b7d4f;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

textarea {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;
  resize: vertical;
}

input[type='number'] {
  max-width: 80px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.submit-btn {
  background-color: #359c61;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:enabled {
  background-color: #2b7d4f;
}

.submit-btn:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}

p {
  margin-top: 1rem;
  color: #555;
}

em {
  font-weight: bold;
  color: #d9534f;
}

hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 2rem 0;
}

/* Estilo para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
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

/* Contenedor principal de opciones del administrador */
.admin-options {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  padding: 10px;
}

/* Botones generales */
.btn-admin {
  height: 50px;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-weight: bold;
}

/* Botón para editar */
.btn-modificar {
  margin-top: 8px;
  background-color: #3498db;
  color: white;
}

.btn-modificar:hover {
  background-color: #1e73b7;
}

/* Botón para eliminar */
.btn-eliminar {
  background-color: #ff4b5c;
  color: white;
}

.btn-eliminar:hover {
  background-color: #d9534f;
}

/* Modal Modificar Review*/
.modal-content-review {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  width: 90%;
}

.modal-buttons-review {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Botón Guardar */
.btn-guardar {
  padding: 8px 16px;
  background-color: #359c61;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.btn-guardar:hover {
  background-color: #2b7d4f;
}

/* Botón Cancelar */
.btn-cancelar-review {
  padding: 8px 16px;
  background-color: #f4f4f4;
  color: #333;
  border-radius: 5px;
  border: 1px solid #ddd;
  cursor: pointer;
}

.btn-cancelar-review:hover {
  background-color: #ddd;
}
</style>
