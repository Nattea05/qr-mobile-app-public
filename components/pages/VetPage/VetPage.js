import { useEffect, useState } from 'react';
import { ref as ref_db, onValue } from "firebase/database";
import { ref as ref_storage, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { db, storage } from '../../../firebaseConfig';
import { View, Text, Dimensions, Platform, Pressable, ScrollView, Image } from 'react-native';
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import { Close, PhoneNumber, Email, Time } from '../../../assets/svg_logos/svg_logos';
import moment from 'moment';

function DisplayPage({ receivedIndex, onViewAppointments, onBack }) {
    const [isLoading, setIsLoading] = useState(true);
    const [clinicData, setClinicData] = useState([])
    const [interiorList, setInteriorList] = useState([])
    const [staffList, setStaffList] = useState({})
    const [staffImages, setStaffImages] = useState({})
    const [isClinicDataLoaded, setIsClinicDataLoaded] = useState(false)
    const [isInteriorListLoaded, setIsInteriorListLoaded] = useState(false)
    const [isStaffListLoaded, setIsStaffListLoaded] = useState(false)
    const [isStaffImagesLoaded, setIsStaffImagesLoaded] = useState(false)

    useEffect(() => {
        const placesRef = ref_db(db, "places/place" + (receivedIndex + 1).toString())
        const placeListener = onValue(placesRef, (snapshot) => {
            const data = snapshot.val()
            setClinicData(data)
            setIsClinicDataLoaded(true)
        })

        const staffRef = ref_db(db, "staff/vet" + receivedIndex.toString())
        const staffListener = onValue(staffRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                Object.keys(data).filter(key => data[key].role === "Veterinarian").map(key => {
                    setStaffList((prevState) => ({
                        ...prevState,
                        [key]: data[key]
                    }))
                })
            }
            setIsStaffListLoaded(true)
        })

        const interiorRef = ref_storage(storage, "vet-interiors/place" + (receivedIndex + 1).toString())
        listAll(interiorRef)
            .then((res) => {
                const promises = res.items.map(async (itemRef) => {
                    const metadataPromise = getMetadata(itemRef);
                    const downloadURLPromise = getDownloadURL(itemRef);
                    try {
                        const [metadata, url] = await Promise.all([metadataPromise, downloadURLPromise]);
                        setInteriorList(interiorList => [...interiorList, {imageName: metadata.name, url: url}]);
                    } catch (error) {
                        console.error("Error retrieving interior images: ", error);
                    }
                });
                Promise.all(promises)
                    .then(() => {
                        setIsInteriorListLoaded(true);
                    })
                    .catch((error) => {
                        console.error("Error resolving promises: ", error)
                    })
            })
            .catch((error) => {
                console.error("Error referencing interior images: ", error)
            })

        return (() => {
            placeListener()
            staffListener()
        })
    }, [])

    useEffect(() => {
        if (isClinicDataLoaded && isInteriorListLoaded && isStaffListLoaded) {
            const staffImagesRef = ref_storage(storage, "staff-images/vet" + receivedIndex.toString())
            listAll(staffImagesRef)
                .then((res) => {
                    const promises = res.items.map(async (itemRef) => {
                        const metadataPromise = getMetadata(itemRef);
                        const downloadURLPromise = getDownloadURL(itemRef);
                        try {
                            const [metadata, url] = await Promise.all([metadataPromise, downloadURLPromise]);
                            if (Object.keys(staffList).includes(metadata.name)) {
                                setStaffImages((prevState) => ({
                                    ...prevState,
                                    [metadata.name]: {url: url}
                                }))
                            }
                        } catch (error) {
                            console.error("Error retrieving staff images: ", error);
                        }
                    });
                    Promise.all(promises)
                        .then(() => {
                            setIsStaffImagesLoaded(true);
                        })
                        .catch((error) => {
                            console.error("Error resolving promises: ", error)
                        })
                })
                .catch((error) => {
                    console.error("Error referencing staff images: ", error)
                })
        }
    }, [isClinicDataLoaded, isInteriorListLoaded, isStaffListLoaded]);

    useEffect(() => {
        if (isStaffImagesLoaded) {
            setIsLoading(false)
        }
    }, [isStaffImagesLoaded])

    const {width: screenWidth} = Dimensions.get("window");
    const [activeSlide, setActiveSlide] = useState(0);
    const renderItem = ({item, index}, parallaxProps) => {
        if (isInteriorListLoaded) {
            return (
                <View className="w-full h-80">
                    <ParallaxImage
                        source={{uri: item.url}}
                        containerStyle={{flex: 1, marginBottom: Platform.select({ios: 0, android: 1}), backgroundColor: 'white'}}
                        style={{width: "100%", height: "100%"}}
                        parallaxFactor={0.4}
                        {...parallaxProps}
                    />
                </View>
            );
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center align-middle">
                <Text className="font-bold text-6xl inline-block self-center bg-yellow-300">Loading...</Text>
            </View>
        );
    }
    
    return (
        <ScrollView className="flex-1 flex flex-col" contentContainerStyle={{paddingBottom: 30, alignItems: "center"}}>
            <View className="flex-1 w-full h-80">
                <Pressable onPress={() => onBack()} className="absolute z-10 ml-5 mt-10 flex flex-col w-14 h-14 justify-center items-center rounded-full bg-white">
                    <Close width={"36"} height={"36"} />
                </Pressable>
                {isClinicDataLoaded && isInteriorListLoaded &&
                    <>
                        <Carousel
                        ref = {(c) => {this._carousel = c;}}
                        sliderWidth={screenWidth}
                        sliderHeight={320}
                        itemWidth={screenWidth}
                        data={interiorList}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => (item.imageName + index.toString())}
                        hasParallaxImages={true}
                        onSnapToItem={(index) => setActiveSlide(index)}
                        containerCustomStyle={{ position: 'absolute', backgroundColor: 'transparent', zIndex: 0 }}
                        contentContainerStyle={{ flex: 1 }}
                        />
                        <Pagination
                            dotsLength={interiorList.length}
                            activeDotIndex={activeSlide}
                            containerStyle={{ backgroundColor: 'transparent', top: '65%', zIndex: 5 }}
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
                    </>
                }
            </View>
            <View className="flex w-full p-6 justify-center space-y-3">
                <Text className="font-semibold text-4xl text-left">{clinicData.name}</Text>
                <Text className="font-light text-justify">{clinicData.address}</Text>
                <View className="flex flex-row w-full p-2 space-x-3 items-center">
                    <Time width={"30"} height={"30"} fill={"#45e14f"} />
                    <Text className="font-bold text-xl">{moment(clinicData.openTime, "HH:mm").format("h:mm A")} - {moment(clinicData.closeTime, "HH:mm").format("h:mm A")}</Text>
                </View>
                <View className="flex flex-row w-full p-2 space-x-3 items-center">
                    <Email width={"30"} height={"30"} fill={"#45e14f"} />
                    <Text className="font-bold text-xl">{clinicData.email}</Text>
                </View>
                <View className="flex flex-row w-full p-2 space-x-3 items-center">
                    <PhoneNumber width={"30"} height={"30"} fill={"#45e14f"} />
                    <Text className="font-bold text-xl">{clinicData.phoneNumber}</Text>
                </View>
            </View>
            <View className="flex w-full h-80 py-5 justify-center space-y-3 bg-petgreen/50">
                <Text className="px-3 font-semibold text-3xl text-left">Contact the Veterinarians</Text>
                <ScrollView className="flex flex-row space-x-[50px] w-full self-center" horizontal={true} contentContainerStyle={{paddingLeft: 20, paddingRight: 20, justifyContent: "center", alignItems: "center"}}>
                    {isStaffListLoaded && isStaffImagesLoaded &&
                        Object.keys(staffList).map((staffID) => {
                            return (
                                <View key={staffID} className="flex flex-row w-[365px] h-full rounded-3xl bg-white">
                                    <View className="flex flex-col w-1/2 h-full justify-center items-center space-y-5">
                                        <Image source={{uri: staffImages[staffID].url}} className="w-32 h-32 rounded-full" />
                                        <Text className="font-bold text-2xl text-center">{staffList[staffID].name}</Text>
                                    </View>
                                    <View className="flex flex-col w-1/2 h-full justify-center items-center">
                                        <View className="flex flex-col w-full h-1/2 p-2 pl-5 justify-center items-start">
                                            <View className="flex flex-col space-y-3">
                                                <Email width={"30"} height={"30"} fill={"#45e14f"} />
                                                <Text className="font-medium text-sm">{staffList[staffID].email}</Text>
                                            </View>
                                        </View>
                                        <View className="w-11/12 border-b-2 border-gray-300" />
                                        <View className="flex flex-col w-full h-1/2 p-2 pl-5 space-y-5 justify-center">
                                            <View className="flex flex-col space-y-2">
                                                <PhoneNumber width={"30"} height={"30"} fill={"#45e14f"} />
                                                <Text className="font-medium text-sm">{staffList[staffID].phoneNumber}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                    {isStaffListLoaded && isStaffImagesLoaded && Object.keys(staffImages).length === 0 && Object.keys(staffImages).length  === 0 &&
                        <View className="flex flex-row w-[380px] h-full justify-center items-center rounded-3xl">
                            <Text className="font-light text-center text-3xl">This clinic has not added veterinarian information.</Text>
                        </View>
                    }
                </ScrollView>
            </View>
            <Pressable className='mt-8 w-11/12 h-20 self-center rounded-lg bg-petgreen active:bg-activepetgreen justify-center' onPress={() => onViewAppointments(receivedIndex)}>
                <Text className='font-bold text-black text-2xl self-center'>See all available appointments</Text>
            </Pressable>
        </ScrollView>
    );
}

export default function VetPage({ onReceiveIndex, onReceiveViewAppointments, receiveBack }) {
    function handleViewAppointments(currentVetIndex) {
        onReceiveViewAppointments("DateSlots", currentVetIndex)
    }
    
    function handleBack() {
        receiveBack()
    }

    return (
        <DisplayPage receivedIndex={onReceiveIndex} onViewAppointments={(currentVetIndex) => handleViewAppointments(currentVetIndex)} onBack={() => handleBack()} />
    );
}