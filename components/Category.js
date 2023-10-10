import { Text, View, Pressable } from 'react-native';
import { Activity, Home, Pets, Profile } from "../assets/navbar_icons/navbar_icons"
import { useRoute } from '@react-navigation/native';

function DisplayCategories({ onCategoryPress }) {
    const iconComponents = [
        {category: "Home", component: Home},
        {category: "Activity", component: Activity},
        {category: "Pets", component: Pets},
        {category: "Profile", component: Profile}
    ];
    const route = useRoute()

    return (
        <View className="w-full h-24 bg-white">
            <View className="flex-row items-center justify-evenly w-full h-24">
                {iconComponents.map(({category, component: IconComponent }) => {
                    const isActive = (route.name === category)

                    return (
                        <Pressable key={category} className="items-center fill-black" onPress={() => onCategoryPress(category)}>
                            <IconComponent fillColor={isActive ? "#45e14f" : "black"}/>
                            <Text className={`font-medium text-base ${isActive ? "text-petgreen" : "text-black"}`}>{category}</Text>
                        </Pressable>
                    )
                })}
            </View>
        </View>
    );
}

export default function CategoryRow({ onReceiveInput }) {
    function handleCategoryPress(category) {
        onReceiveInput(category)
    }

    return (
        <DisplayCategories onCategoryPress={(category) => handleCategoryPress(category)} />
    );
}