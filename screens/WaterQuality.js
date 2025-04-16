import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import { ref, set, onValue, get } from 'firebase/database';

import { dbRealtime } from '../firebaseConfig';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 28;

const getColorByWaterQuality = (percent) => {
  if (percent <= 35) return '#ff4d4d';
  if (percent <= 70) return '#ffd700';
  return '#2692D0';
};

const Card = ({ title, value, icon, height, delay, score, onPress }) => {
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
      <TouchableOpacity onPress={onPress}>
        <Icon name={icon} size={30} color="#2692D0" style={{ marginBottom: 10 }} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </TouchableOpacity>

      {title === 'Water Level' && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.cardSubLabel}>Water Quality</Text>
          <Text style={styles.cardSubValue}>{score}%</Text>
        </View>
      )}
    </Animated.View>
  );
};

const WaterQualityScreen = () => {
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalStep, setModalStep] = useState('loading');
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    ph: '0',
    turbidity: 0,
    waterLevel: 0,
  });
  const [waterQualityScore, setWaterQualityScore] = useState(0);
  const [waterLevelModalVisible, setWaterLevelModalVisible] = useState(false);
  const [newWaterLevel, setNewWaterLevel] = useState('');

  const handleChangeWater = () => {
    setModalMessage('Changing water...');
    setLoadingModalVisible(true);
    setModalStep('loading');

    const waterChangeRef = ref(dbRealtime, 'waterChange');
    set(waterChangeRef, {
      change: true,
      timestamp: Date.now(),
    })
      .then(() => console.log('Water change triggered'))
      .catch((error) => console.error('Error updating water change:', error))
      .finally(() => {
        setTimeout(() => {
          setModalStep('success');
          setModalMessage('Success!');
        }, 1500);

        setTimeout(() => {
          setLoadingModalVisible(false);
          setModalStep('loading');
        }, 3000);
      });
  };

  const handleFetchStats = async () => {
    setModalMessage('Fetching latest stats...');
    setLoadingModalVisible(true);
    setModalStep('loading');

    try {
      const sensorRef = ref(dbRealtime, 'sensorReadings');
      const snapshot = await get(sensorRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setSensorData(data);

        const ph = parseFloat(data.ph);
        const turbidity = parseFloat(data.turbidity);
        const temperature = parseFloat(data.temperature);

        const phScore = 10 - Math.abs(7 - ph);
        const turbidityScore = 10 - turbidity;
        const tempScore = 10 - Math.abs(25 - temperature);

        const score = Math.max(0, ((phScore + turbidityScore + tempScore) / 3) * 10).toFixed(0);
        setWaterQualityScore(score);

        console.log('Stats fetched!');
        setModalStep('success');
        setModalMessage('Success!');
      } else {
        console.log('No data available');
        setModalStep('success');
        setModalMessage('No data found');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setModalStep('success');
      setModalMessage('Error fetching stats');
    }

    setTimeout(() => {
      setLoadingModalVisible(false);
      setModalStep('loading');
    }, 3000);
  };

  const handleWaterLevelUpdate = () => {
    if (newWaterLevel.trim() === '') {
      alert('Please enter a valid water level');
      return;
    }

    const waterLevelRef = ref(dbRealtime, 'sensorReadings/waterLevel');
    set(waterLevelRef, parseInt(newWaterLevel))
      .then(() => {
        setSensorData({ ...sensorData, waterLevel: newWaterLevel });
        setWaterLevelModalVisible(false);
        console.log('Water level updated');
      })
      .catch((error) => console.error('Error updating water level:', error));
  };

  const size = 200;
  const strokeWidth = 20;
  const radius = size / 2;
  const angle = (waterQualityScore / 100) * 360 - 90;
  const radians = (angle * Math.PI) / 180;
  const edgeX = radius + radius * Math.cos(radians);
  const edgeY = radius + radius * Math.sin(radians);

  const speedometerColor = getColorByWaterQuality(waterQualityScore);

  const leftColumnCards = [
    { id: '1', title: 'Water Level', value: `${sensorData.waterLevel}°Ltr`, icon: 'water-outline', height: 250, onPress: () => setWaterLevelModalVisible(true) },
    { id: '2', title: 'Temp', value: `${sensorData.temperature}°C`, icon: 'thermometer-outline', height: 150 },
  ];
  const rightColumnCards = [
    { id: '3', title: 'Turbidity', value: `${sensorData.turbidity} NTU`, icon: 'cloudy-outline', height: 150 },
    { id: '4', title: 'pH', value: `${sensorData.ph}`, icon: 'flask-outline', height: 150 },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Water Quality Analysis</Text>

      <View style={styles.speedometerWrapper}>
        <View style={styles.speedometerContainer}>
          <AnimatedCircularProgress
            size={size}
            width={strokeWidth}
            fill={waterQualityScore}
            tintColor={speedometerColor}
            backgroundColor="#e0e0e0"
            rotation={-360}
            arcSweepAngle={360}
            lineCap="round"
          />
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
            <Text style={styles.bubbleText}>{waterQualityScore}%</Text>
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
        <TouchableOpacity style={styles.feedButton} onPress={handleFetchStats}>
          <Text style={styles.feedButtonText}>Fetch Stats</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subheading}>Stats</Text>

      <View style={styles.columnsContainer}>
        <View style={styles.column}>
          {leftColumnCards.map((item, index) => (
            <Card key={item.id} {...item} delay={index * 150} score={waterQualityScore} />
          ))}
        </View>
        <View style={styles.column}>
          {rightColumnCards.map((item, index) => (
            <Card key={item.id} {...item} delay={index * 150 + 75} />
          ))}
        </View>
      </View>

      <Modal visible={loadingModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {modalStep === 'loading' ? (
              <>
                <ActivityIndicator size="large" color="#2692D0" />
                <Text style={styles.modalText}>{modalMessage}</Text>
              </>
            ) : (
              <>
                <Icon name="checkmark-circle" size={60} color="#4BB543" />
                <Text style={styles.modalText}>{modalMessage}</Text>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={waterLevelModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Update Water Level</Text>
            <TextInput
              style={styles.input}
              value={newWaterLevel}
              onChangeText={setNewWaterLevel}
              keyboardType="numeric"
              placeholder="Enter new water level"
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleWaterLevelUpdate}
            >
              <Text style={styles.modalButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setWaterLevelModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  feedButtonWrapper: {
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 10,
  },
  modalText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButton: {
    width: '100%',
    backgroundColor: '#2692D0',
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WaterQualityScreen;
