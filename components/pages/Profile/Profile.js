import { Text, View, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref as ref_db, onValue } from 'firebase/database';
import { db, auth } from '../../../firebaseConfig';

function DisplayProfile({ receiveSignOut }) {
    const [userData, setUserData] = useState(null);
    const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
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
        const userRef = ref_db(db, "users/" + uid)
        const valueListener = onValue(userRef, (snapshot) => {
            const data = snapshot.val()
            setUserData(data)
            setIsUserDataLoaded(true)
        })

        return () => {
            valueListener();
        }
    }, [uid])

    useEffect(() => {
        if (isUserDataLoaded) {
            setIsLoading(false)
        }
    }, [isUserDataLoaded])

    if (isLoading) {
        return (
            <View className="flex-1 justify-center align-middle">
                <Text className="font-bold text-6xl inline-block self-center bg-yellow-300">Loading...</Text>
            </View>
        );        
    }

    return(
        <View className="mt-10 flex-1">
            <Text className="text-3xl">Email: {userData.email}</Text>
            <Text className="text-3xl">Password: {userData.password}</Text>
            <Pressable
                className='mt-10 bottom-3 w-8/12 h-16 self-center rounded-xl bg-petgreen active:bg-activepetgreen justify-center'
                onPress={() => onSignOut()}
            >
                <Text className='font-bold text-black text-2xl self-center'>Log Out</Text>
            </Pressable>            
        </View>
    )
}

export default function Profile({ navigateSignOut }) {
    function handleSignOut() {
        navigateSignOut("Login")
    }

    return (
        <DisplayProfile receiveSignOut={() => handleSignOut()} />
    )
}