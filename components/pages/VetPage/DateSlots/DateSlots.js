import { Text, View, Pressable, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import useDataFetch from '../../../interaction_events/DataFetch';

function DisplayDateSlots({ receivedVetIndex, onConfirm }) {
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
            <Text className="mt-12 self-center font-bold text-4xl">{placesList[receivedVetIndex].name}'s upcoming availability</Text>
            <Calendar
                className='mt-24 w-11/12 self-center rounded-xl shadow-2xl shadow-black'
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
    );
}

export default function DateSlots({ onReceiveVetIndex, onConfirmed }) {
    function handleConfirm(selectedDate) {
        onConfirmed("TimeSlots", {selectedDate: selectedDate, vetIndex: onReceiveVetIndex})
    }

    return (
        <DisplayDateSlots receivedVetIndex={onReceiveVetIndex} onConfirm={(selectedDate) => handleConfirm(selectedDate)} />
    );
}