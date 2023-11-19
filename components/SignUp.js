import { View, Text, Pressable, ImageBackground, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref as ref_db, set } from 'firebase/database';
import { db, auth } from '../firebaseConfig';
import Logo from '../assets/petlogo.svg';

function DisplaySignUp({ onLogin }) {
    const [firstName, onChangeFirstName] = useState('')
    const [lastName, onChangeLastName] = useState('')
    const [phoneNumber, onChangePhoneNumber] = useState('')
    const [emailText, onChangeEmailText] = useState('');
    const [passwordText, onChangePasswordText] = useState('');
    const [isFirstValid, setIsFirstValid] = useState(true);
    const [isLastValid, setIsLastValid] = useState(true);
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [focusedInput, setFocusedInput] = useState('')

    function checkPassword() {        
        // Regular expression to check for complexity requirements
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
        setIsPasswordValid(passwordRegex.test(passwordText));
        return passwordRegex.test(passwordText)
    }

    function checkEmail() {        
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        setIsEmailValid(emailRegex.test(emailText));
        return emailRegex.test(emailText)
    }

    function checkPhoneNumber() {
        const phoneNumberRegex = /^\d{9,10}$/;
        setIsPhoneNumberValid(phoneNumberRegex.test(phoneNumber))
        return phoneNumberRegex.test(phoneNumber)
    }

    function checkFirst() {
        setIsFirstValid(firstName.trim() === '' ? false : true)
        return firstName.trim() === '' ? false : true
    }

    function checkLast() {
        setIsLastValid(lastName.trim() === '' ? false : true)
        return lastName.trim() === '' ? false : true
    }

    function createAccount() {
        const passwordValidity = checkPassword()
        const emailValidity = checkEmail()
        const phoneNumberValidity = checkPhoneNumber()
        const firstValidity = checkFirst()
        const lastValidity = checkLast()
        const userDetails = [firstName, lastName, phoneNumber, emailText, passwordText, firstValidity, lastValidity, phoneNumberValidity, emailValidity, passwordValidity]
        const isMissingDetails = userDetails.some((value) => value === undefined || value === null || value === '' || value === false)

        if (!isMissingDetails) {
            createUserWithEmailAndPassword(auth, emailText, passwordText)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;

                    const userData = {
                        firstName: firstName,
                        lastName: lastName,
                        phoneNumber: phoneNumber,
                        email: emailText,
                        password: passwordText
                    }
                    const usersRef = ref_db(db, "users/" + user.uid);
                    set(usersRef, userData);
                    alert('Account successfully created!')
                    onLogin()
                })
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        alert('Email address is already in use. Please choose another email.')
                    } else {
                        console.log(`${error.code}: ${error.message}`)
                    }
                })
        }
    }

    return (
        <ScrollView className="w-full" contentContainerStyle={{paddingBottom: 30, alignItems: "center"}}>
            <View className="w-full h-80">
                <ImageBackground className="h-full flex-1 justify-center overflow-hidden rounded-b-2xl" source={require("../assets/Login_Signup/SignUpImage.jpg")} resizeMode='cover'>
                    <View className="flex flex-col justify-center w-full h-full bg-black/40">
                        <Text className="font-light text-5xl text-white text-center tracking-wider">Hello!</Text>
                        <Text className="mt-3 font-light text-2xl text-white text-center tracking-wider">Sign up to use our services</Text>
                    </View>
                </ImageBackground>
                <Logo width={100} height={100} style={{position: "absolute", alignSelf: "center", top: "83%", zIndex: 1}} />
            </View>
            <View className="flex flex-col w-full h-full items-center">
                <TextInput
                    className="w-8/12 h-16 p-4 mt-20 border-2 border-gray-200 rounded-xl text-xl font-semibold align-text-top focus:border-petgreen"
                    style={{textAlignVertical: "top"}}
                    placeholder="First Name"
                    placeholderTextColor={focusedInput === 'first' ? "#45e14f" : "#cbcbcb"}
                    onFocus={() => setFocusedInput('first')}
                    onBlur={() => setFocusedInput('')}
                    multiline={false}
                    onChangeText={onChangeFirstName}
                />
                {!isFirstValid && (
                    <Text className="mt-3 w-8/12 text-justify text-red-600 text-base">
                        Missing first name.
                    </Text>
                )}        
                <TextInput
                    className="w-8/12 h-16 p-4 mt-10 border-2 border-gray-200 rounded-xl text-xl font-semibold align-text-top focus:border-petgreen"
                    style={{textAlignVertical: "top"}}
                    placeholder="Last Name"
                    placeholderTextColor={focusedInput === 'last' ? "#45e14f" : "#cbcbcb"}
                    onFocus={() => setFocusedInput('last')}
                    onBlur={() => setFocusedInput('')}
                    multiline={false}
                    onChangeText={onChangeLastName}
                />
                {!isLastValid && (
                    <Text className="mt-3 w-8/12 text-justify text-red-600 text-base">
                        Missing last name.
                    </Text>
                )}
                <View className={`flex flex-row w-8/12 h-16 mt-10 border-2 border-gray-200 rounded-xl ${focusedInput === 'phone' ? 'border-petgreen' : ''}`}>
                    <View className={`flex w-3/12 h-full justify-center items-center text-xl font-semibold border-r-2 border-gray-200 ${focusedInput === 'phone' ? 'border-petgreen' : ''}`}>
                        <Text className={`text-xl text-[#cbcbcb] font-semibold ${focusedInput === 'phone' ? 'text-petgreen' : ''}`}>+60</Text>
                    </View>
                    <TextInput
                        className="flex-1 p-4 rounded-xl text-xl font-semibold align-text-top"
                        style={{textAlignVertical: "top"}}
                        placeholder="Phone Number"
                        placeholderTextColor={focusedInput === 'phone' ? "#45e14f" : "#cbcbcb"}
                        onFocus={() => setFocusedInput('phone')}
                        onBlur={() => setFocusedInput('')}
                        multiline={false}
                        onChangeText={onChangePhoneNumber}
                    />
                </View>
                {!isPhoneNumberValid && (
                    <Text className="mt-3 w-8/12 text-justify text-red-600 text-base">
                        Invalid phone number.
                    </Text>
                )}
                <TextInput
                    className="w-8/12 h-16 p-4 mt-10 border-2 border-gray-200 rounded-xl text-xl font-semibold align-text-top focus:border-petgreen"
                    style={{textAlignVertical: "top"}}
                    placeholder="Email"
                    placeholderTextColor={focusedInput === 'email' ? "#45e14f" : "#cbcbcb"}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput('')}
                    multiline={false}
                    onChangeText={onChangeEmailText}
                />
                {!isEmailValid && (
                    <Text className="mt-3 w-8/12 text-justify text-red-600 text-base">
                        Invalid email format.
                    </Text>
                )}
                <TextInput
                    className="w-8/12 h-16 p-4 mt-10 border-2 border-gray-200 rounded-xl text-xl font-semibold align-text-top focus:border-petgreen"
                    style={{textAlignVertical: "top"}}
                    placeholder="Password"
                    placeholderTextColor={focusedInput === 'password' ? "#45e14f" : "#cbcbcb"}
                    onFocus={() =>setFocusedInput('password')}
                    onBlur={() => setFocusedInput('')}
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
        </ScrollView>
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