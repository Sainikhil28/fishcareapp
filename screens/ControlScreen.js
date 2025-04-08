import React from "react";
import { View, Button } from "react-native";
import { db } from "../firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";

const ControlScreen = () => {
  const handleFeedFish = async () => {
    await updateDoc(doc(db, "sensorData", "lastFeed"), { time: new Date().toISOString() });
  };

  return (
    <View>
      <Button title="Feed the Fish" onPress={handleFeedFish} />
      <Button title="Change Water" onPress={() => console.log("Water changed")} />
    </View>
  );
};

export default ControlScreen;
