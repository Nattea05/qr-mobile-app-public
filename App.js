import 'react-native-gesture-handler';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CategoryRow from './components/Category';
import ScrollingList from './components/ItemList';
import Pets from './components/pages/Pets/Pets';
import PetProfile from './components/pages/Pets/PetProfile/PetProfile';
import EditPetProfile from './components/pages/Pets/PetProfile/EditPetProfile/EditPetProfile';
import EmrHistory from './components/pages/Pets/PetProfile/EmrHistory/EmrHistory';
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
import Qr from './components/pages/Activity/History/Emr/Qr/Qr';
import Profile from './components/pages/Profile/Profile';
import EditProfile from './components/pages/Profile/EditProfile/EditProfile';

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation, route }) {
  return (
    <View className="flex-1 bg-white">
      <Login onReceiveNewEmail={route.params ? route.params : ''} onReceiveNavigation={(page) => navigation.navigate(page)} />
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
      <Pets receiveNavigation={(page) => navigation.navigate(page)} receivePetNavigation={(pet) => navigation.navigate("PetProfile", {petProfile: pet})} />
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />    
    </View>
  );
}

function PetProfileScreen({ navigation, route }) {
  const {petProfile} = route.params

  return (
    <View className="flex-1 bg-white">
      <PetProfile onReceivePetDetails={(page, petDetails) => navigation.navigate(page, {petDetails: petDetails})} onReceivePetProfile={petProfile} />
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />    
    </View>
  );
}

function EditPetProfileScreen({ navigation, route }) {
  const {petDetails} = route.params

  return (
    <View className="flex-1 bg-white">
      <EditPetProfile onReceivePetDetails={petDetails} onReceiveDone={(petData) => navigation.reset({index: 1, routes: [{ name: "Pets" }, { name: "PetProfile", params: { petProfile: petData } }]})} onConfirmPetRemove={() => navigation.reset({index: 1, routes: [{ name: "Home" }, { name: "Pets" }]})} />
    </View>
  );
}

function EmrHistoryScreen({ navigation, route }) {
  const {petDetails} = route.params

  return (
    <View className="flex-1 bg-white">
      <EmrHistory onReceivePetDetails={petDetails} onReceiveEmrNavigation={(appointmentDetails) => navigation.navigate("Emr", {historyDetails: appointmentDetails})} />
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
      <Emr onReceiveHistoryDetails={historyDetails} openQr={(page, qrData) => navigation.navigate(page, {qrData: qrData})} receiveNavigation={(page) => navigation.navigate(page)} />
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />
    </View>
  );
}

function QrScreen({ navigation, route }) {
  const {qrData} = route.params

  return (
    <View className="flex-1 bg-white">
      <Qr onReceiveQrData={qrData} receiveBack={() => navigation.goBack()} />
    </View>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white">
      <Profile onReceiveNavigation={(page, object) => navigation.navigate(page, {object: object})} navigateSignOut={(page) => navigation.reset({index: 0, routes: [{ name: "Login" }]})} />
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />
    </View>
  );
}

function EditProfileScreen({ navigation, route }) {
  const userDetails = route.params.object

  return (
    <View className="flex-1 bg-white">
      <EditProfile onReceiveUserDetails={userDetails} onReceiveDone={() => navigation.reset({index: 1, routes: [{ name: "Home" }, { name: "Profile" }]})} onReceiveUpdateEmail={(newEmail) => navigation.reset({index: 0, routes: [{ name: "Login", params: newEmail}]})} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false, animation: "fade"}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Pets" component={PetScreen} />
          <Stack.Screen name="PetProfile" component={PetProfileScreen} />
          <Stack.Screen name="EditPetProfile" component={EditPetProfileScreen} options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="EmrHistory" component={EmrHistoryScreen} />
          <Stack.Screen name="AddPet" component={AddPetScreen} />
          <Stack.Screen name="VetPage" component={VetPageScreen} />
          <Stack.Screen name="DateSlots" component={DateSlotsScreen} />
          <Stack.Screen name="TimeSlots" component={TimeSlotsScreen} />
          <Stack.Screen name="SelectPet" component={SelectPetScreen} />
          <Stack.Screen name="Activity" component={ActivityScreen} />
          <Stack.Screen name="UpcomingDetails" component={UpcomingDetailsScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Emr" component={EmrScreen} />
          <Stack.Screen name="Qr" component={QrScreen} options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ animation: "slide_from_right" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}