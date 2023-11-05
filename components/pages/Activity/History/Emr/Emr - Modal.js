import { Text, View, SafeAreaView, ScrollView, Image, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { ref as ref_db, onValue } from 'firebase/database';
import { db } from '../../../../../firebaseConfig';
import { createStackNavigator } from '@react-navigation/stack';
import QR from '../../../../../assets/svg_logos/qr.svg'
import moment from "moment"

const EmrStack = createStackNavigator()

function DisplayEmr({ receivedHistoryDetails, onQrModal }) {
    const [historyDetails, setHistoryDetails] = useState(receivedHistoryDetails)
    const [emrData, setEmrData] = useState({})
    const [isEmrDataLoaded, setIsEmrDataLoaded] = useState(false)

    function capitalizeWords(string) {
        return string.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    useEffect(() => {
        const emrID = historyDetails.ownID.slice(0, 5) + historyDetails.date.replace(/-/g, '') + historyDetails.time.replace(/:/g, '') + "vet" + historyDetails.vetIndex.toString()
        const emrRef = ref_db(db, "emr_list/" + emrID)
        const updatedEmrData = {...emrData}
        const emrListener = onValue(emrRef, (snapshot) => {
            const data = snapshot.val()
            Object.keys(data).forEach(key => {
                if (key === "subjective") {
                    updatedEmrData.subjective = data[key]
                } else if (key === "objective") {
                    updatedEmrData.objective = data[key]
                } else if (key === "assessment") {
                    updatedEmrData.assessment = data[key]
                }
            })
            setEmrData(updatedEmrData)
            setIsEmrDataLoaded(true)
        })

        return () => {
            emrListener()
        }
    }, [])

    useEffect(() => {if (isEmrDataLoaded) {}}, [isEmrDataLoaded])

    return (
        <SafeAreaView className="flex-1 flex-col items-center bg-white">
            <View className="flex flex-row pt-5 w-full h-40 rounded-b-xl bg-petgreen justify-evenly items-center">
                <Text className="font-bold text-3xl">{moment(historyDetails.date).format("MMMM Do YYYY")}</Text>
                <Pressable className="flex flex-col w-24 h-24 items-center rounded-full bg-white" onPress={() => onQrModal("QrModalScreen")}>
                    <QR height={50} width={50} style={{top: 5}}/>
                    <Text className="mt-2 font-medium text-lg">QR</Text>
                </Pressable>
            </View>
            <ScrollView className="w-full" contentContainerStyle={{alignItems: "center"}}>
                <View className="flex flex-col p-3 w-full items-center">
                    <View className="flex-1 flex flex-row pb-7 w-full justify-evenly border-b-2 border-petgreen">
                        <View className="flex pt-2 items-center">
                            <Image source={{uri: historyDetails.url}} className="w-32 h-32 rounded-xl" />
                            <Text className="mt-3 font-medium text-xl">{historyDetails.petID.slice(5)}</Text>
                        </View>
                        <View className="p-2 left-3 w-7/12 rounded-3xl border-2 border-gray-300">
                            <Text className="font-semibold text-2xl">Reason</Text>
                            <ScrollView className="max-h-28" nestedScrollEnabled={true}>
                                <Text className="font-light text-lg">{historyDetails.reason}</Text>
                            </ScrollView>
                        </View>
                    </View>
                    <View className="flex-1 flex flex-col mt-5 w-full">
                        <Text className="font-semibold text-2xl text-gray-400">Subjective</Text>
                        <View className="mt-3 p-3 rounded-3xl border-2 border-gray-300">
                            <ScrollView className="h-40 max-h-40" nestedScrollEnabled={true}>
                                <Text className="font-medium">{emrData.subjective}</Text>
                            </ScrollView>
                        </View>
                    </View>
                    <View className="flex-1 flex flex-col mt-5 w-full">
                        <Text className="font-semibold text-2xl text-gray-400">Objective</Text>
                        <ScrollView className="mt-3 h-[300px] max-h-[300px] rounded-3xl border-2 border-gray-300" contentContainerStyle={{padding: 20}} nestedScrollEnabled={true}>
                            {isEmrDataLoaded && emrData.objective && emrData.objective.vitals && (
                                <View className="flex flex-col p-3 w-full rounded-3xl border-2 border-gray-300">
                                    <Text className="font-medium text-2xl">Vitals</Text>
                                    <View className="flex flex-row w-full h-52">
                                        <View className="flex w-1/2 justify-evenly">
                                            {Object.keys(emrData.objective.vitals).map(field => (
                                                <Text key={field} className="font-medium text-lg text-gray-400">
                                                    {capitalizeWords(field)}
                                                </Text>
                                            ))}
                                        </View>
                                        <View className="flex w-1/2 justify-evenly">
                                            {Object.keys(emrData.objective.vitals).map(field => (
                                                <Text key={field} className="font-medium text-lg">
                                                    {
                                                        field === "heartRate" ? `${emrData.objective.vitals[field]} Bpm` :
                                                        field === "respiration" ? `${emrData.objective.vitals[field]} Bpm` :
                                                        field === "temperature" ? `${emrData.objective.vitals[field]} °C` :
                                                        field === "weight" ? `${emrData.objective.vitals[field]} kg` :
                                                        ""
                                                    }
                                                </Text>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            )}
                            {isEmrDataLoaded && emrData.objective && emrData.objective.candh && (
                                <View className="flex flex-col p-3 mt-5 w-full rounded-3xl border-2 border-gray-300">
                                    <Text className="font-medium text-2xl">Circulation and Hydration</Text>
                                    <View className="flex flex-row w-full h-52">
                                        <View className="flex w-2/3 justify-evenly">
                                            {Object.keys(emrData.objective.candh).map(field => (
                                                <Text key={field} className="font-medium text-[17px] text-gray-400">
                                                    {
                                                        field === "crt" ? `Capillary Refill Time` :
                                                        field === "ha" ? `Hydration Assessment` :
                                                        field === "mmc" ? `Mucous Membrane Colour` :
                                                        ""
                                                    }
                                                </Text>
                                            ))}
                                        </View>
                                        <View className="flex w-1/3 justify-evenly">
                                            {Object.keys(emrData.objective.candh).map(field => (
                                                <Text key={field} className="font-medium text-lg">
                                                    {
                                                        field === "crt" ? `${emrData.objective.candh[field]} seconds` :
                                                        field === "ha" ? `${emrData.objective.candh[field]}` :
                                                        field === "mmc" ? `${emrData.objective.candh[field]}` :
                                                        ""
                                                    }
                                                </Text>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            )}                            
                        </ScrollView>
                    </View>
                    <View className="flex-1 flex flex-col mt-5 w-full">
                        <Text className="font-semibold text-2xl text-gray-400">Assessment</Text>
                        <View className="mt-3 p-3 rounded-3xl border-2 border-gray-300">
                            <ScrollView className="h-40 max-h-40" nestedScrollEnabled={true}>
                                <Text className="font-medium">{emrData.assessment}</Text>
                            </ScrollView>
                        </View>
                    </View>                    
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default function Emr({ onReceiveHistoryDetails }) {
    function EmrScreen({ navigation }) {
        return (
            <DisplayEmr receivedHistoryDetails={onReceiveHistoryDetails} onQrModal={(page) => navigation.navigate(page)} />
        )
    }

    function QrModalScreen({ navigation }) {
        return (
            <View className="flex-1 flex bg-petgreen">

            </View>
        )
    }

    return (
        <EmrStack.Navigator screenOptions={{headerShown: false, animation: "slide_from_bottom"}}>
            <EmrStack.Group>
                <EmrStack.Screen name="EmrScreen" component={EmrScreen} />
            </EmrStack.Group>
            <EmrStack.Group screenOptions={{ presentation: 'modal' }}>
                <EmrStack.Screen name="QrModalScreen" component={QrModalScreen} />
            </EmrStack.Group>
        </EmrStack.Navigator>
    )
}