<template>
  <div class="container">
    <div class="header">
      <h1>About Me</h1>
      <div class="right-content">
        <!-- Set the src attribute to the path of your image -->
        <img src="/images/my.jpg"  class="profile-image-large" alt="My Image" />
      </div>
    </div>
    <div class="content">
      <div class="left-content">
        <div class="section">
          <h2>Education</h2>
          <ul>
            <li><i class="fas fa-graduation-cap"></i> 10th from CBSE</li>
            <li><i class="fas fa-graduation-cap"></i> 12th in Science from CBSE</li>
            <li><i class="fas fa-graduation-cap"></i> B.Tech in Computer Science Engineering</li>
          </ul>
        </div>
        <div class="section">
          <h2>Professional Summary</h2>
          <p>
            I am a dedicated and passionate computer engineering graduate with a solid foundation in both theoretical knowledge and practical skills. My educational journey has equipped me with a comprehensive understanding of various aspects of computer science and engineering.
          </p>
          <p>
            I actively participated in coding competitions, hackathons, and technical workshops. These experiences expanded my technical expertise and allowed me to collaborate effectively with peers and mentors.
          </p>
        </div>
        <div class="section">
          <h2>Experience with Programming Languages</h2>
          <div class="button-container">
            <div class="button">Python</div>
            <div class="button">HTML</div>
            <div class="button">CSS</div>
            <div class="button">JavaScript</div>
            <div class="button">Vue.js</div>
            <div class="button">Nuxt.js</div>
            <div class="button">Django</div>
            <div class="button">AI (Artificial Intelligence)</div>
            <div class="button">PHP</div>
            <div class="button">Laravel</div>
            <div class="button">Bootstrap</div>
            <div class="button">AI (Make)</div>
            <div class="button">AI (Botpress)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {};
  },
};
</script>

  
  <style scoped>
  .container {
    width: 70%;
    margin: 0 auto;
    padding: 20px;
    position: relative;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  
  .header h1 {
    color: #ff4500;
    font-size: 36px;
    font-weight: bold;
  }
  
  .content {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .left-content {
    width: 65%;
  }
  
  .right-content {
    position: absolute; /* Free positioning */
    right: 100px; /* Adjust as needed */
    top: 80px; /* Moves it downward */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .profile-image-large {
  border-radius: 50%; /* Circular image */
  width: 170px;
  height: 170px;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  image-rendering: -webkit-optimize-contrast; /* For better rendering on WebKit browsers */
}

  
  .profile-image-large:hover {
    transform: scale(1.05);
  }
  
  .section {
    margin-top: 20px;
  }
  
  .section h2 {
    color: #ff4500;
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .section ul {
    list-style: none;
    padding: 0;
  }
  
  .section ul li {
    margin: 10px 0;
    font-size: 18px;
  }
  
  .section ul li i {
    margin-right: 10px;
    color: #ff4500;
  }
  
  .section p {
    font-size: 16px;
    line-height: 1.6;
  }
  
  .button-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }
  
  .button-container .button {
    background-color: #000;
    color: #fff;
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 14px;
    transition: background-color 0.3s ease;
    cursor: pointer;
  }
  
  .button-container .button:hover {
    background-color: #ff4500;
  }
  
  /* Responsive design for smaller screens */
  @media (max-width: 768px) {
    .container {
      width: 95%;
      padding: 10px;
    }
  
    .header {
      flex-direction: column;
      align-items: center;
    }
  
    .header h1 {
      font-size: 28px;
      text-align: center;
    }
  
    .right-content {
      position: static; /* Reverting from absolute to normal flow */
      margin-top: 20px;
    }
  
    .content {
      flex-direction: column;
      align-items: center;
    }
  
    .left-content {
      width: 100%;
      margin-bottom: 20px;
    }
  
    .section h2 {
      font-size: 20px;
    }
  
    .section ul li {
      font-size: 16px;
    }
  
    .button-container .button {
      font-size: 12px;
    }
  }
  
  /* For very small screens */
  @media (max-width: 480px) {
    .profile-image-large {
      width: 150px;
      height: 150px;
    }
  
    .header h1 {
      font-size: 24px;
    }
  
    .section h2 {
      font-size: 18px;
    }
  
    .section ul li {
      font-size: 14px;
    }
  }

  @media (max-width: 768px) {
  .profile-image-large {
    width: 150px;
    height: 150px;
  }
}
  </style>
  
