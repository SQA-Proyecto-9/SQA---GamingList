
class ReviewService {
  #baseUrl

  constructor() {
    this.#baseUrl = 'http://localhost:8080/api/reviews'
  }

  async solicitarCargarReviews(idJuego) {
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
      }
    } catch (error) {
      console.error('Error al cargar las reseñas:', error);
      return [];
    }
  }

  async solicitarAgregarReview(reviewData) {
    try {
      const response = await fetch(`${this.#baseUrl}/agregar`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      })
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error al agregar la reseña:', error);
      return null;
    }
  }

  async solicitarCargarCalificacion(idJuego) {
    try {
      const response = await fetch(`${this.#baseUrl}/consultar/calificacion/${idJuego}`, {
        method: 'GET',
        mode: 'cors',
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error al cargar calificación:', error);
      return null;
    }
  }

  async solicitarVerificarReview(usuario, idJuego) {
    try {
      const response = await fetch(`${this.#baseUrl}/validar/${usuario}/${idJuego}`, {
        method: 'GET',
        mode: 'cors',
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error al verificar reseña existente:', error);
      return false;
    }
  }

  async solicitarReviewPorUsuario(usuario, idJuego) {
    try {
      const response = await fetch(`${this.#baseUrl}/consultar/${usuario}/${idJuego}`, {
        method: 'GET',
        mode: 'cors',
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error al verificar reseña existente:', error);
      return false;
    }
  }

  async solicitarEliminarReviewsPorId(idJuego) {
    try {
      const response = await fetch(`${this.#baseUrl}/eliminar/${idJuego}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: { Accept: 'application/json'},
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error al eliminar las reseñas:', error);
      return false;
    }
  }

  async solicitarEliminarReviewUser(usuario, idJuego) {
    try {
      const response = await fetch(`${this.#baseUrl}/eliminar/${usuario}/${idJuego}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: { Accept: 'application/json'},
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error al eliminar la reseña:', error);
      return false;
    }
  }

  async solicitarModificarReview(reviewData) {
    try {
      await fetch(`${this.#baseUrl}/modificar`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })
    } catch (error) {
      console.error('Error modificando la review:', error);
      throw error;
    }
  }
}

export default ReviewService;
