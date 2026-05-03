
class UserService {
  #baseUrl;

  constructor() {
    this.#baseUrl = 'http://localhost:8080/api/auth';
  }

  async solicitarConsultarLista(usuario) {
    try {
      const response = await fetch(`${this.#baseUrl}/consultar/${usuario}/videojuegos`, {
        method: 'GET',
        mode: 'cors',
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error cargando la lista personal:', error);
    }
  }

  async solicitarAgregarIdLista(usuario, idJuego) {
    try {
      const response = await fetch(`${this.#baseUrl}/agregar/${usuario}/${idJuego}`, {
        method: 'POST',
        mode: 'cors',
      });
      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.error('Error al agregar a la lista personal:', error);
      return false;
    }
  }

  async solicitarEliminarIdLista(usuario, idJuego) {
    try {
      const response = await fetch(`${this.#baseUrl}/eliminar/${usuario}/${idJuego}`, {
        method: 'DELETE',
        mode: 'cors',
      });
      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.error('Error al eliminar de la lista personal:', error);
      return false;
    }
  }

  async solicitarVerificarVideojuegoLista(usuario, idJuego) {
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
      console.error('Error al verificar en lista:', error);
      return false;
    }
  }

  async solicitarLogin(credenciales) {
    try {
      const response = await fetch(`${this.#baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales),
      })
      if (response.ok) {
        return await response.json();
      } else if (response.status === 401) {
        return null;
      }
    } catch (error) {
      console.error('Error en login:', error)
      return null;
    }
  }

  async solicitarRegistrar(userData) {
    try {
      const response = await fetch(`${this.#baseUrl}/register`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      return false;
    }
  }

  async solicitarEliminarIdListas(idJuego) {
    try {
      const response = await fetch(`${this.#baseUrl}/eliminar/${idJuego}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error eliminando id de listas:', error);
      return false;
    }
  }

  async solicitarModificarEstatus(usuario, idJuego, estatus) {
    try {
      await fetch(`${this.#baseUrl}/modificar/${usuario}/${idJuego}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(estatus),
      })
    } catch (error) {
      console.error('Error modificando estatus:', error);
      throw error;
    }
  }
}

export default UserService;
