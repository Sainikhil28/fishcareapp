import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function Dashboard({ navigation }) {
  const [fishData, setFishData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFish, setCurrentFish] = useState(null);
  const [editedBreed, setEditedBreed] = useState("");
  const [editedNumber, setEditedNumber] = useState("");
  const [editedLastFed, setEditedLastFed] = useState("");
  const [editedLastWaterCheck, setEditedLastWaterCheck] = useState("");

  const titleAnim = useRef(new Animated.Value(0)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;

  const fetchFishData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "fishDetails"));
      const fishList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFishData(fishList);
    } catch (error) {
      console.error("Error fetching fish data:", error);
    }
  };

  const handleRefresh = () => {
    fetchFishData();
    bubbleAnim.setValue(0);
    Animated.timing(bubbleAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fetchFishData();
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleAnim, {
          toValue: 10,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(titleAnim, {
          toValue: -10,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const openEditModal = (fish) => {
    setCurrentFish(fish);
    setEditedBreed(fish.breed);
    setEditedNumber(fish.number);
    setEditedLastFed(fish.lastFed);
    setEditedLastWaterCheck(fish.lastWaterCheck);
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const fishRef = doc(db, "fishDetails", currentFish.id);
      await updateDoc(fishRef, {
        breed: editedBreed,
        number: editedNumber,
        lastFed: editedLastFed,
        lastWaterCheck: editedLastWaterCheck,
      });
      setModalVisible(false);
      fetchFishData();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "fishDetails", id));
            fetchFishData();
          } catch (error) {
            console.error("Delete error:", error);
          }
        },
      },
    ]);
  };

  const bubbleScale = bubbleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.3, 1],
  });

  return (
    <ScrollView style={styles.container}>
      <Animated.Text
        style={[styles.title, { transform: [{ translateX: titleAnim }] }]}
      >
        Aquatic Farming
      </Animated.Text>

      <Text style={styles.subtitle}>Explore All The Incredible Creatures</Text>

      <Image
        source={{
          uri: "https://cdn.mos.cms.futurecdn.net/4UdEs7tTKwLJbxZPUYR3hF-970-80.jpg.webp",
        }}
        style={styles.bannerImage}
        resizeMode="cover"
      />

      <Animated.View
        style={[styles.bubbleWrapper, { transform: [{ scale: bubbleScale }] }]}
      >
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.sectionTitle}>Fish Carousel</Text>

      <FlatList
        data={fishData}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View style={styles.carouselCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.breed}>🐠 {item.breed}</Text>
              <View style={styles.iconGroup}>
                <TouchableOpacity onPress={() => openEditModal(item)}>
                  <Text style={styles.icon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.icon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.info}>🧮 Number: {item.number}</Text>
            <Text style={styles.info}>🍽️ Last Fed: {item.lastFed}</Text>
            <Text style={styles.info}>💧 Water Changed: {item.lastWaterCheck}</Text>
          </View>
        )}
      />

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddFish")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>➕ Add Fish</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("WaterQuality")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>💧 Water Quality</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("FishFeed")}
          style={[styles.button, { marginBottom: 30 }]}
        >
          <Text style={styles.buttonText}>🍽️ Feed Fish</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Editing */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Fish Details</Text>

            <TextInput
              style={styles.input}
              placeholder="Breed"
              value={editedBreed}
              onChangeText={setEditedBreed}
            />
            <TextInput
              style={styles.input}
              placeholder="Number"
              value={editedNumber}
              keyboardType="numeric"
              onChangeText={setEditedNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Fed"
              value={editedLastFed}
              onChangeText={setEditedLastFed}
            />
            <TextInput
              style={styles.input}
              placeholder="Water Changed"
              value={editedLastWaterCheck}
              onChangeText={setEditedLastWaterCheck}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdate}
                style={[styles.modalButton, { backgroundColor: "#1a73e8" }]}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08192d",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#b0c8e9",
    textAlign: "center",
    marginBottom: 15,
  },
  bannerImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  carouselCard: {
    width: width * 0.85,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 20,
    borderRadius: 20,
    marginHorizontal: width * 0.0075,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    paddingBottom: 8,
    marginBottom: 10,
  },
  iconGroup: {
    flexDirection: "row",
  },
  icon: {
    fontSize: 20,
    marginLeft: 12,
    color: "#ffffff",
    opacity: 0.85,
  },
  breed: {
    fontSize: 18,
    color: "#00e0ff",
    fontWeight: "700",
    fontStyle: "italic",
  },
  info: {
    fontSize: 14,
    color: "#e0ecff",
    marginBottom: 5,
    fontWeight: "500",
  },
  buttonGroup: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1a73e8",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bubbleWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: "#32CD32",
    padding: 12,
    borderRadius: 30,
    width: 150,
    alignItems: "center",
  },
  refreshText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 8,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
