<script setup>
import { RouterView } from 'vue-router'
import Navbar from '../components/NavBar.vue'
import Footer from '../components/FooTer.vue'
</script>

<template>
  <div class="app-container">
    <Navbar />
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
</style>
