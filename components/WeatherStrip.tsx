import { View, Text, StyleSheet } from "react-native";
import { WeatherHour } from "../models/weather";

const HOUR_HEIGHT = 70;

export default function WeatherStrip({ weather }: { weather: WeatherHour[] }) {
  return (
    <View style={styles.col}>
      {weather.map((w, i) => (
        <View key={i} style={{ height: HOUR_HEIGHT, alignItems: "center" }}>
          <Text style={styles.temp}>{w.tempF}°</Text>
          <Text style={styles.small}>💨 {w.windMph}</Text>
          <Text style={styles.small}>🌧 {w.precipChance}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    width: 56,
    borderRightWidth: 1,
    borderColor: "#eee",
  },
  temp: {
    fontWeight: "600",
  },
  small: {
    fontSize: 10,
    color: "#666",
  },
});