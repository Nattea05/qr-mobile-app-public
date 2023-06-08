import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryRow from './components/Category';
import ScrollingList from './components/ItemList';
import Pets from './components/pages/Pets';
import VetPage from './components/pages/VetPage';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View className="flex-1">
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />
      <ScrollingList onReceiveInput={(page, index) => navigation.navigate(page, {vetIndex: index})} />
    </View>
  );
}

function PetScreen({ navigation }) {
  return (
    <View className="flex-1">
      <CategoryRow onReceiveInput={(page) => navigation.navigate(page)} />
      <Pets />
    </View>
  );
}

function VetPageScreen({ navigation, route }) {
  const {vetIndex} = route.params;
  return (
    <View className="flex-1">
      <VetPage onReceiveIndex={vetIndex} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Pets" component={PetScreen} />
        <Stack.Screen name="VetPage" component={VetPageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}