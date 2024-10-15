<template>
  <div class="cart-container">
    <h2>Your Cart</h2>

    <!-- Empty cart section -->
    <div v-if="cartItems.length === 0" class="empty-cart">
      <img src="/images/empty-cart.webp" alt="Empty Cart" class="empty-cart-image" />
      <p class="empty-cart-text">Your cart is empty. Looks like you haven't added anything yet!</p>
      <router-link to="/" class="btn-explore">Explore Products</router-link>
    </div>

    <ul v-else class="cart-items">
      <li v-for="item in cartItems" :key="item.id" class="cart-item">
        <div class="item-image-container">
          <img :src="item.image" alt="Item Image" class="item-image" />
        </div>
        <div class="item-details-container">
          <h3>{{ item.title }}</h3>
        </div>
        <div class="item-price-container">
          <p class="price">
            ${{ item.price }} <span class="price-inr">(₹{{ convertToINR(item.price) }})</span>
          </p>
        </div>
        <div class="quantity-control">
          <button @click="decreaseQuantity(item.id)" class="btn-quantity">-</button>
          <span>{{ item.quantity }}</span>
          <button @click="increaseQuantity(item.id)" class="btn-quantity">+</button>
        </div>
        <div class="item-subtotal-container">
          <p class="subtotal">
            Subtotal: ${{ (item.price * item.quantity).toFixed(2) }} 
            <span class="subtotal-inr">(₹{{ convertToINR(item.price * item.quantity) }})</span>
          </p>
        </div>
        <button class="btn-remove" @click="removeFromCart(item.id)">Remove</button>
      </li>
    </ul>

    <div v-if="cartItems.length > 0" class="cart-summary">
      <h3 class="total-price">
        <span class="total-label">Total: </span>
        <span class="total-amount">${{ totalPrice }}</span> 
        <span class="total-amount-inr">(₹{{ convertToINR(totalPrice) }})</span>
      </h3>
      <button class="btn btn-checkout" @click="openBuyModal">Checkout</button>
    </div>

    <!-- UPI QR Code Modal -->
    <div v-if="isBuyModalOpen" class="buy-modal" @click="closeBuyModal">
      <div class="buy-modal-content" @click.stop>
        <span class="close" @click="closeBuyModal">&times;</span>

        <!-- QR Code display -->
        <img :src="qrCodeImage" alt="UPI QR Code" class="modal-image" v-if="qrCodeImage" />
        <h3 class="modal-title">UPI Payment (₹{{ convertToINR(totalPrice) }})</h3>
        
        <!-- Buttons: Payment Pending and Successfully Paid -->
        <div class="button-group">
          <button class="btn btn-pending" @click="showToast('Payment is Pending', 'warning')">Payment is Pending</button>
          <button class="btn btn-success" @click="openPaymentConfirmModal">Successfully Paid</button>
        </div>

        <!-- Input fields after successful payment -->
        <div v-if="showPaymentFields" class="input-group">
          <input type="text" v-model="senderName" class="input-field" placeholder="Your Name" required />
          <input type="email" v-model="email" class="input-field" placeholder="Enter Valid Email ID" required />
          <button class="btn btn-send" @click="validateAndSendData">Send</button>
        </div>
      </div>
    </div>

    <!-- Payment Confirmation Modal -->
    <div v-if="isPaymentConfirmModalOpen" class="payment-confirmation-modal" @click="closePaymentConfirmModal">
      <div class="payment-confirmation-modal-content" @click.stop>
        <span class="close" @click="closePaymentConfirmModal">&times;</span>
        <h3>Are you sure the payment was successful?</h3>
        <button class="btn btn-yes" @click="confirmPayment">Yes</button>
        <button class="btn btn-no" @click="showToast('Please scan again to complete your payment.', 'error'); closePaymentConfirmModal()">No</button>
      </div>
    </div>


    <!-- Toast Container for Notifications -->
    <ToastContainer />


  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import QRCode from 'qrcode'; // Import the qrcode generator
import { useToast } from 'vue-toastification';
import axios from 'axios'; // For sending data

