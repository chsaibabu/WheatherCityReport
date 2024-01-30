import React, { useState, useEffect } from 'react';
import './style.css';

function App() {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherForecast = () => {
    setLoading(true);
    setError('');

    const apiKey = '1635890035cbba097fd5c26c8ea672a1'; // Replace with your API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('City not found');
        }
        return response.json();
      })
      .then((data) => {
        // Group forecast data by date
        const groupedForecast = {};
        data.list.forEach((item) => {
          const date = new Date(item.dt_txt).toLocaleDateString(); // Convert date string to date object and format as locale date string
          if (!groupedForecast[date]) {
            groupedForecast[date] = [];
          }
          groupedForecast[date].push(item);
        });
        setForecast(groupedForecast);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setError('City not found');
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== '') {
      fetchWeatherForecast();
    }
  };

  return (
    <div className="container">
      <div className="nav mt-4 mb-4 ms-0 me-0">
        <h1 className="heading text fs-2">Weather in City Your</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="input me-1"
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="button" type="submit">
            Search
          </button>
        </form>
        {loading && <div className="load">Loading...</div>}
        {error && <div>{error}</div>}
      </div>
      <div className="row">
        {!loading &&
          Object.keys(forecast).length > 0 &&
          Object.keys(forecast).map((date) => {
            const values = forecast[date];
            const lastValue = values[values.length - 1];
            return (
              <div key={date} className="col-12 col-md-3 col-lg-2">
                <table className="table table-sm text-center">
                  <thead>
                    <tr>
                      <th colspan="2" className="date">
                        Date: {date}
                      </th>
                    </tr>
                    <tr>
                      <th colspan="2" className="bg-secondary">
                        Temperatures
                      </th>
                    </tr>
                    <tr>
                      {/* <th>date</th> */}
                      {/* <th>Date/Time</th> */}

                      <th className="bg-light">Min</th>
                      <th className="bg-light">Max</th>
                      {/* <th>Pressure</th> */}
                      {/* <th>Humidity</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="bg-light">{lastValue?.main?.temp_min}</td>
                      <td className="bg-light">{lastValue?.main?.temp_max}</td>
                    </tr>
                    <tr>
                      <td>Pressure</td>
                      <td>{lastValue?.main?.pressure}</td>
                    </tr>
                    <tr>
                      <td>Humidity</td>
                      <td>{lastValue?.main?.humidity}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
