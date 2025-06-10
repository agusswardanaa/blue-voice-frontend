'use strict';

/**
 * navbar toggle
 */

const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

const navToggleEvent = function (elem) {
  for (let i = 0; i < elem.length; i++) {
    elem[i].addEventListener("click", function () {
      navbar.classList.toggle("active");
      overlay.classList.toggle("active");
    });
  }
}

navToggleEvent(navElemArr);
navToggleEvent(navLinks);



/**
 * header sticky & go to top
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {

  if (window.scrollY >= 120) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }

});

function showLoading() {
    // Show overlay
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    // Show skeleton loading pada setiap hasil
    const resultElements = ['accessResult', 'attractionResult', 'amenitiesResult', 'priceResult', 'noAspectsResult'];
    resultElements.forEach(id => {
        const element = document.getElementById(id);
        element.innerHTML = '<div class="result-skeleton"></div>';
    });

    // Disable submit button
    const submitButton = document.querySelector('#submitButton'); // Sesuaikan dengan ID button Anda
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Analyzing...';
    }
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
    
    // Re-enable submit button
    const submitButton = document.querySelector('#submitButton');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Analyze'; // Sesuaikan dengan teks asli
    }
}

function updateResult(elementId, value) {
    const element = document.getElementById(elementId);
    
    // Fade out effect
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        element.textContent = value || '-';
        
        // Fade in effect
        element.style.opacity = '1';
    }, 150);
}

function showSentimentResult() {
  const inputText = document.getElementById("sentimentInput").value;

  if (!inputText.trim()) {
    alert("Please enter a sentence for sentiment analysis.");
    return;
  }

  showLoading()

  fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: inputText })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to fetch sentiment prediction");
    }
    return response.json();
  })
  .then(data => {
    if (data.status !== "success" || !data.data) {
      throw new Error("Invalid response from server");
    }

    document.getElementById("resultSentence").textContent = inputText;

    const aspectData = data.data;
    
    // Update hasil berdasarkan response key
    document.getElementById("accessResult").textContent = aspectData.access || "-";
    document.getElementById("attractionResult").textContent = aspectData.attractions || "-";
    document.getElementById("amenitiesResult").textContent = aspectData.amenities || "-";
    document.getElementById("priceResult").textContent = aspectData.price || "-";
    document.getElementById("noAspectsResult").textContent = aspectData.no_aspect || "-";

    document.getElementById("sentimentModal").style.display = "flex";
    hideLoading();
  })
  .catch(error => {
    console.error("Error:", error);
    alert("An error occurred while analyzing sentiment.");
  });
}


  function closeModal() {
    document.getElementById("sentimentModal").style.display = "none";
  }

function closeModal() {
  document.getElementById("sentimentModal").style.display = "none";
}