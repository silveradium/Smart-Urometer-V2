import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartUp from '../screens/StartUp';
import Patients from '../screens/Patients';
import PatientDetails from '../screens/PatientDetails';




const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName="StartUp">
      <Stack.Screen name="StartUp" component={StartUp} options={{ headerShown: false }} />
      <Stack.Screen name="Patients" component={Patients} options={{ headerShown: false }} />
      <Stack.Screen name="PatientDetails" component={PatientDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
