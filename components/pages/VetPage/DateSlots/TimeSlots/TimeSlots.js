import { Text, View, ScrollView, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import createTimeSlots from '../../../../interaction_events/fetchTimeSlots';
import { ref as ref_db, onValue } from 'firebase/database';
import { db } from '../../../../../firebaseConfig';
import { Back } from '../../../../../assets/svg_logos/svg_logos';
import moment from 'moment';

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

function DisplayTimeSlots({ receivedDate, receivedVetIndex, confirmTime, onBack }) {
    const [date, dayOfWeek] = formatDate(receivedDate)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [clinicData, setClinicData] = useState({})
    const [isClinicDataLoaded, setIsClinicDataLoaded] = useState(false)
    const [slots, setSlots] = useState([])
    const [bookedSlots, setBookedSlots] = useState([])
    const [bookedSlotsSet, setBookedSlotsSet] = useState(new Set(bookedSlots))
    const [isSlotsFetched, setIsSlotsFetched] = useState(false)
    const [isSlotsLoaded, setIsSlotsLoaded] = useState(false)

    function alert () {
        Alert.alert('Time slot not selected', 'Please select a time slot', [
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
        const vetIndex = receivedVetIndex + 1
        const clinicRef = ref_db(db, "places/place" + vetIndex.toString())
        const clinicListener = onValue(clinicRef, (snapshot) => {
            const data = snapshot.val()
            setClinicData(data)
            setIsClinicDataLoaded(true)
        })

        return(() => {
            clinicListener()
        })
    }, [])

    useEffect(() => {
        if (isClinicDataLoaded) {
            const appointmentsRef = ref_db(db, "appointments")
            const appointmentListener = onValue(appointmentsRef, (snapshot) => {
              const data = snapshot.val()
              const timeSlots = Object.keys(data)
                .filter((key) => key.slice(-1) === clinicData.index.toString() && data[key].date === moment(receivedDate).format("YYYY-MM-DD"))
                .map((key) => data[key].time);
              let updatedBookedSlots = [...bookedSlots, ...timeSlots]
              const updatedSet = new Set(updatedBookedSlots)
              updatedSet.forEach((item) => setBookedSlotsSet((prev) => prev.add(item)))
              setIsSlotsFetched(true)
            })

            return (() => {
                appointmentListener()
            })
        }
    }, [isClinicDataLoaded])

    useEffect(() => {
        if (isSlotsFetched) {
            setSlots(createTimeSlots(clinicData.openTime, clinicData.closeTime, bookedSlotsSet, receivedDate))
            setIsSlotsLoaded(true)
        }
    }, [isSlotsFetched])

    return (
        <View className="flex flex-col w-full h-full">
            <View className="flex w-full py-10 px-5 rounded-b-xl justify-center bg-petgreen">
                <Pressable onPress={() => onBack()} className="top-5 flex flex-col w-14 h-14 justify-center items-center rounded-full bg-white">
                    <Back width={"36"} height={"36"} fill={"black"} />
                </Pressable>
                <Text className="mt-12 self-center font-bold text-4xl">Upcoming Availability</Text>
                <Text className="mt-5 self-center font-bold text-3xl">{date}</Text>
            </View>
                <ScrollView className="flex-1 flex flex-col w-full space-y-5" contentContainerStyle={{paddingTop: 30, paddingBottom: 20, alignItems: "center", justifyContent: "center"}} >
                    {isSlotsLoaded &&
                        slots.map((slot) => {
                            return (
                                <Pressable 
                                    key={slot} 
                                    className={`flex w-3/5 p-5 justify-center items-center rounded-full bg-slate-100 active:bg-slate-200 ${selectedTimeSlot === slot ? "bg-petgreen active:bg-activepetgreen" : ""}`}
                                    onPress={() => {
                                        //select or deselect the slot
                                        if (selectedTimeSlot === slot) {
                                            setSelectedTimeSlot(null);
                                          } else {
                                            setSelectedTimeSlot(slot);
                                          }                                        
                                    }}
                                >
                                    <Text className="font-bold text-xl">{slot}</Text>
                                </Pressable>
                            )
                        })
                    }
                    <View className="flex flex-col w-11/12 p-5 space-y-5 justify-center items-center border-t-2 border-slate-100">
                        <Text className="font-bold text-2xl">Selected time slot: {selectedTimeSlot}</Text>
                        <Pressable className="flex w-[70%] p-5 justify-center items-center rounded-full bg-petgreen active:bg-activepetgreen" onPress={() => (selectedTimeSlot ? confirmTime(selectedTimeSlot) : alert())}>
                            <Text className="font-bold text-2xl">Confirm</Text>
                        </Pressable>
                    </View>
                </ScrollView>
        </View>
    )
}

export default function TimeSlots({ onReceiveData, onConfirmedTime, onReceiveBack }) {
    function handleConfirmTime(timeSlot) {
        onConfirmedTime("SelectPet", {date: onReceiveData.selectedDate, slot: timeSlot, vetIndex: onReceiveData.vetIndex})
    }

    return (
        <DisplayTimeSlots receivedDate={onReceiveData.selectedDate} receivedVetIndex={onReceiveData.vetIndex} confirmTime={(selectedTimeSlot) => handleConfirmTime(selectedTimeSlot)} onBack={() => onReceiveBack()} />
    )
}