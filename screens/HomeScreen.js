import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFirebaseData } from '../FirebaseDataContext'; // adjust path

const { width } = Dimensions.get('window');

const bannerImages = [
  require('../assets/b1.jpg'),
  require('../assets/b4.jpg'),
  require('../assets/b6.jpg'),
];

const fishBreedData = [
  {
    id: '1',
    breed: 'Goldfish',
    info: 'Peaceful and easy to care for, great for beginners.',
    image: require('../assets/Goldfish.jpeg'),
  },
  {
    id: '2',
    breed: 'Betta',
    info: 'Colorful and aggressive, should be kept alone.',
    image: require('../assets/Betta.jpg'),
  },
  {
    id: '3',
    breed: 'Guppy',
    info: 'Small and vibrant, perfect for community tanks.',
    image: require('../assets/guppy.jpg'),
  },
  {
    id: '4',
    breed: 'Koi',
    info: 'Large and beautiful, best suited for outdoor ponds.',
    image: require('../assets/Koi.jpg'),
  },
];

const colors = ['#29b6f6', '#3cc694', '#f9a825', '#ff7043'];

const HomeScreen = () => {
  const [greeting, setGreeting] = useState('');
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [userName, setUserName] = useState('User');
  const [waterCapacity, setWaterCapacity] = useState('0');
  const [modalVisible, setModalVisible] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempCapacity, setTempCapacity] = useState(waterCapacity);

  const { fishData } = useFirebaseData();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    if (fishData && fishData.length > 0) {
      const updates = fishData.map(item => ({
        ...item,
        image: require('../assets/fish.jpeg'), // fallback image
      }));
      setLatestUpdates(updates);
    }
  }, [fishData]);

  const handleSave = () => {
    setUserName(tempName);
    setWaterCapacity(tempCapacity);
    setModalVisible(false);
  };

  const renderCard = ({ item }) => (
    <View style={styles.updateCard}>
      <Image
        source={item.image}
        style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }}
        resizeMode="cover"
      />
      <View style={{ flexShrink: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
          🐠 Breed: {item.breed || 'N/A'}
        </Text>
        <Text style={{ fontSize: 13, marginBottom: 2 }}>
          🧮 Count: {item.number ?? item.fishCount ?? 'N/A'}
        </Text>
        {/* <Text style={{ fontSize: 13, marginBottom: 2 }}>
          💧 Last Water Check: {item.lastWaterCheck || item.lastWaterChange || 'N/A'}
        </Text>
        <Text style={{ fontSize: 13 }}>
          🍽️ Last Fed: {item.lastFed || item.lastFeedTime || 'N/A'}
        </Text> */}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting},</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.userName}>{userName}</Text>
            {/* <Text style={styles.Wtercap}>Water Tank Capacity: {waterCapacity} Ltr</Text> */}
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity>
          <Icon name="notifications-outline" size={26} color="#000" />
          <View style={styles.notificationDot} />
        </TouchableOpacity> */}
      </View>

      {/* Modal for updating name and water capacity */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Info</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={tempName}
              onChangeText={setTempName}
            />
            {/* <TextInput
              style={styles.input}
              placeholder="Enter Water Tank Capacity"
              value={tempCapacity}
              onChangeText={setTempCapacity}
            /> */}
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={handleSave} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Banner Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.bannerContainer}
      >
        {bannerImages.map((img, index) => (
          <Image key={index} source={img} style={styles.bannerImage} />
        ))}
      </ScrollView>

      {/* Fish Breeds Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fish Breeds</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {fishBreedData.map((item, index) => (
            <View
              key={item.id}
              style={[styles.fishCard, { backgroundColor: colors[index % colors.length] }]}
            >
              <Image source={item.image} style={styles.fishAvatar} />
              <View style={styles.fishInfo}>
                <Text style={styles.fishBreed}>{item.breed}</Text>
                <Text style={styles.fishDetails}>{item.info}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Latest Updates Section */}
      <View style={styles.section}>
        <Text style={styles.myScheduleTitle}>Latest Updates</Text>
        <View style={{ height: 140 }}>
          <FlatList
            data={latestUpdates}
            keyExtractor={item => item.id}
            renderItem={renderCard}
            showsVerticalScrollIndicator={true}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#e6f2fb',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  greeting: {
    fontSize: 16,
    color: '#555',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  Wtercap: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  bannerContainer: { marginTop: 20 },
  bannerImage: {
    width: width - 40,
    height: 150,
    borderRadius: 15,
    marginRight: 15,
    resizeMode: 'cover',
  },
  section: { marginTop: 25 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  myScheduleTitle: { fontSize: 20, fontWeight: '700', marginBottom: 15 },
  updateCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginRight: 15,
    width: width - 100,
  },
  fishAvatar: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 30,
    borderColor: '#fff',
  },
  fishInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  fishBreed: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  fishDetails: {
    fontSize: 14,
    color: '#f0f0f0',
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default HomeScreen;
