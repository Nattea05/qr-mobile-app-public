import { Text, View, Pressable, TextInput, Alert } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as ref_db, set, onValue} from "firebase/database";
import { db, auth } from "../../../../../../firebaseConfig";
import { useState, useEffect } from 'react';
import { Back } from '../../../../../../assets/svg_logos/svg_logos';
import moment from 'moment'
import DropDownPicker from 'react-native-dropdown-picker';

function DisplaySelectPet({ receivedData, onConfirm, onBack }) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([])
    const [isPetDataLoaded, setIsPetDataLoaded] = useState(false)
    const [uid, setUid] = useState('');
    const [text, onChangeText] = useState('');
    const [clinicData, setClinicData] = useState([])
    const [isClinicDataLoaded, setIsClinicDataLoaded] = useState(false)

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

            const clinicRef = ref_db(db, "places/place" + (receivedData.vetIndex + 1).toString())
            const clinicListener = onValue(clinicRef, (snapshot) => {
                const data = snapshot.val()
                setClinicData(data)
                setIsClinicDataLoaded(true)
            })

            return () => {
                valueListener();
                clinicListener()
            }
        }
    }, [uid])

    DropDownPicker.setListMode("SCROLLVIEW");

    return (
        <View className="flex flex-col w-full h-full items-center">
            <View className="flex w-full py-7 px-5 space-y-12 rounded-b-xl justify-center bg-petgreen">
                <Pressable onPress={() => onBack()} className="top-5 flex flex-col w-14 h-14 justify-center items-center rounded-full bg-white">
                    <Back width={"36"} height={"36"} fill={"black"} />
                </Pressable>
                <View className="flex flex-col w-full space-y-1 justify-center items-center">
                    <Text className="self-center font-bold text-3xl text-center">{clinicData.name}</Text>
                    <Text className="self-center font-bold text-center text-2xl">{moment(receivedData.date).format("MMMM Do YYYY")}</Text>
                    <Text className="self-center font-bold text-center text-2xl">{moment(receivedData.slot, "HH:mm").format("h:mm A")}</Text>
                </View>
            </View>
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

export default function SelectPet({ onReceiveData, successfulConfirmation, onReceiveBack }) {
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
            onBack={() => onReceiveBack()}
        />
    )
}