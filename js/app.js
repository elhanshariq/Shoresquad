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
    await new Promise(resolve => leafletScript.onload = resolve);    // Initialize map with retro style
    const map = L.map('cleanup-map', {
        zoomControl: false // We'll add custom styled zoom controls
    }).setView([34.0522, -118.2437], 10);
    
    // Add custom retro-styled tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Add custom zoom controls
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Sample cleanup locations (to be replaced with real data)
    const cleanups = [
        { lat: 34.0522, lng: -118.2437, title: 'Santa Monica Beach Cleanup' },
        { lat: 34.0005, lng: -118.8068, title: 'Malibu Coastal Cleanup' }
    ];    // Add Nintendo-styled markers for cleanup locations
    cleanups.forEach(cleanup => {
        const marker = L.marker([cleanup.lat, cleanup.lng])
            .bindPopup(`
                <div class="nintendo-popup">
                    <h3>⭐ ${cleanup.title} ⭐</h3>
                    <p>Join this quest to earn points!</p>
                    <button class="cta-button" onclick="alert('Quest joined! Get ready for your beach cleanup adventure!')">
                        Accept Quest
                    </button>
                </div>
            `)
            .addTo(map);
    });
};

// Weather API integration using data.gov.sg
const updateWeather = async () => {
    const weatherContainer = document.querySelector('.weather-container');
    const currentWeather = weatherContainer.querySelector('.current-weather');
    const forecastContainer = weatherContainer.querySelector('.forecast-container');

    try {
        // Fetch current weather data from data.gov.sg
        const date = new Date().toISOString().split('T')[0];
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(`https://api.data.gov.sg/v1/environment/air-temperature`),
            fetch(`https://api.data.gov.sg/v1/environment/4-day-weather-forecast`)
        ]);

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        // Get the latest temperature reading for Pasir Ris
        const latestReading = currentData.items[currentData.items.length - 1].readings
            .find(reading => reading.station_id === 'S106') || { value: 'N/A' };

        // Update current weather
        currentWeather.innerHTML = `
            <div class="power-up">🌡️</div>
            <h3>PASIR RIS BEACH</h3>
            <p class="current-temp">${latestReading.value}°C</p>
            <p class="pixel-text">BEACH CLEANUP CONDITIONS</p>
            <div class="progress-bar">
                <div class="progress" style="width: 85%"></div>
            </div>
            <p class="power-level">QUEST READINESS: 85%</p>
        `;

        // Update 4-day forecast
        const forecastHTML = forecastData.items[0].forecasts
            .map(day => {
                const date = new Date(day.date);
                const formattedDate = date.toLocaleDateString('en-SG', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                });
                
                // Map weather forecast to appropriate emoji
                const weatherEmoji = {
                    'Partly Cloudy': '⛅',
                    'Cloudy': '☁️',
                    'Light Rain': '🌦️',
                    'Moderate Rain': '🌧️',
                    'Heavy Rain': '⛈️',
                    'Sunny': '☀️',
                    'Light Showers': '🌦️',
                    'Showers': '🌧️',
                    'Thundery Showers': '⛈️'
                }[day.forecast] || '🌤️';

                return `
                    <div class="forecast-card">
                        <div class="forecast-date">${formattedDate}</div>
                        <div class="forecast-icon">${weatherEmoji}</div>
                        <div class="forecast-temp">${day.temperature.low}-${day.temperature.high}°C</div>
                        <div class="forecast-desc">${day.forecast}</div>
                    </div>
                `;
            })
            .join('');

        forecastContainer.innerHTML = forecastHTML;

    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherContainer.innerHTML = `
            <div class="weather-card">
                <p class="pixel-text">⚠️ Weather data currently unavailable</p>
                <p>Please try again later</p>
            </div>
        `;
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