import { Text, Pressable, Image, FlatList, View, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { SearchBar } from '@rneui/themed';
import useDataFetch from './interaction_events/DataFetch';

function DisplayPlaces({ onVetPress }) {
    const [placesList, imagesList] = useDataFetch('veterinary-locations');
    const [refreshing, setRefreshing] = useState(false)
    const [search, setSearch] = useState('')
    const [filteredList, setFilteredList] = useState(placesList)

    function onRefresh() {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 1000)
    }

    const updateSearch = (search) => {
        setSearch(search)
        // Filter based on search
        const filtered = placesList.filter((item) => {
            const searchLowerCase = search.toLowerCase()
            return (
                item.name.toLowerCase().includes(searchLowerCase) ||
                item.location.toLowerCase().includes(searchLowerCase) ||
                item.address.toLowerCase().includes(searchLowerCase)
            )
        })
        setFilteredList(filtered)
    }

    useEffect(() => {
        if (placesList) {
            setFilteredList(placesList)
        }
    }, [placesList])
    
    return (
        <>
            <View className="flex w-full h-36 pt-14 pb-8 rounded-b-xl justify-center bg-petgreen">
                <SearchBar 
                    containerStyle={{width: "100%", padding: 20, backgroundColor: "#45e14f", borderTopWidth: 0, borderBottomWidth: 0}}
                    inputContainerStyle={{width: "100%", height: 52, backgroundColor: "white", borderRadius: 9999}}
                    inputStyle={{color: "black"}}
                    searchIcon={{color: "black", size: 30}}
                    clearIcon={{color: "black", size: 25}}
                    cancelIcon={{color: "black", size: 25}}
                    placeholder='Search'
                    onChangeText={updateSearch}
                    value={search}
                    lightTheme={true}
                />
            </View>
            <FlatList
                className="w-full"
                contentContainerStyle={{paddingTop: 25, paddingBottom: 20, display: "flex", flexDirection: 'column', gap: 40, alignItems: 'stretch'}}
                data={filteredList}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    <>
                        <Pressable key={item.index} onPress={() => onVetPress(item.index)} className="flex flex-col w-[95%] h-96 self-center rounded-xl active:bg-gray-100">
                            <View className="flex-1 flex flex-col rounded-xl">
                                <Image source={{uri: imagesList[item.index]}} className="w-full h-64 rounded-xl" />
                                <View className="flex-1 flex flex-col w-full p-3">
                                    <Text className="font-semibold text-base justify-start">{item.name}, {item.location}</Text>
                                    <Text className="font-medium text-sm justify-start text-gray-400/80">{item.address}</Text>
                                </View>
                            </View>
                        </Pressable>
                    </>
                )}
                keyExtractor={(item) => item.index}
             />
        </>
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