const apiKey = "671ff1bb08855dbb09163633c512dd76"; 
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherResult = document.getElementById("weather-result");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weather-icon");
const errorMessage = document.getElementById("error-message");
const forecastContainer = document.getElementById("forecast");

async function fetchWeather(city) {
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}&units=metric&lang=pt`);
        if (!response.ok) {
            throw new Error("Cidade não encontrada.");
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        displayError(error.message);
    }
}

async function fetchForecast(city) {
    try {
        const response = await fetch(`${forecastApiUrl}${city}&appid=${apiKey}&units=metric&lang=pt`);
        if (!response.ok) {
            throw new Error("Erro ao buscar previsão estendida.");
        }
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error(error.message);
    }
}

function displayWeather(data) {
    errorMessage.classList.add("hidden");
    weatherResult.classList.remove("hidden");
    cityName.textContent = data.name;
    temperature.textContent = `Temperatura: ${data.main.temp}°C`;
    description.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherIcon.alt = data.weather[0].description;

    const sunrise = convertTimestampToTime(data.sys.sunrise);
    const sunset = convertTimestampToTime(data.sys.sunset);

    document.getElementById("sunrise").textContent = `Nascer do Sol: ${sunrise}`;
    document.getElementById("sunset").textContent = `Pôr do Sol: ${sunset}`;
}

function displayForecast(data) {
    forecastContainer.innerHTML = "";
    const dailyForecasts = data.list.filter((entry) => entry.dt_txt.includes("12:00:00"));

    dailyForecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString("pt-BR");
        const temp = `${forecast.main.temp}°C`;
        const description = forecast.weather[0].description;
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card");
        forecastCard.innerHTML = `
            <p>${date}</p>
            <img src="${iconUrl}" alt="${description}" />
            <p>${description}</p>
            <p>${temp}</p>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}

function convertTimestampToTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function displayError(message) {
    weatherResult.classList.add("hidden");
    errorMessage.classList.remove("hidden");
    errorMessage.textContent = message;
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        fetchForecast(city);
    } else {
        displayError("Por favor, insira o nome de uma cidade.");
    }
});
