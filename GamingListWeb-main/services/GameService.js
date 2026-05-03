import ApplicationControl from '../router/ApplicationControl.js'

class GameService {
  #baseUrl;

  constructor() {
    this.#baseUrl = 'http://localhost:8080/api/videojuegos'
  }

  async solicitarCargarVideojuegos(personal, usuario) {
    try {
      let response;
      if (!personal) {
        // Cargar la lista general de videojuegos
        response = await fetch(`${this.#baseUrl}/consultar`, {
          method: 'GET',
          mode: 'cors',
          headers: { Accept: 'application/json' },
        });
      } else {
        // Cargar la lista de videojuegos específica del usuario
        let juegos = await ApplicationControl.pedirListaPersonal(usuario);

        let idsJuegos = [];
        for (let ind in juegos) {
          idsJuegos.push(juegos[ind].idJuego);
        }

        response = await fetch(`${this.#baseUrl}/consultar/usuario`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(idsJuegos),
        });
      }
      if (response.ok) {
        const videojuegos = await response.json();

        // Obtener calificación por juego y añadirla al objeto de cada juego
        return await Promise.all(
          videojuegos.map(async (videojuego) => {
            const calificacion = await ApplicationControl.pedirCalificacion(videojuego.id);
            return { ...videojuego, calificacion };
          })
        );
      }
    } catch (error) {
      console.error('Error en la función cargarVideojuegos:', error);
      return [];
    }
  }

  async solicitarCargarJuego(idJuego) {
    try {
      const response = await fetch(`${this.#baseUrl}/consultar/${idJuego}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        return null;
      }
    } catch (error) {
      console.error('Error al cargar el videojuego:', error);
      return null;
    }
  }

  async solicitarConsultarId() {
    try {
      const response = await fetch(`${this.#baseUrl}/consultar/id`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error consultando ID', error);
      throw error;
    }
  }

  async solicitarAgregarVideojuego(videojuego) {
    try {
      const response = await fetch(`${this.#baseUrl}/agregar`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videojuego),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error agregando juego:', error);
      throw error;
    }
  }

  async solicitarEliminarVideojuego(idJuego) {
    try {
      if (!await ApplicationControl.eliminarReviewsPorId(idJuego)) {
         return false;
      }

      if (!await ApplicationControl.eliminarIdListas(idJuego)) {
        return false;
      }

      const response = await fetch(`${this.#baseUrl}/eliminar/${idJuego}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error eliminando juego:', error);
      throw error;
    }
  }

  async solicitarModificarVideojuego(videojuego) {
    try {
      await fetch(`${this.#baseUrl}/modificar`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videojuego),
      })
    } catch (error) {
      console.error('Error modificando juego:', error);
      throw error;
    }
  }
}

export default GameService;
