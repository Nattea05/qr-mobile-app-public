import 'react-native-gesture-handler';
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
import Activity from './components/pages/Activity/Activity';
import UpcomingDetails from './components/pages/Activity/UpcomingDetails';
import History from './components/pages/Activity/History/History';
import Emr from './components/pages/Activity/History/Emr/Emr';
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
      <SelectPet onReceiveData={confirmedTime} successfulConfirmation={(page) => navigation.reset({index: 0, routes: [{ name: "Home" }]})} />
    </View>
  )
}

function ActivityScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white">
      <Activity receiveNavigation={(page, appointmentDetails) => {
        page === "Activity"
          ? navigation.reset({
            index: 1,
            routes: [{name: "Home"}, {name: page}]
            })
          : navigation.navigate(page, {appointmentDetails: appointmentDetails})}} />
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />
    </View>
  );
}

function UpcomingDetailsScreen({ navigation, route }) {
  const {appointmentDetails} = route.params

  return (
    <View className="flex-1 bg-white">
      <UpcomingDetails onReceiveAppointmentDetails={appointmentDetails} />
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />
    </View>
  );
}

function HistoryScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white">
      <History receiveNavigation={(page, history) => navigation.navigate(page, {historyDetails: history})} />
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />
    </View>
  );
}

function EmrScreen({ navigation, route }) {
  const {historyDetails} = route.params

  return (
    <View className="flex-1 bg-white">
      <Emr onReceiveHistoryDetails={historyDetails} receiveNavigation={(page) => navigation.navigate(page)} />
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />
    </View>
  );
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
      <Stack.Navigator screenOptions={{headerShown: false, animation: "fade"}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Pets" component={PetScreen} />
        <Stack.Screen name="AddPet" component={AddPetScreen} />
        <Stack.Screen name="VetPage" component={VetPageScreen} />
        <Stack.Screen name="DateSlots" component={DateSlotsScreen} />
        <Stack.Screen name="TimeSlots" component={TimeSlotsScreen} />
        <Stack.Screen name="SelectPet" component={SelectPetScreen} />
        <Stack.Screen name="Activity" component={ActivityScreen} />
        <Stack.Screen name="UpcomingDetails" component={UpcomingDetailsScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Emr" component={EmrScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}