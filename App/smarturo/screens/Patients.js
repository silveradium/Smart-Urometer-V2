import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AddPatientModal from '../components/AddPatientModal';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';

export default function Patients() {
  const navigation = useNavigation();
  const [patients, setPatients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddPatient = (newPatient) => {
    const id = (patients.length + 1).toString();
    const urineLevel = '0 mL'; // Default for now
    setPatients([{ ...newPatient, id, urineLevel }, ...patients]);
  };

  useEffect(() => {
    // Create a query for the latest reading
    const logRef = collection(db, 'urometer_log');
    const latestQuery = query(logRef, orderBy('timestamp', 'desc'), limit(1));

    // Set up real-time listener
    const unsubscribe = onSnapshot(latestQuery, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0].data();
        setPatients([
          {
            id: '1',
            name: 'Herath Kumarawardana',
            bed: '12',
            ward: '5',
            urineLevel: `${doc.value} mL`,
          },
        ]);
      }
    }, (error) => {
      console.error('Error fetching from Firestore:', error);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.branding}>
        <Text style={styles.brandPrimary}>Smart</Text>
        <Text style={styles.brandAccent}>Uro</Text>
      </Text>

      <Text style={styles.heading}>Patient List</Text>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('PatientDetails', { patient: item })}
          >
            <View style={styles.patientCard}>
              <View style={styles.leftSide}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.subText}>Bed: {item.bed} | {item.ward}</Text>
              </View>
              <View style={styles.rightSide}>
                <Text style={styles.urineLevel}>{item.urineLevel}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Patient</Text>
      </TouchableOpacity>

      <AddPatientModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddPatient={handleAddPatient}
      />
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    padding: 20,
    backgroundColor: '#f4faff',
  },
  heading: {
    fontSize: 25,
    fontWeight: 'medium',
    marginBottom: 17,
    marginLeft: 10,
    color: '#003366',
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#e6f2ff',
    marginBottom: 15,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  leftSide: { flexDirection: 'column', flexShrink: 1 },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#002244',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  rightSide: { alignItems: 'flex-end' },
  urineLevel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 35,
    paddingVertical: 16,
    borderRadius: 50,
    elevation: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  branding: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#003366',
  },
  brandPrimary: {
    color: '#003366',
  },
  brandAccent: {
    color: '#007AFF',
  },
});