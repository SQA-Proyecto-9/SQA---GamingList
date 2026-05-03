import GameService from '../services/GameService.js';
import UserService from '../services/UserService.js'
import ReviewService from '../services/ReviewService.js'

class ApplicationControl {
  // Declarando los atributos como privados
  #routerInstance;
  #toastInstance;
  #gameService;
  #userService;
  #reviewService;

  constructor() {
    this.#routerInstance = null;
    this.#toastInstance = null;
    this.#gameService = new GameService();
    this.#userService = new UserService();
    this.#reviewService = new ReviewService();
  }

  setToast(toast) {
    this.#toastInstance = toast;
  }

  setRouter(router) {
    this.#routerInstance = router;
  }

  cambiarVista(nombreRuta, parametro) {
    this.#routerInstance.push({ name: nombreRuta, params: parametro });
  }

  volverVista() {
    this.#routerInstance.back()
  }

  // ----------- GAME SERVICE ------------------------------------------------------------------------------------------
  async pedirVideojuegos(personal, username) {
    try {
      return await this.#gameService.solicitarCargarVideojuegos(personal, username);
    } catch (error) {
      console.error('Hubo un error cargando los videojuegos:', error);
      this.#toastInstance.error('Hubo un problema cargando los videojuegos');
    }
  }

  async pedirJuego(id) {
    try {
      let videojuego = await this.#gameService.solicitarCargarJuego(id);
      if (videojuego != null) {
        return videojuego;
      } else {
        this.cambiarVista('error');
        return null;
      }
    } catch (error) {
      console.error('Hubo un error cargando el videojuego:', error);
      this.cambiarVista('error');
      return null;
    }
  }

  async pedirId() {
    try {
      return await this.#gameService.solicitarConsultarId();
    }
    catch (error) {
      console.error('Error recuperando la siguiente ID: ', error);
    }
  }

  async agregarJuego(videojuegoData) {
    try {
      await this.#gameService.solicitarAgregarVideojuego(videojuegoData);
      this.#toastInstance.success('Videojuego agregado con éxito!');
    } catch (error) {
      console.error('Error agregando juego:', error);
      this.#toastInstance.error('Hubo un error al agregar el Videojuego');
    }
  }

  async eliminarJuego(id) {
    try {
      return await this.#gameService.solicitarEliminarVideojuego(id);
    } catch(error) {
      console.error('Error eliminando juego:', error);
      return false;
    }
  }

  async modificarJuego(videojuegoData) {
    try {
      await this.#gameService.solicitarModificarVideojuego(videojuegoData);
      this.#toastInstance.success('Videojuego modificado con éxito!');
    } catch (error) {
      console.error('Error modificando juego:', error);
      this.#toastInstance.error('Hubo un error al modificar el Videojuego');
    }
  }
  // -------------------------------------------------------------------------------------------------------------------

  // --------- USER SERVICE --------------------------------------------------------------------------------------------
  async pedirListaPersonal(username) {
    try {
       return await this.#userService.solicitarConsultarLista(username);
    } catch (error) {
      console.error('Error cargando la lista personal:', error);
    }
  }

  async agregarIdListaPersonal(username, id) {
    try {
      let juegoAgregado = await this.#userService.solicitarAgregarIdLista(username, id);
      if (juegoAgregado) {
        this.#toastInstance.success('Videojuego agregado a la lista personal!');
        return true;
      } else {
        this.#toastInstance.error('Hubo un error agregando a la lista personal');
        return false;
      }
    } catch (error) {
      console.error('Error agregando id a la lista personal:', error);
      this.#toastInstance.error('Hubo un error agregando a la lista personal');
      return false;
    }
  }

  async eliminarIdListaPersonal(username, id) {
    try {
      let juegoEliminado = await this.#userService.solicitarEliminarIdLista(username, id);
      if (juegoEliminado) {
        this.#toastInstance.success('Videojuego eliminado de la lista personal!');
        return true;
      } else {
        this.#toastInstance.error('Hubo un error eliminando de la lista personal');
        return false;
      }
    } catch (error) {
      console.error('Error eliminando id de la lista personal:', error);
      this.#toastInstance.error('Hubo un error eliminando de la lista personal');
      return false;
    }
  }

