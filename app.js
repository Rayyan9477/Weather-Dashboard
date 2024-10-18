// Replace with your actual API keys
const OPENWEATHER_API_KEY = '8151f78487afb97bbcc6cc96e7cdd3b6';
const GEMINI_API_KEY = 'AIzaSyDST9zkEo2Ry0MTbbIMbwEPoCshA6xE5-M';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEMINI_BASE_URL = 'https://api.gemini.com/v1/chat';

const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const cityInput = document.getElementById('cityInput');
const getWeatherButton = document.getElementById('getWeather');
const weatherWidget = document.getElementById('weatherWidget');
const forecastTable = document.getElementById('forecastTable');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const toggleChatButton = document.getElementById('toggleChat');
const chatContent = document.querySelector('.chat-content');

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

prevPageButton?.addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        displayForecastTable();
    }
});

nextPageButton?.addEventListener('click', function() {
    if (currentPage * itemsPerPage < forecastData.length) {
        currentPage++;
        displayForecastTable();
    }
});

toggleChatButton.addEventListener('click', function() {
    chatContent.classList.toggle('collapsed');
    toggleChatButton.textContent = chatContent.classList.contains('collapsed') ? '▲' : '▼';
});

function addChatMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatMessage(message) {
    // Check if the message is about weather
    if (message.toLowerCase().includes('weather')) {
        const city = message.split('weather')[1].trim();
        if (city) {
            fetchWeatherData(city);
        } else {
            addChatMessage('Please provide a city name for the weather information.', 'bot');
        }
    } else {
        // Use Gemini API to handle non-weather-related queries
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
    }
}

function fetchWeatherData(city) {
    if (weatherWidget) {
        weatherWidget.innerHTML = '<div class="loading-spinner"></div>';
    }
    fetch(`${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeatherData(data);
                fetchForecastData(city);
            } else {
                if (weatherWidget) {
                    weatherWidget.innerHTML = '<div class="error-message">City not found. Please try again.</div>';
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (weatherWidget) {
                weatherWidget.innerHTML = '<div class="error-message">An error occurred. Please try again later.</div>';
            }
        });
}

function fetchForecastData(city) {
    fetch(`${OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            forecastData = data.list;
            currentPage = 1;
            displayForecastTable();
            if (window.location.pathname.includes('index.html')) {
                displayCharts(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (forecastTable) {
                forecastTable.innerHTML = '<div class="error-message">An error occurred. Please try again later.</div>';
            }
        });
}

function displayWeatherData(data) {
    if (weatherWidget) {
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
}

function displayForecastTable() {
    if (forecastTable) {
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
}

function displayCharts(data) {
    const labels = data.list.map(item => new Date(item.dt_txt).toLocaleDateString());
    const temperatures = data.list.map(item => item.main.temp);
    const weatherConditions = data.list.map(item => item.weather[0].main);

    // Vertical Bar Chart
    const barCtx = document.getElementById('barChart')?.getContext('2d');
    if (barCtx) {
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: temperatures,
                        backgroundColor: '#3498db',
                        borderColor: '#2980b9',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                animation: {
                    duration: 1000,
                    easing: 'easeInOutBounce',
                    delay: 500
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Doughnut Chart
    const doughnutCtx = document.getElementById('doughnutChart')?.getContext('2d');
    if (doughnutCtx) {
        new Chart(doughnutCtx, {
            type: 'doughnut',
            data: {
                labels: ['Sunny', 'Cloudy', 'Rainy', 'Other'],
                datasets: [
                    {
                        data: [
                            weatherConditions.filter(condition => condition === 'Clear').length,
                            weatherConditions.filter(condition => condition === 'Clouds').length,
                            weatherConditions.filter(condition => condition === 'Rain').length,
                            weatherConditions.filter(condition => !['Clear', 'Clouds', 'Rain'].includes(condition)).length
                        ],
                        backgroundColor: ['#f1c40f', '#7f8c8d', '#2980b9', '#e74c3c']
                    }
                ]
            },
            options: {
                animation: {
                    duration: 1000,
                    easing: 'easeInOutBounce',
                    delay: 500
                }
            }
        });
    }

    // Line Chart
    const lineCtx = document.getElementById('lineChart')?.getContext('2d');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: temperatures,
                        backgroundColor: '#2980b9',
                        borderColor: '#2980b9',
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                animation: {
                    duration: 1000,
                    easing: 'easeInOutBounce',
                    delay: 500
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}