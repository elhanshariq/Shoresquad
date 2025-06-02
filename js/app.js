// Initialize map using Leaflet.js
const initMap = async () => {
    // Load Leaflet CSS dynamically
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCSS);

    // Load Leaflet JS dynamically
    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    document.head.appendChild(leafletScript);

    // Wait for Leaflet to load
    await new Promise(resolve => leafletScript.onload = resolve);

    // Initialize map
    const map = L.map('cleanup-map').setView([34.0522, -118.2437], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Sample cleanup locations (to be replaced with real data)
    const cleanups = [
        { lat: 34.0522, lng: -118.2437, title: 'Santa Monica Beach Cleanup' },
        { lat: 34.0005, lng: -118.8068, title: 'Malibu Coastal Cleanup' }
    ];

    // Add markers for cleanup locations
    cleanups.forEach(cleanup => {
        L.marker([cleanup.lat, cleanup.lng])
            .bindPopup(cleanup.title)
            .addTo(map);
    });
};

// Weather API integration
const updateWeather = async () => {
    const weatherContainer = document.querySelector('.weather-container');
    try {
        // Note: Replace with actual API key and endpoint in production
        const response = await fetch('https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=beach&days=3');
        const data = await response.json();
          // For now, show placeholder weather data
        weatherContainer.innerHTML = `
            <div class="weather-card">
                <div class="power-up">☀️</div>
                <h3>WORLD 1-1</h3>
                <p>75°F | SUNNY</p>
                <p class="pixel-text">PERFECT WEATHER FOR A QUEST!</p>
                <div class="progress-bar">
                    <div class="progress" style="width: 80%"></div>
                </div>
                <p class="power-level">BEACH POWER: 80%</p>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherContainer.innerHTML = '<p>Weather data unavailable</p>';
    }
};

// Form handling
const initForms = () => {
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = signupForm.querySelector('input[type="email"]').value;
            
            // Add loading state
            const button = signupForm.querySelector('button');
            button.textContent = 'Joining...';
            button.disabled = true;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Show success message
                signupForm.innerHTML = '<p class="success">Welcome to ShoreSquad! 🌊</p>';
            } catch (error) {
                console.error('Error:', error);
                button.textContent = 'Try Again';
                button.disabled = false;
            }
        });
    }
};

// Smooth scroll navigation
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Intersection Observer for animations
const initAnimations = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        },
        { threshold: 0.1 }
    );

    // Observe sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    updateWeather();
    initForms();
    initSmoothScroll();
    initAnimations();
});

// Add service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    });
}