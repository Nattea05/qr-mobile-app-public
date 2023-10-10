import { Text, Pressable, Image, FlatList, View } from 'react-native';
import useDataFetch from './interaction_events/DataFetch';

function DisplayPlaces({ onVetPress }) {
    const [placesList, imagesList] = useDataFetch('veterinary-locations');

    return (
        <FlatList
            className="w-full mt-10"
            contentContainerStyle={{paddingBottom: 20, display: "flex", flexDirection: 'column', gap: 50, alignItems: 'stretch'}}
            data={placesList}
            renderItem={({item}) => (
                <>
                    <View className="flex flex-col w-10/12 h-96 self-center rounded-xl bg-petgreen">
                        <Pressable key={item.index} onPress={() => onVetPress(item.index)} className="flex-1 flex flex-col rounded-xl">
                            <Image source={{uri: imagesList[item.index]}} className="w-full h-64 rounded-xl" />
                            <Text className="font-medium text-base justify-start">{item.name}, {item.location}</Text>
                        </Pressable>
                    </View>
                </>
            )}
            keyExtractor={item => item.index}
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