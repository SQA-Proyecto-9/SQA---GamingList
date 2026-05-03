import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CatalogoVideojuegosView from '../views/CatalogoVideojuegosView.vue'
import ConsultaVideojuegoView from '../views/ConsultaVideojuegoView.vue'
import AgregarVideojuegoView from '../views/AgregarVideojuegoView.vue'
import LogInView from '../views/LogInView.vue'
import RegistroView from '../views/RegistroView.vue'
import PerfilView from '../views/PerfilView.vue'
import { useAuthStore } from '../stores/auth.js'
import { useToast } from 'vue-toastification'
import ErrorView from '../views/ErrorView.vue'

const toast = useToast();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/videojuegos',
      name: 'juegos',
      component: CatalogoVideojuegosView
    },
    {
      path: '/videojuegos/agregar',
      name: 'agregar-videojuego',
      component: AgregarVideojuegoView
    },
    {
      path: '/videojuegos/editar/:id',
      name: 'editar-videojuego',
      component: AgregarVideojuegoView,
      props: true,
    },
    {
      path: '/videojuegos/:id',
      name: 'detalles-juego',
      component: ConsultaVideojuegoView
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: PerfilView
    },
    {
      path: '/login',
      name: 'login',
      component: LogInView
    },
    {
      path: '/register',
      name: 'register',
      component: RegistroView
    },
    {
      path:'/error',
      name: 'error',
      component: ErrorView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Lista de rutas que requieren autenticación
  const rutasProtegidas = ['perfil'];
  const rutaAdmin = 'agregar-videojuego';

  if (rutasProtegidas.includes(to.name) && authStore.adminLogueado) {
    toast.info("El administrador no posee perfil.")
    next({ name: from.name });
  }
  else if (rutaAdmin === to.name && !authStore.adminLogueado) {
    alert("Solo el administrador tiene permiso para entrar aquí");
    next({ name: from.name });
  }
  else if (rutasProtegidas.includes(to.name) && !authStore.usuarioLogueado) {
    toast.info("Inicia sesión para ver tu perfil.")
    next({ name: from.name });
  } else {
    next();
  }
});

export default router
