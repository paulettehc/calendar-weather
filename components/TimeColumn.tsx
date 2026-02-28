import { View, Text, StyleSheet } from "react-native";
import dayjs from "dayjs";

const HOUR_HEIGHT = 70;

export default function TimeColumn() {
  return (
    <View style={styles.col}>
      {Array.from({ length: 24 }).map((_, i) => (
        <View key={i} style={{ height: HOUR_HEIGHT }}>
          <Text style={styles.text}>
            {dayjs().hour(i).minute(0).format("h A")}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    width: 60,
    paddingRight: 8,
  },
  text: {
    fontSize: 12,
    color: "#888",
  },
});