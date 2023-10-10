import { Text, View, SafeAreaView, ScrollView, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { ref as ref_db, onValue } from 'firebase/database';
import { db } from '../../../firebaseConfig';
import moment from "moment"

function DisplayUpcomingDetails({ receivedAppointmentDetails }) {
    const [appointmentDetails, setAppointmentDetails] = useState(receivedAppointmentDetails)
    const [clinicsData, setClinicsData] = useState([])
    const [isClinicsDataLoaded, setIsClinicsDataLoaded] = useState(false)

    useEffect(() => {
        const clinicsRef = ref_db(db, "places")
        const clinicsListener = onValue(clinicsRef, (snapshot) => {
            const data = snapshot.val()
            Object.keys(data).forEach(key => {
                setClinicsData(clinicsData => [...clinicsData, data[key]])
            })
            setIsClinicsDataLoaded(true)
        })

        return () => {
            clinicsListener()
        }
    }, [])

    useEffect(() => {
        if (isClinicsDataLoaded) {
            const updatedAppointmentDetails = {...appointmentDetails}
            if (clinicsData.some((clinic) => clinic.index === updatedAppointmentDetails.vetIndex)) {
                const matchingIndex = clinicsData.findIndex((clinic) => clinic.index === updatedAppointmentDetails.vetIndex)
                updatedAppointmentDetails.clinicName = clinicsData[matchingIndex].name
                updatedAppointmentDetails.clinicAddress = clinicsData[matchingIndex].address
            }
            setAppointmentDetails(updatedAppointmentDetails)
        }
    }, [isClinicsDataLoaded])

    return (
        <SafeAreaView className="flex-1 flex-col pt-8 items-center">
            <ScrollView className="mt-7 w-full" contentContainerStyle={{alignItems: "center"}}>
                <View className="p-3 w-11/12 items-center border-2 border-petgreen rounded-xl">
                    <Image source={{uri: appointmentDetails.url}} className="w-44 h-44 rounded-xl" />
                    <Text className="mt-3 font-semibold text-3xl">{appointmentDetails.petID.slice(5)}</Text>
                    <View className="flex flex-row w-full">
                        <View className="flex flex-col mt-5 w-full justify-around">
                            <View className="flex flex-row p-2 w-full justify-between items-center border-b-[1px] border-gray-300">
                                <Text className="font-semibold text-2xl">Clinic</Text>
                                <Text className="font-light text-sm">{appointmentDetails.clinicName}</Text>
                            </View>
                            <View className="flex flex-row w-full p-2 h-fit justify-between items-center border-b-[1px] border-gray-300">
                                <Text className="font-semibold text-2xl">Address</Text>
                                <Text className="w-[70%] font-light text-sm text-right">{appointmentDetails.clinicAddress}</Text>
                            </View>
                            <View className="flex flex-row p-2 w-full justify-between items-center border-b-[1px] border-gray-300">
                                <Text className="font-semibold text-2xl">Date</Text>
                                <Text className="font-light text-sm">{moment(appointmentDetails.date).format("MMMM Do YYYY")}</Text>
                            </View>
                            <View className="flex flex-row p-2 w-full justify-between items-center border-b-[1px] border-gray-300">
                                <Text className="font-semibold text-2xl">Time</Text>
                                <Text className="font-light text-sm">{moment((appointmentDetails.time), "HH:mm").format("h:mm A")}</Text>
                            </View>
                        </View>
                    </View>
                    <View className="flex flex-col p-3 mt-5 w-full border-2 border-gray-300 rounded-2xl">
                        <Text className="font-semibold text-2xl">Reason</Text>
                        <ScrollView className="mt-3 w-full" nestedScrollEnabled={true}>
                            <Text>{appointmentDetails.reason}</Text>
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default function UpcomingDetails({ onReceiveAppointmentDetails }) {
    return (
        <DisplayUpcomingDetails receivedAppointmentDetails={onReceiveAppointmentDetails} />
    )
}