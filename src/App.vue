<template>
  <div>
    <!-- Navbar will always be displayed at the top -->
    <Navbar />

    <!-- This is where your routed components will be displayed -->
    <router-view></router-view>

    <!-- Footer will always be displayed at the bottom -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'; // Ensure the correct path
import Footer from './components/Footer.vue'; // Ensure the correct path
</script>

<style scoped>
/* You can keep your styles for the header and logo here or move them to their respective components */

.header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  .header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  .header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