export default {
  data() {
    return {
      isBuyModalOpen: false, // Controls modal visibility
      showPaymentFields: false, // Controls input fields after payment
      isPaymentConfirmModalOpen: false, // Controls payment confirmation modal
      senderName: '',
      email: '',
      qrCodeImage: '', // QR code image source
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  computed: {
    ...mapGetters(['cartItems', 'totalPrice']),
  },
  methods: {
    openBuyModal() {
      this.generateQRCode(); // Generate QR Code when modal opens
      this.isBuyModalOpen = true;
    },
    closeBuyModal() {
      this.isBuyModalOpen = false;
      this.qrCodeImage = ''; // Clear QR code when closing modal
    },
    convertToINR(priceInUSD) {
      const exchangeRate = 84; // Example exchange rate, adjust accordingly
      return (priceInUSD * exchangeRate).toFixed(2);
    },
    removeFromCart(itemId) {
      this.$store.commit('removeFromCart', itemId);
    },
    increaseQuantity(itemId) {
      this.$store.commit('increaseQuantity', itemId);
    },
    decreaseQuantity(itemId) {
      this.$store.commit('decreaseQuantity', itemId);
    },
    openPaymentConfirmModal() {
      this.isPaymentConfirmModalOpen = true; // Open Payment Confirmation modal
    },
    closePaymentConfirmModal() {
      this.isPaymentConfirmModalOpen = false;
    },
    confirmPayment() {
      this.showPaymentFields = true; // Show input fields for name and email
      this.closePaymentConfirmModal(); // Close the confirmation modal
    },
    async generateQRCode() {
      const upiId = "shivamwallu72594@okhdfcbank"; // UPI ID
      const amount = this.convertToINR(this.totalPrice); // Convert total price to INR
      const senderName = "Shivam Wallu"; // Replace with your sender name
      const message = "Project Purchase payment"; // Payment message

      const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(senderName)}&am=${amount}&purpose=${encodeURIComponent(message)}`;

      try {
        this.qrCodeImage = await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' });
      } catch (error) {
        console.error(error);
      }
    },
    validateAndSendData() {
  if (!this.senderName || !this.email) {
    this.showToast('All fields are required!', 'error');
    return;
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    this.showToast('Please enter a valid email address!', 'error');
    return;
  }

  // Gather project titles, prices, and download links
  const projects = this.cartItems.map(item => ({
    title: item.title, // Assuming item.title contains the project title
    priceInUSD: item.price, // Assuming item.price contains the price in USD
    priceInINR: this.convertToINR(item.price), // Convert to INR
    downloadLink: item.downloadLink // Assuming item.downloadLink contains the project download link
  }));
  const totalPriceInINR = this.convertToINR(this.totalPrice); // Convert total price to INR
 
  // Prepare the data object to send
  const checkoutData = {
    checkout_name: this.senderName,
    checkout_email: this.email,
    checkout_date: new Date().toLocaleDateString("en-IN"), // Current date in IST
    checkout_time: new Date().toLocaleTimeString("en-IN"), // Current time in IST
    checkout_projects_tittle_names: projects.map(project => project.title).join(', '), // Joining project titles
    checkout_projects_dollarprice_Rupeesprice: projects.map(project => `${project.priceInUSD} USD / ₹${project.priceInINR}`).join(', '), // Joining project prices
    checkout_projects_Total: `${this.totalPrice} USD / ₹${totalPriceInINR}`, // Total price in both currencies
    checkout_each_projects_downloadlinks: projects.map(project => project.downloadLink).join(', '), // Joining download links
  };

  // Send data via webhook
  axios.post('https://hook.eu2.make.com/ftgxxje4i7iqys9al6g3t1yarudrs8y8', checkoutData)
    .then(response => {
      this.showToast('Data sent successfully!', 'success');
      this.closeBuyModal();

       // Clear input fields after successful submission
      this.senderName = '';
      this.email = '';
    })
    .catch(error => {
      this.showToast('Error sending data!', 'error');
    });
},



    showToast(message, type = 'success') {
      this.toast[type](message, {
        position: "top-right",
        timeout: 3000,
      });
    },
  }
};
</script>
 

<style>
.cart-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.cart-container h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

/* Empty Cart Styles */
.empty-cart {
  text-align: center;
  padding: 40px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-cart-image {
  max-width: 200px;
  margin-bottom: 20px;
}

.empty-cart-text {
  font-size: 1.2em;
  color: #666;
  margin-bottom: 20px;
}

.btn-explore {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn-explore:hover {
  background-color: #0056b3;
}

/* Cart Items and Other Styles (Already Provided) */
.cart-items {
  list-style-type: none;
  padding: 0;
}
.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr 150px 150px 150px auto;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  flex-wrap: nowrap; /* Disable wrapping for web view */
}

.item-image-container {
  display: flex;
  justify-content: center;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details-container h3 {
  font-size: 1.2em;
  color: #333;
}

.item-price-container {
  text-align: center;
}

.price {
  font-size: 1.2em;
  color: #007bff;
  font-weight: bold;
}

.price-inr {
  font-size: 0.9em;
  color: #666;
  margin-left: 5px;
}

.quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-quantity {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
  transition: background-color 0.3s ease;
}

.btn-quantity:hover {
  background-color: #0056b3;
}

.item-subtotal-container {
  text-align: center;
}

.subtotal {
  font-size: 1.1em;
  font-weight: bold;
}

.subtotal-inr {
  font-size: 0.9em;
  color: #666;
  margin-left: 5px;
}

.btn-remove {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-remove:hover {
  background-color: #e60000;
}

.cart-summary {
  margin-top: 20px;
  text-align: center;
}

.btn-checkout {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-checkout:hover {
  background-color: #218838;
}

.cart-summary {
  margin-top: 20px;
  text-align: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #eee;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.cart-summary .total-price {
  font-size: 2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.cart-summary .total-label {
  font-size: 1.2em;
  font-weight: normal;
  color: #555;
}

.cart-summary .total-amount {
  font-weight: bold;
  color: #28a745; /* Green for the total price */
  margin-left: 10px;
}

.cart-summary .total-amount-inr {
  font-weight: bold;
  color: #007bff; /* Blue for INR conversion */
  margin-left: 10px;
  font-size: 0.8em;
}

/* Add some styling for the checkout button */
.cart-summary .btn-checkout {
  background-color: #28a745; /* Green for checkout */
  color: white;
  padding: 15px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1em;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cart-summary .btn-checkout:hover {
  background-color: #218838; /* Darker green on hover */
  transform: translateY(-2px);
}

/* Animation for the total price */
.cart-summary .total-price {
  background-color: #f9f9f9;
  padding: 10px 20px;
  border-radius: 8px;
  /* display: inline-block; */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.cart-summary .total-price:hover::after {
  width: 120%;
}

@media (max-width: 600px) {
  .cart-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .cart-item > * {
    width: 100%;
    text-align: center;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }

  .quantity-control {
    justify-content: center;
  }

  .btn-quantity {
    padding: 5px 8px;
    font-size: 0.9em;
  }

  .item-price-container,
  .item-subtotal-container {
    font-size: 1em;
  }

  .subtotal,
  .price {
    font-size: 1.1em;
  }

  .cart-summary h3 {
    font-size: 1.2em;
  }

  .btn-checkout {
    padding: 10px;
    width: 80%;
    margin: 10px auto;
  }
  .empty-cart {
    padding: 20px;
  }

  .empty-cart-image {
    max-width: 150px;
  }

  .empty-cart-text {
    font-size: 1.1em;
  }

  .btn-explore {
    padding: 8px 16px;
  }
  .cart-summary {
    padding: 15px;
  }

  .cart-summary .total-price {
    font-size: 1.5em;
  }

  .cart-summary .btn-checkout {
    padding: 12px 25px;
    font-size: 1em;
  }
}

 /* Style (For QR Code Modal) */

 .qr-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
}

.qr-modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.qr-modal-content canvas {
  margin: 20px 0;
}

.qr-modal-content h3 {
  margin-bottom: 10px;
}

.upi-id {
  margin-top: 10px;
  font-weight: bold;
}

</style>


