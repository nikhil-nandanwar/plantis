import React from "react";
import { View, Text } from "react-native";

export default function About() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold">About Page</Text>
            <Text className="mt-2 text-lg text-gray-500">Learn more about us here.</Text>
        </View>
    );
}
