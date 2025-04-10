import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import Addfish from '../screens/AddFish';
import FeedFish from '../screens/FeedFish';
import WaterQuality from '../screens/WaterQuality';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Alert } from 'react-native';
import { useFirebaseData } from '../FirebaseDataContext'; // adjust path


const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children }) => {
  const { setFishData } = useFirebaseData();

  const handleRefresh = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'fishDetails'));
      const updates = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFishData(updates);
      //Alert.alert('Refreshed!', 'Home screen data updated.');
    } catch (error) {
      console.error('Error refreshing:', error);
      Alert.alert('Error', 'Could not refresh from Firebase.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.customButton}
      onPress={handleRefresh}
      activeOpacity={0.8}
    >
      <View style={styles.customButtonInner}>{children}</View>
    </TouchableOpacity>
  );
};


const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" size={28} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Fish"
        component={Addfish}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="fish-outline" size={28} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Refresh"
        component={() => null}
        options={({ navigation }) => ({
          tabBarIcon: () => (
            <Icon name="refresh-circle" size={30} color="white" />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} navigation={navigation} />
          ),
        })}
      />

      <Tab.Screen
        name="WaterQuality"
        component={WaterQuality}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="water-outline" size={28} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="FeedFish"
        component={FeedFish}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="restaurant-outline" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#D4F1F4',
    height: 70,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 0,
  },
  customButton: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2692D0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6d42e4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default BottomTabNavigator;
