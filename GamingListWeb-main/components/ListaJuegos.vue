<script>
import { useAuthStore } from '../stores/auth.js';
import ApplicationControl from '../router/ApplicationControl.js'

export default {
  name: 'ListaJuegos',

  props: {
    personal: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      color: '',
      juegosEstatus: [],
      videojuegos: [],
      videojuegosFiltrados: [],
      busqueda: '',
      filtroGenero: '',
      generosDisponibles: ['Casual', 'Aventura', 'Acción', 'Shooter', 'RPG', 'Estrategia', 'Roguelike', 'Plataformas',
        'Carreras', 'Sandbox', 'Supervivencia', 'Mundo Abierto', 'Puzzles', 'Multijugador'],
    };
  },

  computed: {
    usuarioLogueado() {
      return this.authStore.usuarioLogueado;
    },
    usuario() {
      return this.authStore.usuario;
    },
  },

  methods: {
    retornarEstatus(id) {
      let idEstatus = this.retornarJuegoEstatus(id);
      let estatus = "";
      switch (idEstatus) {
        case 1: {
          estatus = "Sin jugar";
          break;
        }
        case 2: {
          estatus = "Por jugar";
          break;
        }
        case 3: {
          estatus = "Jugando";
          break;
        }
        case 4: {
          estatus = "Finalizado";
          break;
        }
        case 5: {
          estatus = "Completado 100%";
          break;
        }
        default: {
          estatus = " - ";
        }
      }
      return estatus;
    },

    retornarJuegoEstatus(id) {
      for (let ind in this.juegosEstatus) {
        let objetoEstatus = this.juegosEstatus[ind];
        if (objetoEstatus.idJuego === id) {
          return objetoEstatus.estatus;
        }
      }
      return null;
    },

    cambiarColorEstatus(id) {
      let idEstatus = this.retornarJuegoEstatus(id);
      let color;
      switch (idEstatus) {
        case 1: {
          color = "rojo"
          break;
        }
        case 2: {
          color = "naranja"
          break;
        }
        case 3: {
          color = "amarillo";
          break;
        }
        case 4: {
          color = "azul";
          break;
        }
        case 5: {
          color = "violeta";
          break;
        }
        default: {
          color = "gris";
        }
      }
      return color;
    },

    verDetallesJuego(idJuego) {
      ApplicationControl.cambiarVista('detalles-juego', {id: idJuego});
    },

    filtrarVideojuegos() {
      const textoBusqueda = this.busqueda.toLowerCase();
      this.videojuegosFiltrados = this.videojuegos.filter((juego) => {
        const coincideNombre = juego.nombre.toLowerCase().includes(textoBusqueda);
        const coincideGenero = this.filtroGenero ? juego.generos.includes(this.filtroGenero) : true;
        return coincideNombre && coincideGenero;
      });
    },

    aplicarFiltroGenero(genero) {
      this.filtroGenero = genero;
      this.filtrarVideojuegos();
    },

    limpiarFiltros() {
      this.busqueda = '';
      this.filtroGenero = '';
      this.videojuegosFiltrados = this.videojuegos;
    },
  },

  async mounted() {
    this.juegosEstatus = null;

    if (this.personal && !this.usuario) {
      console.warn('Usuario no disponible. Asegurar que el usuario está autenticado.');
      ApplicationControl.cambiarVista('error');
      return;
    }

    if (this.personal && this.usuario) {
      this.juegosEstatus = await ApplicationControl.pedirListaPersonal(this.usuario);
    }

    try {
      const data = await ApplicationControl.pedirVideojuegos(this.personal, this.usuario);
      if (data && Array.isArray(data)) {
        this.videojuegos = data;
      } else {
        console.warn('No se pudieron cargar los videojuegos o el formato de datos es incorrecto');
      }
    } catch (error) {
      console.error('Error en mounted:', error);
    }
    this.videojuegosFiltrados = this.videojuegos;
  },

  setup() {
    const authStore = useAuthStore();
    return { authStore };
  }
};
</script>

<template>
  <section class="controles">
    <input
      type="text"
      v-model="busqueda"
      @input="filtrarVideojuegos"
      placeholder="Buscar por nombre..."
      class="barra-busqueda"
    />

    <div class="filtros-genero">
      <div class="filtros">
        <button class="boton-filtro"
                v-for="genero in generosDisponibles"
                :key="genero"
                @click="aplicarFiltroGenero(genero)"
                :class="{ activo: filtroGenero === genero }"
        >
          {{ genero }}
        </button>
      </div>
      <button @click="limpiarFiltros" id="limpia">Limpiar Filtro</button>
    </div>
  </section>
  <ul class="lista-juegos">
    <li
      v-for="videojuego in videojuegosFiltrados"
      :key="videojuego.id"
      class="juego"
      @click="verDetallesJuego(videojuego.id)"
    >
      <header>
        <h2>{{ videojuego.nombre }}</h2>
        <h3>Calificación: {{ videojuego.calificacion !== null ? videojuego.calificacion : 'No disponible' }}/10</h3>
        <h4 v-if="juegosEstatus">| Estatus: <span :class="color = cambiarColorEstatus(videojuego.id)" id="estatus">{{ retornarEstatus(videojuego.id) }}</span></h4>
      </header>
      <main>
        <ul class="generos">
          <li v-for="genero in videojuego.generos" :key="genero" class="genero">
            {{ genero }}
          </li>
        </ul>
        <p>{{ videojuego.descripcion }}</p>
      </main>
    </li>
  </ul>
</template>

<style scoped>
h4 {
  margin-left: 0.3rem;
  font-size: 1rem;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.controles {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.barra-busqueda {
  width: 75%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.filtros-genero {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  max-width: 1200px;
}

.filtros {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filtros-genero button {
  padding: 0.5rem 1rem;
  border: 3px solid #359c61;
  border-radius: 5px;
  background-color: #e0f4eb;
  color: #359c61;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
}

.filtros-genero button.activo {
  background-color: #359c61;
  color: white;
}

.boton-filtro:hover {
  background-color: #359c61;
  color: white;
}

#limpia {
  margin-left: 2rem;
  color: #15c6ac;
  border: 3px solid #15c6ac;
  max-height: 43px;
}

#limpia:hover {
  background-color: #15c6ac;
  color: white;
}

.lista-juegos {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 25px;
  padding: 0;
  list-style: none;
  margin: 20px 0;
}

.juego {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.juego:hover {
  transform: translateY(-3%);
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
}

.generos {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.genero {
  display: flex;
  background-color: #e0f4eb;
  color: #359c61;
  padding: 0.3rem 0.5rem;
  border-radius: 5px;
  font-size: 0.9rem;
}

p {
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.4;
  color: #333;
}

#estatus.rojo {
  color: #ff4b5c;
}

#estatus.naranja {
  color: #fd8241;
}

#estatus.amarillo {
  color: #ffee56;
}

#estatus.azul {
  color: #3498db;
}

#estatus.violeta {
  color: #ad56ff;
}

@media (max-width: 768px) {
  .lista-juegos {
    grid-template-columns: 1fr;
  }
}
</style>

