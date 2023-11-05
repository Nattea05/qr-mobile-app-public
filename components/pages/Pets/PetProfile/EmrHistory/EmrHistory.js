import { Text, View, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as ref_db, onValue } from 'firebase/database';
import { db, auth } from '../../../../../firebaseConfig';
import moment from 'moment';

function DisplayEmrHistory({ receivedPetDetails, onNavigateEmr }) {
    const petDetails = receivedPetDetails
    const [petData, setPetData] = useState(petDetails.petData)
    const [petImage, setPetImage] = useState(petDetails.petImage)
    const [appointmentList, setAppointmentList] = useState({})
    const [clinics, setClinics] = useState([])
    const [isAppointmentListLoaded, setIsAppointmentListLoaded] = useState(false)
    const [uid, setUid] = useState('');

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
            const petID = uid.slice(0, 5) + petData.name
            const appointmentListRef = ref_db(db, "appointment_history")
            const appointmentListener = onValue(appointmentListRef, (snapshot) => {
                const data = snapshot.val()
                {data ? Object.keys(data).filter((key) => data[key].petID === petID).forEach((key) => {
                    setAppointmentList(appointmentList => ({...appointmentList, [key]: data[key]}))
                }) : null}
                setIsAppointmentListLoaded(true)
            })

            const clinicRef = ref_db(db, "places")
            const clinicListener = onValue(clinicRef, (snapshot) => {
                const data = snapshot.val()
                {data ? Object.keys(data).forEach((key) => {
                    setClinics(clinics => [...clinics, data[key]])
                }) : null}
            })

            return (() => {
                appointmentListener()
                clinicListener()
            })
        }
    }, [uid])

    useEffect(() => {}, [isAppointmentListLoaded])

    return (
        <>
            <View className="flex w-full h-32 p-8 pt-14 rounded-b-xl justify-center bg-petgreen">
                <Text className="font-bold text-3xl">{petData.name}'s EMR History</Text>
            </View>
            <ScrollView className="flex-1 flex flex-col" contentContainerStyle={{paddingBottom: 30, alignItems: "center"}}>
                <View className="flex flex-col w-full p-5 pb-10 pt-0 justify-center items-center">
                    {appointmentList && clinics &&
                        Object.keys(appointmentList).map((key) => {
                            const matchingIndex = clinics.findIndex((clinics) => clinics.index.toString() === key.slice(-1))
                            const date = moment(key.slice(5, 13)).format("MMMM Do YYYY")
                            const time = moment((key.slice(13, 17)), "HH:mm").format("h:mm A")

                            if (matchingIndex !== -1) {
                                appointmentList[key].url = petImage

                                return (
                                    <Pressable key={key} className="flex flex-col mt-5 w-[95%] p-3 py-5 rounded-2xl active:bg-gray-100" onPress={() => onNavigateEmr(appointmentList[key])}>
                                        <Text className="font-semibold text-xl">{clinics[matchingIndex].name}</Text>
                                        <Text className="font-medium text-sm text-gray-400/80">{date}, {time}</Text>
                                    </Pressable>
                                )
                            }
                        })
                    }
                </View>
            </ScrollView>
        </>
    )
}

export default function EmrHistory({ onReceivePetDetails,onReceiveEmrNavigation }) {
    return (
        <DisplayEmrHistory receivedPetDetails={onReceivePetDetails} onNavigateEmr={(appointmentDetails) => onReceiveEmrNavigation(appointmentDetails)} />
    )
}