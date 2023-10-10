import { Text, View, Pressable, TextInput, Alert } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as ref_db, set, onValue} from "firebase/database";
import { db, auth } from "../../../../../../firebaseConfig";
import { useState, useEffect } from 'react';
import { formatDate } from "../TimeSlots"
import DropDownPicker from 'react-native-dropdown-picker';

function DisplaySelectPet({ receivedData, onConfirm }) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([])
    const [isPetDataLoaded, setIsPetDataLoaded] = useState(false)
    const [uid, setUid] = useState('');
    const date = formatDate(receivedData.date)[0]
    const [text, onChangeText] = useState('');

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
            const petsRef = ref_db(db, "pets/" + uid)
            const valueListener = onValue(petsRef, (snapshot) => {
                const data = snapshot.val()
                {data ? Object.keys(data).forEach(key => {
                    setItems(items => [...items, {label: data[key].name, value: key}]);
                }) : null}
                setIsPetDataLoaded(true)
            })
            return () => {
                valueListener();
            }
        }
    }, [uid])

    DropDownPicker.setListMode("SCROLLVIEW");

    return (
        <View className="flex flex-col w-full h-full items-center">
            <Text className="mt-12 self-center font-bold text-xl">
                {receivedData.date}, {receivedData.slot}, {receivedData.vetIndex}, {date}
            </Text>
            <Text className="mt-8 self-center font-bold text-2xl">Who's going?</Text>
            {isPetDataLoaded && <DropDownPicker
                className="mt-5 w-10/12 h-16 self-center border-2 border-gray-200"
                textStyle={{fontSize: 20, lineHeight: 28, fontWeight: "300"}}
                labelStyle={{fontSize: 20, lineHeight: 28, fontWeight: "600"}}
                dropDownContainerStyle={{borderWidth: 2, marginTop: 20, width: "83.333333%", alignSelf: "center", zIndex: 9999}}
                placeholderStyle={{color: "#cbcbcb", fontWeight: "600"}}
                placeholder="Who's going?"
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
            />}
            <TextInput
                className="w-10/12 h-60 p-5 mt-8 border-2 border-gray-200 rounded-xl text-xl font-semibold align-text-top -z-10"
                style={{textAlignVertical: "top"}}
                placeholder="Reason for appointment"
                placeholderTextColor="#cbcbcb"
                multiline={true}
                onChangeText={onChangeText}
            />
            <Pressable
                className='mt-5 w-2/5 h-16 self-center rounded-xl bg-petgreen active:bg-activepetgreen justify-center'
                onPress={() => onConfirm(uid, value, text)}
            >
                <Text className='font-bold text-black text-2xl self-center'>Confirm</Text>
            </Pressable>
        </View>
    )
}

export default function SelectPet({ onReceiveData, successfulConfirmation }) {
    function alert () {
        Alert.alert('Incomplete Confirmation', 'Please state your reason or select a pet for the appointment.', [
            {
                text: 'OK'
            }
        ],
        {
            cancelable: true,
        }
        )
    }

    function confirmAppointment(uid, date, time, vetIndex, selectedPet, reason) {
        if (!reason || !reason.trim() || !selectedPet) {
            alert()
        } else {
            const appointmentID = uid.slice(0, 5) + date.replace(/-/g, "") + time.replace(/:/g, "") + "vet" + vetIndex
            const appointmentsRef = ref_db(db, 'appointments/' + appointmentID);
            set(appointmentsRef, {
                date: date,
                time: time,
                vetIndex: vetIndex,
                petID: selectedPet,
                ownID: uid,
                reason: reason
            });

            successfulConfirmation("Home")
        }
    }

    return (
        <DisplaySelectPet
            receivedData={onReceiveData} 
            onConfirm={(uid, selectedPet, reason) => confirmAppointment(uid, onReceiveData.date, onReceiveData.slot, onReceiveData.vetIndex, selectedPet, reason)}
        />
    )
}