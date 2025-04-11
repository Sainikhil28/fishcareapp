import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/Ionicons';

import { ref, set, push, query, orderByChild, limitToLast, get } from 'firebase/database';
import { dbRealtime } from '../firebaseConfig'; // ✅ Import from your config

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 28;
const WATER_QUALITY_PERCENT = 75;

const cards = [
  { id: '1', title: 'Water', value: '2.1 liters', icon: 'water-outline', height: 250 },
  { id: '2', title: 'Temp', value: '26.28°C', icon: 'thermometer-outline', height: 150 },
  { id: '3', title: 'Turbidity', value: '510.43 NTU', icon: 'cloudy-outline', height: 150 },
  { id: '4', title: 'pH', value: '7.2', icon: 'flask-outline', height: 150 },
];

const getColorByWaterQuality = (percent) => {
  if (percent <= 35) return '#ff4d4d'; // Red
  if (percent <= 70) return '#ffd700'; // Yellow
  return '#2692D0'; // Blue
};

const Card = ({ title, value, icon, height, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          height,
          opacity: fadeAnim,
          transform: [{ translateY }],
          justifyContent: 'center',
        },
      ]}
    >
      <Icon name={icon} size={30} color="#2692D0" style={{ marginBottom: 10 }} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>

      {title === 'Water' && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.cardSubLabel}>Water Quality</Text>
          <Text style={styles.cardSubValue}>{WATER_QUALITY_PERCENT}%</Text>
        </View>
      )}
    </Animated.View>
  );
};

const WaterQualityScreen = () => {
  const leftColumnCards = cards.filter((_, i) => i % 2 === 0);
  const rightColumnCards = cards.filter((_, i) => i % 2 !== 0);

  const speedometerColor = getColorByWaterQuality(WATER_QUALITY_PERCENT);

  const handleChangeWater = () => {
    const waterChangeRef = ref(dbRealtime, 'waterChange'); // ✅ Using your dbRealtime
    set(waterChangeRef, {
      change: true,
      timestamp: Date.now(),
    })
      .then(() => {
        console.log('Water change triggered');
      })
      .catch((error) => {
        console.error('Error updating waterchange:', error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Water Quality Analysis</Text>

      <View style={styles.speedometerWrapper}>
        <View style={styles.speedometerContainer}>
          <AnimatedCircularProgress
            size={200}
            width={20}
            fill={WATER_QUALITY_PERCENT}
            tintColor={speedometerColor}
            backgroundColor="#e0e0e0"
            rotation={-360}
            arcSweepAngle={360}
            lineCap="round"
          />
          <TouchableOpacity style={styles.centerButton} onPress={handleChangeWater}>
            <Text style={styles.centerButtonText}>Change Water</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subheading}>Stats</Text>

      <View style={styles.columnsContainer}>
        <View style={styles.column}>
          {leftColumnCards.map((item, index) => (
            <Card key={item.id} {...item} delay={index * 150} />
          ))}
        </View>
        <View style={styles.column}>
          {rightColumnCards.map((item, index) => (
            <Card key={item.id} {...item} delay={index * 150 + 75} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 100,
    paddingHorizontal: 20,
    backgroundColor: '#e6f2fb',
  },
  heading: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
  },
  speedometerWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  speedometerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2692D0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  centerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subheading: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: CARD_WIDTH,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2692D0',
    marginTop: 6,
  },
  cardSubLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  cardSubValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2692D0',
    textAlign: 'center',
  },
});

export default WaterQualityScreen;