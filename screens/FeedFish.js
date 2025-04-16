import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { dbRealtime } from '../firebaseConfig';
import { ref, set, push, query, orderByChild, limitToLast, get } from 'firebase/database';

const { width } = Dimensions.get('window');

const triggerFeed = async () => {
  try {
    await set(ref(dbRealtime, "/servoMotor/trigger"), true);
  } catch (err) {
    console.error(err);
  }
};

const FeedFish = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [feedLogs, setFeedLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleFeedPress = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await triggerFeed();

      const now = new Date();
      const day = now.toLocaleDateString('en-US', { weekday: 'long' });
      const date = now.toLocaleDateString('en-US');
      const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const timestamp = now.getTime();

      const logEntry = { day, date, time, timestamp };

      await push(ref(dbRealtime, 'feedLogs'), logEntry);
      await set(ref(dbRealtime, 'lastFeed'), logEntry);

      fetchLatestFeedLogs();

      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
    } catch (error) {
      console.error("Feed action failed:", error);
    }
  };

  const fetchLatestFeedLogs = async () => {
    try {
      const logsRef = query(ref(dbRealtime, 'feedLogs'), orderByChild('timestamp'), limitToLast(3));
      const snapshot = await get(logsRef);
      const logs = [];

      snapshot.forEach(child => {
        logs.push({
          id: child.key,
          ...child.val(),
        });
      });

      setFeedLogs(logs.reverse());
    } catch (error) {
      console.error("Error fetching feed logs:", error);
    }
  };

  useEffect(() => {
    fetchLatestFeedLogs();
  }, []);

  const latestFeed = feedLogs.length > 0 ? feedLogs[0] : null;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="checkmark-circle" size={60} color="#4BB543" />
            <Text style={styles.modalText}>Fish Fed Success</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.feedCard}>
        <View style={styles.feedHeader}>
          <Text style={styles.feedLabel}>Last feed</Text>
          <Text style={styles.dayText}>{latestFeed?.day || '--'}</Text>
        </View>
        <Text style={styles.feedDate}>{latestFeed?.date || '--'}</Text>
        <Text style={styles.feedTime}>{latestFeed?.time || '--'}</Text>
        <View style={styles.progressBar} />
      </View>

      <View style={styles.bannerCard}>
        <Image
          source={require('../assets/feedfish.jpg')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity style={styles.feedButton} onPress={handleFeedPress}>
          <Icon name="fish" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.feedButtonText}>Feed Fish</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.tableCard}>
        <Text style={styles.tableTitle}>Last 3 Feed Logs</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Day</Text>
          <Text style={styles.tableHeaderText}>Date</Text>
          <Text style={styles.tableHeaderText}>Time</Text>
        </View>
        {feedLogs.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.day}</Text>
            <Text style={styles.tableCell}>{item.date}</Text>
            <Text style={styles.tableCell}>{item.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f2fb',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  feedCard: {
    backgroundColor: '#f5f7ff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginBottom: 20,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  feedLabel: {
    fontSize: 14,
    color: '#888',
  },
  dayText: {
    fontSize: 14,
    color: '#2692D0',
    fontWeight: '600',
  },
  feedDate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d1d1d',
  },
  feedTime: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
  },
  progressBar: {
    height: 5,
    backgroundColor: '#dce3ff',
    borderRadius: 10,
    width: '100%',
  },
  bannerCard: {
    backgroundColor: '#f5f7ff',
    borderRadius: 18,
    overflow: 'hidden',
    height: 150,
    width: '100%',
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
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
    marginBottom: 30,
  },
  feedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  tableCard: {
    backgroundColor: '#f5f7ff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 30,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1d1d1d',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2692D0',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: '#4BB543',
  },
});

export default FeedFish;
