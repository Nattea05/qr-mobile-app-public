import { View, Text, Pressable, ImageBackground, TextInput, ScrollView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import Logo from '../assets/petlogo.svg';

function DisplayLogin({ receivedNewEmail, onInput }) {
    const [emailText, onChangeEmailText] = useState('natliew05@gmail.com');
    const [passwordText, onChangePasswordText] = useState('Test12345');
    const [focusedInput, setFocusedInput] = useState('')
    const newEmail = receivedNewEmail

    function loginAccount() {        
        signInWithEmailAndPassword(auth, emailText, passwordText)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                onInput("Home");
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-email' || error.code === 'auth/missing-password' || error.code === 'auth/invalid-login-credentials' || error.code === 'auth/wrong-password') {
                    alert('Invalid email or password')
                } else {
                    console.log("Error logging in: " + error)
                }
            })            
    }
    
    useEffect(() => {
        if (newEmail) {
            Alert.alert('Email Verification Required', 'An email with a verification link has been sent to your new email address. Please check your inbox and follow the link to verify your email address and complete the update process.', [
              {
                  text: 'OK'
              }
            ],
            {cancelable: true}
            )
        }
    }, [newEmail])

    return (
        <ScrollView className="w-full" contentContainerStyle={{alignItems: "center"}}>
            <View className="w-full h-80">
                <ImageBackground className="h-full flex-1 justify-center overflow-hidden rounded-b-2xl" source={require("../assets/Login_Signup/LoginImage.jpg")} resizeMode='cover'>
                    <View className="flex flex-col justify-center w-full h-full bg-black/40">
                        <Text className="font-light text-5xl text-white text-center tracking-wider">Welcome back!</Text>
                        <Text className="mt-3 font-light text-2xl text-white text-center tracking-wider">Log in to your account</Text>
                    </View>
                </ImageBackground>
                <Logo width={100} height={100} style={{position: "absolute", alignSelf: "center", top: "83%", zIndex: 1}} />
            </View>
            <View className="flex flex-col w-full h-full items-center">
                <TextInput
                    className="w-8/12 h-16 p-5 mt-20 border-2 border-gray-200 rounded-xl text-xl font-semibold align-text-top focus:border-petgreen"
                    style={{textAlignVertical: "top"}}
                    placeholder="Email"
                    placeholderTextColor={focusedInput === 'email' ? "#45e14f" : "#cbcbcb"}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput('')}
                    multiline={false}
                    onChangeText={onChangeEmailText}
                />
                <TextInput
                    className="w-8/12 h-16 p-5 mt-10 border-2 border-gray-200 rounded-xl text-xl font-semibold align-text-top focus:border-petgreen"
                    style={{textAlignVertical: "top"}}
                    placeholder="Password"
                    placeholderTextColor={focusedInput === 'password' ? "#45e14f" : "#cbcbcb"}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput('')}
                    multiline={false}
                    secureTextEntry={true}
                    onChangeText={onChangePasswordText}
                />
                <Pressable
                    className='mt-10 w-8/12 h-16 self-center rounded-xl bg-petgreen active:bg-activepetgreen justify-center'
                    onPress={() => loginAccount()}
                >
                    <Text className='font-bold text-black text-2xl self-center'>Login</Text>
                </Pressable>
                <Text className="mt-5 font-bold text-gray-400 text-base">
                    Don't have an account? <Text className="text-petgreen" onPress={() => onInput("SignUp")}>Register here</Text>
                </Text>
            </View>
        </ScrollView>
    )
}

export default function Login({ onReceiveNewEmail, onReceiveNavigation }) {
    function handleInput(page) {
        onReceiveNavigation(page)
    }

    return (
        <DisplayLogin receivedNewEmail={onReceiveNewEmail} onInput={(page) => handleInput(page)} />
    )
}