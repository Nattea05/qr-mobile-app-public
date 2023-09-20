import { Text, View, SafeAreaView, ScrollView, Image, Pressable, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as ref_db, set } from 'firebase/database';
import { ref as ref_storage, uploadBytes } from 'firebase/storage';
import { db, auth, storage } from '../../../../firebaseConfig';
import PetModal from './PetModal';
import AddPhotoIcon from '../../../../assets/svg_logos/addPhoto.svg'

function DisplayAddPet({ onAddPet }) {
    const [uid, setUid] = useState('');
    const [image, setImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [textInput, onChangeTextInput] = useState({
        name: '',
        species: '',
        breed: '',
        sex: '',
    });

    function alert () {
        Alert.alert('Incomplete Submission', 'Please check if all details have been provided or if a profile picture has been submitted.', [
            {
                text: 'OK'
            }
        ],
        {
            cancelable: true,
        }
        )
    }

    function falseAuth() {
        return (
            <Text className="text-4xl font-bold text-center self-center">There is an authentication issue. Please login again.</Text>
        )
    }

    function addPet() {
        // Check if all details have been provided or picture has been provided
        const hasEmptyField = Object.keys(textInput).some((key) => {
            const value = textInput[key].trim()
            return value === undefined || value === null || value === "";
        })

        if (hasEmptyField || !image) {
            alert()
        } else {
            // Combine first 5 letters from signed in user id and pet's name and combine to create unique pet ID
            const id1 = uid.slice(0, 5)
            const id2 = textInput.name
            const idCombined = id1 + id2
            const petsRef = ref_db(db, "pets/" + uid + "/" + idCombined)
            const petProfilePictureRef = ref_storage(storage, "pet-profile-pictures/" + uid + "/" + idCombined)

            // Upload user provided pet profile picture to storage database
            async function convertImageUriToBlob(imageUri) {
                // Fetch image data as a Blob
                const response = await fetch(imageUri)
                const blob = await response.blob()
                return blob;
            }

            convertImageUriToBlob(image)
                .then((blob) => {
                    // Upload pet data to database and pet picture to storage after Blob has been fetched
                    uploadBytes(petProfilePictureRef, blob).then((snapshot) => {
                        onAddPet();
                    })
                    set(petsRef, textInput)
                })
                .catch((error) => {
                    console.error("Error converting image URI to Blob:", error)
                })
        }
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUid(user.uid)
        } else {
            falseAuth()
        }
    })

    return (
        <SafeAreaView className="flex-1 flex-col items-center">
            <View className="flex flex-row w-full h-36 rounded-xl bg-petgreen items-center">
                <Text className="font-bold text-5xl left-10">Add Pet</Text>
            </View>
            <ScrollView className="w-full" contentContainerStyle={{alignItems: "center"}}>
                <Pressable onPress={() => setShowModal(true)} className={`justify-center items-center w-40 h-40 mt-10 ${image ? "border-4 border-white" : "border-dashed border-4 border-gray-300"}`}>
                    <AddPhotoIcon width={100} height={100} style={{left: 5 }} />
                    {image && <Image resizeMode="cover" resizeMethod="scale" className="absolute w-full h-full rounded-xl" source={{uri: image}} />}
                </Pressable>
                {Object.keys(textInput).map((field) => (
                    <TextInput
                        key={field}
                        className="w-11/12 h-16 p-5 mt-5 font-semibold align-text-top text-xl border-b-2 border-gray-300"
                        style={{textAlignVertical: "top"}}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        placeholderTextColor={"#cbcbcb"}
                        multiline={false}
                        onChangeText={(text) => {
                            onChangeTextInput((prevTextInput) => ({
                                ...prevTextInput,
                                [field]: text,
                            }))
                        }}
                    />                    
                ))}
                <Pressable
                    className='mt-10 bottom-3 w-8/12 h-16 self-center rounded-xl bg-petgreen active:bg-activepetgreen justify-center'
                    onPress={() => addPet()}
                >
                    <Text className='font-bold text-black text-2xl self-center'>Add Pet Profile</Text>
                </Pressable>
            </ScrollView>
            {showModal && <PetModal onModalClose={() => setShowModal(false)} onReceiveImage={(image) => setImage(image)} />}
        </SafeAreaView>
    )
}

export default function AddPet({ receiveAddPet }) {
    function handleAddPet() {
        receiveAddPet("Pets")
    }

    return (
        <DisplayAddPet onAddPet={() => handleAddPet()} />
    )
}