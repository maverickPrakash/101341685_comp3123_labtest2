import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [currentDayData, setCurrentDayData] = useState(null);
  const [nextSixDaysData, setNextSixDaysData] = useState(null);
  const [city, setCity] = useState('Toronto');
  const [inputCity, setInputCity] = useState('');
  const API_KEY = 'f220b7c0920dba8116b2364f392e6191';

  useEffect(() => {
    const fetchCurrentDayData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        setCurrentDayData(response.data);
      } catch (error) {
        console.error('Error fetching current day data:', error);
      }
    };

    const fetchNextSixDaysData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${8*7}&appid=${API_KEY}`
        );
        setNextSixDaysData(response.data);
      } catch (error) {
        console.error('Error fetching next six days data:', error);
      }
    };

    fetchCurrentDayData();
    fetchNextSixDaysData();
  }, [city, API_KEY]);

  const handleInputChange = (event) => {
    setInputCity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setCity(inputCity);
  };

  const filterDailyData = (data) => {
    const dailyData = [];
    const groupedData = {};

    data.list.forEach(item => {
      const dateKey = item.dt_txt.split(' ')[0];
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = [];
      }
      groupedData[dateKey].push(item);
    });

    Object.keys(groupedData).forEach(dateKey => {
      const dayTemperatures = groupedData[dateKey];
      const minTemperature = Math.min(...dayTemperatures.map(item => item.main.temp - 273.15));
      const maxTemperature = Math.max(...dayTemperatures.map(item => item.main.temp - 273.15));

      dailyData.push({
        date: new Date(dayTemperatures[0].dt_txt).toLocaleDateString('en-US', { weekday: 'long' }),
        minTemperature: Math.round(minTemperature),
        maxTemperature: Math.round(maxTemperature),
        icon: dayTemperatures[0].weather[0].icon,
      });
    });

    return dailyData;
  };

  return (
    <div>
      <h2>Weather Forecast for {city} created By Prakash Kumar - 101341685</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Enter City:
          <input type="text"  placeholder="Enter City " value={inputCity} onChange={handleInputChange} style={{padding: '12px 20px',
  margin: '8px 0',
  display: 'inline-block',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box', }} />
        </label>
        <button type="submit"  style={{padding: '12px 20px',
  margin: '8px 0',
  display: 'inline-block',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box',background:"#042cbd",color:"white"}} >Submit</button>
      </form>
      <div className='weather' style={{background:'#083eff', color:'white', borderRadius:'40px',margin:'10px'}}>

      {currentDayData && (
        
        <div style={{background:"#3458eb", padding:'20px'}}>
          <h3>Current Weather  </h3>
          <div className='currentBody'>
          <img src={`http://openweathermap.org/img/wn/${currentDayData.weather[0].icon}.png`} alt="Weather Icon"  width={200} height={200}/>
          <div>
          <p>Day: {new Date(currentDayData.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
          <p>Temp: {Math.round(currentDayData.main.temp - 273.15)} &#176; C</p>
          <p>Min : {Math.round(currentDayData.main.temp_min - 273.15)} &#176;C </p>
          <p>Max : {Math.round(currentDayData.main.temp_max - 273.15)} &#176;C </p>

          <p>Feels Like: {Math.round(currentDayData.main.feels_like - 273.15)} &#176; C</p>
          <p>Wind Speed: {currentDayData.wind.speed} m/s</p>
          </div>
          </div>
          
        </div>
      )}

      {nextSixDaysData && (
        <div>
          <h3>Next Six Days</h3>
          <div style={{display:'flex'}}>
          {filterDailyData(nextSixDaysData).map((day, index) => (
            <div key={index} style={{marginLeft:'90px'}}>
              <p>Day: {day.date}</p>
              <img src={`http://openweathermap.org/img/wn/${day.icon}.png`} alt="Weather Icon" />
              <p>Min : {day.minTemperature} &#176;C </p>
              <p>Max : {day.maxTemperature} &#176;C </p>
              
            </div>
          ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Weather;
