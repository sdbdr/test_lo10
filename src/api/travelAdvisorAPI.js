/* eslint-disable consistent-return */
import axios from "axios";

export const getPlacesData = async (type, sw, ne) => {
  try {
    const {
      data: { data },
    } = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      {
        params: {
          bl_latitude: sw.lat,
          bl_longitude: sw.lng,
          tr_longitude: ne.lng,
          tr_latitude: ne.lat,
        },
        headers: {
          "x-rapidapi-key": process.env.REACT_APP_RAPID_API_TRAVEL_API_KEY,
          "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
        },
      }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getWeatherData = async (lat, lng) => {
  try {
    const apiKey = process.env.REACT_APP_RAPID_API_WEATHER_API_KEY;
    if (lat && lng) {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${apiKey}`,
        {
          params: { lat, lon: lng },
        }
      );

      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const login = async (username, password) => {
  return fetch("http://localhost:8080/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
};

const deleteSessionCookie = () => {
  document.cookie =
    "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const logout = async () => {
  deleteSessionCookie();
  return fetch("http://localhost:8080/api/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
