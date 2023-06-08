import { memo, useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, Platform } from 'react-native';
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import { ref as ref_db, onValue} from "firebase/database";
import { ref as ref_storage, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { db, storage } from "../../firebaseConfig";


/* const Places = [
    {key: 0, name: "Animal Medical Centre", location: "Kuala Lumpur" , image: require("../../assets/vets/vet1.png")},
    {key: 1, name: "Leow Veterinary Clinic and Surgery", location:"Kepong", image: require("../../assets/vets/vet2.png")},
    {key: 2, name: "Kota Damansara Veterinary Centre", location: "Kota Damansara", image: require("../../assets/vets/vet3.png")},
    {key: 3, name: "Cyberlynx Animal Clinic", location:"Petaling Jaya", image: require("../../assets/vets/vet4.png")},
    {key: 4, name: "St Angel Animal Medical Centre", location:"Puchong", image: require("../../assets/vets/vet5.png")}
]; */

function DisplayPage() {
    const {width: screenWidth} = Dimensions.get("window");
    const [activeSlide, setActiveSlide] = useState(0);

    const [placesList, setPlacesList] = useState([]);
    const [imagesList, setImagesList] = useState([]);
    const [imageNameList, setImageNameList] = useState([]);
    const [isPlacesLoaded, setIsPlacesLoaded] = useState(false);
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);

    const renderItem = ({item, index}, parallaxProps) => {
        return (
            <View className="w-full h-80">
                <ParallaxImage
                    source={{uri: imagesList[item.index]}}
                    containerStyle={{flex: 1, marginBottom: Platform.select({ios: 0, android: 1}), backgroundColor: 'white'}}
                    style={{width: "100%", height: "100%"}}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
            </View>
        );
    };

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
        const imagesRef = ref_storage(storage, 'vet-interiors')
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
            contentContainerStyle={{flexDirection: 'column'}}
            data={[{key: 0}]}
            renderItem={() => (
                <>
                    <View className="flex-1 w-full h-80">
                        <Carousel
                            ref = {(c) => {this._carousel = c;}}
                            sliderWidth={screenWidth}
                            sliderHeight={320}
                            itemWidth={screenWidth}
                            data={placesList}
                            renderItem={renderItem}
                            keyExtractor={item => item.index}
                            hasParallaxImages={true}
                            onSnapToItem={(index) => setActiveSlide(index)}
                            containerCustomStyle={{ position: 'absolute', backgroundColor: 'transparent'}}
                            contentContainerStyle={{ flex: 1 }}
                        />
                        <Pagination
                            dotsLength={placesList.length}
                            activeDotIndex={activeSlide}
                            containerStyle={{ backgroundColor: 'transparent', top: '60%'}}
                            dotStyle={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                marginHorizontal: 8,
                                backgroundColor: 'white'
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />
                    </View>
                </>
            )}
            keyExtractor={item => item.key}
            className=""
        />
    );
}

export default function VetPage({ onReceiveIndex }) {
    return (
        <DisplayPage />
    );
}