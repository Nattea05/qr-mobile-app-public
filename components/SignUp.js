import { View, Text, Pressable, ImageBackground, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref as ref_db, set } from 'firebase/database';
import { db, auth } from '../firebaseConfig';
import Logo from '../assets/petlogo.svg';

function DisplaySignUp({ onLogin }) {
    const [emailText, onChangeEmailText] = useState('');
    const [passwordText, onChangePasswordText] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isLoginFocused, setIsLoginFocused] = useState(false);

    function CheckPassword() {        
        // Regular expression to check for complexity requirements
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;       
        setIsPasswordValid(passwordRegex.test(passwordText));
    }

    function CheckEmail() {        
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        setIsEmailValid(emailRegex.test(emailText));
    }

    function createAccount() {
        CheckPassword()
        CheckEmail()

        createUserWithEmailAndPassword(auth, emailText, passwordText)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                const userData = {
                    email: emailText,
                    password: passwordText
                }
                const usersRef = ref_db(db, "users/" + user.uid);
                set(usersRef, userData);
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    alert('Email address is already in use. Please choose another email.')
                } else {
                    console.log(`${error.code}: ${error.message}`)
                }
            })
    }

    return (
        <View className="flex flex-col w-full h-full items-center">
            <View className="w-full h-80">
                <ImageBackground className="h-full flex-1 justify-center overflow-hidden rounded-2xl" source={require("../assets/Login_Signup/SignUpImage.jpg")} resizeMode='cover'>
                    <View className="flex flex-col justify-center w-full h-full bg-black/40">
                        <Text className="font-light text-5xl text-white text-center tracking-wider">Hello!</Text>
                        <Text className="mt-3 font-light text-2xl text-white text-center tracking-wider">Sign up to use our services</Text>
                    </View>
                </ImageBackground>
                <Logo width={100} height={100} style={{position: "absolute", alignSelf: "center", top: "83%", zIndex: 1}} />
            </View>
            <View className="flex flex-col w-full h-full items-center">
                <TextInput
                    className="w-8/12 h-16 p-5 mt-20 border-2 border-gray-200 rounded-xl text-xl font-semibold align-text-top focus:border-petgreen"
                    style={{textAlignVertical: "top"}}
                    placeholder="Email"
                    placeholderTextColor={isLoginFocused ? "#45e14f" : "#cbcbcb"}
                    onFocus={() => setIsLoginFocused(true)}
                    onBlur={() => setIsLoginFocused(false)}
                    multiline={false}
                    onChangeText={onChangeEmailText}
                />
                {!isEmailValid && (
                    <Text className="mt-3 w-8/12 text-justify text-red-600 text-base">
                        Invalid email format
                    </Text>
                )}
                <TextInput
                    className="w-8/12 h-16 p-5 mt-10 border-2 border-gray-200 rounded-xl text-xl font-semibold align-text-top focus:border-petgreen"
                    style={{textAlignVertical: "top"}}
                    placeholder="Password"
                    placeholderTextColor={isPasswordFocused ? "#45e14f" : "#cbcbcb"}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    multiline={false}
                    secureTextEntry={true}
                    onChangeText={onChangePasswordText}
                />
                {!isPasswordValid && (
                    <Text className="mt-3 w-8/12 text-justify text-red-600 text-base">
                        Password must be a minimum of 8 characters and must contain at least one capital letter, one digit, and one special character (!, @, #, $, %, ^, &, *)
                    </Text>
                )}
                <Pressable
                    className='mt-10 w-8/12 h-16 self-center rounded-xl bg-petgreen active:bg-activepetgreen justify-center'
                    onPress={() => createAccount()}
                >
                    <Text className='font-bold text-black text-2xl self-center'>Sign up</Text>
                </Pressable>
                <Text className="mt-5 font-bold text-gray-400 text-base">
                    Already have an account? <Text className="text-petgreen" onPress={() => onLogin()}>Login here</Text>
                </Text>
            </View>
        </View>
    )
}

export default function SignUp({ transferToLogin }) {
    function handleLogin() {
        transferToLogin("Login")
    }

    return (
        <DisplaySignUp onLogin={() => handleLogin()} />
    )
}