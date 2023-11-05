import { Text, View, Pressable, ScrollView, Image, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, updatePassword, signOut, verifyBeforeUpdateEmail } from 'firebase/auth';
import { ref as ref_db, set } from 'firebase/database';
import { ref as ref_storage, deleteObject, uploadBytes } from 'firebase/storage';
import { createStackNavigator } from '@react-navigation/stack';
import Animated, { Easing, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { db, auth, storage } from '../../../../firebaseConfig';
import { Close, Done } from '../../../../assets/svg_logos/svg_logos';
import { ProfilePicture } from '../../../../assets/profile_icons/profile_icons';
import { VisibilityOn, VisibilityOff } from '../../../../assets/svg_logos/svg_logos';
import * as ImagePicker from 'expo-image-picker'

const EditProfileStack = createStackNavigator()

function DisplayProfile({ receivedNewImage, receivedUserDetails, onNavigation, onClose, onDone, onUpdateEmail }) {
    const [fill, setFill] = useState("#45e14f")
    const userDetails = receivedUserDetails
    const [userData, setUserData] = useState(userDetails.userData)
    const [userImage, setUserImage] = useState(userDetails.userImage)
    const [uid, setUid] = useState('');
    const newImage = receivedNewImage === "remove" ? null : receivedNewImage
    
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
        const userRef = ref_db(db, "users/" + uid)
        const passwordRef = ref_db(db, "users/" + uid + "/password")
        const profilePicRef = ref_storage(storage, "user-profile-pictures/" + uid)
        const hasMissingDetails = Object.values(userData).some(
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
            set(userRef, userData)

            if (userData.password !== userDetails.userData.password) {
                updatePassword(auth.currentUser, userData.password)
                    .then(() => {
                        //Password successfully updated
                    })
                    .catch((error) => {
                        if (error.code === "auth/requires-recent-login") {
                            set(passwordRef, userDetails.userData.password)
                            Alert.alert('Recent Login Required', 'Updating a password requires a user to be recently logged in, please login again.', [
                                {
                                    text: 'OK'
                                }
                            ],
                            {cancelable: true}
                            )
                        } else {
                            console.error("Error updating password: " + error)
                        }
                    })
            }

            if (newImage) {
                async function convertImageUriToBlob(imageUri) {
                    // Fetch image data as a Blob
                    const response = await fetch(imageUri)
                    const blob = await response.blob()
                    return blob;
                }
    
                convertImageUriToBlob(newImage)
                    .then((blob) => {
                        uploadBytes(profilePicRef, blob)
                            .then((snapshot) => {
                                // Successful upload
                            })
                            .catch((error) => {
                                // console.error("Error uploading file: " + error)
                            })
                    })
                    .catch((error) => {
                        console.error("Error converting image URI to Blob:", error)
                    })
            } 
            else if (!newImage && !userImage) {
                deleteObject(profilePicRef)
                    .then(() => {
                        // File deleted successfully
                    })
                    .catch((error) => {
                        // console.error("Error deleting profile picture: " + error)
                    })
            }   

            if (userData.email !== userDetails.userData.email) {
                verifyBeforeUpdateEmail(auth.currentUser, userData.email).then(() => {
                    // Email verification sent
                }).catch((error) => {
                    if (error.code === "auth/requires-recent-login") {
                        Alert.alert('Recent Login Required', 'Updating an email requires a user to be recently logged in, please login again.', [
                            {
                                text: 'OK'
                            }
                        ],
                        {cancelable: true}
                        )
                    } else if (error.code === "auth/invalid-new-email") {
                        Alert.alert('Invalid email', 'The email you entered was invalid, please try again.', [
                            {
                                text: 'OK'
                            }
                        ],
                        {cancelable: true}
                        )
                    } else {
                        console.error("Error sending verification email: " + error)
                    }
                })

                signOut(auth).then(() => {
                    onUpdateEmail(userData.email)
                }).catch((error) => {
                    console.error("Error signing out: ", error)
                })
            } else {
                setTimeout(() => {
                    onDone()
                }, 500)
            }
        }
    }

    useEffect(() => {
        if (receivedNewImage === "remove") {
            setUserImage('')
        }
    }, [newImage])

    return(
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
                {userImage && !newImage &&
                    <Pressable className="rounded-full" onPress={() => onNavigation("ProfilePicModal")}>
                        <Image source={{uri: userImage}} alt='Profile Picture' className="w-48 h-48 rounded-full"/>
                    </Pressable>
                }
                {!userImage && !newImage &&
                    <Pressable className="rounded-full" onPress={() => onNavigation("ProfilePicModal")}>
                        <ProfilePicture fill={"black"} />
                    </Pressable>
                }
                {newImage &&
                    <Pressable className="w-48 h-48 rounded-full" onPress={() => onNavigation("ProfilePicModal")}>
                        <Image src={newImage} alt='Profile Picture' className="w-48 h-48 rounded-full"/>
                    </Pressable>
                }
                {Object.keys(userData).map((field) => {
                    const formattedField = field.split(/(?=[A-Z])/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                    if (field === "phoneNumber") {
                        return (
                            <View key={field} className="flex flex-col w-11/12 mt-5">
                                <Text className="pl-3">{formattedField}</Text>
                                <View className="flex flex-row w-full h-16 items-center border-b-2">
                                    <View className="flex w-2/12 h-5/6 p-2 pl-3 text-xl font-semibold border-r-2">
                                        <Text className="text-xl text-gray-400 font-semibold">+60</Text>
                                    </View>                          
                                    <TextInput
                                        className="flex-1 h-5/6 p-2 pl-3 font-semibold text-xl"
                                        style={{textAlignVertical: "top"}}
                                        value={userData[field]}
                                        placeholder={formattedField}
                                        placeholderTextColor={"#cbcbcb"}
                                        multiline={false}
                                        onChangeText={(text) => {
                                            setUserData((prevUserData) => ({
                                                ...prevUserData,
                                                [field]: text,
                                            }))
                                        }}
                                    />   
                                </View>
                            </View>
                        )
                    }
                    else if (field === "password") {
                        const [isVisible, setIsVisible] = useState(false)
                        return (
                            <View key={field} className="flex flex-col w-11/12 mt-5">
                                <Text className="pl-3">{formattedField}</Text>
                                <View className="flex flex-row w-full h-16 items-center border-b-2">                           
                                    <TextInput
                                        className="flex-1 h-5/6 p-2 pl-3 font-semibold text-xl"
                                        style={{textAlignVertical: "top"}}
                                        value={userData[field]}
                                        placeholder={formattedField}
                                        placeholderTextColor={"#cbcbcb"}
                                        multiline={false}
                                        secureTextEntry={isVisible ? false : true}
                                        onChangeText={(text) => {
                                            setUserData((prevUserData) => ({
                                                ...prevUserData,
                                                [field]: text,
                                            }))
                                        }}
                                    />
                                    <Pressable className="flex w-2/12 h-5/6 p-2 pl-3" onPress={() => setIsVisible(!isVisible)}>
                                        {isVisible &&
                                            <VisibilityOn width={"40"} height={"40"} />                                            
                                        }
                                        {!isVisible &&
                                            <VisibilityOff width={"40"} height={"40"} />                                            
                                        }
                                    </Pressable>     
                                </View>
                            </View>
                        )
                    }
                    else {
                        return (
                            <View key={field} className="flex flex-col w-11/12 mt-5">
                                <Text className="pl-3">{formattedField}</Text>
                                <TextInput
                                    className="flex w-full h-16 p-3 font-semibold text-xl border-b-2"
                                    style={{textAlignVertical: "top"}}
                                    value={userData[field]}
                                    placeholder={formattedField}
                                    placeholderTextColor={"#cbcbcb"}
                                    multiline={false}
                                    onChangeText={(text) => {
                                        setUserData((prevUserData) => ({
                                            ...prevUserData,
                                            [field]: text,
                                        }))
                                    }}
                                /> 
                            </View>
                        )
                    }                   
                })}
            </ScrollView>
        </View>
    )
}

export default function EditProfile({ onReceiveUserDetails, onReceiveDone, onReceiveUpdateEmail }) {
    function EditProfileScreen({ navigation, route }) {
        return (
            <DisplayProfile receivedNewImage={route.params ? route.params : ''} receivedUserDetails={onReceiveUserDetails} onNavigation={(page) => navigation.navigate(page)} onClose={() => navigation.goBack()} onDone={() => onReceiveDone()} onUpdateEmail={(newEmail) => onReceiveUpdateEmail(newEmail)} />
        )
    }

    function ProfilePicModal({ navigation }) {
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

        function handleRemoveImage() {
            setNewImage('remove')
        }

        useEffect(() => {
            if (newImage) {
                navigation.navigate("EditProfileScreen", newImage)
            }
        }, [newImage])

        return (
            <Pressable className="flex-1 flex bg-black/50" onPress={() => navigation.goBack()}>
                <Animated.View
                    entering={SlideInDown.duration(200).easing(Easing.bezier(0.09, 0.38, 0.09, 1.01))}
                    exiting={SlideOutDown.duration(250).easing(Easing.bezier(0.09, 0.38, 0.09, 1.01))}
                    className="flex flex-col absolute bottom-0 w-full h-3/5 justify-evenly items-center rounded-t-2xl bg-white"
                >
                    <Pressable onPress={() => snapImage()} className="w-11/12 h-20 justify-center items-center bg-petgreen active:bg-activepetgreen rounded-2xl">
                      <Text className="font-medium text-3xl">Use Camera</Text>
                    </Pressable>
                    <Pressable onPress={() => pickImage()} className="w-11/12 h-20 justify-center items-center bg-petgreen active:bg-activepetgreen rounded-2xl">
                      <Text className="font-medium text-3xl">Pick from Gallery</Text>
                    </Pressable>
                    <Pressable onPress={() => handleRemoveImage()} className="w-11/12 h-20 justify-center items-center bg-cancel active:bg-activecancel rounded-2xl">
                      <Text className="font-medium text-3xl">Remove current picture</Text>
                    </Pressable>
                </Animated.View>
            </Pressable>
        )
    }

    return (
        <EditProfileStack.Navigator screenOptions={{headerShown: false}}>
            <EditProfileStack.Group>
                <EditProfileStack.Screen name="EditProfileScreen" component={EditProfileScreen} />
            </EditProfileStack.Group>
            <EditProfileStack.Group screenOptions={{ presentation: 'transparentModal' }}>
                <EditProfileStack.Screen name="ProfilePicModal" component={ProfilePicModal} />
            </EditProfileStack.Group>
        </EditProfileStack.Navigator>
    )
}