<script>
import { useToast } from 'vue-toastification'
import ApplicationControl from '../router/ApplicationControl.js'

export default {
  name: 'AgregarVideojuegoView',
  props: {
    id: {
      type: Number,
      required: false
    }
  },

  data() {
    return {
      videojuego: {
        id: 0,
        nombre: '',
        descripcion: '',
        sinopsis: '',
        yearPublicacion: 0,
        generos: [],
      },
      generosDisponibles: ['Casual', 'Aventura', 'Acción', 'Shooter', 'RPG', 'Estrategia', 'Roguelike', 'Plataformas',
        'Carreras', 'Sandbox', 'Supervivencia', 'Mundo Abierto', 'Puzzles', 'Multijugador'],
    };
  },

  computed: {
    formInvalido() {
      return (
        this.videojuego.nombre.length === 0 ||
        this.videojuego.descripcion.length === 0 ||
        this.videojuego.sinopsis.length === 0 ||
        this.videojuego.yearPublicacion < 1950 || this.videojuego.yearPublicacion > 2099 ||
        this.videojuego.generos.length === 0 ||
        this.videojuego.nombre.length > 70 ||
        this.videojuego.descripcion.length > 170 ||
        this.videojuego.sinopsis.length > 400 ||
        this.videojuego.generos.length > 3
      );
    },
  },

  methods: {
    validarGeneros() {
      if (this.videojuego.generos.length > 3) {
        this.videojuego.generos.pop();
      }
    },

    cancelarModificar() {
      ApplicationControl.cambiarVista('detalles-juego', {id: this.id});
    },

    resetFormulario() {
      this.videojuego = {
        id: 0,
        nombre: '',
        descripcion: '',
        sinopsis: '',
        yearPublicacion: '',
        generos: [],
      }
    },

    async guardarVideojuego() {
      // Primero consulta cuál es la id a colocar
      this.videojuego.id = await ApplicationControl.pedirId();
      await ApplicationControl.agregarJuego(this.videojuego);
      this.resetFormulario();
    },

    async modificarVideojuego() {
      await ApplicationControl.modificarJuego(this.videojuego);
      this.resetFormulario();
      ApplicationControl.cambiarVista('detalles-juego', {id: this.id});
    }
  },

  async mounted() {
    if (this.id) {
      this.videojuego = await ApplicationControl.pedirJuego(this.id);
    }
  },

  setup() {
    const toast = useToast();
    return { toast };
  }
};
</script>

<template>
  <div class="formulario">
    <h1 v-if="!this.id">Añadir Videojuego</h1>
    <h1 v-else>Modificar Videojuego</h1>
    <hr />
    <div>
      <div class="contenido-rellenar">
        <main>
          <label for="nombre">Título (máx. 70 caracteres):</label>
          <input
            v-model="videojuego.nombre"
            maxlength="70"
            type="text"
            id="nombre"
            name="nombre"
            required
          />
          <span v-if="videojuego.nombre.length > 70" class="error">El nombre es demasiado largo</span>

          <label for="descripcion">Descripción (máx. 170 caracteres):</label>
          <textarea
            v-model="videojuego.descripcion"
            maxlength="170"
            rows="3"
            placeholder="Breve descripción del juego"
            id="descripcion"
            name="descripcion"
            required
          ></textarea>
          <span v-if="videojuego.descripcion.length > 170" class="error">La descripción es demasiado larga</span>

          <label for="sinopsis">Sinopsis:</label>
          <textarea
            v-model="videojuego.sinopsis"
            maxlength="400"
            rows="7"
            placeholder="Sinopsis sobre el juego"
            id="sinopsis"
            name="sinopsis"
            required
          ></textarea>
          <span v-if="videojuego.sinopsis.length > 400" class="error">Sinopsis excesivamente larga</span>

          <label for="date">Año de publicación:</label>
          <input
            v-model.number="videojuego.yearPublicacion"
            type="number"
            id="date"
            name="date"
            min="1950"
            max="2099"
            required
          />
        </main>
        <aside>
          <label for="generos">Géneros:</label>
          <select
            v-model="videojuego.generos"
            @change="validarGeneros"
            id="generos"
            name="generos"
            multiple
            required
          >
            <option v-for="genero in generosDisponibles" :key="genero" :value="genero">
              {{ genero }}
            </option>
          </select>
          <small v-if="videojuego.generos.length <= 3">Selecciona hasta 3 géneros.</small>
          <span v-if="videojuego.generos.length > 3" class="error">Solo puedes seleccionar hasta 3 géneros</span>
        </aside>
      </div>
      <button v-if="!this.id" @click="guardarVideojuego" :disabled="formInvalido" class="submit-btn">Agregar</button>
      <div  v-if="this.id" class="opciones-modificar">
        <button @click="modificarVideojuego" :disabled="formInvalido" class="modificar-btn">Modificar</button>
        <button @click="cancelarModificar" class="volver-btn">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: #359c61;
}

.formulario {
  margin: 0 auto;
  padding: 20px;
  border: 3px solid #359c61;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  width: 70%;
}

.contenido-rellenar {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 20px;
}

main {
  display: flex;
  flex-direction: column;
}

aside {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
  padding: 10px;
  background-color: #eef5f1;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

label {
  color: #333;
  font-weight: bold;
  margin: 10px 0 5px;
}

input[type="text"],
input[type="number"],
textarea,
select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

textarea {
  resize: none;
}

select {
  height: 80%;
}

button {
  background-color: #359c61;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #2b7d4f;
}

.error {
  color: #d9534f;
  font-weight: bold;
}

hr {
  margin-bottom: 20px;
}

#nombre, #descripcion, #sinopsis {
  flex-wrap: wrap;
  width: 80%;
}

small {
  color: #444;
}

.opciones-modificar {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.modificar-btn {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease; /* Transición suave */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra ligera */
}

.modificar-btn:hover:enabled {
  background-color: #1e73b7;
}

.modificar-btn:disabled {
  background-color: #b0b0b0;
  cursor: not-allowed;
  box-shadow: none;
}

.volver-btn {
  padding: 10px 20px;
  background-color: white;
  color: #359c61;
  font-size: 1rem;
  font-weight: bold;
  border: 2px solid #359c61;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.volver-btn:hover {
  background-color: #2b7d4f;
  color: white;
}
</style>
