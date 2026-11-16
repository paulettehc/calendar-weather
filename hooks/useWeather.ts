import { WeatherHour } from "@/models/weather";
import { fetchHourlyWeather } from "@/services/weatherService";
import { useEffect, useState } from "react";

export function useWeather(
  lat: number | null,
  lon: number | null,
  date: Date = new Date()
) {
  const [hours, setHours] = useState<WeatherHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTemp, setCurrentTemp] = useState<number>();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (lat == null || lon == null) {
        setHours([]);
        setCurrentTemp(undefined);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchHourlyWeather(lat, lon, date);
        if (cancelled) return;

        setHours(data);


        // ✅ filter to selected day
        //const start = new Date(date);
        //start.setHours(0, 0, 0, 0);

        //const end = new Date(start);
        //end.setDate(end.getDate() + 1);
        //const filtered = data.filter(
        //  (h) =>
        //    h.timestamp >= start.getTime() &&
        //    h.timestamp < end.getTime()
        //);
                
        // closest hour
        const now = Date.now();
        const closest = data.reduce((a, b) =>
          Math.abs(new Date(a.timestamp).getTime() - now) <
          Math.abs(new Date(b.timestamp).getTime() - now)
            ? a
            : b
        );

        
        setCurrentTemp(closest.tempF);
      } catch (e: any) {
        console.log("Weather load error:", e);
        if (!cancelled) setError(e.message);
      } finally {
        console.log("Weather load complete");
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [lat, lon, date]);

  return { hours: hours ?? [], loading, error, currentTemp };
}
