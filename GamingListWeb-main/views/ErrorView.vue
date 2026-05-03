<script>

import ApplicationControl from '../router/ApplicationControl.js'

export default {
  name: 'NotFoundView',
  methods: {
    volverInicio() {
      ApplicationControl.cambiarVista('home');
    },
    vistaAnterior() {
      ApplicationControl.volverVista();
    }
  }
};
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="not-found-title">404</h1>
      <p class="not-found-message">Oops! El recurso que estás buscando no existe o no está disponible.</p>
      <div class="not-found-buttons">
        <button @click="volverInicio" class="btn">Volver al inicio</button>
        <button @click="vistaAnterior" class="btn-outline">Volver atrás</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  width: 90%;
  height: 600px;
  display: flex;
  justify-content: center;
  background-color: #f4f4f4;
  border-radius: 10px;
}

.not-found-content {
  text-align: center;
  width: 90%;
  padding: 20px;
}

.not-found-title {
  font-size: 10rem;
  color: #ff4b5c;
  margin-bottom: 20px;
}

.not-found-message {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 30px;
}

.not-found-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  padding: 10px 20px;
  background-color: #359c61;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
}

.btn:hover {
  background-color: #387a55;
}

.btn-outline {
  padding: 10px 20px;
  background-color: transparent;
  color: #359c61;
  border: 2px solid #359c61;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
}

.btn-outline:hover {
  background-color: #359c61;
  color: white;
}
</style>
