<script setup>
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer>
    <p>{{ currentYear }} UCAB. Ingeniería de Software</p>
  </footer>
</template>

<style scoped>
footer {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f0f0f0;
  color: #333;
  text-align: center;
}
</style>
