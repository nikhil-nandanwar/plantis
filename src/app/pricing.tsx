import React from "react";
import { View, Text } from "react-native";

export default function Pricing() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold">Pricing Page</Text>
            <Text className="mt-2 text-lg text-gray-500">Check out our pricing options.</Text>
        </View>
    );
}
