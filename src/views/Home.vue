<template>
  <div class="card-container">
    <!-- Existing Card Display Code -->
    <div class="card" v-for="item in items" :key="item.id">
      <img :alt="item.title" :src="item.image" height="150" width="250" />
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
      <div class="price">
        <span class="price-value">${{ item.price }} (₹{{ item.inrPrice }})</span>
      </div>
      <a class="btn btn-buy" @click.prevent="openBuyModal(item)">Buy Now</a>
      <div class="btn-container">
        <a class="btn btn-video" @click.prevent="openVideoModal(item.videoLink)">Video</a>
        <!-- <a class="btn btn-code" :href="item.codeLink" target="_blank" rel="noopener noreferrer">Code</a> -->
        <a class="btn btn-live" :href="item.liveLink" target="_blank" rel="noopener noreferrer">Live</a>
      </div>
      <a class="btn btn-add-to-cart" @click.prevent="addCart(item)">
        Add to Cart ({{ getCartItemQuantity(item.id) }})
      </a>
    </div>

    <!-- Buy Modal -->
    <div v-if="isBuyModalOpen" class="buy-modal" @click="closeBuyModal">
      <div class="buy-modal-content" @click.stop>
        <span class="close" @click="closeBuyModal">&times;</span>

        <!-- Display the QR code image instead of barcodeImage -->
      <img :src="qrCodeImage" alt="QR Code" class="modal-image" v-if="qrCodeImage">

        <h3 class="modal-title">Purchase Confirmation</h3>
        <div class="button-group">
          <button class="btn btn-pending" @click="showPaymentPendingToast">Payment is Pending</button>
          <button class="btn btn-success" @click="confirmPayment">Successfully Sent</button>
        </div>

        <!-- Input fields appear when Successfully Sent is clicked -->
        <div v-if="showPaymentFields" class="input-group">
          <input 
            type="text" 
            v-model="senderName" 
            class="input-field" 
            placeholder="Name" 
            required
          />
          <input 
            type="email" 
            v-model="email" 
            class="input-field" 
            placeholder="Enter Valid Email ID" 
            required
          />
          <button class="btn btn-send" @click="validateAndSendData">Send</button>
        </div>
      </div>
    </div>

     <!-- Payment Confirmation Modal -->
    <div v-if="isPaymentConfirmModalOpen" class="payment-confirmation-modal" @click="closePaymentConfirmModal">
      <div class="payment-confirmation-modal-content" @click.stop>
        <span class="close" @click="closePaymentConfirmModal">&times;</span>
        <h3>Are you sure the payment was successful?</h3>
        <button class="btn btn-yes" @click="showPaymentFields = true; closePaymentConfirmModal()">Yes</button>
        <button class="btn btn-no" @click="showToast('Please scan again to complete your payment.', 'error'); closePaymentConfirmModal()">No</button>
      </div>
    </div>

    <!-- Toast container to display toast notifications -->
    <ToastContainer />

    <!-- Video Modal -->
    <div v-if="isModalOpen" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeModal">&times;</span>
        <iframe
          :src="currentVideoLink"
          frameborder="0"
          allowfullscreen
          width="100%"
          height="315"
        ></iframe>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import QRCode from 'qrcode'; // Import the qrcode generator
