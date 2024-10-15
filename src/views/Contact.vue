<template>
  <div>
    <div class="container">
      <div class="contact-info">
          <h2>Contact Us</h2>
          <p>We value open communication and are here to assist you with any questions, inquiries, or feedback you may have. Whether you’re looking for more information about our services, need support, or wish to collaborate, our dedicated team is ready to help. Please feel free to reach out through the contact form below, or connect with us via email or phone. We strive to respond promptly and ensure your experience is seamless and satisfactory. Your input is important to us as we continuously work to provide the best solutions and services.</p>
          <div class="info-item">
              <i class="fas fa-home"></i>
              <div>
                  <h3>Address</h3>
                  <p>Chandigarh, India</p>
              </div>
          </div>
          <div class="info-item">
              <i class="fas fa-phone"></i>
              <div>
                  <h3>Phone</h3>
                  <p>+91 7814749816</p>
              </div>
          </div>
          <div class="info-item">
              <i class="fas fa-envelope"></i>
              <div>
                  <h3>Email</h3>
                  <p>er.shivamwallu@gmail.com</p>
              </div>
          </div>
      </div>
      <div class="contact-form">
        <h2>Send Message</h2>
        <form @submit.prevent="submitForm">
          <input
            v-model="contactname"
            type="text"
            placeholder="Full Name"
            required
          />
          <input
            v-model="contactemail"
            type="email"
            placeholder="Email"
            required
          />
          <textarea
            v-model="contactmessage"
            placeholder="Type your Message..."
            required
          ></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
  </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification"; // Importing the toast function

export default {
  name: "Contact",
  data() {
    return {
      contactname: "", // updated to match the v-model in the template
      contactemail: "",
      contactmessage: "",
    };
  },
  setup() {
    const toast = useToast(); // Using the toast instance inside setup
    return { toast };
  },
  methods: {
    // Show toast message
    showToast(message, type = "success") {
      if (type === "success") {
        this.toast.success(message, {
          position: "top-right",
          timeout: 3000,
        });
      } else {
        this.toast.error(message, {
          position: "top-right",
          timeout: 3000,
        });
      }
    },

    // Validate email format
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    // Validate form fields
    validateForm() {
      if (!this.contactname || !this.contactemail || !this.contactmessage) {
        this.showToast("All fields are required!", "error");
        return false;
      }
      if (!this.isValidEmail(this.contactemail)) {
        this.showToast("Invalid email format!", "error");
        return false;
      }
      return true;
    },

    // Submit form data to webhook
    submitForm() {
      if (!this.validateForm()) {
        return;
      }

      const payload = {
        contactname: this.contactname,
        contactemail: this.contactemail,
        contactmessage: this.contactmessage,
      };

      axios
        .post("https://hook.eu2.make.com/ftgxxje4i7iqys9al6g3t1yarudrs8y8", payload)
        .then((response) => {
          console.log("Response:", response.data);
          this.showToast("Message sent successfully!", "success");
          // Reset form fields after success
          this.contactname = "";
          this.contactemail = "";
          this.contactmessage = "";
        })
        .catch((error) => {
          console.error("Error details:", error.response || error);
          this.showToast("Error sending message!", "error");
        });
    },
  },
};
</script>

<style scoped>
/* General styling */
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 50px;
}
.contact-info, .contact-form {
  flex: 1;
  min-width: 300px;
  margin: 20px;
  box-sizing: border-box;
}
.contact-info h2, .contact-form h2 {
  font-size: 36px;
  margin-bottom: 20px;
}
.contact-info p {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 40px;
}
.contact-info .info-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.contact-info .info-item i {
  font-size: 24px;
  background: #fff;
  color: #000;
  border-radius: 50%;
  padding: 10px;
  margin-right: 20px;
}
.contact-info .info-item h3 {
  font-size: 20px;
  margin: 0;
  color: #00bcd4;
}
.contact-info .info-item p {
  margin: 5px 0 0 0;
  color: #000000;
}
.contact-form {
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}
.contact-form input, .contact-form textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}
.contact-form button {
  background: #00bcd4;
  color: #fff;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
}
.contact-form button:hover {
  background: #0097a7;
}

/* Media queries for responsiveness */
@media (max-width: 768px) {
  .container {
      flex-direction: column;
      padding: 20px;
  }
  .contact-info, .contact-form {
      margin: 20px 0;
      width: 100%;
  }
  .contact-info h2, .contact-form h2 {
      font-size: 30px;
  }
  .contact-form {
      max-width: 100%;
      padding: 20px;
  }
}

@media (max-width: 480px) {
  .container {
      padding: 10px;
  }
  .contact-info h2, .contact-form h2 {
      font-size: 24px;
  }
  .contact-info p {
      font-size: 14px;
  }
  .contact-info .info-item i {
      font-size: 20px;
      padding: 8px;
  }
  .contact-info .info-item h3 {
      font-size: 18px;
  }
  .contact-info .info-item p {
      font-size: 14px;
  }
  .contact-form h2 {
      font-size: 20px;
  }
  .contact-form input, .contact-form textarea {
      font-size: 14px;
  }
  .contact-form button {
      font-size: 14px;
      padding: 10px;
  }
}
</style>
