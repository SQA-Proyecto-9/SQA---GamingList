<script>
import ApplicationControl from '../router/ApplicationControl.js'

export default {
  methods: {
    inicioSesion() {
      ApplicationControl.cambiarVista('login');
    },
    registrarse() {
      ApplicationControl.cambiarVista('register');
    }
  }
};
</script>

<template>
  <div class="home">
    <section class="intro">
      <h1>Bienvenido a Gaming List</h1>
      <p>¡Descubre las últimas reseñas y calificaciones de tus juegos favoritos!</p>
    </section>

    <div class="buttons-container">
      <button @click="inicioSesion" class="btn iniciar-sesion">Iniciar Sesión</button>
      <button @click="registrarse" class="btn registrarse">Registrarse</button>
    </div>
    <hr />
    <section class="features">
      <h2>Explora nuestras funcionalidades:</h2>
      <ul class="features-list">
        <li>✅ Reseñas detalladas por usuarios</li>
        <li>⭐ Calificaciones globales y personales</li>
        <li>🎮 Catálogo extenso de videojuegos</li>
        <li>🔍 Búsquedas y filtros por género</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.home {
  width: 75%;
  border-radius: 10px;
  border-width: 3px;
  border-style: solid;
  border-color: #359c61;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(to bottom, #f0f4f8, #e2ecef);
}

.intro {
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #359c61;
}

h2 {
  color: #359c61;
}

p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #555;
}

.buttons-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 2rem;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s ease-in-out;
}

.iniciar-sesion {
  background-color: #359c61;
  color: white;
}

.registrarse {
  background-color: #2b7d4f;
  color: white;
}

.btn:hover {
  transform: scale(1.05);
}

hr {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #555;
}

.features {
  margin-bottom: 3rem;
}

.features h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.features-list {
  list-style: none;
  padding: 0;
}

.features-list li {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  color: #555;
}
</style>
