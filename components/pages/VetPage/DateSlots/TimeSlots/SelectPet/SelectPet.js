import { Text, View, Pressable, TextInput, Alert } from 'react-native';
import { ref as ref_db, set} from "firebase/database";
import { db } from "../../../../../../firebaseConfig";
import { useState } from 'react';
import { formatDate } from "../TimeSlots"

function confirmAppointment(date, time, vetIndex, reason) {
    const appointmentsRef = ref_db(db, 'appointments/a0');
    set(appointmentsRef, {
        date: date,
        time: time,
        vetIndex: vetIndex,
        reason: reason
    });
}

function DisplaySelectPet({ receivedData, onConfirm }) {
    const date = formatDate(receivedData.date)[0]
    const [text, onChangeText] = useState('');

    function alert () {
        Alert.alert('Reason not stated', 'Please state your reason for the appointment', [
            {
                text: 'OK'
            }
        ],
        {
            cancelable: true,
        }
        )
    }
    
    return (
        <View className="flex flex-col w-full h-full items-center">
            <Text className="mt-12 self-center font-bold text-xl">
                {receivedData.date}, {receivedData.slot}, {receivedData.vetIndex}, {date}
            </Text>
            <TextInput
                className="w-10/12 h-60 p-5 mt-12 border-2 border-gray-200 rounded-xl text-xl font-semibold align-text-top"
                style={{textAlignVertical: "top"}}
                placeholder="Reason for appointment"
                placeholderTextColor="#cbcbcb"
                multiline={true}
                onChangeText={onChangeText}
            />
            <Pressable
                className='mt-5 w-2/5 h-16 self-center rounded-xl bg-petgreen active:bg-activepetgreen justify-center'
                onPress={() => (text ? onConfirm(text) : alert())}
            >
                <Text className='font-bold text-black text-2xl self-center'>Confirm</Text>
            </Pressable>
        </View>
    )
}

export default function SelectPet({ onReceiveData }) {
    return (
        <DisplaySelectPet
            receivedData={onReceiveData} 
            onConfirm={(reason) => confirmAppointment(onReceiveData.date, onReceiveData.slot, onReceiveData.vetIndex, reason)}
        />
    )
}