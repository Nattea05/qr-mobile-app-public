import { Text, Pressable, Image, FlatList, View } from 'react-native';
import DataFetch from './interaction_events/DataFetch';

function DisplayPlaces({ onVetPress }) {
    const [placesList, imagesList] = DataFetch('veterinary-locations');

    return (
        <FlatList
            contentContainerStyle={{flexDirection: 'column', alignItems: 'center'}}
            data={placesList}
            renderItem={({item}) => (
                <>
                    <View className="flex-col mt-5 mb-10">
                        <Pressable key={item.index} onPress={() => onVetPress(item.index)} className="flex-col w-96 h-80 rounded-xl bg-orange-400">
                            <Image source={{uri: imagesList[item.index]}} className="w-96 h-52 rounded-xl" />
                            <Text className="font-medium text-base justify-start">{item.name}, {item.location}</Text>
                        </Pressable>
                    </View>
                </>
            )}
            keyExtractor={item => item.index}
            className=""
         />
    );
}

export default function ScrollingList({ onReceiveInput }) {
    function handleVetPress(index) {
        onReceiveInput("VetPage", index);
    }

    return (
        <DisplayPlaces onVetPress={(index) => handleVetPress(index)} />
    );
}