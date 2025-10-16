import { Link } from "expo-router";
import { View, Text } from "react-native";
import React from "react";

export default function Header() {
    return (
        <View className="px-4 h-14 flex items-center flex-row justify-between bg-white border-b border-gray-200">
            <Text className="text-lg font-bold text-green-600">🌱 Plantis</Text>
            <Link
                className="text-md font-medium text-green-700"
                href="/introduction"
            >
                About
            </Link>
        </View>
    );
}

