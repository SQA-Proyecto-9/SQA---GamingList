<script>
import { useAuthStore } from '../stores/auth.js';
import { useToast } from 'vue-toastification';
import { ref } from 'vue';
import ApplicationControl from '../router/ApplicationControl.js'

export default {
  methods:{
    registrarse() {
      ApplicationControl.cambiarVista('register');
    }
  },

  setup() {
    const authStore = useAuthStore();
    const toast = useToast();

    const username = ref('');
    const clave = ref('');
    const errorMessage = ref('');

    // Manejar formulario de inicio de sesión
    const manejarLogin = async () => {
      errorMessage.value = '';
      try {
        await authStore.login({
          username: username.value,
          clave: clave.value,
        });

        if (authStore.usuarioLogueado) {
          ApplicationControl.cambiarVista('juegos');
          toast.success("Haz logueado exitosamente!");
        } else {
          errorMessage.value = 'Error de autenticación. Verifique sus credenciales.';
        }
      } catch (error) {
        errorMessage.value = 'Error en autenticación.';
        console.error('Error iniciando sesión:', error);
      }
    };

    return { username, clave, manejarLogin, errorMessage };
  },
};
</script>

<template>
  <div class="login-container">
    <h1>Iniciar Sesión</h1>
    <form @submit.prevent="manejarLogin">
      <label for="username">Nombre de Usuario</label>
      <input v-model="username" type="text" id="username" required />

      <label for="clave">Contraseña</label>
      <input v-model="clave" type="password" id="clave" required />

      <button type="submit">Iniciar Sesión</button>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
  <button @click="registrarse" class="registrar">Soy nuevo</button>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.registrar{
  margin-top: 20px;
  width: 26%;
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
