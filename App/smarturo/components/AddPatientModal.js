import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput
} from 'react-native';
import Modal from 'react-native-modal';

export default function AddPatientModal({ isVisible, onClose, onAddPatient }) {
  const [step, setStep] = useState(1);
  const [selectedWifi, setSelectedWifi] = useState(null);
  const [name, setName] = useState('');
  const [bed, setBed] = useState('');
  const [ward, setWard] = useState('');

  const dummyWifis = ['ESP32-Uro01', 'DialogWiFi', 'SLT-AP02'];

  const next = () => setStep((prev) => Math.min(prev + 1, 3));
  const back = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    onAddPatient({ name, bed, ward, wifi: selectedWifi });
    setStep(1); setSelectedWifi(null); setName(''); setBed(''); setWard('');
    onClose();
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContent}>
        {step === 1 && (
          <>
            <Text style={styles.title}>Step 1: Select ESP32</Text>
            {dummyWifis.map((wifi, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.wifiOption, selectedWifi === wifi && styles.selected]}
                onPress={() => setSelectedWifi(wifi)}
              >
                <Text style={{ color: selectedWifi === wifi ? '#fff' : '#007AFF' }}>{wifi}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Step 2: Patient Info</Text>
            <TextInput
              style={styles.input}
              placeholder="Patient Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Bed Number"
              value={bed}
              onChangeText={setBed}
            />
            <TextInput
              style={styles.input}
              placeholder="Ward Number"
              value={ward}
              onChangeText={setWard}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>Step 3: Confirm</Text>
            <Text style={styles.confirmText}>Wi-Fi: {selectedWifi}</Text>
            <Text style={styles.confirmText}>Name: {name}</Text>
            <Text style={styles.confirmText}>Bed: {bed}</Text>
            <Text style={styles.confirmText}>Ward: {ward}</Text>
          </>
        )}

        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity style={styles.navButton} onPress={back}>
              <Text style={styles.navText}>Back</Text>
            </TouchableOpacity>
          )}
          {step < 3 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.next]}
              onPress={next}
              disabled={step === 1 && !selectedWifi}
            >
              <Text style={styles.navText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.navButton, styles.next]} onPress={handleSubmit}>
              <Text style={styles.navText}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: '#888', marginTop: 15, textAlign: 'center' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#003366' },
  wifiOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    marginVertical: 5
  },
  selected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF'
  },
  input: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
    marginTop: 10
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF'
  },
  next: {
    backgroundColor: '#007AFF'
  },
  navText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  confirmText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333'
  }
});
