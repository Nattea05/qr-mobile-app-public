import { Text, View, Pressable, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Back } from '../../../../assets/svg_logos/svg_logos';
import useDataFetch from '../../../interaction_events/DataFetch';

function DisplayDateSlots({ receivedVetIndex, onConfirm, onBack }) {
    const [isLoading, setIsLoading] = useState(true);
    const [placesList, imagesList] = useDataFetch('veterinary-locations');
    const [selected, setSelected] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    function alert () {
        Alert.alert('Date not selected', 'Please select a date', [
            {
                text: 'OK'
            }
        ],
        {
            cancelable: true,
        }
        )
    }

    useEffect(() => {
        const now = new Date()
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        setCurrentDate(dateString)
    }, [])

    useEffect(() => {
        if (placesList.length > 0 && imagesList.length > 0) {
            setIsLoading(false);
        }
    }, [placesList, imagesList]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center align-middle">
                <Text className="font-bold text-6xl inline-block self-center bg-yellow-300">Loading...</Text>
            </View>
        );
    }

    return (
        <View className="flex flex-col w-full h-full">
            <View className="flex flex-col w-full py-10 px-5 space-y-12 rounded-b-xl justify-center bg-petgreen">
                <Pressable onPress={() => onBack()} className="top-5 flex flex-col w-14 h-14 justify-center items-center rounded-full bg-white">
                    <Back width={"36"} height={"36"} fill={"black"} />
                </Pressable>
                <Text className="mt-5 self-center font-bold text-center text-2xl">{placesList[receivedVetIndex].name}'s upcoming availability</Text>
            </View>
            <View className="flex-1 flex flex-col w-full py-10 space-y-8 justify-center">
                <Calendar
                    className='flex w-11/12 h-[400px] justify-center self-center rounded-xl shadow-2xl shadow-black'
                    theme={{
                        todayTextColor: "#45e14f",
                        arrowColor: "#45e14f"
                    }}
                    minDate={currentDate}
                    onDayPress={day => {setSelected(day.dateString)}}
                    markedDates={{
                        [selected]: {selected: true, disableTouchEvent: true, selectedColor: '#45e14f'}
                    }}
                    enableSwipeMonths={true}
                    allowSelectionOutOfRange={false}
                />
                <Pressable
                    className='mt-5 w-2/5 h-16 self-center rounded-xl bg-petgreen active:bg-activepetgreen justify-center'
                    onPress={() => (selected ? onConfirm(selected) : alert())}
                >
                    <Text className='font-bold text-black text-2xl self-center'>Confirm</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default function DateSlots({ onReceiveVetIndex, onConfirmed, onReceiveBack }) {
    function handleConfirm(selectedDate) {
        onConfirmed("TimeSlots", {selectedDate: selectedDate, vetIndex: onReceiveVetIndex})
    }

    return (
        <DisplayDateSlots receivedVetIndex={onReceiveVetIndex} onConfirm={(selectedDate) => handleConfirm(selectedDate)} onBack={() => onReceiveBack()} />
    );
}