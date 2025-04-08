import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { ref, set } from "firebase/database";
import { dbRealtime } from "../firebaseConfig";

export default function FishFeed() {
  const [animateFood] = useState(new Animated.Value(0));
  const [isFeeding, setIsFeeding] = useState(false);

  const triggerFeed = async () => {
    try {
      await set(ref(dbRealtime, "/servoMotor/trigger"), true);
      Alert.alert("Feeding Triggered", "Servo motor will dispense food.");
      setIsFeeding(true);
      animateFishFood();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to trigger feeding.");
    }
  };

  const animateFishFood = () => {
    animateFood.setValue(0);
    Animated.timing(animateFood, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => setIsFeeding(false));
  };

  const foodDrop = animateFood.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 300],
  });

  const foodOpacity = animateFood.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🍽️ Fish Feed</Text>

      <ImageBackground
        source={{
          uri: "https://st.depositphotos.com/1054144/2479/i/450/depositphotos_24796455-stock-photo-feeding-fish.jpg",
        }}
        style={styles.imageContainer}
        imageStyle={{ borderRadius: 15 }}
      >
        {isFeeding && (
          <Animated.View
            style={[
              styles.foodParticle,
              {
                transform: [{ translateY: foodDrop }],
                opacity: foodOpacity,
              },
            ]}
          >
            <Text style={styles.foodEmoji}>🟤</Text>
          </Animated.View>
        )}
      </ImageBackground>

      <TouchableOpacity style={styles.feedButton} onPress={triggerFeed}>
        <Text style={styles.feedButtonText}>Feed Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08192d",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 30,
  },
  foodParticle: {
    position: "absolute",
    top: 10,
  },
  foodEmoji: {
    fontSize: 24,
  },
  feedButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  feedButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
