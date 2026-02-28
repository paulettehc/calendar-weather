import { WeatherHour } from "@/models/weather";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

type OpenMeteoResponse = {
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    windspeed_10m: number[];
  };
};

export async function fetchHourlyWeather(
  latitude: number,
  longitude: number,
  date: Date
): Promise<WeatherHour[]> {
  const dayStr = date.toISOString().split("T")[0];

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: "temperature_2m,precipitation_probability,windspeed_10m",
    temperature_unit: "fahrenheit",
    windspeed_unit: "mph",
    timezone: "auto",
    start_date: dayStr,
    end_date: dayStr,
  });

  const res = await fetch(`${OPEN_METEO_URL}?${params.toString()}`);
  console.log(`${OPEN_METEO_URL}?${params.toString()}`);
  console.log("--------------------");
  if (!res.ok) {
    console.log("Weather API error:", res.status, await res.text());
    throw new Error("Weather fetch failed");
  }

  //const data: OpenMeteoResponse = await res.json();
  const json = await res.json();
  console.log("Geocode response:", json);

  if (!json.hourly) {
    console.log("No hourly data in response:", json);
    throw new Error("No weather returned");

  }
  const { time, temperature_2m, precipitation_probability, windspeed_10m } =
    json.hourly;

  return time.map((t: string, i: number) => {
    const d = new Date(t);

    return {
      timestamp: t,
      hour: d.getHours(),
      tempF: Math.round(temperature_2m[i]),
      precip: precipitation_probability[i] ?? 0,
      wind: Math.round(windspeed_10m[i] ?? 0),
    };
  });
}