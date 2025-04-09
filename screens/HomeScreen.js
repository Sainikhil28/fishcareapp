import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const bannerImages = [
  require('../assets/banner2.jpeg'),
  require('../assets/banner2.jpeg'),
  require('../assets/banner3.jpeg'),
];

const HomeScreen = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const LatestUpdates = [
    {
      id: '1',
      image: require('../assets/banner2.jpeg'),
      lastWaterChange: '07 Apr 2025 - 10:30 AM',
      lastFeedTime: '07 Apr 2025 - 08:00 AM',
      fishCount: 120,
    },
    {
      id: '2',
      image: require('../assets/banner2.jpeg'),
      lastWaterChange: '07 Apr 2025 - 09:00 AM',
      lastFeedTime: '07 Apr 2025 - 07:45 AM',
      fishCount: 90,
    },
    {
      id: '3',
      image: require('../assets/banner3.jpeg'),
      lastWaterChange: '06 Apr 2025 - 04:00 PM',
      lastFeedTime: '06 Apr 2025 - 01:00 PM',
      fishCount: 200,
    },
    {
      id: '4',
      image: require('../assets/banner3.jpeg'),
      lastWaterChange: '06 Apr 2025 - 06:00 PM',
      lastFeedTime: '06 Apr 2025 - 03:00 PM',
      fishCount: 150,
    },
  ];
  
  

  const fishBreedData = [
    {
      id: '1',
      breed: 'Goldfish',
      info: 'Peaceful and easy to care for, great for beginners.',
      image: require('../assets/banner3.jpeg'),
    },
    {
      id: '2',
      breed: 'Betta',
      info: 'Colorful and aggressive, should be kept alone.',
      image: require('../assets/banner3.jpeg'),
    },
    {
      id: '3',
      breed: 'Guppy',
      info: 'Small and vibrant, perfect for community tanks.',
      image: require('../assets/banner3.jpeg'),
    },
    {
      id: '4',
      breed: 'Koi',
      info: 'Large and beautiful, best suited for outdoor ponds.',
      image: require('../assets/banner3.jpeg'),
    },
  ];
  
  
  

  const colors = ['#29b6f6','#3cc694', '#f9a825', '#ff7043'];

  const renderCard = ({ item }) => (
    <View style={{ 
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
      elevation: 2
    }}>
      <Image 
        source={item.image} 
        style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }} 
        resizeMode="cover"
      />
      <View style={{ flexShrink: 1 }}>
  <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
    🐠 Fish Count: {item.fishCount}
  </Text>
  <Text style={{ fontSize: 13, marginBottom: 2, flexWrap: 'wrap' }}>
    💧 Water Changed: {item.lastWaterChange}
  </Text>
  <Text style={{ fontSize: 13, flexWrap: 'wrap' }}>
    🍽️ Last Feed: {item.lastFeedTime}
  </Text>
</View>
</View>
  );
  

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.userName}>Babloo</Text>
        </View>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={26} color="#000" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Banner Carousel */}
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.bannerContainer}>
        {bannerImages.map((img, index) => (
          <Image key={index} source={img} style={styles.bannerImage} />
        ))}
      </ScrollView>

      <View style={styles.section}>
  <Text style={styles.sectionTitle}>Fish Breeds</Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {fishBreedData.map((item, index) => (
      <View
        key={item.id}
        style={[
          styles.fishCard,
          { backgroundColor: colors[index % colors.length] },
        ]}
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




      <View style={styles.section}>
  <Text style={styles.myScheduleTitle}>Latest Updates</Text>
  <View style={{ height: 140 }}> {/* You can adjust height */}
  <FlatList
  data={LatestUpdates}
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
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#e6f2fb',paddingTop:20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 },
  greeting: { fontSize: 16, color: '#555' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  avatar: {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginBottom: 8,
  alignSelf: 'center',
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
  borderRadius: 30, // half of 60 to make it circular
  
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
  lessonCard: {
    width: width - 80,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    marginRight: 15,
  },
  lessonTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  lessonSubtitle: { fontSize: 14, color: '#fff', marginTop: 5 },
  myScheduleTitle: { fontSize: 20, fontWeight: '700', marginBottom: 15 },
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  scheduleImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  scheduleText: { flex: 1 },
  scheduleDate: { fontSize: 13, color: '#555' },
  scheduleTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  scheduleLocation: { fontSize: 13, color: '#666' },
});

export default HomeScreen;