  async pedirVerificarJuegoLista(username, id) {
    try {
      return await this.#userService.solicitarVerificarVideojuegoLista(username, id);
    } catch (error) {
      console.error('Error verificando juego en la lista personal:', error);
    }
  }

  async loginUsuario(credenciales) {
    try {
      return await this.#userService.solicitarLogin(credenciales);
    } catch (error) {
      console.error('Error iniciando sesión:', error);
      this.#toastInstance.error('Hubo un problema iniciando sesión');
    }
  }

  async registrarUsuario(username, clave) {
    try {
      let registroExitoso = await this.#userService.solicitarRegistrar({ username, clave });
      if (registroExitoso) {
        this.cambiarVista('login');
        this.#toastInstance.success('Te has registrado exitosamente! Ahora, Inicia Sesión');
      } else {
        this.#toastInstance.error('Ya existe este usuario');
      }
    } catch (error) {
      console.error('Error registrando usuario:', error);
      this.#toastInstance.error('Hubo un problema con el registro');
    }
  }

  async eliminarIdListas(id) {
    try {
      return await this.#userService.solicitarEliminarIdListas(id);
    } catch(error) {
      console.error('Error al eliminar la id de las listas:', error);
      return false;
    }
  }

  async modificarEstatus(username, id, estatus) {
    try {
      await this.#userService.solicitarModificarEstatus(username, id, estatus);
      this.#toastInstance.success('Estatus modificada con éxito!');
    } catch (error) {
      console.error('Error modificando estatus:', error);
      this.#toastInstance.error('Hubo un error al modificar el estatus');
    }
  }
  // -------------------------------------------------------------------------------------------------------------------

  // --------- REVIEW SERVICE ------------------------------------------------------------------------------------------
  async pedirReviews(id) {
    try {
      return await this.#reviewService.solicitarCargarReviews(id);
    } catch (error) {
      console.error('Error recuperando las reseñas:', error);
    }
  }

  async agregarReview(reviewData) {
    try {
      let nuevaReview = await this.#reviewService.solicitarAgregarReview(reviewData);
      if (nuevaReview) {
        this.#toastInstance.success('Reseña agregado exitosamente!');
        return true;
      } else {
        this.#toastInstance.error('Hubo un problema al guardar la reseña. Intente de nuevo');
        return false;
      }
    } catch (error) {
      console.error('Error agregando la reseña:', error);
      return false;
    }
  }

  async pedirCalificacion(id) {
    try {
      return await this.#reviewService.solicitarCargarCalificacion(id);
    } catch (error) {
      console.error('Error recuperando la calificacion:', error);
    }
  }

  async pedirVerificarReview(username, id) {
    try {
      return await this.#reviewService.solicitarVerificarReview(username, id);
    } catch (error) {
      console.error('Error verificando la existencia de reseña:', error);
    }
  }

  async pedirReviewPorUsuario(username, id) {
    try {
      return await this.#reviewService.solicitarReviewPorUsuario(username, id);
    } catch (error) {
      console.error('Error recuperando la reseña por usuario:', error);
    }
  }

  async eliminarReviewsPorId(id) {
    try {
      return await this.#reviewService.solicitarEliminarReviewsPorId(id);
    } catch (error) {
      console.error('Error eliminado reseñas:', error);
      return false;
    }
  }

  async eliminarReviewUser(username, id) {
    try {
      return await this.#reviewService.solicitarEliminarReviewUser(username, id);
    } catch (error) {
      console.error('Error eliminando la reseña:', error);
      return false;
    }
  }

  async modificarReview(reviewData) {
    try {
      await this.#reviewService.solicitarModificarReview(reviewData);
      this.#toastInstance.success('Reseña modificada con éxito!');
    } catch (error) {
      console.error('Error modificando reseña:', error);
      this.#toastInstance.error('Hubo un error al modificar la reseña');
    }
  }
  // -------------------------------------------------------------------------------------------------------------------
}

export default new ApplicationControl();
