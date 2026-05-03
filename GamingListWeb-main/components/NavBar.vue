<script setup>
const menuItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Juegos', path: '/videojuegos' },
  { name: 'Perfil', path: '/perfil' },
];
</script>

<template>
  <nav>
    <ul>
      <li v-for="item in menuItems" :key="item.name">
        <router-link :to="item.path">{{ item.name }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  background-color: #333;
  padding: 1rem;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

li {
  margin: 0 1rem;
}

a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

a:hover{
  color: #42b883;
}
</style>
