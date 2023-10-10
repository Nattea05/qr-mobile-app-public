import { Text, View, SafeAreaView, ScrollView, Image, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { ref as ref_db, onValue } from 'firebase/database';
import { ref as ref_storage, getDownloadURL, getMetadata, listAll } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, storage } from '../../../../firebaseConfig';
import Upcoming from "../../../../assets/svg_logos/upcoming.svg"
import moment from "moment"

function DisplayHistory({ onNavigation }) {
    const [historyData, setHistoryData] = useState([])
    const [clinicsData, setClinicsData] = useState([])
    const [petImages, setPetImages] = useState([])
    const [isHistoryDataLoaded, setIsHistoryDataLoaded] = useState(false)
    const [isClinicsDataLoaded, setIsClinicsDataLoaded] = useState(false)
    const [isPetImagesLoaded, setIsPetImagesLoaded] = useState(false)
    const [uid, setUid] = useState('')

    function falseAuth() {
        return (
            <Text className="text-4xl font-bold text-center self-center">There is an authentication issue. Please login again.</Text>
        )
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUid(user.uid)
        } else {
            falseAuth()
        }
    })

    useEffect(() => {
        if (uid) {
            const historyRef = ref_db(db, "appointment_history")
            const historyListener = onValue(historyRef, (snapshot) => {
                const data = snapshot.val()
                Object.keys(data).forEach(key => {
                    if (data[key].ownID === uid) {
                        setHistoryData(historyData => [...historyData, data[key]])
                    }
                })
                setIsHistoryDataLoaded(true)
            })

            const clinicsRef = ref_db(db, "places")
            const clinicsListener = onValue(clinicsRef, (snapshot) => {
                const data = snapshot.val()
                Object.keys(data).forEach(key => {
                    setClinicsData(clinicsData => [...clinicsData, data[key]])
                })
                setIsClinicsDataLoaded(true)
            })

            const petImagesRef = ref_storage(storage, "pet-profile-pictures/" + uid)
            listAll(petImagesRef)
            .then((res) => {
                const promises = res.items.map(async (itemRef) => {
                    const metadataPromise = getMetadata(itemRef);
                    const downloadURLPromise = getDownloadURL(itemRef);
                    try {
                        const [metadata, url] = await Promise.all([metadataPromise, downloadURLPromise]);
                        setPetImages(petImages => [...petImages, {imageName: metadata.name, url: url}]);
                    } catch (error) {
                        console.error("Error received: ", error);
                    }
                });
                Promise.all(promises)
                    .then(() => {
                        setIsPetImagesLoaded(true);
                    })
                    .catch((error) => {
                        console.error("Error received: ", error)
                    })
            })
            .catch((error) => {
                console.error("Error received: ", error)
            })

            return () => {
                historyListener()
                clinicsListener()
            }
        }
    }, [uid])

    useEffect(() => {
        if (isHistoryDataLoaded, isClinicsDataLoaded, isPetImagesLoaded) {
            const updatedHistoryData = [...historyData]
            updatedHistoryData.forEach((entry) => {
                if (petImages.some((image) => image.imageName === entry.petID)) {
                    const matchingIndex = petImages.findIndex((image) => image.imageName === entry.petID)
                    entry.url = petImages[matchingIndex].url
                }
            })
            setHistoryData(updatedHistoryData)
        }
    }, [isHistoryDataLoaded, isClinicsDataLoaded, isPetImagesLoaded])

    return (
        <SafeAreaView className="flex-1 flex-col items-center">
            <View className="flex flex-row pt-5 w-full h-40 rounded-b-xl bg-petgreen justify-evenly items-center">
                <Text className="font-bold text-5xl">History</Text>
                <Pressable className="flex flex-col ml-16 w-24 h-24 items-center rounded-full bg-white" onPress={() => onNavigation("Activity")}>
                    <Upcoming height={45} width={45} style={{top: 5}}/>
                    <Text className="mt-2 font-medium text-sm">Upcoming</Text>
                </Pressable>
            </View>
            <ScrollView className="w-full" contentContainerStyle={{alignItems: "center"}}>
                {isHistoryDataLoaded && isClinicsDataLoaded && isPetImagesLoaded &&
                    historyData.map((history, index) => {
                        const matchingIndex = clinicsData.findIndex(clinic => clinic.index === history.vetIndex)

                        if (matchingIndex !== -1) {
                            return (
                                <Pressable key={index} className="flex flex-row mt-3 mb-3 w-11/12 h-56 rounded-2xl border-[1px] border-gray-300" onPress={() => onNavigation("Emr", history)}>
                                    <View className="flex flex-col p-3 w-2/3 h-full justify-between rounded-xl">
                                        <Text className="font-semibold text-xl">{clinicsData[matchingIndex].name}</Text>
                                        <Text className="font-semibold text-xs text-gray-400">{clinicsData[matchingIndex].address}</Text>
                                        <Text className="font-light text-2xl">{moment(history.date).format("MMMM Do YYYY")}</Text>
                                        <Text className="font-light text-2xl">{moment((history.time), "HH:mm").format("h:mm A")}</Text>
                                    </View>
                                    <View className="flex flex-col p-2 w-1/3 h-full items-center rounded-xl">
                                        <Image source={{uri: history.url}} className="w-full h-3/5 rounded-xl" />
                                        <Text className="font-medium text-lg">{history.petID.slice(5)}</Text>
                                        <View className="absolute flex flex-col bottom-3 w-full h-10 justify-center items-center rounded-full bg-petgreen">
                                            <Text className="font-medium text-sm text-white">Completed</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            )
                        }
                    })
                } 
            </ScrollView>
        </SafeAreaView>
    )
}

export default function History({ receiveNavigation }) {
    function handleNavigation(page, params) {
        receiveNavigation(page, params)
    }

    return (
        <DisplayHistory onNavigation={(page, params) => handleNavigation(page, params)} />
    )
}