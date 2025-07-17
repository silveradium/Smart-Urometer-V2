import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

export default function PatientDetails({ route }) {
  const { patient } = route.params;
  const [urineLevel, setUrineLevel] = useState(patient.urineLevel || '0 mL');
  const [urineData, setUrineData] = useState({
    labels: [],
    datasets: [{ data: [], strokeWidth: 2 }],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listener for the latest urine level
    const logRef = collection(db, 'urometer_log');
    const latestQuery = query(logRef, orderBy('timestamp', 'desc'), limit(1));

    const unsubscribeLatest = onSnapshot(
      latestQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0].data();
          setUrineLevel(`${doc.value || 0} mL`);
        } else {
          setUrineLevel('0 mL'); // Fallback for no data
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching latest urine level:', error);
        setError('Failed to fetch latest urine level');
        setIsLoading(false);
      }
    );

    // Listener for all urine level readings (for the chart)
    const allLogsQuery = query(logRef, orderBy('timestamp', 'asc'));

    const unsubscribeAll = onSnapshot(
      allLogsQuery,
      (snapshot) => {
        const logs = snapshot.docs.map((doc) => doc.data());
        const labels = logs.map((log) => {
          try {
            // Handle Firestore Timestamp or fallback to current time
            const date = log.timestamp?.toDate
              ? log.timestamp.toDate()
              : new Date();
            return date.toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            });
          } catch (e) {
            console.error('Error formatting timestamp:', e);
            return 'Unknown';
          }
        });
        const data = logs.map((log) => log.value || 0);

        setUrineData({
          labels,
          datasets: [{ data, strokeWidth: 2 }],
        });
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching urine data for chart:', error);
        setError('Failed to fetch urine data for chart');
        setIsLoading(false);
      }
    );

    // Clean up both listeners on unmount
    return () => {
      unsubscribeLatest();
      unsubscribeAll();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>{patient.name}</Text>
        <Text style={styles.sub}>Bed: {patient.bed} | Ward: {patient.ward}</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{patient.name}</Text>
      <Text style={styles.sub}>Bed: {patient.bed} | Ward: {patient.ward}</Text>

      <View style={styles.urineBox}>
        <Text style={styles.urineLabel}>Current Urine Level</Text>
        <Text style={styles.urineValue}>{urineLevel}</Text>
      </View>

      <Text style={styles.chartTitle}>Urine Level Over Time</Text>
      {urineData.labels.length > 0 ? (
        <LineChart
          data={urineData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#e6f2ff',
            backgroundGradientTo: '#cce6ff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: () => '#333',
          }}
          style={{ borderRadius: 10 }}
        />
      ) : (
        <Text style={styles.noDataText}>No urine data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  heading: { fontSize: 26, fontWeight: 'bold', color: '#003366' },
  sub: { fontSize: 16, color: '#555', marginBottom: 20 },
  urineBox: {
    backgroundColor: '#e6f2ff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
  },
  urineLabel: { fontSize: 16, color: '#333' },
  urineValue: { fontSize: 32, fontWeight: 'bold', color: '#007AFF' },
  chartTitle: { fontSize: 18, fontWeight: '500', marginBottom: 10 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 20 },
  noDataText: { fontSize: 16, color: '#555', textAlign: 'center', marginTop: 20 },
});