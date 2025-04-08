import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity,
  Image,
} from "react-native";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const SwimmingFish = () => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    ).start();
  }, []);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  return (
    <Animated.Text style={[styles.fishIcon, { transform: [{ translateX }] }]}>
      🐠
    </Animated.Text>
  );
};

export default function AddFish({ navigation }) {
  const [breedCount, setBreedCount] = useState("");
  const [breeds, setBreeds] = useState([]);

  const handleBreedCountSubmit = () => {
    const count = parseInt(breedCount);
    if (isNaN(count) || count <= 0) {
      Alert.alert("Invalid", "Please enter a valid number.");
      return;
    }
    const breedInputs = Array.from({ length: count }, () => ({
      breed: "",
      number: "",
    }));
    setBreeds(breedInputs);
  };

  const handleInputChange = (index, field, value) => {
    const updatedBreeds = [...breeds];
    updatedBreeds[index][field] = value;
    setBreeds(updatedBreeds);
  };

  const handleSubmit = async () => {
    if (
      breeds.some(
        (item) => !item.breed || !item.number || isNaN(parseInt(item.number))
      )
    ) {
      Alert.alert("Error", "Please fill all breed fields correctly.");
      return;
    }

    try {
      for (const item of breeds) {
        await addDoc(collection(db, "fishDetails"), {
          breed: item.breed,
          number: parseInt(item.number),
          lastFed: "Not fed yet",
          lastWaterCheck: "Not changed yet",
        });
      }

      Alert.alert("Success", "All fish breeds added!");
      setBreeds([]);
      setBreedCount("");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add fish details.");
    }
  };

  const renderFishTank = (count) => {
    const fishCount = parseInt(count);
    if (isNaN(fishCount) || fishCount <= 0) return null;

    return (
      <View style={styles.tank}>
        <Text style={styles.tankLabel}>🐟 Fish Tank</Text>
        <View style={styles.fishRow}>
          {Array.from({ length: fishCount }).map((_, i) => (
            <SwimmingFish key={i} />
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!breeds.length ? (
        <>
          <Text style={styles.label}>
            How many fish breeds do you want to add?
          </Text>
          <TextInput
            style={styles.input}
            value={breedCount}
            onChangeText={setBreedCount}
            keyboardType="numeric"
            placeholder="Enter number of breeds"
            placeholderTextColor="#a0b0c0"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleBreedCountSubmit}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>

          <Image
            source={{
              uri: "https://content.invisioncic.com/Mnanoreef/imageproxy/14468199193_af3096c19e_z.jpg.c0f4b90af91bcaf51bf107dc97bb5b4e.jpg",
            }}
            style={styles.fishImage}
          />
        </>
      ) : (
        <>
          {breeds.map((item, index) => (
            <View key={index} style={styles.breedBlock}>
              <Text style={styles.subheading}>Breed {index + 1}</Text>
              <TextInput
                placeholder="Breed Name"
                placeholderTextColor="#a0b0c0"
                style={styles.input}
                value={item.breed}
                onChangeText={(text) =>
                  handleInputChange(index, "breed", text)
                }
              />
              <TextInput
                placeholder="Number of Fish"
                placeholderTextColor="#a0b0c0"
                style={styles.input}
                keyboardType="numeric"
                value={item.number}
                onChangeText={(text) =>
                  handleInputChange(index, "number", text)
                }
              />
              {renderFishTank(item.number)}
            </View>
          ))}
          <TouchableOpacity
            style={[styles.button, { marginBottom: 40 }]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Add Fish Breeds</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#08192d",
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#1a73e8",
    backgroundColor: "#102840",
    color: "#ffffff",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  subheading: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
    color: "#61dafb",
  },
  breedBlock: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#0e2946",
    borderRadius: 10,
  },
  tank: {
    backgroundColor: "#193c57",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  tankLabel: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#61dafb",
  },
  fishRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
    height: 40,
  },
  fishIcon: {
    fontSize: 22,
    margin: 5,
  },
  button: {
    backgroundColor: "#1a73e8",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fishImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 20,
  },
});
