import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import 'react-native-gesture-handler'; 
import 'react-native-reanimated';
import Dashboard from "./screens/Dashboard";
import AddFish from "./screens/AddFish";
import WaterQuality from "./screens/WaterQuality";
import FishFeed from "./screens/FishFeed";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="AddFish" component={AddFish} />
        <Stack.Screen name="WaterQuality" component={WaterQuality} />
        <Stack.Screen name="FishFeed" component={FishFeed} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
