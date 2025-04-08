import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const DashboardScreen = ({ navigation }) => {
  const [fishData, setFishData] = useState([]);
  
  useEffect(() => {
    const fetchFishData = async () => {
      const querySnapshot = await getDocs(collection(db, "fishData"));
      setFishData(querySnapshot.docs.map(doc => doc.data()));
    };
    fetchFishData();
  }, []);

  return (
    <View>
      <Text>Fish Details:</Text>
      {fishData.map((fish, index) => (
        <Text key={index}>{fish.breed} - {fish.count} fish</Text>
      ))}
      <Button title="Add Fish" onPress={() => navigation.navigate("Add Fish")} />
    </View>
  );
};

export default DashboardScreen;
