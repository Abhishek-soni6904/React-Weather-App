import React, { useEffect, useState } from 'react';
import Search from './Search';

export default function Weather() {
    const [searchCity, setSearchCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCurrentLocationWeather = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setSearchCity(`${latitude},${longitude}`);
                    },
                    (err) => {
                        setError('Failed to fetch location: ' + err.message);
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser. You have to manually search ');
            }
        };

        fetchCurrentLocationWeather();
    }, []);
    useEffect(() => {
        if (!searchCity) return;
        fetchWeather();
    }, [searchCity]);
    const getWeatherClass = (condition) => {
        condition = condition.toLowerCase();
        if (condition.includes('clear') || condition.includes('sunny')) return 'clear';
        if (condition.includes('rain') || condition.includes('drizzle')) return 'rain';
        if (condition.includes('cloud') || condition.includes('overcast')) return 'clouds';
        if (condition.includes('snow') || condition.includes('ice') || condition.includes('sleet')) return 'snow';
        return '';
    }
    const fetchWeather = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=777c08406c6e46e3a9d114236251803&q=${searchCity}`
            );

            if (!response.ok) throw new Error('City not found or API error');

            const data = await response.json();
            setWeather(data);
        } catch (error) {
            setError('Error Occurred: ' + error.message);
            setWeather(null);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="weather-container">
            <Search setSearchCity={setSearchCity} setError={setError} />
            <button onClick={fetchWeather}>Reload</button>
            {error && <p className="error-message">{error}</p>}
            {loading && <p className="loading">Loading.....</p>}

            {weather && !loading && !error && (
                <div className={`weather-details ${getWeatherClass(weather.current.condition.text)}`}>
                    <h2 className="weather-header">{weather.location.name}, {weather.location.country}</h2>
                    <p>{weather.location.localtime}</p>
                    <img src={weather.current.condition.icon} alt={weather.current.condition.text} />
                    <h3 className="weather-info">{weather.current.temp_c}°C ({weather.current.temp_f}°F)</h3>
                    <p className="weather-info">{weather.current.condition.text}</p>
                    <p className="weather-info">Feels like: {weather.current.feelslike_c}°C</p>
                    <p className="weather-info">Humidity: {weather.current.humidity}%</p>
                    <p className="weather-info">Wind: {weather.current.wind_kph} km/h ({weather.current.wind_dir})</p>
                    <p className="weather-info">Pressure: {weather.current.pressure_mb} mb</p>
                    <p className="weather-info">Visibility: {weather.current.vis_km} km</p>
                    <p className="weather-info">UV Index: {weather.current.uv}</p>
                </div>
            )}
        </div>
    );
}
