import { Text, Pressable, Image, FlatList, View } from 'react-native';
import { ref as ref_db, onValue} from "firebase/database";
import { ref as ref_storage, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { useCallback, useEffect, useState } from 'react';

function DisplayPlaces() {
    const [placesList, setPlacesList] = useState([]);
    const [imagesList, setImagesList] = useState([]);
    const [imageNameList, setImageNameList] = useState([]);
    const [isPlacesLoaded, setIsPlacesLoaded] = useState(false);
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);
    
    function combineSort() {
        // combine into an array of objects
        let combined = imageNameList.map((e, i) => ({element1: e, element2: imagesList[i]}));

        //sort the combined array based on imageNameList's elements
        combined.sort((a, b) => {
            const numberA = parseInt(a.element1.match(/\d+/)[0]);
            const numberB = parseInt(b.element1.match(/\d+/)[0]);

            return numberA - numberB;
        });

        // separate the combined array back into two arrays
        setImageNameList(combined.map(e => e.element1));
        setImagesList(combined.map(e => e.element2));
    }

    useEffect(() => {
        // retrieve veterinary information
        const placesRef = ref_db(db, 'places/');
        const valueListener = onValue(placesRef, (snapshot) => {
            const data = snapshot.val();

            Object.keys(data).forEach(key => {
                setPlacesList(placesList => [...placesList, data[key]]);
            });

            // set boolean variable to indicate all places information are fetched
            setIsPlacesLoaded(true);
        });

        // retrieve store vet location images
        const imagesRef = ref_storage(storage, 'veterinary-locations')
        listAll(imagesRef)
            .then((res) => {
                // asynchronous operation that uses Promise to wait until all promises are resolved through fetching data
                const promises = res.items.map(async (itemRef) => {
                    const metadataPromise = getMetadata(itemRef);
                    const downloadURLPromise = getDownloadURL(itemRef);

                    try {
                        // inserts value into immutable variables when promises are resolved with fetched data
                        const [metadata, url] = await Promise.all([metadataPromise, downloadURLPromise]);
                        setImageNameList(imageNameList => [...imageNameList, metadata.name]);
                        setImagesList(imagesList => [...imagesList, url]);
                    } catch (error) {
                        console.error("Error received: ", error);
                    }
                });

                // when all promises are resolved, set boolean variable to indicate fully fetched data
                Promise.all(promises)
                    .then(() => {
                        setIsImagesLoaded(true); // Images data is loaded
                    })
                    .catch((error) => {
                        console.error("Error received: ", error);
                    });
            })
            .catch((error) => {
                console.error("Error received: ", error);
            });

        return () => {
            valueListener();
        };
    }, []);

    // second useEffect runs when both places and images data have been fetched and loaded into arrays
    useEffect(() => {
        if (isPlacesLoaded && isImagesLoaded) {
            // run function to sort images and places properly
            combineSort();
        }
    }, [isPlacesLoaded, isImagesLoaded]);

    return (
        <FlatList
            contentContainerStyle={{flexDirection: 'column', alignItems: 'center'}}
            data={placesList}
            renderItem={({item}) => (
                <>
                    <View className="flex-col mt-5 mb-10">
                        <Pressable key={item.index} className="flex-col w-96 h-80 rounded-xl bg-orange-400">
                            <Image source={{uri: imagesList[item.index]}} className="w-96 h-52 rounded-xl" />
                            <Text className="font-medium text-base justify-start">{item.name}, {item.location}</Text>
                        </Pressable>
                    </View>
                </>
            )}
            keyExtractor={item => item.index}
            className=""
         />
    );
}

export default function ScrollingList() {
    return (
        <DisplayPlaces />
    );
}