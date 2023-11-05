import { Text, View, Pressable, ScrollView, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref as ref_db, onValue } from 'firebase/database';
import { ref as ref_storage, getDownloadURL, getMetadata, listAll } from 'firebase/storage';
import { db, auth, storage } from '../../../firebaseConfig';
import { ProfilePicture, EditProfile } from '../../../assets/profile_icons/profile_icons';

function DisplayProfile({ onNavigate, receiveSignOut }) {
    const [userData, setUserData] = useState(null);
    const [userImage, setUserImage] = useState([])
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
            listAll(userProfilePicRef)
                .then((res) => {
                    const promises = res.items.map(async (itemRef) => {
                        console.log(itemRef)
                        const metadataPromise = getMetadata(itemRef);
                        const downloadURLPromise = getDownloadURL(itemRef);
                        try {
                            const [metadata, url] = await Promise.all([metadataPromise, downloadURLPromise]);
                            setUserImage(userImage => [...userImage, {imageName: metadata.name, url: url}]);
                        } catch (error) {
                            console.error("Error received: ", error);
                        }
                    });
                    Promise.all(promises)
                        .then(() => {
                            setIsUserImageLoaded(true);
                        })
                        .catch((error) => {
                            console.error("Error received: ", error)
                        })
                })
                .catch((error) => {
                    console.error("Error received: ", error)
                })
            return () => {
                valueListener();
            }
        }
    }, [uid])

    useEffect(() => {
        if (isUserDataLoaded && isUserImageLoaded) {
            // console.log(userImage)
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
        <ScrollView className="flex-1 flex flex-col mt-10" contentContainerStyle={{paddingBottom: 30, alignItems: "center"}}>
            <View className="flex flex-row p-2 w-full h-52 border-4">
                <View className="flex w-5/12 h-full justify-center items-center">
                    {userImage[0] && userImage[0]?.url &&
                        <Image source={{uri: userImage[0].url}} alt='Profile Picture' className="w-44 h-44 rounded-full"/>
                    }
                    {!userImage[0] &&
                        <ProfilePicture />
                    }
                </View>
                <View className="p-2 w-7/12 h-full justify-center border-4 border-orange-400">
                    <Text className="text-2xl">{userData.firstName} {userData.lastName}</Text>
                    <Text className="mt-1 text-lg">0 pets</Text>
                    <Pressable className="flex flex-row mt-3 self-start" onPress={() => onNavigate("EditProfile", {userData: userData, userImage: userImage})}>
                        <EditProfile />
                        <Text className="ml-1 text-sm">Edit Profile</Text>
                    </Pressable>
                </View>
            </View>
            <View className="flex flex-col w-full border-4 border-sky-500">
                <Text className="text-3xl mt-8">First Name: {userData.firstName}</Text>
                <Text className="text-3xl mt-8">Last Name: {userData.lastName}</Text>
                <Text className="text-3xl mt-8">Phone Number: 0{userData.phoneNumber}</Text>
                <Text className="text-3xl mt-8">Email: {userData.email}</Text>
                <Pressable
                    className='mt-10 w-72 h-16 self-center rounded-xl bg-petgreen active:bg-activepetgreen justify-center'
                    onPress={() => onSignOut()}
                >
                    <Text className='font-bold text-black text-2xl self-center'>Log Out</Text>
                </Pressable>
            </View>
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