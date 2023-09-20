import { Text, View, Pressable, Image } from 'react-native';
import { useState } from 'react';

const Categories = [
    {category: "Home", icon: require("../assets/home_icon.png")},
    {category: "Health", icon: require("../assets/heartplus_icon.png")},
    {category: "Pets", icon: require("../assets/pets_icon.png")},
    {category: "Profile", icon: require("../assets/profile_icon.png")},
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
        <View className="w-full h-24 bg-white">
            <View className="flex-row items-center justify-evenly w-full h-24">
                {items}
            </View>
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