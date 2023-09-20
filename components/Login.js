import { View, Text, Pressable, ImageBackground, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Logo from '../assets/petlogo.svg';

function DisplayLogin({ onInput }) {
    const [emailText, onChangeEmailText] = useState('');
    const [passwordText, onChangePasswordText] = useState('');

    function loginAccount() {
        signInWithEmailAndPassword(auth, emailText, passwordText)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                onInput("Home");
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-email' || error.code === 'auth/missing-password' || error.code === 'auth/invalid-login-credentials') {
                    alert('Invalid email or password')
                } else {
                    console.log(`${error.code}: ${error.message}`)
                }
            })
    }

    return (
        <View className="flex flex-col w-full h-full items-center">
            <View className="w-full h-80">
                <ImageBackground className="h-full flex-1 justify-center overflow-hidden rounded-2xl" source={require("../assets/Login_Signup/LoginImage.jpg")} resizeMode='cover'>
                    <View className="flex flex-col justify-center w-full h-full bg-black/40">
                        <Text className="font-light text-5xl text-white text-center tracking-wider">Welcome back!</Text>
                        <Text className="mt-3 font-light text-2xl text-white text-center tracking-wider">Log in to your account</Text>
                    </View>
                </ImageBackground>
                <Logo width={100} height={100} style={{position: "absolute", alignSelf: "center", top: "83%", zIndex: 1}} />
            </View>
            <View className="flex flex-col w-full h-full items-center">
                <TextInput
                    className="w-8/12 h-16 p-5 mt-20 border-2 border-gray-200 rounded-xl text-xl font-semibold align-text-top"
                    style={{textAlignVertical: "top"}}
                    placeholder="Email"
                    placeholderTextColor="#cbcbcb"
                    multiline={false}
                    onChangeText={onChangeEmailText}
                />
                <TextInput
                    className="w-8/12 h-16 p-5 mt-10 border-2 border-gray-200 rounded-xl text-xl font-semibold align-text-top"
                    style={{textAlignVertical: "top"}}
                    placeholder="Password"
                    placeholderTextColor="#cbcbcb"
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
        </View>
    )
}

export default function Login({ onReceiveNavigation }) {
    function handleInput(page) {
        onReceiveNavigation(page)
    }

    return (
        <DisplayLogin onInput={(page) => handleInput(page)} />
    )
}