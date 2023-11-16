import { Text, View, Pressable, ScrollView, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref as ref_db, onValue } from 'firebase/database';
import { ref as ref_storage, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../../../firebaseConfig';
import { ProfilePicture, EditProfile } from '../../../assets/profile_icons/profile_icons';

function DisplayProfile({ onNavigate, receiveSignOut }) {
    const [userData, setUserData] = useState(null);
    const [userImage, setUserImage] = useState('')
    const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
    const [isUserImageLoaded, setIsUserImageLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uid, setUid] = useState('');

    function onSignOut() {
        signOut(auth).then(() => {
            receiveSignOut("Login")
        }).catch((error) => {
            console.error("Error signing out: ", error)
        })
    }

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
            const userRef = ref_db(db, "users/" + uid)
            const valueListener = onValue(userRef, (snapshot) => {
                const data = snapshot.val()
                setUserData(data)
                setIsUserDataLoaded(true)
            })
    
            const userProfilePicRef = ref_storage(storage, "user-profile-pictures/" + uid)
            getDownloadURL(userProfilePicRef)
                .then((url) => {
                    const xhr = new XMLHttpRequest()
                    xhr.responseType = 'blob'
                    xhr.onload = (event) => {
                        const blob = xhr.response
                        setUserImage(xhr.responseURL)
                    }
                    xhr.open('GET', url)
                    xhr.send()
                    setIsUserImageLoaded(true)
                })
                .catch((error) => {
                    if (error.code === "storage/object-not-found") {
                        setIsUserImageLoaded(true)
                    } else {
                        console.error("Error receiving image: " + error)
                    }
                })
            return () => {
                valueListener();
            }
        }
    }, [uid])

    useEffect(() => {
        if (isUserDataLoaded && isUserImageLoaded) {
            setIsLoading(false)
        }
    }, [isUserDataLoaded, isUserImageLoaded])

    if (isLoading) {
        return (
            <View className="flex-1 justify-center align-middle">
                <Text className="font-bold text-6xl inline-block self-center bg-yellow-300">Loading...</Text>
            </View>
        );        
    }

    return(
        <ScrollView className="flex-1 flex flex-col" contentContainerStyle={{paddingBottom: 30, alignItems: "center"}}>
            <View className="flex flex-row w-full h-64 pt-5 rounded-b-2xl bg-petgreen">
                <View className="flex w-5/12 h-full justify-center items-center">
                    {userImage &&
                        <Image source={{uri: userImage}} alt='Profile Picture' className="w-36 h-36 rounded-full"/>
                    }
                    {!userImage &&
                        <ProfilePicture fill={"white"} />
                    }
                </View>
                <View className="p-2 w-7/12 h-full justify-center">
                    <Text className="font-bold text-3xl text-white">{userData.firstName} {userData.lastName}</Text>
                    <Pressable className="flex flex-row mt-3 self-start" onPress={() => onNavigate("EditProfile", {userData: userData, userImage: userImage})}>
                        <EditProfile width={"28"} height={"28"} fill={"white"} />
                        <Text className="ml-1 text-base font-semibold text-white">Edit Profile</Text>
                    </Pressable>
                </View>
            </View>
            <View className="flex flex-col w-full p-5 justify-center items-center">
                <View className="flex flex-col w-full pb-5 justify-center items-center border-2 border-petgreen rounded-3xl">
                    <View className="flex flex-col w-11/12">
                        <Text className="pl-2 pt-2 text-lg font-semibold text-gray-400/70">First Name</Text>
                        <Text className="p-2 text-lg font-semibold border-b-2 border-gray-400/70">{userData.firstName}</Text>
                    </View>
                    <View className="flex flex-col w-11/12">
                        <Text className="pl-2 pt-2 text-lg font-semibold text-gray-400/70">Last Name</Text>
                        <Text className="p-2 text-lg font-semibold border-b-2 border-gray-400/70">{userData.lastName}</Text>
                    </View>
                    <View className="flex flex-col w-11/12">
                        <Text className="pl-2 pt-2 text-lg font-semibold text-gray-400/70">Phone Number</Text>
                        <Text className="p-2 text-lg font-semibold border-b-2 border-gray-400/70">0{userData.phoneNumber}</Text>
                    </View>
                    <View className="flex flex-col w-11/12">
                        <Text className="pl-2 pt-2 text-lg font-semibold text-gray-400/70">Email</Text>
                        <Text className="p-2 text-lg font-semibold border-b-2 border-gray-400/70">{userData.email}</Text>
                    </View>
                </View>
            </View>
            <Pressable
                className='w-72 h-16 self-center rounded-xl bg-petgreen active:bg-activepetgreen justify-center'
                onPress={() => onSignOut()}
            >
                <Text className='font-bold text-black text-2xl self-center'>Log Out</Text>
            </Pressable>
        </ScrollView>
    )
}

export default function Profile({ onReceiveNavigation, navigateSignOut }) {
    function handleNavigate(page, object) {
        onReceiveNavigation(page, object)
    }

    function handleSignOut() {
        navigateSignOut("Login")
    }

    return (
        <DisplayProfile onNavigate={(page, object) => handleNavigate(page, object)} receiveSignOut={() => handleSignOut()} />
    )
}