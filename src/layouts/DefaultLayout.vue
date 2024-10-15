<template>
  <div class="layout">
    <!-- Navbar will always be displayed at the top -->
    <Navbar />

    <!-- The routed content (from <router-view>) will be displayed inside <main> -->
    <main class="content">
      <router-view /> <!-- Use router-view to render routed components -->
    </main>

    <!-- Footer will always be displayed at the bottom -->
    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

export default {
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Full viewport height */
}

.content {
  flex: 1; /* Takes up remaining space */
  padding: 20px; /* Adjust as needed */
}
</style>
