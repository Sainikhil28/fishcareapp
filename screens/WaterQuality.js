import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import Speedometer from "react-native-speedometer";
import { ref, set } from "firebase/database";
import { dbRealtime } from "../firebaseConfig";

export default function WaterQuality() {
  const [temperature] = useState(7); // °C
  const [turbidity] = useState(65);   // NTU
  const [phLevel] = useState(8.2);    // pH

  const calculateWaterPurity = () => {
    let score = 100;

    if (turbidity > 50) score -= (turbidity - 50);
    if (phLevel < 6.5 || phLevel > 8.5) score -= 10;
    if (temperature < 20 || temperature > 30) score -= 5;

    return Math.max(0, Math.min(score, 100));
  };

  const purityScore = calculateWaterPurity();

  const triggerWaterChange = async () => {
    try {
      await set(ref(dbRealtime, "/waterChange/trigger"), true);
      Alert.alert("Triggered", "Water change triggered.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to trigger water change.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Water Quality Monitor</Text>

      <View style={styles.speedoContainer}>
        <Speedometer
          value={purityScore}
          totalValue={100}
          size={220}
          outerColor="#cfd8dc"
          internalColor={
            purityScore > 75 ? "#00b894" :
            purityScore > 50 ? "#fdcb6e" :
            "#d63031"
          }
          showText
          text={`${purityScore}%`}
          textStyle={{ color: "#fff", fontSize: 20 }}
          showLabels
          labelStyle={{ color: "#b2bec3" }}
        />
        
        <Text style={styles.purityLabel}>     </Text>
      </View>

      <View style={styles.readingsContainer}>
        <View style={styles.readingBox}>
          <Text style={styles.readingLabel}>🌡️ Temp</Text>
          <Text style={styles.readingValue}>{temperature} °C</Text>
        </View>

        <View style={styles.readingBox}>
          <Text style={styles.readingLabel}>🌫️ Turbidity</Text>
          <Text style={styles.readingValue}>{turbidity} NTU</Text>
        </View>

        <View style={styles.readingBox}>
          <Text style={styles.readingLabel}>⚗️ pH</Text>
          <Text style={styles.readingValue}>{phLevel}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Change Water Now"
          onPress={triggerWaterChange}
          color="#ff4d4d"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08192d",
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  speedoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  purityLabel: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "600",
    color: "#61dafb",
  },
  readingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  readingBox: {
    alignItems: "center",
    backgroundColor: "#0e2946",
    padding: 15,
    borderRadius: 10,
    width: "30%",
  },
  readingLabel: {
    fontSize: 14,
    color: "#b2bec3",
    marginBottom: 5,
    fontWeight: "600",
  },
  readingValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  buttonContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
});
