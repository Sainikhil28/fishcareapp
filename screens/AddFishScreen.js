import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AddFishScreen = ({ navigation }) => {
  const [breed, setBreed] = useState("");
  const [count, setCount] = useState("");

  const handleAddFish = async () => {
    await addDoc(collection(db, "fishData"), { breed, count });
    navigation.goBack();
  };

  return (
    <View>
      <TextInput placeholder="Breed Name" value={breed} onChangeText={setBreed} />
      <TextInput placeholder="Number of Fish" value={count} onChangeText={setCount} />
      <Button title="Add Fish" onPress={handleAddFish} />
    </View>
  );
};

export default AddFishScreen;
