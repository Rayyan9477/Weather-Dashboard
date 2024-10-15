// Replace with your actual API keys
const OPENWEATHER_API_KEY = '8151f78487afb97bbcc6cc96e7cdd3b6';
const GEMINI_API_KEY = 'AIzaSyDST9zkEo2Ry0MTbbIMbwEPoCshA6xE5-M';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const cityInput = document.getElementById('cityInput');
const getWeatherButton = document.getElementById('getWeather');
const weatherWidget = document.getElementById('weatherWidget');
const forecastTable = document.getElementById('forecastTable');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');

let currentPage = 1;
const itemsPerPage = 5;
let forecastData = [];

chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const message = chatInput.value;
        if (message.trim() !== '') {
            addChatMessage(message, 'user');
            handleChatMessage(message);
            chatInput.value = '';
        }
    }
});

getWeatherButton.addEventListener('click', function() {
    const city = cityInput.value;
    if (city.trim() !== '') {
        fetchWeatherData(city);
    }
});

prevPageButton.addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        displayForecastTable();
    }
});

nextPageButton.addEventListener('click', function() {
    if (currentPage * itemsPerPage < forecastData.length) {
        currentPage++;
        displayForecastTable();
    }
});

function addChatMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatMessage(message) {
    // Integrate with the Gemini API
    fetch(`${GEMINI_BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GEMINI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: message,
            max_tokens: 150
        })
    })
    .then(response => response.json())
    .then(data => {
        const reply = data.choices[0].text.trim();
        addChatMessage(reply, 'bot');
    })
    .catch(error => {
        console.error('Error:', error);
        addChatMessage('Sorry, I could not process your request.', 'bot');
    });

    // Echo the message for now
    setTimeout(() => {
        addChatMessage(`You said: ${message}`, 'bot');
    }, 1000);
}

function fetchWeatherData(city) {
    weatherWidget.innerHTML = '<div class="loading-spinner"></div>';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeatherData(data);
                fetchForecastData(city);
            } else {
                weatherWidget.innerHTML = '<div class="error-message">City not found. Please try again.</div>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            weatherWidget.innerHTML = '<div class="error-message">An error occurred. Please try again later.</div>';
        });
}

function fetchForecastData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            forecastData = data.list;
            currentPage = 1;
            displayForecastTable();
        })
        .catch(error => {
            console.error('Error:', error);
            forecastTable.innerHTML = '<div class="error-message">An error occurred. Please try again later.</div>';
        });
}

function displayWeatherData(data) {
    const weatherHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <button id="convertTemp">Convert to Fahrenheit</button>
    `;
    weatherWidget.innerHTML = weatherHTML;

    document.getElementById('convertTemp').addEventListener('click', function() {
        const tempElement = weatherWidget.querySelector('p:nth-child(2)');
        const tempCelsius = data.main.temp;
        const tempFahrenheit = (tempCelsius * 9/5) + 32;
        tempElement.textContent = `Temperature: ${tempFahrenheit.toFixed(2)}°F`;
    });
}

function displayForecastTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = forecastData.slice(start, end);

    let tableHTML = '<table><tr><th>Date</th><th>Temperature</th><th>Weather</th></tr>';
    paginatedData.forEach(item => {
        tableHTML += `
            <tr>
                <td>${new Date(item.dt_txt).toLocaleString()}</td>
                <td>${item.main.temp}°C</td>
                <td>${item.weather[0].description}</td>
            </tr>
        `;
    });
    tableHTML += '</table>';

    forecastTable.innerHTML = tableHTML;
}

// Optional: Implement geolocation
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`)
            .then(response => response.json())
            .then(data => {
                const weatherMessage = `Current temperature at your location is ${data.main.temp}°C with ${data.weather[0].description}.`;
                addChatMessage(weatherMessage, 'bot');
            })
            .catch(error => {
                console.error('Error:', error);
                addChatMessage('Sorry, I could not fetch the weather data.', 'bot');
            });
    });
}