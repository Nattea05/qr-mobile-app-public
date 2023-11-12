import { Text, View, LogBox } from 'react-native';
import { NativeBaseProvider } from 'native-base'
import { useState } from 'react';
import { TimeSlotPicker } from 'react-native-timeslots-picker';
LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.']);

export function formatDate(inputDate) {
    // Create a new Date object by parsing the input date string
    const date = new Date(inputDate);
  
    // Define arrays for months and suffixes for days
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    const daySuffixes = ['st', 'nd', 'rd', 'th'];
  
    // Extract the components of the date
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const daySuffix = daySuffixes[(day - 1) % 10] || 'th';
  
    // Assemble the formatted date string
    const formattedDate = `${month} ${day}${daySuffix}, ${year}`;

    // Get day of the week
    const dayOfWeek = date.getDay();
  
    return [formattedDate, dayOfWeek];
  }

function DisplayTimeSlots({ receivedDate, receivedVetIndex, confirmTime }) {
    const [date, dayOfWeek] = formatDate(receivedDate)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    return (
        <View className="flex flex-col w-full h-full">
            <View className="flex w-full h-48 pb-10 rounded-b-xl justify-center items-center bg-petgreen">
                <Text className="mt-12 self-center font-bold text-4xl">Upcoming Availability</Text>
                <Text className="mt-5 self-center font-bold text-3xl">{date}</Text>
            </View>
            <NativeBaseProvider>
                <View>
                    <TimeSlotPicker
                        slotResult={slot => {setSelectedTimeSlot(slot)}}
                        timeSlotInterval={30}
                        weekDayFromTime={'08:00'}
                        weekDayToTime={'18:00'}
                        weekendFromTime={'08:00'}
                        weekendToTime={'12:00'}
                        disableHeader={true}
                        width='300px'
                        onConfirm={selectedSlot => confirmTime(selectedSlot)}
                        dayOfWeek={dayOfWeek}
                        appointmentData={{selectedDate: receivedDate, selectedVet: receivedVetIndex}}
                    />
                </View>
            </NativeBaseProvider>
        </View>
    )
}

export default function TimeSlots({ onReceiveData, onConfirmedTime }) {
    function handleConfirmTime(timeSlot) {
        onConfirmedTime("SelectPet", {date: onReceiveData.selectedDate, slot: timeSlot, vetIndex: onReceiveData.vetIndex})
    }

    return (
        <DisplayTimeSlots receivedDate={onReceiveData.selectedDate} receivedVetIndex={onReceiveData.vetIndex} confirmTime={(selectedSlot) => handleConfirmTime(selectedSlot)} />
    )
}