import { Text, View, SafeAreaView, ScrollView, Image, Pressable } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { ref as ref_db, onValue } from 'firebase/database';
import { ref as ref_storage, getDownloadURL, getMetadata, listAll } from 'firebase/storage';
import { db, auth, storage } from '../../../firebaseConfig';
import AddLogo from '../../../assets/svg_logos/add.svg';

function DisplayPets({ onNavigation }) {
    const [uid, setUid] = useState('');
    const [petData, setPetData] = useState([]);
    const [petImages, setPetImages] = useState([]);
    const [isPetDataLoaded, setIsPetDataLoaded] = useState(false);
    const [isPetImagesLoaded, setIsPetImagesLoaded] = useState(false);

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
            const petDetailsRef = ref_db(db, "pets/" + uid);
            const valueListener = onValue(petDetailsRef, (snapshot) => {
                const data = snapshot.val();
                {data ? Object.keys(data).forEach(key => {
                    setPetData(petData => [...petData, data[key]]);
                }) : null}
                setIsPetDataLoaded(true);
            });

            const petImagesRef = ref_storage(storage, "pet-profile-pictures/" + uid)
            listAll(petImagesRef)
                .then((res) => {
                    const promises = res.items.map(async (itemRef) => {
                        const metadataPromise = getMetadata(itemRef);
                        const downloadURLPromise = getDownloadURL(itemRef);
                        try {
                            const [metadata, url] = await Promise.all([metadataPromise, downloadURLPromise]);
                            setPetImages(petImages => [...petImages, {imageName: metadata.name, url: url}]);
                        } catch (error) {
                            console.error("Error received: ", error);
                        }
                    });
                    Promise.all(promises)
                        .then(() => {
                            setIsPetImagesLoaded(true);
                        })
                        .catch((error) => {
                            console.error("Error received: ", error)
                        })
                })
                .catch((error) => {
                    console.error("Error received: ", error)
                })
            return () => {
                valueListener();
            };
        };
    }, [uid])

    useEffect(() => {
        if (isPetDataLoaded && isPetImagesLoaded) {
            const updatedPetData = [...petData];
            updatedPetData.forEach((entry) => {
                const petID = uid.slice(0, 5) + entry.name
                if (petImages.some((image) => image.imageName === petID)) {
                    const matchingIndex = petImages.findIndex((image) => image.imageName === petID)
                    entry.url = petImages[matchingIndex].url
                }
            })
            setPetData(updatedPetData)
        }
    }, [isPetImagesLoaded])

    return (
        <SafeAreaView className="flex-1 flex-col items-center">
            <View className="flex flex-row pt-5 w-full h-40 rounded-b-xl bg-petgreen justify-evenly items-center">
                <Text className="font-bold text-5xl">Your Pets</Text>
                <Pressable className="flex flex-col items-center w-24 h-24 rounded-full bg-white" onPress={() => onNavigation("AddPet")}>
                    <AddLogo height={48} width={48} style={{top: 5}} />
                    <Text className="mt-2 font-medium text-sm">Add pet</Text>
                </Pressable>
            </View>
            <ScrollView className="w-full" contentContainerStyle={{alignItems: "center"}}>
                {isPetDataLoaded && petData.map((pet, index) => (
                    <View key={index} className="flex flex-col w-11/12 items-center">
                        <Pressable className="flex flex-row w-11/12 h-32 mt-5 rounded-xl" onPress={() => console.log("I've been pressed!")}>
                            <Image source={{uri: pet.url}} className="w-2/5 h-full rounded-xl" />
                            <View className="flex-1 flex-col pl-4 justify-center">
                                <Text className="font-semibold text-4xl">{pet.name}</Text>
                                <Text className="font-medium text-lg text-gray-400">{pet.breed}</Text>
                            </View>
                        </Pressable>
                        <View className="w-full mt-5 border-b-2 border-gray-300"/>
                    </View>                    
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default function Pets({ receiveNavigation }) {
    function handleNavigation(page) {
        receiveNavigation(page)
    }

    return (
        <DisplayPets onNavigation={(page) => handleNavigation(page)} />
    );
}