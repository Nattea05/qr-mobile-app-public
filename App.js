import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryRow from './components/Category';
import ScrollingList from './components/ItemList';
import Pets from './components/pages/Pets/Pets';
import AddPet from './components/pages/Pets/AddPet/AddPet';
import VetPage from './components/pages/VetPage/VetPage';
import DateSlots from './components/pages/VetPage/DateSlots/DateSlots'
import TimeSlots from './components/pages/VetPage/DateSlots/TimeSlots/TimeSlots';
import SelectPet from './components/pages/VetPage/DateSlots/TimeSlots/SelectPet/SelectPet';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/pages/Profile/Profile';

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white">
      <Login onReceiveNavigation={(page) => navigation.navigate(page)} />
    </View>
  )
}

function SignUpScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white">
      <SignUp transferToLogin={(page) => navigation.navigate(page)} />
    </View>
  )
}

function HomeScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white">
      <ScrollingList onReceiveInput={(page, index) => navigation.navigate(page, {vetIndex: index})} />
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />
    </View>
  );
}

function PetScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white">
      <Pets receiveNavigation={(page) => navigation.navigate(page)} />
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />    
    </View>
  );
}

function AddPetScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white">
      <AddPet receiveAddPet={(page) => navigation.reset({index: 1, routes: [{ name: "Home" }, { name: "Pets" }]})}/>
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />    
    </View>
  );
}

function VetPageScreen({ navigation, route }) {
  const {vetIndex} = route.params;
  return (
    <View className="flex-1 bg-white">
      <VetPage onReceiveIndex={vetIndex} onReceiveViewAppointments={(page, index) => navigation.navigate(page, {currentVetIndex: index})} />
    </View>
  );
}

function DateSlotsScreen({ navigation, route }) {
  const {currentVetIndex} = route.params;
  return (
    <View className="flex-1 w-full h-full bg-white">
      <DateSlots onReceiveVetIndex={currentVetIndex} onConfirmed={(page, confirmedDate) => navigation.navigate(page, {confirmedDate: confirmedDate})} />
    </View>
  )
}

function TimeSlotsScreen({ navigation, route }) {
  const {confirmedDate} = route.params;
  return (
    <View className="flex-1 w-full h-full bg-white">
      <TimeSlots onReceiveData={confirmedDate} onConfirmedTime={(page, confirmedTime) => navigation.navigate(page, {confirmedTime: confirmedTime})} />
    </View>
  )
}

function SelectPetScreen({ navigation, route }) {
  const {confirmedTime} = route.params
  return (
    <View className="flex-1 w-full h-full bg-white">
      <SelectPet onReceiveData={confirmedTime} />
    </View>
  )
}

function ProfileScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white">
      <Profile navigateSignOut={(page) => navigation.reset({index: 0, routes: [{ name: "Login" }]})} />
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Pets" component={PetScreen} />
        <Stack.Screen name="AddPet" component={AddPetScreen} />
        <Stack.Screen name="VetPage" component={VetPageScreen} />
        <Stack.Screen name="DateSlots" component={DateSlotsScreen} />
        <Stack.Screen name="TimeSlots" component={TimeSlotsScreen} />
        <Stack.Screen name="SelectPet" component={SelectPetScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}