import { Text, View, Pressable, ScrollView, Image, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as ref_db, set, remove, onValue } from 'firebase/database';
import { ref as ref_storage, uploadBytes, deleteObject, updateMetadata } from 'firebase/storage';
import { createStackNavigator } from '@react-navigation/stack';
import Animated, { Easing, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { db, auth, storage } from '../../../../../firebaseConfig';
import { Close, Done } from '../../../../../assets/svg_logos/svg_logos';
import * as ImagePicker from 'expo-image-picker'

const EditPetProfileStack = createStackNavigator()

function DisplayEditPetProfile({ receivedNewImage, receivedPetDetails, onNavigation, onClose, onDone, onPetRemove }) {
    const petDetails = receivedPetDetails
    const [fill, setFill] = useState("#45e14f")
    const [petData, setPetData] = useState(petDetails.petData)
    const [petImage, setPetImage] = useState(petDetails.petImage)
    const [uid, setUid] = useState('');
    const newImage = receivedNewImage ? receivedNewImage : null

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

    function handleDone() {
        const oldPetID = uid.slice(0, 5) + petDetails.petData.name
        const newPetID = uid.slice(0, 5) + petData.name
        const oldPetRef = ref_db(db, "pets/" + uid + "/" + oldPetID)
        const newPetRef = ref_db(db, "pets/" + uid + "/" + newPetID)
        const oldPetPicRef = ref_storage(storage, "pet-profile-pictures/" + uid + "/" + oldPetID)
        const newPetPicRef = ref_storage(storage, "pet-profile-pictures/" + uid + "/" + newPetID)
        const hasMissingDetails = Object.values(petData).some(
            (value) => value === undefined || value === null || value.trim() === ""
        )

        if (hasMissingDetails) {
            Alert.alert('Empty Fields Detected', 'Please fill in all the required fields.', [
                {
                    text: 'OK'
                }
            ],
            {cancelable: true}
            )
        } else {
            remove(oldPetRef)
            set(newPetRef, petData)
            async function convertImageUriToBlob(imageUri) {
                // Fetch image data as a Blob
                const response = await fetch(imageUri)
                const blob = await response.blob()
                return blob;
            }

            if (newImage) {
                deleteObject(oldPetPicRef)
                    .then(() => {
                        // Successful delete
                        convertImageUriToBlob(newImage)
                            .then((blob) => {
                                uploadBytes(newPetPicRef, blob)
                                    .then((snapshot) => {
                                        // Successful upload
                                    })
                                    .catch((error) => {
                                        console.error("Error uploading file: " + error)
                                    })
                            })
                            .catch((error) => {
                                console.error("Error converting image URI to Blob:", error)
                            })                        
                    })
                    .catch((error) => {
                        console.error("Error deleting image: " + error)
                    })
            } else {
                if (petData.name !== petDetails.petData.name) {
                    convertImageUriToBlob(petImage)
                        .then((blob) => {
                            uploadBytes(newPetPicRef, blob)
                                .then((snapshot) => {
                                    // Successful upload
                                    deleteObject(oldPetPicRef)
                                        .then(() => {
                                            // Successful delete
                                        })
                                        .catch((error) => {
                                            console.error("Error deleting image: " + error)
                                        })                                        
                                })
                                .catch((error) => {
                                    console.error("Error uploading file: " + error)
                                })
                        })
                        .catch((error) => {
                            console.error("Error converting image URI to Blob:", error)
                        })                        
                } else {
                    convertImageUriToBlob(petImage)
                        .then((blob) => {
                            uploadBytes(newPetPicRef, blob)
                                .then((snapshot) => {
                                    // Successful upload
                                })
                                .catch((error) => {
                                    console.error("Error uploading file: " + error)
                                })
                        })
                        .catch((error) => {
                            console.error("Error converting image URI to Blob:", error)
                        })                      
                }
            }

            setTimeout(() => {
                onDone(petData)
            }, 500)
        }
    }

    function handlePetRemove() {
        const petID = uid.slice(0, 5) + petDetails.petData.name
        onPetRemove("RemovePetModal", {petID: petID, uid: uid})
    }

    return (
        <View className="flex-1 flex flex-col pt-10 bg-white">
            <View className="flex flex-row w-full p-2 justify-between">
                <Pressable onPress={() => onClose()}>
                    <Close width={"58"} height={"54"} />
                </Pressable>
                <Pressable onPress={() => handleDone()} onPressIn={() => setFill('#22d12d')} onPressOut={() => setFill("#45e14f")}>
                    <Done width={"60"} height={"60"} fill={fill} />
                </Pressable>
            </View>
            <ScrollView className="flex-1 flex flex-col" contentContainerStyle={{paddingTop: 10, paddingBottom: 30, alignItems: "center"}}>
                {petImage && !newImage &&
                    <Pressable className="rounded-full" onPress={() => onNavigation("PetProfilePicModal")}>
                        <Image source={{uri: petImage}} alt='Pet Profile Picture' className="w-48 h-48 rounded-full"/>
                    </Pressable>
                }
                {newImage &&
                    <Pressable className="w-48 h-48 rounded-full" onPress={() => onNavigation("PetProfilePicModal")}>
                        <Image src={newImage} alt='Pet Profile Picture' className="w-48 h-48 rounded-full"/>
                    </Pressable>
                }
                {Object.keys(petData).map((field) => {
                    const formattedField = field.charAt(0).toUpperCase() + field.slice(1)
                    const stringSplit = petData[field].split(" ")
                    const capitalizedString = stringSplit.map((string) => {
                        return string.charAt(0).toUpperCase() + string.slice(1)
                    })
                    const formattedValue = capitalizedString.join(" ")

                    if (field === "name") {

                    } else {
                        return (
                            <View key={field} className="flex flex-col w-11/12 mt-5">
                                <Text className="pl-3">{formattedField}</Text>
                                <TextInput
                                    className="flex w-full h-16 p-3 font-semibold text-xl border-b-2"
                                    style={{textAlignVertical: "top"}}
                                    value={formattedValue}
                                    placeholder={
                                        field === "species"
                                            ? formattedField + " (e.g. Dog, Cat)"
                                            : field === "breed"
                                            ? formattedField + " (e.g. Shiba, Siamese)"
                                            : formattedField
                                    }
                                    placeholderTextColor={"#cbcbcb"}
                                    multiline={false}
                                    onChangeText={(text) => {
                                        setPetData((prevPetData) => ({
                                            ...prevPetData,
                                            [field]: text,
                                        }))
                                    }}
                                /> 
                            </View>
                        )
                    }
                })}
                <Pressable className="flex flex-row mt-10 w-11/12 p-5 justify-center items-center bg-cancel rounded-2xl active:bg-activecancel" onPress={() => handlePetRemove()}>
                    <Text className="ml-1 text-xl font-bold">Remove {petDetails.petData.name}'s Profile</Text>
                </Pressable>
            </ScrollView>
        </View>
    )
}

export default function EditPetProfile({ onReceivePetDetails, onReceiveDone, onConfirmPetRemove }) {
    function EditPetProfileScreen({ navigation, route }) {
        return (
            <DisplayEditPetProfile receivedNewImage={route.params ? route.params : ''} receivedPetDetails={onReceivePetDetails} onNavigation={(page) => navigation.navigate(page)} onClose={() => navigation.goBack()} onDone={(petData) => onReceiveDone(petData)} onPetRemove={(page, ref) => navigation.navigate(page, {ref: ref})} />
        )
    }

    function PetProfilePicModal({ navigation }) {
        const [newImage, setNewImage] = useState(null);
        const pickImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            })
        
            if (!result.canceled) {
                setNewImage(result.assets[0].uri);
            }
          }
    
        const snapImage = async () => {
          if ((await ImagePicker.getCameraPermissionsAsync()).granted) {
            let result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            })
          
            if (!result.canceled) {
                setNewImage(result.assets[0].uri);
            }
          } else {
            ImagePicker.requestCameraPermissionsAsync()
          }
        }

        useEffect(() => {
            if (newImage) {
                navigation.navigate("EditPetProfileScreen", newImage)
            }
        }, [newImage])

        return (
            <Pressable className="flex-1 flex bg-black/50" onPress={() => navigation.goBack()}>
                <Animated.View
                    entering={SlideInDown.duration(200).easing(Easing.bezier(0.09, 0.38, 0.09, 1.01))}
                    exiting={SlideOutDown.duration(250).easing(Easing.bezier(0.09, 0.38, 0.09, 1.01))}
                    className="flex flex-col absolute bottom-0 w-full h-1/3 justify-evenly items-center rounded-t-2xl bg-white"
                >
                    <Pressable onPress={() => snapImage()} className="w-11/12 h-20 justify-center items-center bg-petgreen active:bg-activepetgreen rounded-2xl">
                      <Text className="font-medium text-3xl">Use Camera</Text>
                    </Pressable>
                    <Pressable onPress={() => pickImage()} className="w-11/12 h-20 justify-center items-center bg-petgreen active:bg-activepetgreen rounded-2xl">
                      <Text className="font-medium text-3xl">Pick from Gallery</Text>
                    </Pressable>
                </Animated.View>
            </Pressable>
        )
    }
    
    function RemovePetModal({ navigation, route }) {
        const {ref} = route.params
        const petRef = ref_db(db, "pets/" + ref.uid + "/" + ref.petID)
        const petImageRef = ref_storage(storage, "pet-profile-pictures/" + ref.uid + "/" + ref.petID)
        const [petAppointments, setPetAppointments] = useState({})
        const [petHistory, setPetHistory] = useState({})
        const [petEmrHistory, setPetEmrHistory] = useState({})
        const [isPetAppointmentsLoaded, setIsPetAppointmentsLoaded] = useState(false)
        const [isPetHistoryLoaded, setIsPetHistoryLoaded] = useState(false)
        const [isPetEmrHistoryLoaded, setIsPetEmrHistoryLoaded] = useState(false)
        
        useEffect(() => {
            const petAppointmentRef = ref_db(db, "appointments")
            const petAppointmentListener = onValue(petAppointmentRef, (snapshot) => {
                const data = snapshot.val()
                Object.keys(data).filter(key => data[key].petID === ref.petID).map((key) => setPetAppointments((prevState) => ({
                    ...prevState,
                    [key]: data[key]
                })))
                setIsPetAppointmentsLoaded(true)
            })

            return (() => {
                petAppointmentListener()
            })
        }, [])

        useEffect(() => {
            if (isPetAppointmentsLoaded) {
                const petAppointmentHistoryRef = ref_db(db, "appointment_history")
                const petAppointmentHistoryListener = onValue(petAppointmentHistoryRef, (snapshot) => {
                    const data = snapshot.val()
                    Object.keys(data).filter(key => data[key].petID === ref.petID).map((key) => setPetHistory((prevState) => ({
                        ...prevState,
                        [key]: data[key]
                    })))
                    setIsPetHistoryLoaded(true)
                })

                return (() => {
                    petAppointmentHistoryListener()
                })
            }
        }, [isPetAppointmentsLoaded])

        useEffect(() => {
            if (isPetHistoryLoaded) {
                const petEmrHistoryRef = ref_db(db, "emr_list")
                const petEmrHistoryListener = onValue(petEmrHistoryRef, (snapshot) => {
                    const data = snapshot.val()
                    Object.keys(data).filter(key => data[key].patientID === ref.petID).map((key) => setPetEmrHistory((prevState) => ({
                        ...prevState,
                        [key]: data[key]
                    })))
                    setIsPetEmrHistoryLoaded(true)
                })

                return (() => {
                    petEmrHistoryListener()
                })
            }
        }, [isPetHistoryLoaded])

        // useEffect(() => {
        //     if (isPetEmrHistoryLoaded) {
        //         console.log(petAppointments)
        //         console.log(petHistory)
        //         console.log(petEmrHistory)
        //     }
        // }, [isPetEmrHistoryLoaded])

        function removePet() {
            Object.keys(petAppointments).forEach((key) => {
                const appointmentRef = ref_db(db, "appointments/" + key)
                remove(appointmentRef)
            })

            Object.keys(petHistory).forEach((key) => {
                const historyRef = ref_db(db, "appointment_history/" + key)
                const emrRef = ref_db(db, "emr_list/" + key)
                remove(historyRef)
                remove(emrRef)
            })

            remove(petRef)
            deleteObject(petImageRef)
                .then(() => {
                    // Successful delete
                })
                .catch((error) => {
                    console.error("Error removing pet picture: " + error)
                })
            setTimeout(() => {
                onConfirmPetRemove()
            }, 500)
        }

        if (!isPetEmrHistoryLoaded) {
            return (
                <Pressable className="flex-1 flex items-center justify-center bg-black/50" onPress={() => navigation.goBack()}>
                    <View className="flex w-10/12 h-1/3 p-3 items-center justify-center bg-white rounded-2xl">
                        <Text className="font-bold text-3xl">Fetching data...</Text>
                    </View>
                </Pressable>
            )
        }

        return (
            <Pressable className="flex-1 flex items-center justify-center bg-black/50" onPress={() => navigation.goBack()}>
                <View className="flex w-10/12 h-1/3 p-3 items-center justify-center bg-white rounded-2xl">
                    <Text className="font-bold text-3xl">Are you sure?</Text>
                    <Text className="mt-5 text-xl text-center">You are about to remove {ref.petID.slice(5)}'s profile.</Text>
                    <View className="flex flex-row mt-10  w-full justify-evenly">
                        <Pressable onPress={() => removePet()} className="flex w-5/12 h-12 items-center justify-center rounded-2xl bg-petgreen active:bg-activepetgreen">
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
        <EditPetProfileStack.Navigator screenOptions={{headerShown: false}}>
            <EditPetProfileStack.Group>
                <EditPetProfileStack.Screen name="EditPetProfileScreen" component={EditPetProfileScreen} />
            </EditPetProfileStack.Group>
            <EditPetProfileStack.Group screenOptions={{ presentation: 'transparentModal' }}>
                <EditPetProfileStack.Screen name="PetProfilePicModal" component={PetProfilePicModal} />
                <EditPetProfileStack.Screen name="RemovePetModal" component={RemovePetModal} />
            </EditPetProfileStack.Group>
        </EditPetProfileStack.Navigator>
    )
}