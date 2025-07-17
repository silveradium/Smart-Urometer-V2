import { useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function StartUp() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Patients'); // or "Main" or your home screen
    }, 5000); // 3-second delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/bg.png')} // update path if different
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  overlay: {
    // backgroundColor: 'rgba(0, 0, 0, 0.3)', // slight dark overlay
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff'
  },
  brandPrimary: {
    color: '#ffffff'
  },
  brandAccent: {
    color: '#007AFF'
  }
});
