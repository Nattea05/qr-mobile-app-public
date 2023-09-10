import { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, Platform, Pressable } from 'react-native';
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import useDataFetch from '../../interaction_events/DataFetch';

function DisplayPage({ receivedIndex, onViewAppointments }) {
    const [isLoading, setIsLoading] = useState(true);
    const [placesList, imagesList] = useDataFetch('vet-interiors');
    useEffect(() => {
        if (placesList.length > 0 && imagesList.length > 0) {
            setIsLoading(false);
        }
    }, [placesList, imagesList]);

    const {width: screenWidth} = Dimensions.get("window");
    const [activeSlide, setActiveSlide] = useState(0);
    const renderItem = ({item, index}, parallaxProps) => {
        return (
            <View className="w-full h-80">
                <ParallaxImage
                    source={{uri: imagesList[item.index]}}
                    containerStyle={{flex: 1, marginBottom: Platform.select({ios: 0, android: 1}), backgroundColor: 'white'}}
                    style={{width: "100%", height: "100%"}}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
            </View>
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center align-middle">
                <Text className="font-bold text-6xl inline-block self-center bg-yellow-300">Loading...</Text>
            </View>
        );
    }
    return (
        <FlatList
            contentContainerStyle={{flexDirection: 'column'}}
            data={[{key: 0}]}
            renderItem={() => (
                <>
                    <View className="flex-1 w-full h-80">
                        <Carousel
                            ref = {(c) => {this._carousel = c;}}
                            sliderWidth={screenWidth}
                            sliderHeight={320}
                            itemWidth={screenWidth}
                            data={placesList}
                            renderItem={renderItem}
                            keyExtractor={item => item.index}
                            hasParallaxImages={true}
                            onSnapToItem={(index) => setActiveSlide(index)}
                            containerCustomStyle={{ position: 'absolute', backgroundColor: 'transparent' }}
                            contentContainerStyle={{ flex: 1 }}
                        />
                        <Pagination
                            dotsLength={placesList.length}
                            activeDotIndex={activeSlide}
                            containerStyle={{ backgroundColor: 'transparent', top: '60%' }}
                            dotStyle={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                marginHorizontal: 8,
                                backgroundColor: 'white'
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />
                    </View>
                    <View className="flex-1 w-full h-screen">
                        <Text className="font-bold text-4xl">{placesList[receivedIndex].name}, {placesList[receivedIndex].location}</Text>
                        <Pressable
                            className='w-11/12 h-16 self-center rounded-lg bg-petgreen active:bg-activepetgreen justify-center'
                            onPress={() => onViewAppointments(receivedIndex)}
                        >
                            <Text className='font-bold text-black text-2xl self-center'>See all available appointments</Text>
                        </Pressable>
                    </View>
                </>
            )}
            keyExtractor={item => item.key}
        />
    );
}

export default function VetPage({ onReceiveIndex, onReceiveViewAppointments }) {
    function handleViewAppointments(currentVetIndex) {
        onReceiveViewAppointments("DateSlots", currentVetIndex)
    }

    return (
        <DisplayPage receivedIndex={onReceiveIndex} onViewAppointments={(currentVetIndex) => handleViewAppointments(currentVetIndex)} />
    );
}