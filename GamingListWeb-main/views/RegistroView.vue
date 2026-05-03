<script>
import { ref } from 'vue';
import ApplicationControl from '../router/ApplicationControl.js'

export default {
  setup() {
    const username = ref('');
    const clave = ref('');
    const confirmClave = ref('');
    const errorMessage = ref('');

    // Manejar el envío de registro
    const handleRegister = async () => {
      errorMessage.value = '';

      if (username.value.length > 15) {
        errorMessage.value = "El username debe tener máximo 15 caracteres";
        return;
      }

      if (clave.value.length < 8 || clave.value.length > 15) {
        errorMessage.value = "La clave debe estar entre 8 y 15 caracteres";
        return;
      }

      if (clave.value !== confirmClave.value) {
        errorMessage.value = 'Las contraseñas no coinciden.';
        return;
      }

      await ApplicationControl.registrarUsuario(username.value, confirmClave.value);
    };

    return { username, clave, confirmClave, handleRegister, errorMessage };
  },
};
</script>

<template>
  <div class="register-container">
    <h1>Registrarse</h1>
    <form @submit.prevent="handleRegister">
      <label for="username">Nombre de Usuario</label>
      <input v-model="username" type="text" id="username" required />

      <label for="clave">Contraseña</label>
      <input v-model="clave" type="password" id="clave" required />

      <label for="confirmClave">Confirmar Contraseña</label>
      <input v-model="confirmClave" type="password" id="confirmClave" required />

      <button type="submit">Registrarse</button>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #359c61;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  font-weight: bold;
}

input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

button {
  padding: 10px;
  background-color: #359c61;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2b7d4f;
}

.error-message {
  color: red;
  font-weight: bold;
  text-align: center;
}
</style>
