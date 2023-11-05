import { Text, View, Pressable, ScrollView, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as ref_db, onValue } from 'firebase/database';
import { ref as ref_storage, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../../../../firebaseConfig';
import { EditProfile } from '../../../../assets/profile_icons/profile_icons';

function DisplayPetProfile({ onSendPetDetails, receivedPetProfile }) {
    const [petData, setPetData] = useState([])
    const [petImage, setPetImage] = useState(null)
    const petProfile = receivedPetProfile
    const [isPetDataLoaded, setIsPetDataLoaded] = useState(false)
    const [isPetImageLoaded, setIsPetImageLoaded] = useState(false)
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
            const petID = uid.slice(0, 5) + petProfile.name
            const petRef = ref_db(db, "pets/" + uid + "/" + petID)
            const petListener = onValue(petRef, (snapshot) => {
                const data = snapshot.val()
                setPetData(data)
                setIsPetDataLoaded(true)
            })

            const petProfilePicRef = ref_storage(storage, "pet-profile-pictures/" + uid + "/" + petID)
            getDownloadURL(petProfilePicRef)
                .then((url) => {
                    const xhr = new XMLHttpRequest()
                    xhr.responseType = 'blob'
                    xhr.onload = (event) => {
                        const blob = xhr.response
                        setPetImage(xhr.responseURL)
                    }
                    xhr.open('GET', url)
                    xhr.send()
                    setIsPetImageLoaded(true)
                })
                .catch((error) => {
                    if (error.code === "storage/object-not-found") {
                        setIsPetImageLoaded(true)
                    } else {
                        console.error("Error receiving image: " + error)
                    }
                })
            return (() => {
                petListener()
            })
        }
    }, [uid])

    useEffect(() => {}, [isPetDataLoaded, isPetImageLoaded])

    return (
        <ScrollView className="flex-1 flex flex-col" contentContainerStyle={{paddingBottom: 30, alignItems: "center"}}>
            <View className="flex flex-col w-full pt-12 pb-5 justify-center items-center bg-petgreen rounded-b-2xl">
                {petImage &&
                    <Image source={{uri: petImage}} alt='Profile Picture' className="w-48 h-48 rounded-full"/>
                }
                {petData &&
                    <Text className="mt-5 font-bold text-5xl text-white">{petData.name}</Text>
                }
                <Pressable className="flex flex-row mt-3 p-3 pr-5 justify-center items-center bg-white rounded-2xl active:bg-gray-100" onPress={() => onSendPetDetails("EditPetProfile", {petData: petData, petImage: petImage})}>
                    <EditProfile width={28} height={28} fill={"black"} />
                    {petData &&
                        <Text className="ml-1 text-lg font-semibold">Edit {petData.name}'s Profile</Text>
                    }
                </Pressable>
            </View>
            <View className="flex flex-col w-full p-5 justify-center items-center">
                <View className="flex flex-col pb-5 border-2 border-petgreen rounded-3xl">
                    <View className="flex flex-row">
                        <View className="flex flex-col w-1/3 pl-5 py-5 gap-y-5">
                        {petData &&
                            Object.keys(petData).map((field) => {
                                const formattedField = field.charAt(0).toUpperCase() + field.slice(1)

                                if (field === "conditions") {

                                } else {
                                    return (
                                        <Text key={field} className="p-2 text-2xl font-semibold text-gray-400/70 border-b-2 border-gray-400/70">{formattedField}</Text>
                                    )
                                }
                            })
                        }
                        </View>
                        <View className="flex flex-col w-2/3 pr-5 py-5 gap-y-5">
                        {petData &&
                            Object.keys(petData).map((field) => {
                                const stringSplit = petData[field].split(" ")
                                const capitalizedString = stringSplit.map((string) => {
                                    return string.charAt(0).toUpperCase() + string.slice(1)
                                })
                                const formattedValue = capitalizedString.join(" ")

                                if (field === "conditions") {

                                } else {
                                    return (
                                        <Text key={field} className="p-2 text-right text-2xl font-semibold border-b-2 border-gray-400/70">{formattedValue}</Text>
                                    )
                                }
                            })
                        }
                        </View>
                    </View>
                    <View className="flex flex-col p-2">
                        <Text className="p-2 pl-3 text-2xl font-semibold text-gray-400/70">Conditions</Text>
                        {petData && petData.conditions &&
                            <Text className="w-[95%] p-5 text-lg font-medium self-center rounded-2xl border-2 border-gray-400/70">{petData.conditions}</Text>
                        }
                    </View>
                </View>
            </View>
            <Pressable className="flex flex-row mt-3 w-11/12 p-5 justify-center items-center bg-petgreen rounded-2xl active:bg-activepetgreen" onPress={() => onSendPetDetails("EmrHistory", {petData: petData, petImage: petImage})}>
                {petData &&
                    <Text className="ml-1 text-xl font-bold">View {petData.name}'s EMR History</Text>
                }
            </Pressable>
        </ScrollView>
    )
}

export default function PetProfile({ onReceivePetDetails, onReceivePetProfile }) {
    return (
        <DisplayPetProfile onSendPetDetails={(page, petDetails) => onReceivePetDetails(page, petDetails)} receivedPetProfile={onReceivePetProfile} />
    )
}