export default {
  data() {
    return {
      items: [
        {
          id: 1,
          title: "Auto Post by Artificial Intelligence (AI)",
          description: "Auto post on social media via AI every 15 minutes.",
          price: 0.012,
          inrPrice: (0.012 * 84).toFixed(2), // Pre-calculated INR price
          image: "https://images.pexels.com/photos/533446/pexels-photo-533446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buyLink: "#",
          videoLink: "https://www.webmobilefirst.com/en/screencasts/jFsmbo78o3/",
          codeLink: "https://github.com/",
          liveLink: "https://example.com/live",
          downloadLink: "https://example.com/driver-download"
        },
        {
          id: 2,
          title: "Gym Proper Website",
          description: "A fitness application for tracking workouts (Vuejs 3).",
          price: 125,
          inrPrice: (125 * 84).toFixed(2), // Pre-calculated INR price
          image: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buyLink: "#",
          videoLink: "https://www.webmobilefirst.com/en/screencasts/jFsmbo78o3/",
          codeLink: "https://github.com/",
          liveLink: "https://shivgym.vercel.app/",
          downloadLink: "https://drive.google.com/file/d/1lEwjgtN1-9Dp-qHwTTzmhA3qAtbQzCbd/view?usp=drive_link"
        },
        
        {
          id: 3,
          title: "AI Chatbot",
          description: "12 Artificial intelligence (AI) Chatbots Personality Wise.",
          price: 30,
          inrPrice: (30 * 84).toFixed(2), // Pre-calculated INR price
          image: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buyLink: "#",
          videoLink: "https://www.webmobilefirst.com/en/screencasts/jFsmbo78o3/",
          codeLink: "https://github.com/",
          liveLink: "https://chatwithshivam.vercel.app/",
          downloadLink: "https://example.com/driver-download"
        },
        {
          id: 4,
          title: "E-commerce Website",
          description: "An e-commerce website sales project and notes for students.",
          price: 150,
          inrPrice: (150 * 84).toFixed(2), // Pre-calculated INR price
          image: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buyLink: "#",
          videoLink: "https://www.webmobilefirst.com/en/screencasts/jFsmbo78o3/",
          codeLink: "https://github.com/",
          liveLink: "https://example.com/live",
          downloadLink: "https://drive.google.com/file/d/1jd5Ib0cEjhW1Au_1PdtzePFSBMz70nAz/view?usp=drive_link"
        },
        {
          id: 5,
          title: "Gym Website",
          description: "A fully functional online (HTML, CSS , JavaScript)",
          price: 6,
          inrPrice: (6 * 84).toFixed(2), // Pre-calculated INR price
          image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buyLink: "#",
          videoLink: "https://www.webmobilefirst.com/en/screencasts/jFsmbo78o3/",
          codeLink: "https://github.com/",
          liveLink: "https://shivamwallugym.vercel.app/",
          downloadLink: "https://example.com/driver-download"
        },
        {
          id: 6,
          title: "PortFolio Website",
          description: "A platform to share your Profile Information (HTML, CSS , JS).",
          price: 7,
          inrPrice: (7 * 84).toFixed(2), // Pre-calculated INR price
          image: "https://images.pexels.com/photos/14936128/pexels-photo-14936128.jpeg?auto=compress&cs=tinysrgb&w=600",
          buyLink: "#",
          videoLink: "https://www.webmobilefirst.com/en/screencasts/jFsmbo78o3/",
          codeLink: "https://github.com/",
          liveLink: "https://shivamresume.vercel.app/",
          downloadLink: "https://drive.google.com/file/d/1QOrwSNRajC8kFIraKB9Q_ylsCLK0GPHd/view?usp=drive_link"
        },
        
        {
          id: 7,
          title: "Gym Website",
          description: "Gym Attendance Management System - Python and Django.",
          price: 12,
          inrPrice: (12 * 84).toFixed(2), // Pre-calculated INR price
          image: "https://images.pexels.com/photos/5327526/pexels-photo-5327526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buyLink: "#",
          videoLink: "https://www.webmobilefirst.com/en/screencasts/jFsmbo78o3/",
          codeLink: "https://github.com/",
          liveLink: "https://example.com/live",
          downloadLink: "https://example.com/driver-download"
        },
        
          
          {
          id: 8,
          title: "ChatGPT Clone",
          description: "ChatGPT Clone with Microphone Functionality - Python(Django).",
          price: 50,
          inrPrice: (50 * 84).toFixed(2), // Pre-calculated INR price
          image: "https://images.pexels.com/photos/16027824/pexels-photo-16027824/free-photo-of-chat-gpt-welcome-screen-on-computer.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buyLink: "#",
          videoLink: "https://www.webmobilefirst.com/en/screencasts/jFsmbo78o3/",
          codeLink: "https://github.com/",
          liveLink: "https://example.com/live",
          downloadLink: "https://example.com/driver-download"
        },
        {
          id: 9,
          title: "Up-to-Date Python Notes",
          description: "Complete Installation Guide from Basic to Advanced",
          price: 18,
          inrPrice: (18 * 84).toFixed(2), // Pre-calculated INR price
          image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600",
          buyLink: "#",
          videoLink: "https://www.webmobilefirst.com/en/screencasts/jFsmbo78o3/",
          codeLink: "https://github.com/",
          liveLink: "https://example.com/live",
          downloadLink: "https://drive.google.com/file/d/188DrBno68pu35eukVt3GzT6Ox5LESCKP/view?usp=drive_link"
        },
        {
          id: 10,
          title: "Up-to-Date Vue.js 3 Notes",
          description: "Complete Installation Guide from Basic to Advanced.",
          price: 20,
          inrPrice: (20 * 84).toFixed(2), // Pre-calculated INR price
          image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*vXVBfNK-0eI4f0BrwKjEwg.jpeg",
          buyLink: "#",
          videoLink: "https://www.webmobilefirst.com/en/screencasts/jFsmbo78o3/",
          codeLink: "https://github.com/",
          liveLink: "https://example.com/live",
          downloadLink: "https://drive.google.com/file/d/1m8Zn5b-BVBNyFoSq3Aq2tDytD_8hK3YP/view?usp=drive_link"
        },
          {
          id: 11,
          title: "Advanced Text-to-Image Generation Techniques",
          description: "Generate Image from Text with ChatGPT API key (Python).",
          price: 5,
          inrPrice: (5 * 84).toFixed(2), // Pre-calculated INR price
          image: "https://media.licdn.com/dms/image/v2/D5612AQH9Hkz1riV5lA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1654634918204?e=1733356800&v=beta&t=b4J6CrhuFoUS2lu6zF-vwm2NV5MtmU6TzC2Fs0nPNKM",
          buyLink: "#",
          videoLink: "https://www.webmobilefirst.com/en/screencasts/jFsmbo78o3/",
          codeLink: "https://github.com/",
          liveLink: "https://example.com/live",
          downloadLink: "https://example.com/driver-download"
        },
         
        
          {
          id: 12,
          title: "Generate a shortened URL link",
          description: "Generate a shortened URL link using Python",
          price: 4,
          inrPrice: (4 * 84).toFixed(2), // Pre-calculated INR price
          image: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          buyLink: "#",
          videoLink: "https://www.webmobilefirst.com/en/screencasts/jFsmbo78o3/",
          codeLink: "https://github.com/",
          liveLink: "https://example.com/live",
          downloadLink: "https://drive.google.com/file/d/1mst3TygvJikE2ydb6ISLkHIBOrCo7PU5/view?usp=drive_link"
        },
      ],
      isModalOpen: false,
      isBuyModalOpen: false,
      showPaymentFields: false,
      currentVideoLink: '',
      senderName: '',
      qrCodeImage: '', // Store the QR code image URL
      email: '',
      currentItem: null,
      toastQueue: [],
      isToastShowing: false,
      isPaymentConfirmModalOpen: false // New property to control the payment confirmation modal
    };
  },
  computed: {
    ...mapGetters(['cartItems'])
  },
  setup() {
  const toast = useToast();
  let isToastShowing = false; // Track if a toast is currently showing

  const showPaymentPendingToast = () => {
    if (isToastShowing) return; // Do not show new toast if one is already showing

    isToastShowing = true; // Set the flag to true
    toast.warning('Please try again.', {
      position: "top-right",
      timeout: 3000,
      onClose: () => {
        isToastShowing = false; // Reset the flag when the toast is closed
      }
    });
  };

    return {
      showPaymentPendingToast,
      toast
    };
  },
  methods: {
    addCart(item) {
      this.$store.dispatch('addtocart', { ...item, quantity: 1 });
    },
    openBuyModal(item) {
    this.currentItem = item; // Set the current item
    this.generateQRCode(item.inrPrice, item.title); // Generate QR code based on the selected item's INR price and title
    this.isBuyModalOpen = true;
  },
    closeBuyModal() {
      this.isBuyModalOpen = false;
      this.showPaymentFields = false;
      this.senderName = '';
      this.email = '';
      this.isPaymentConfirmModalOpen = false; // Reset the payment confirmation modal
      this.qrCodeImage = ''; // Clear QR code image on modal close

    },
    openVideoModal(videoLink) {
      this.currentVideoLink = videoLink;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.currentVideoLink = '';
    },
    getCartItemQuantity(itemId) {
      const cartItem = this.cartItems.find(item => item.id === itemId);
      return cartItem ? cartItem.quantity : 0;
    },
    
    // New method to handle payment confirmation
    confirmPayment() {
      this.isPaymentConfirmModalOpen = true; // Show the confirmation modal
    },

    showToast(message, type = 'success') {
      this.toastQueue.push({ message, type });
      this.processToastQueue();
    },

    async generateQRCode(inrPrice, noteTitle) {
      const upiId = "shivamwallu72594@okhdfcbank"; // Replace with your UPI ID
      const amount = inrPrice; // Format the price to two decimal places
      const senderName = "Shivam Wallu"; // Hardcoded name
      const message = noteTitle; // Use the provided note title as the message

      // Construct the QR data using the parameters
      const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(senderName)}&mc=1234&tid=1&am=${amount}&tid=1234&purpose=${encodeURIComponent(message)}`;
      
      try {
        // Generate the QR code as a data URL
        this.qrCodeImage = await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' });
      } catch (error) {
        console.error(error);
      }
    },

    processToastQueue() {
      if (this.isToastShowing || this.toastQueue.length === 0) return;

      const { message, type } = this.toastQueue.shift();
      this.isToastShowing = true;

      const toastMethod = type === 'success' ? this.toast.success : this.toast.error;
      toastMethod(message, {
        position: "top-right",
        timeout: 3000,
      });

      setTimeout(() => {
        this.isToastShowing = false;
        this.processToastQueue();
      }, 3000);
    },

    validateAndSendData() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!this.senderName || !this.email) {
        this.showToast('All fields are required!', 'error');
        return;
      }

      if (!emailPattern.test(this.email)) {
        this.showToast('Invalid email address', 'error');
        return;
      }

      this.sendData(this.currentItem, this.senderName, this.email);
    },

    sendData(currentItem, senderName, email) {
      const currentTime = new Date();
      const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
      const formattedDate = `${currentTime.getDate()}-${currentTime.getMonth() + 1}-${currentTime.getFullYear()}`;

      const payload = {
        senderName,
        email,
        itemTitle: currentItem.title,
        price: currentItem.price, // Include dollar price
        inrPrice: currentItem.inrPrice, // Include INR price
        currentTime: formattedTime,
        currentDate: formattedDate,
        downloadLink: currentItem.downloadLink
      };

      axios.post('https://hook.eu2.make.com/ftgxxje4i7iqys9al6g3t1yarudrs8y8', payload)
        .then(response => {
          console.log('Response:', response.data);
          this.showToast('Sent successfully!');
          this.closeBuyModal();
        })
        .catch(error => {
          console.error('Error details:', error.response || error);
          this.showToast('Error sending data!', 'error');
        });
    },

    // New method to close the payment confirmation modal
    closePaymentConfirmModal() {
      this.isPaymentConfirmModalOpen = false;
    }
  }
};
</script>





  
    
  
<style>

.qr-code-container {
  margin: 20px 0;
}

.qr-code {
  width: 200px; /* Adjust as necessary */
  height: 200px; /* Adjust as necessary */
}



.price {
  font-size: 1.5em; 
  font-weight: bold; 
  color: #800080; 
  margin: 10px 0 20px 0 !important; 
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); 
}

.price-value {
  border: 2px solid #800080; 
  padding: 5px; 
  border-radius: 5px; 
  background-color: rgba(128, 0, 128, 0.1); 
}

  .card-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 250px;
    padding: 20px;
    text-align: center;
    transition: transform 0.3s, border-color 0.3s;
    border: 2px solid transparent;
    margin: 10px;
    overflow: hidden; 
    position: relative; 
  }
  .card:hover {
    transform: translateY(-10px);
    border-color: #007bff;
  }
  
  .card img {
    width: 100%;
    height: auto;
    border-radius: 10px 10px 10px 10px;
  }
  
  .card h3 {
    font-size: 1.2em;
    margin: 10px 0;
  }
  
  .card p {
    color: #666;
    font-size: 0.9em;
    margin: 10px 0;
    max-height: 40px; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    display: -webkit-box; 
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical; 
  }
  
  .card .price {
    font-size: 1.2em; 
    color: #800080;
    margin: 5px 0;
  }
  
  .card .btn {
    flex: 1;
    padding: 5px 10px; 
    margin: 0;
    border-radius: 5px;
    text-decoration: none;
    color: white;
    font-size: 0.8em; 
    transition: background-color 0.3s, transform 0.3s;
  }
  
  .btn-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-wrap: nowrap;
    margin-top: 10px;
  }
  
  .card .btn-video, .card .btn-code, .card .btn-live {
    background-color: black;
  }
  
  .card .btn-video:hover, 
.card .btn-code:hover, 
.card .btn-live:hover {
  background-color: #333;
  transform: scale(1.05);
  color: white; 
}


  .card .btn-buy {
    background-color: #007bff; 
    justify-content: center; /* Center the text horizontally */
    align-items: center; /* Center the text vertically */
    display: flex; /* Center the text vertically */
  }
  
  .card .btn-buy:hover {
    background-color: #0056b3;
  }
  
  .card .btn-add-to-cart {
    background-color: #28a745; 
    display: flex; /* Center the text vertically */
    margin-top: 10px; 
    text-align: center; 
    justify-content: center; /* Center the text horizontally */
    align-items: center; /* Center the text vertically */
  }



  .card .btn-add-to-cart:hover {
    background-color: #218838; 
    transform: scale(1.05);
  }
  
  .modal {
    display: flex !important;
    justify-content: center;
    align-items: center;
}

.modal-content {
    position: relative;
    max-width: 55%;
    max-height: 55%;
}

.close {
    position: absolute;
    top: 2px;
    right: 29px;
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
}

  
  @media (max-width: 768px) {
    .card-container {
      flex-direction: column;
      align-items: center;
    }
    .card {
      width: 90%;
    }
    .close {
      top: 2px; 
      right: 48px; 
    }
  }





/* / / Modal Background / / */
.buy-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; 
    overflow: auto; 
}
/* / / Modal Content / / */
.buy-modal-content {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 90%; 
    max-width: 300px; 
    position: relative; 
}

.close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 24px;
    cursor: pointer;
    color: #aaa;
}

.close:hover {
    color: #000; 
}

/* / / Modal Image / / */
.modal-image {
    width: 100%; 
    height: auto; 
    border-radius: 8px;
    margin-bottom: 15px; 
}

.modal-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px; 
}

.button-group {
    display: flex;
    justify-content: space-between; 
    margin-bottom: 15px;
}

.buy-modal .btn {
    background-color: #007BFF; 
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    font-size: 16px;
    font-weight: bold;
    flex: 1; 
    margin: 0 5px; 
}

.buy-modal .btn:hover {
    background-color: #0056b3;
    transform: translateY(-2px); 
}

.buy-modal .btn-pending {
    background-color: #FFC107; 
}

.buy-modal .btn-success {
    background-color: #28A745; 
}

.buy-modal .btn-send {
    background-color: #007BFF;
    width: 100%;
}

.input-group {
    display: flex;
    flex-direction: column; 
}

.input-field {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px; 
    font-size: 16px;
}

.input-field:focus {
    border-color: #007BFF; 
    outline: none; 
}

.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
}



/* / Payment Confirmation Modal Styles / */
.payment-confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; 
}

.payment-confirmation-modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.payment-confirmation-modal h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5em;
}

.payment-confirmation-modal .btn {
  background-color: #28a745; 
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  margin: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.payment-confirmation-modal .btn:hover {
  background-color: #218838; 
}

.payment-confirmation-modal .btn-no {
  background-color: #dc3545;
}

.payment-confirmation-modal .btn-no:hover {
  background-color: #c82333; 
}

@media (max-width: 600px) {
  .payment-confirmation-modal-content {
    padding: 15px;
  }

  .payment-confirmation-modal h3 {
    font-size: 1.3em;
  }

  .payment-confirmation-modal .btn {
    padding: 8px 12px;
    font-size: 0.9em;
  }
}


</style>
    
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  <!-- { -->
      //   title: "Personal Portfolio",
      //   description: "Showcase your projects and skills",
      //   price: "$499",
      //   image: "https://example.com/portfolio.png",
      //   buyLink: "#",
      //   videoLink: "#",
      //   codeLink: "#"
      // },
      // {
      //   title: "Blog Platform",
      //   description: "A platform to share your thoughts",
      //   price: "$299",
      //   image: "https://example.com/blog.png",
      //   buyLink: "#",
      //   videoLink: "#",
      //   codeLink: "#"
      // },
      // {
      //   title: "Social Media App",
      //   description: "Connect with friends and family",
      //   price: "$799",
      //   image: "https://example.com/socialapp.png",
      //   buyLink: "#",
      //   videoLink: "#",
      //   codeLink: "#"
      // },
      // {
      //   title: "Task Manager",
      //   description: "Manage your tasks efficiently",
      //   price: "$199",
      //   image: "https://example.com/taskmanager.png",
      //   buyLink: "#",
      //   videoLink: "#",
      //   codeLink: "#"
      // },
      // {
      //   title: "Weather App",
      //   description: "Get real-time weather updates",
      //   price: "$149",
      //   image: "https://example.com/weatherapp.png",
      //   buyLink: "#",
      //   videoLink: "#",
      //   codeLink: "#"
      // },
      // {
      //   title: "Recipe Finder",
      //   description: "Discover new recipes based on ingredients",
      //   price: "$99",
      //   image: "https://example.com/recipefinder.png",
      //   buyLink: "#",
      //   videoLink: "#",
      //   codeLink: "#"
      // },
      // {
      //   title: "Fitness Tracker",
      //   description: "Track your workouts and progress",
      //   price: "$349",
      //   image: "https://example.com/fitnesstracker.png",
      //   buyLink: "#",
      //   videoLink: "#",
      //   codeLink: "#"
      // },
      // {
      //   title: "Event Planner",
      //   description: "Plan and manage events with ease",
      //   price: "$249",
      //   image: "https://example.com/eventplanner.png",
      //   buyLink: "#",
      //   videoLink: "#",
      //   codeLink: "#"
      // }