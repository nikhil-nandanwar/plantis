import { Text, View } from "react-native";

export default function Footer() {
    return (
        <View className="items-center border-t border-gray-200 bg-gray-50 py-4">
            <Text className="text-center text-gray-600 text-sm">
                © {new Date().getFullYear()} Plantis. All rights reserved.
            </Text>
        </View>
    );
}