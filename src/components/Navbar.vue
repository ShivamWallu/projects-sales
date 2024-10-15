<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light-purple">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <div class="loader"></div>
      </a>
      <!-- Cart icon - will only show on mobile -->
      <router-link class="nav-link cart-icon mobile-only" to="/cart" exact-active-class="active">
        <i class="fas fa-shopping-cart"></i>
        <span class="badge bg-danger">{{ totalUniqueItems }}</span>
        <span class="cart-text"></span>
      </router-link>
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarScroll" 
        aria-controls="navbarScroll" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
        ref="navbarToggle">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarScroll">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">
              <i class="fas fa-home"></i> Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about" exact-active-class="active">
              <i class="fas fa-info-circle"></i> About
            </router-link>  
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contact" exact-active-class="active">
              <i class="fas fa-envelope"></i> Contact Us
            </router-link>
          </li>
          <!-- Cart icon in the navbar for desktop view -->
          <li class="nav-item desktop-only">
            <router-link class="nav-link cart-icon" to="/cart" exact-active-class="active">
              <i class="fas fa-shopping-cart"></i> 
              <span class="badge bg-danger">{{ totalUniqueItems }}</span>
              <span class="cart-text">  Cart</span>
            </router-link>
          </li>
        </ul>
        <form class="d-flex ms-3" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-search" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['cartItems']),
    totalUniqueItems() {
      return this.cartItems.length;
    }
  },
  setup() {
    const router = useRouter();
    
    // Watch for route changes
    watch(() => router.currentRoute.value, () => {
      // Close the navbar by toggling it
      const navbarToggle = document.querySelector('.navbar-toggler');
      if (navbarToggle) {
        navbarToggle.click(); // Simulate click to close the navbar
      }
    });
  }
}
</script>
  
  <style scoped>
/* Add any necessary styles here */
.badge {
  margin-left: 5px; /* Adjust the margin for the badge */
}
  
  /* Navbar styling */
  .navbar-nav{
    margin-top: 10px;
  }
  .navbar {
    width: 100%;
    z-index: 1000; /* Ensure navbar stays on top */
  }
  
  .bg-light-purple {
    background-color: #d6aadd; /* Light purple background */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  }
  
  .navbar-brand {
    font-weight: bold;
  }
  
  .nav-link {
    color: #333;
    font-size: 1rem;
    padding: 0.5rem 1rem; /* Add padding for better click area */
    margin-right: 0.5rem; /* Add margin between links */
    transition: color 0.3s, background-color 0.3s; /* Smooth transitions */
  }
  
  /* Change link color on hover */
  .nav-link:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.2); /* Light background on hover */
    border-radius: 0.25rem; /* Rounded corners on hover */
  }
  
  /* Highlight the active link */
  .nav-link.active {
    color: #fff; /* White text color */
    background-color: #a57cc8; /* Darker purple background for active link */
    border-radius: 0.25rem; /* Rounded corners for active link */
  }
  
  /* Search form styling */
  .form-control {
    border-radius: 20px; /* Rounded search input */
  }
  
  .btn-search {
    border-radius: 20px; /* Rounded button */
    color: #ffffff; /* White text color */
    background-color: #000000; /* Charcoal gray background color */
    border: 1px solid #ccc; /* Light gray border */
  }
  
  .btn-search:hover {
    color: #fff; /* White text color on hover */
    background-color: #a57cc8; /* Light purple background on hover */
    border-color: #d6aadd; /* Matching border color on hover */
  }




 /* cart icon */

 /* Adjust alignment for the cart icon */
.navbar .cart-icon {
  display: flex;
  align-items: center;
  margin-left: auto; /* Pushes the cart to the left */
}

.cart-icon i {
  margin-right: 5px;
}

/* Adjust the badge and cart text */
.cart-text {
  font-size: 16px; /* Adjust font size if needed */
  margin-left: 5px;
}

/* Media queries to show/hide elements based on screen size */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: flex;
    align-items: center;
  }
}

@media (min-width: 769px) {
  .desktop-only {
    display: flex;
  }
  .mobile-only {
    display: none;
  }
}
/* Hide the cart icon on desktop screens */
.cart-icon.mobile-only {
  display: none; /* Hide by default */
}

/* Show the cart icon on mobile screens */
@media (max-width: 768px) {
  .cart-icon.mobile-only {
    display: flex; /* Show on mobile screens */
    align-items: center; /* Align items in the center */
  }
}







  /* logo css */
  .loader {
  position: relative;
  width: 1.5em; /* Reduced width */
  height: 1.5em; /* Reduced height */
  transform: rotate(165deg);
}

.loader:before, .loader:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 0.3em; /* Reduced size of inner elements */
  height: 0.3em; /* Reduced size of inner elements */
  border-radius: 0.25em;
  transform: translate(-50%, -50%);
}

.loader:before {
  animation: before8 2s infinite;
}

.loader:after {
  animation: after6 2s infinite;
}

@keyframes before8 {
  0% {
    width: 0.3em;
    box-shadow: 0.8em -0.3em rgba(170, 0, 65, 0.75), -0.8em 0.3em rgba(0, 136, 163, 0.75);
  }
  35% {
    width: 1.5em;
    box-shadow: 0 -0.3em rgba(170, 0, 65, 0.75), 0 0.3em rgba(0, 136, 163, 0.75);
  }
  70% {
    width: 0.3em;
    box-shadow: -0.8em -0.3em rgba(170, 0, 65, 0.75), 0.8em 0.3em rgba(0, 136, 163, 0.75);
  }
  100% {
    box-shadow: 0.8em -0.3em rgba(170, 0, 65, 0.75), -0.8em 0.3em rgba(0, 136, 163, 0.75);
  }
}

@keyframes after6 {
  0% {
    height: 0.3em;
    box-shadow: 0.3em 0.8em rgba(10, 107, 75, 0.75), -0.3em -0.8em rgba(255, 177, 9, 0.75);
  }
  35% {
    height: 1.5em;
    box-shadow: 0.3em 0 rgba(10, 107, 75, 0.75), -0.3em 0 rgba(255, 177, 9, 0.75);
  }
  70% {
    height: 0.3em;
    box-shadow: 0.3em -0.8em rgba(10, 107, 75, 0.75), -0.3em 0.8em rgba(255, 177, 9, 0.75);
  }
  100% {
    box-shadow: 0.3em 0.8em rgba(10, 107, 75, 0.75), -0.3em -0.8em rgba(255, 177, 9, 0.75);
  }
}

.loader {
  position: relative;
  top: 0; /* Keep the loader at its original position */
  left: 0; /* Ensure it's aligned to the left */
}


  </style>
  