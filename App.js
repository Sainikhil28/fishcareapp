import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './components/BottomTabNavigator';
import { FirebaseDataProvider } from './FirebaseDataContext'; // adjust path

export default function App() {
  return (
    <FirebaseDataProvider>
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
    </FirebaseDataProvider>
  );
}
