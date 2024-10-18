# Weather Dashboard with Chatbot Integration

## Overview
This project is a weather dashboard that provides current weather information and a 5-day forecast for a specified city. It also includes a chatbot integration using the Gemini API. The dashboard is built using HTML, CSS, and JavaScript, and it leverages the OpenWeather API for weather data and Chart.js for data visualization.

## Features
- **Current Weather Information**: Displays the current weather for a specified city.
- **5-Day Forecast**: Provides a 5-day weather forecast with pagination.
- **Weather Charts**: Includes vertical bar, doughnut, and line charts to visualize weather data.
- **Chatbot Integration**: Uses the Gemini API to handle user queries.
- **Filters**: Allows users to sort temperatures, filter rainy days, and find the highest temperature.
- **Responsive Design**: Ensures the dashboard is usable on various devices.

## Project Structure
```
weather-dashboard/
│
├── 

index.html

          # Main dashboard page
├── tables.html         # 5-day forecast table page
├── styles.css          # CSS styles
├── app.js              # JavaScript for API calls and interactivity
├── profile-pic.png     # User profile picture
└── README.md           # Project documentation
```

## Setup and Installation
1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-username/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Open the project in your preferred code editor**.

3. **Update API keys**:
   - Open `app.js` and replace `'your_openweather_api_key'` and `'your_gemini_api_key_here'` with your actual API keys.

## Usage
1. **Open `index.html` in your browser**:
   - This is the main dashboard where you can enter a city name and get the current weather and 5-day forecast.

2. **Navigate to the Tables page**:
   - Click on the "Tables" link in the sidebar to view the 5-day forecast table with pagination and filters.

3. **Interact with the Chatbot**:
   - Use the chatbot input to ask weather-related questions or general queries.

## Deployment
To deploy the project using GitHub Pages:
1. **Create a GitHub repository**:
   - Go to [GitHub](https://github.com/) and create a new repository.

2. **Push your project to GitHub**:
   ```sh
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/weather-dashboard.git
   git push -u origin master
   ```

3. **Enable GitHub Pages**:
   - Go to the repository settings on GitHub.
   - Scroll down to the `GitHub Pages` section.
   - Under `Source`, select the `main` branch and click `Save`.

4. **Access your live site**:
   - Your site will be published at `[https://your-username.github.io/weather-dashboard/](https://rayyan9477.github.io/Weather-Dashboard/index.html)`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgements
- [OpenWeather API](https://openweathermap.org/api)
- [Gemini API](https://ai.google.dev/aistudio)
- [Chart.js](https://www.chartjs.org/)
