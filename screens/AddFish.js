import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const AddFish = () => {
  const [breed, setBreed] = useState('');
  const [count, setCount] = useState('');
  const [fishList, setFishList] = useState([]);

  const handleAdd = () => {
    if (breed.trim() && count.trim()) {
      setFishList([
        ...fishList,
        { id: Date.now().toString(), breed, count },
      ]);
      setBreed('');
      setCount('');
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>🐟 Fish Tracker Dashboard</Text>

      <View style={styles.dashboardContainer}>
        <View style={styles.dashboardCard}>
          <Text style={styles.cardEmoji}>🐟</Text>
          <Text style={styles.dashboardTitle}>Fish Breeds</Text>
          <Text style={styles.dashboardValue}>{fishList.length}</Text>
        </View>
        <View style={styles.dashboardCard}>
          <Text style={styles.cardEmoji}>🎏</Text>
          <Text style={styles.dashboardTitle}>Total Count</Text>
          <Text style={styles.dashboardValue}>
            {fishList.reduce((sum, item) => sum + parseInt(item.count), 0)}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.addCard}>
          <Text style={styles.cardTitle}>Add New Fish</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Fish Breed"
            placeholderTextColor="#999"
            value={breed}
            onChangeText={setBreed}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Fish Count"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={count}
            onChangeText={setCount}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>+ Add Fish</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>🐠 Fish Details</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 0.7 }]}>S No</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>Icon</Text>
            <Text style={[styles.headerText, { flex: 2 }]}>Breed</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>Count</Text>
          </View>

          {fishList.length === 0 ? (
            <View style={styles.noRecordRow}>
              <Text style={styles.noRecordText}>No records found</Text>
            </View>
          ) : (
            fishList.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  { backgroundColor: index % 2 === 0 ? '#f9f9ff' : '#ffffff' },
                ]}
              >
                <Text style={[styles.cellText, { flex: 0.7 }]}>{index + 1}</Text>
                <Text style={[styles.cellText, { flex: 1 }]}>🐟</Text>
                <Text style={[styles.cellText, { flex: 2 }]}>{item.breed}</Text>
                <Text style={[styles.cellText, { flex: 1 }]}>{item.count}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#e6f2fb',
    padding: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop:20
  },
  dashboardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dashboardCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#888',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  dashboardTitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 10,
    fontWeight: '500',
  },
  dashboardValue: {
    fontSize: 24,
    color: '#2692D0',
    fontWeight: '700',
    marginTop: 4,
  },
  cardEmoji: {
    fontSize: 38,
  },
  scrollContainer: {
    flex: 1,
  },
  addCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#aaa',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 16,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#e6f2fb',
    color: '#000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2692D0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#aaa',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 30,
  },
  tableTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 16,
    fontWeight: '700',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: '#2692D0',
    paddingBottom: 10,
    marginBottom: 8,
  },
  headerText: {
    color: '#4a4a4a',
    fontSize: 14,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    borderRadius: 10,
  },
  cellText: {
    color: '#222',
    fontSize: 15,
    fontWeight: '500',
  },
  noRecordRow: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noRecordText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default AddFish;
