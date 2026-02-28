
import { View, Text, StyleSheet } from "react-native";
import { CalendarEvent } from "../services/calendarService";

const HOUR_HEIGHT = 70;

export default function EventBlock({ event }: { event: CalendarEvent }) {
  const start = event.start.getHours() + event.start.getMinutes() / 60;
  const end = event.end.getHours() + event.end.getMinutes() / 60;

  const top = start * HOUR_HEIGHT;
  const height = (end - start) * HOUR_HEIGHT;

  return (
    <View style={[styles.block, { top, height }]}>
      <Text style={styles.title}>{event.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    position: "absolute",
    left: 0,
    right: 8,
    backgroundColor: "#4F8EF7",
    borderRadius: 12,
    padding: 8,
  },
  title: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
});