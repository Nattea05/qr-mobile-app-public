import { Text, View, Pressable, Image } from 'react-native';
import { useState } from 'react';

const Categories = [
    {category: "Home", icon: require("../assets/home_icon.png")},
    {category: "Health", icon: require("../assets/heartplus_icon.png")},
    {category: "Pets", icon: require("../assets/pets_icon.png")}
];

function DisplayCategories({ categories, onCategoryPress }) {
    const items = [];

    categories.forEach(item => {
        items.push(
            <Pressable key={item.category} className="items-center" onPress={() => onCategoryPress(item.category)}>
                <Image source={item.icon} />
                <Text className="font-medium text-base">{item.category}</Text>
            </Pressable>
        );
    });

    return (
        <View className="top-10 flex-row items-start justify-evenly w-full h-28">
            {items}
        </View>
    );
}

export default function CategoryRow({ onReceiveInput }) {
    function handleCategoryPress(category) {
        onReceiveInput(category)
    }

    return (
        <DisplayCategories categories={Categories} onCategoryPress={(category) => handleCategoryPress(category)} />
    );
}