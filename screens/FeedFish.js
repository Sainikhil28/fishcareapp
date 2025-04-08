import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native';
const { width } = Dimensions.get('window');

const FeedFish = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFeedPress = () => {
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
  };

  const lastFiveFeeds = [
    { id: '1', date: 'April 8', time: '9:55 am', day: 'Friday' },
    { id: '2', date: 'April 7', time: '10:15 am', day: 'Thursday' },
    { id: '3', date: 'April 6', time: '9:45 am', day: 'Wednesday' },
   
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Feed Info */}
      <View style={styles.feedCard}>
        <View style={styles.feedHeader}>
          <Text style={styles.feedLabel}>Last feed</Text>
          <Text style={styles.dayText}>Friday</Text>
        </View>
        <Text style={styles.feedDate}>April 8</Text>
        <Text style={styles.feedTime}> 9:55 am</Text>
        <View style={styles.progressBar} />
      </View>
  
      {/* Banner */}
      <View style={styles.bannerCard}>
        <Image
          source={require('../assets/banner2.jpeg')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>
  
      {/* Feed Button */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity style={styles.feedButton} onPress={handleFeedPress}>
          <Icon name="fish" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.feedButtonText}>Feed Fish</Text>
        </TouchableOpacity>
      </Animated.View>
  
      {/* Feed History Table */}
      <View style={styles.tableCard}>
        <Text style={styles.tableTitle}>Last 3 Feed Logs</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Day</Text>
          <Text style={styles.tableHeaderText}>Date</Text>
          <Text style={styles.tableHeaderText}>Time</Text>
        </View>
        {lastFiveFeeds.map((item) => (
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
});

export default FeedFish;
