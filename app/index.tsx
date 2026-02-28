import { useWeather } from "@/hooks/useWeather";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function DayScreen() {
  // TEMP: hardcode location for now
  const [location, setLocation] = useState({
    name: "Pipe Creek, TX",
    lat: 29.65928,
    lon: -98.8231631,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const { hours, loading, error, currentTemp } = useWeather(location.lat, location.lon, selectedDate); // Austin
  console.log("error: ", error);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation((prev) => ({
        ...prev,
        lat: loc.coords.latitude,
        lon: loc.coords.longitude,
        name: prev.name, // we can update with reverse geocode later
      }));
    })();
  }, []);
  
  async function searchCity(query: string) {
    if (!query) return;

    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query
        )}&count=1`
      );
      const data = await res.json();

      if (data.results?.length) {
        const r = data.results[0];
        console.log("Geocoded result:", r);
        setLocation({
          name: `${r.name}${r.admin1 ? ", " + r.admin1 : ""}`,
          lat: r.latitude,
          lon: r.longitude,
        });
      }
    } catch (e) {
      console.error("Geocode error:", e);
    }
  }
  const ROW_HEIGHT = 96;

  function getNowOffset() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    return (minutes / 60) * ROW_HEIGHT;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0b0b" }}>
      {/* LOCATION SEARCH */}
      <View style={{ padding: 12 }}>
        <TextInput
          placeholder="Search city"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => searchCity(searchQuery)}
          style={{
            backgroundColor: "#111317",
            color: "#fff",
            padding: 12,
            borderRadius: 10,
            marginBottom: 8,
          }}
        />

        <TouchableOpacity
          onPress={async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            const loc = await Location.getCurrentPositionAsync({});
            setLocation((prev) => ({
              ...prev,
              lat: loc.coords.latitude,
              lon: loc.coords.longitude,
              name: "Current Location",
            }));
          }}
          style={{
            backgroundColor: "#222",
            padding: 8,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff" }}>Use Current Location</Text>
        </TouchableOpacity>

        <Text style={{ color: "#fff", marginTop: 8, fontWeight: "600" }}>
          Showing weather for: {location.name}
        </Text>
      </View>
      {loading && (
        <Text style={{ color: "#aaa", textAlign: "center", marginBottom: 8 }}>
          Loading weather…
        </Text>
      )}
      {error && (
        <Text style={{ color: "red", textAlign: "center", marginBottom: 8 }}>
          Error: {error}
        </Text>
      )}
      <ScrollView style={{ flex: 1, backgroundColor: "#f6eeee" }}>
        <View style={{ position: "relative" }}>
          {hours.map((h) => (
            <HourRow key={h.timestamp} hour={h} />
          ))}
          { }
          <View
            style={{
              position: "absolute",
              top: getNowOffset(),
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: "#ff4d4d",
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function HourRow({ hour }: { hour: any }) {
  const now = new Date();
  const isPast = hour.timestamp <= now.getTime();
  return (
    <View
      style={{
        height: 96,
        flexDirection: "row",
        //paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderColor: "#222",
        //backgroundColor: isPast ? "#0f0f0f" : "#0b0b0b",
        opacity: isPast ? 0.8 : 1,
      }}
    >
      <View
        style={{
          width: 92,
          backgroundColor: "#111317",
          paddingVertical: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#9aa9a6", fontSize: 12 }}>
          {hour.hour}:00
        </Text>

        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          {hour.tempF}°
        </Text>

        <Text style={{ color: "#777", fontSize: 11 }}>
          💨 {hour.windMph}
        </Text>

        <Text style={{ color: "#777", fontSize: 11 }}>
          🌧 {hour.precipChance}%
        </Text>
      </View>

      {/* VERTICAL DIVIDER */}
      <View
        style={{
          width: 1,
          backgroundColor: "#383737",
        }}
      />

      {/* EVENT AREA (empty for now) */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#2f2e2e",
          paddingHorizontal: 12,
          justifyContent: "center",
        }}
      >
        {/* events will go here later */}
      </View>
    </View>
  );
}

function CenteredText({ text }: { text: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#999" }}>{text}</Text>
    </View>
  );
}
