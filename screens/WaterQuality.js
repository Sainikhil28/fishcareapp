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
import { ref, set } from 'firebase/database';
import { dbRealtime } from '../firebaseConfig';

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
  if (percent <= 35) return '#ff4d4d';
  if (percent <= 70) return '#ffd700';
  return '#2692D0';
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
    const waterChangeRef = ref(dbRealtime, 'waterChange');
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

  const size = 200;
  const strokeWidth = 20;
  const radius = size / 2;
  const angle = (WATER_QUALITY_PERCENT / 100) * 360 - 90; // start from top
  const radians = (angle * Math.PI) / 180;
  const edgeX = radius + radius * Math.cos(radians);
  const edgeY = radius + radius * Math.sin(radians);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Water Quality Analysis</Text>

      <View style={styles.speedometerWrapper}>
        <View style={styles.speedometerContainer}>
          <AnimatedCircularProgress
            size={size}
            width={strokeWidth}
            fill={WATER_QUALITY_PERCENT}
            tintColor={speedometerColor}
            backgroundColor="#e0e0e0"
            rotation={-360}
            arcSweepAngle={360}
            lineCap="round"
          />
          {/* Floating percentage at arc end */}
          <View
            style={[
              styles.percentageBubble,
              {
                left: edgeX - 20,
                top: edgeY - 10,
                backgroundColor: speedometerColor,
              },
            ]}
          >
            <Text style={styles.bubbleText}>{WATER_QUALITY_PERCENT}%</Text>
          </View>

          <TouchableOpacity
            style={[styles.centerButton, { backgroundColor: speedometerColor }]}
            onPress={handleChangeWater}
          >
            <Text style={styles.centerButtonText}>Change Water</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.feedButtonWrapper}>
  <TouchableOpacity style={styles.feedButton}>
    <Text style={styles.feedButtonText}>Fetch Stats</Text>
  </TouchableOpacity>
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
    position: 'relative',
  },
  centerButton: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
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
  feedButtonWrapper: {
  alignItems: 'center',

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
  percentageBubble: {
    position: 'absolute',
    width: 50,
    height: 25,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 6,
  },
  bubbleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  feedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2692D0',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 28,
    alignSelf: 'center',
    elevation: 4,
    marginBottom: 10,
  },
  feedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default WaterQualityScreen;
