import { Text, View, SafeAreaView, ScrollView, Image, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { ref as ref_db, onValue, remove } from 'firebase/database';
import { ref as ref_storage, getDownloadURL, getMetadata, listAll } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, storage } from '../../../firebaseConfig';
import { createStackNavigator } from '@react-navigation/stack';
import History from "../../../assets/svg_logos/history.svg"
import moment from "moment"

const ActivityStack = createStackNavigator()

function DisplayActivity({ onNavigation, onModal }) {
    const [appointmentsData, setAppointmentsData] = useState([])
    const [clinicsData, setClinicsData] = useState([])
    const [petImages, setPetImages] = useState([])
    const [isAppointmentsDataLoaded, setIsAppointmentsDataLoaded] = useState(false)
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
            const appointsmentsRef = ref_db(db, "appointments")
            const appointmentsListener = onValue(appointsmentsRef, (snapshot) => {
                const data = snapshot.val()
                Object.keys(data).forEach(key => {
                    if (data[key].ownID === uid) {
                        setAppointmentsData(appointmentsData => [...appointmentsData, data[key]])
                    }
                })
                setIsAppointmentsDataLoaded(true)
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
                appointmentsListener()
                clinicsListener()
            }
        }
    }, [uid])

    useEffect(() => {
        if (isAppointmentsDataLoaded, isClinicsDataLoaded, isPetImagesLoaded) {
            const updatedAppointmentsData = [...appointmentsData]
            updatedAppointmentsData.forEach((entry) => {
                if (petImages.some((image) => image.imageName === entry.petID)) {
                    const matchingIndex = petImages.findIndex((image) => image.imageName === entry.petID)
                    entry.url = petImages[matchingIndex].url
                }
            })
            setAppointmentsData(updatedAppointmentsData)
        }
    }, [isAppointmentsDataLoaded, isClinicsDataLoaded, isPetImagesLoaded])

    return (
        <SafeAreaView className="flex-1 flex-col items-center bg-white">
            <View className="flex flex-row pt-5 w-full h-40 rounded-b-xl bg-petgreen justify-evenly items-center">
                <Text className="font-bold text-5xl">Upcoming</Text>
                <Pressable className="flex flex-col items-center w-24 h-24 rounded-full bg-white" onPress={() => onNavigation("History")}>
                    <History height={48} width={48} style={{top: 5}}/>
                    <Text className="mt-2 font-medium text-sm">History</Text>
                </Pressable>
            </View>
            <ScrollView className="w-full" contentContainerStyle={{alignItems: "center"}}>
                {isAppointmentsDataLoaded && isClinicsDataLoaded && isPetImagesLoaded &&
                    appointmentsData.map((appointment, index) => {
                        const matchingIndex = clinicsData.findIndex(clinic => clinic.index === appointment.vetIndex)

                        if (matchingIndex !== -1) {
                            return (
                                <Pressable key={index} className="flex flex-row mt-3 mb-3 w-11/12 h-56 rounded-2xl border-[1px] border-gray-300" onPress={() => onNavigation("UpcomingDetails", appointment)}>
                                    <View className="flex flex-col p-3 w-2/3 h-full justify-between rounded-xl">
                                        <Text className="font-semibold text-xl">{clinicsData[matchingIndex].name}</Text>
                                        <Text className="font-semibold text-xs text-gray-400">{clinicsData[matchingIndex].address}</Text>
                                        <Text className="font-light text-2xl">{moment(appointment.date).format("MMMM Do YYYY")}</Text>
                                        <Text className="font-light text-2xl">{moment((appointment.time), "HH:mm").format("h:mm A")}</Text>
                                    </View>
                                    <View className="flex flex-col p-2 w-1/3 h-full items-center rounded-xl">
                                        <Image source={{uri: appointment.url}} className="w-full h-3/5 rounded-xl" />
                                        <Text className="font-medium text-lg">{appointment.petID.slice(5)}</Text>
                                        <Pressable className="absolute flex flex-col bottom-3 w-full h-10 justify-center items-center rounded-full bg-cancel active:bg-activecancel" onPress={() => onModal("ModalScreen", appointment)}>
                                            <Text className="font-medium text-sm text-white">Cancel</Text>
                                        </Pressable>
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

export default function Activity({ receiveNavigation }) {
    function handleNavigation(page, params) {
        receiveNavigation(page, params)
    }

    function ActivityScreen({ navigation }) {
        return (
            <DisplayActivity onModal={(page, appointment) => navigation.navigate(page, {appointment: appointment})} onNavigation={(page, params) => handleNavigation(page, params)} />
        )
    }

    function ModalScreen({ navigation, route }) {
        const {appointment} = route.params
    
        function handleCancel(appointment) {
            const appointmentID = appointment.ownID.slice(0, 5) + appointment.date.replace(/-/g, '') + appointment.time.replace(/:/g, '') + "vet" + appointment.vetIndex.toString()
            const removeAppointmentRef = ref_db(db, "appointments/" + appointmentID)
            remove(removeAppointmentRef)
            handleNavigation("Activity")
        }
    
        return (
            <Pressable className="flex-1 flex items-center justify-center bg-black/50" onPress={() => navigation.goBack()}>
                <View className="flex w-10/12 h-1/2 items-center justify-center bg-white rounded-2xl">
                    <Text className="font-bold text-3xl">Are you sure?</Text>
                    <Text className="mt-5 text-xl text-center">You are about to cancel an appointment.</Text>
                    <View className="flex flex-row mt-10  w-full justify-evenly">
                        <Pressable onPress={() => handleCancel(appointment)} className="flex w-5/12 h-12 items-center justify-center rounded-2xl bg-petgreen active:bg-activepetgreen">
                            <Text className="font-medium text-xl text-white">Confirm</Text>
                        </Pressable>
                        <Pressable onPress={() => navigation.goBack()} className="flex w-5/12 h-12 items-center justify-center rounded-2xl bg-cancel active:bg-activecancel">
                            <Text className="font-medium text-xl text-white">Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        )
    }

    return (
        <ActivityStack.Navigator screenOptions={{headerShown: false, animation: "fade"}}>
            <ActivityStack.Group>
                <ActivityStack.Screen name="ActivityScreen" component={ActivityScreen} />
            </ActivityStack.Group>
            <ActivityStack.Group screenOptions={{ presentation: 'transparentModal' }}>
                <ActivityStack.Screen name="ModalScreen" component={ModalScreen} />
            </ActivityStack.Group>
        </ActivityStack.Navigator>
    )
}